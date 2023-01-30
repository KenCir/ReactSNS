import React, { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItem from "@mui/material/ListItem";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Menu from "@mui/material/Menu";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import SendIcon from "@mui/icons-material/Send";
import { useForm, Controller } from "react-hook-form";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import InfiniteScroll from "react-infinite-scroll-component";
import io from "socket.io-client";
import axios from "axios";
import Copyright from "../components/Copyright";

const theme = createTheme();

export default function Chat() {
  const { data: session, status } = useSession({
    required: true,
  });
  const { control, handleSubmit, setValue } = useForm({
    defaultValues: {
      text: "",
    },
  });
  const router = useRouter();
  const [chats, setChat] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  let ignore = false;
  const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL);

  useEffect(() => {
    if (!ignore) {
      socket.on("READY", () => {
        console.log("Ready");
      });

      socket.on("CREATE_MESSAGE", (data) => {
        setChat((oldChat) => [
          {
            id: data.id,
            user_id: data.user_id,
            content: data.content,
            username: data.username,
            avatar: data.avatar,
          },
          ...oldChat,
        ]);
      });

      (async () => {
        try {
          const messages = await axios.post(
            `${process.env.NEXT_PUBLIC_API_ENDPOINT}message/fetch`,
            {
              limit: 100,
              offset: 0,
            }
          );
          setChat((oldChat) => [...messages.data, ...oldChat]);
        } catch (e) {
          console.error(e);
        }
      })();
    }

    ignore = true;
  }, []);

  const onSubmit = (data) => {
    socket.emit("CREATE_MESSAGE", {
      email: session.user.email,
      content: data.text,
    });
    setValue("text", "");
  };

  const fetchMessages = async () => {
    const messages = await axios.post(
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}message/fetch`,
      {
        limit: 100,
        offset: chats.length,
      }
    );
    setChat((oldChat) => [...messages.data, ...oldChat]);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    router.push("/profile");
  };

  const handleLogout = () => {
    signOut();
  };

  const validationRules = {
    text: {
      required: "メッセージを入力してください",
      minLength: { value: 1, message: "1文字以上で入力してください。" },
      maxLength: { value: 1000, message: "1000文字以下で入力してください。" },
    },
  };

  if (status === "loading") {
    return "Loading or not authenticated...";
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* START HEADER */}
      <header>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                幻想地帝国 SNS
              </Typography>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <Avatar
                  alt=""
                  src={
                    session.avatar
                      ? `${process.env.NEXT_PUBLIC_NEXTCLOUD_URL}index.php/s/${session.avatar}/preview`
                      : ""
                  }
                  sx={{
                    marginRight: 1,
                  }}
                />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleProfile}>プロフィールを編集</MenuItem>
                <MenuItem onClick={handleLogout}>ログアウト</MenuItem>
              </Menu>
              <Typography variant="h6" component="div">
                {session.username}
              </Typography>
            </Toolbar>
          </AppBar>
        </Box>
      </header>
      {/* END HEADER */}
      {/* START MAIN */}
      <main>
        {/* CHAT BOX */}
        <Box
          sx={{
            marginTop: 2,
            margin: "auto",
            width: 350,
            minHeight: "65vh",
          }}
        >
          <InfiniteScroll
            dataLength={chats.length}
            next={fetchMessages}
            height="65vh"
            loader={<p>ロード中...</p>}
            style={{ display: "flex", flexDirection: "column-reverse" }}
            inverse={true}
            hasMore={true}
            endMessage=""
          >
            {chats.map((chat) => (
              <div key={chat.id}>
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar
                      alt=""
                      src={
                        chat.avatar
                          ? `${process.env.NEXT_PUBLIC_NEXTCLOUD_URL}index.php/s/${chat.avatar}/preview`
                          : ""
                      }
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={chat.username}
                    secondary={
                      <Typography
                        sx={{ display: "inline" }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {chat.content}
                      </Typography>
                    }
                  />
                </ListItem>
              </div>
            ))}
          </InfiniteScroll>
        </Box>
        {/* Message Input BOX */}
        <Box
          sx={{
            marginTop: 2,
            margin: "auto",
            width: 350,
          }}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="text"
              control={control}
              rules={validationRules.text}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  fullWidth
                  error={fieldState.invalid}
                  helperText={fieldState.error?.message}
                  placeholder="メッセージ"
                  multiline
                  variant="standard"
                />
              )}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              endIcon={<SendIcon />}
            >
              送信
            </Button>
          </form>
        </Box>
      </main>
      {/* END MAIN */}
      {/* START FOOTER */}
      <footer>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </footer>
      {/* END FOOTER */}
    </ThemeProvider>
  );
}
