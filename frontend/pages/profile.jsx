import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import Copyright from "../components/Copyright.jsx";

const theme = createTheme();

export default function NewUser() {
  const [preview, setPreview] = useState();
  const [file, setFile] = useState();
  const [error, setError] = useState();
  const { data: session } = useSession({
    required: true,
  });
  const router = useRouter();
  const { control, handleSubmit } = useForm({
    defaultValues: {
      username: "",
      avatar: "",
    },
  });

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("id", session.id);
    formData.append("username", data.username);
    formData.append("avatar", file);

    axios({
      url: `${process.env.NEXT_PUBLIC_API_ENDPOINT}account/update`,
      method: "post",
      data: formData,
      headers: {
        "content-type": "multipart/form-data",
      },
    })
      .then(async () => {
        const result = await axios.post(
          `${process.env.NEXT_PUBLIC_API_ENDPOINT}account/get`,
          {
            email: session.user.email,
          }
        );

        session.username = result.data.username;
        session.avatar = result.data.avatar;
        router.replace("/", undefined, { shallow: true });
      })
      .catch((error) => {
        console.error(error);
        setError(`不明なエラーが発生しました`);
      });
  };

  //ファイルhandleChange関数
  const handleChangeFile = (newFile) => {
    const { files } = newFile.target;
    const preview = URL.createObjectURL(files[0]);
    setFile(files[0]);
    setPreview(preview);
  };

  const validationRules = {
    name: {
      required: "ユーザー名を入力してください",
      minLength: { value: 2, message: "2文字以上で入力してください。" },
    },
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        {/* START MAIN */}
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <AccountCircleIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            アカウント情報を編集
          </Typography>
          <Box noValidate sx={{ mt: 1 }}>
            <Typography color="error" sx={{ m: 3 }}>
              {error}
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Controller
                name="username"
                control={control}
                rules={validationRules.name}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="ユーザー名"
                    error={fieldState.invalid}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
              <Controller
                name="avatar"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <>
                    <Button
                      variant="contained"
                      component="label"
                      sx={{ mt: 3, ml: 13 }}
                    >
                      アバターをアップロード
                      <input
                        {...field}
                        type="file"
                        hidden
                        onChange={handleChangeFile}
                        accept="image/*"
                      />
                    </Button>
                  </>
                )}
              />
              <>
                {preview && (
                  <>
                    <Box
                      component="img"
                      sx={{
                        height: 256,
                        width: 256,
                        ml: 9,
                        mt: 3,
                      }}
                      src={preview}
                      alt="preview"
                    />
                  </>
                )}
              </>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                送信
              </Button>
            </form>
          </Box>
        </Box>
        {/* END MAIN */}
        {/* START FOOTER */}
        <footer>
          <Copyright sx={{ mt: 8, mb: 4 }} />
        </footer>
        {/* END FOOTER */}
      </Container>
    </ThemeProvider>
  );
}
