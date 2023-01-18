import { useSession, signIn, signOut } from "next-auth/react";
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import CssBaseline from '@mui/material/CssBaseline';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Copyright from '../components/Copyright.jsx';
import io from "socket.io-client";

const theme = createTheme();

const chats = [
  {
      id: 1,
      username: "テストユーザー1",
      message: "テストメッセージ1",
      avatar: ""
  },
  {
      id: 2,
      username: "テストユーザー2",
      message: "テストメッセージ2",
      avatar: ""
  },
  {
      id: 3,
      username: "テストユーザー3",
      message: "テストメッセージ3",
      avatar: ""
  },
];

const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL);
socket.on('READY', () => {
  // alert('Ready');
});
socket.on('MESSAGE_CREATE', (data) => {

});

export default function Component() {
  const { data: session, status } = useSession({
    required: true,
  });

  if (status === "loading") {
    return "Loading or not authenticated...";
  }

  return (
    <ThemeProvider theme={theme}>
    <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
            sx={{
                marginTop: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <Typography variant="h5">
                ReactSNS
            </Typography>
        </Box>
        <Box
            sx={{
                marginTop: 1,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-end',
            }}
        >
            <List sx={{ width: '100%', maxWidth: '100%', bgcolor: 'background.paper' }}>
            {chats.map(chat =>
                <div key={chat.id}>
                    <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                            <Avatar alt="" src={chat.avatar} />
                        </ListItemAvatar>
                        <ListItemText
                            primary={chat.username}
                            secondary={
                                <React.Fragment>
                                    <Typography
                                        sx={{ display: 'inline' }}
                                        component="span"
                                        variant="body2"
                                        color="text.primary"
                                    >
                                        {chat.message}
                                    </Typography>
                                </React.Fragment>
                            }
                        />
                    </ListItem>
                </div>
            )}
        </List>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
    </Container >
</ThemeProvider >
  )
}