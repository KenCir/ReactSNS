import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Copyright from '../components/Copyright';
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

export default function Chat() {
    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                    {chats.map(chat =>
                        <div key={chat.id}>
                            {/** TODO: メッセージIDをKeyに指定する */}
                            <ListItem alignItems="flex-start">
                                <ListItemAvatar>
                                    {/** TODO: 各ユーザー毎のアバターを表示するようにする */}
                                    <Avatar alt="" src={chat.avatar} />
                                </ListItemAvatar>
                                {/** TODO: 各ユーザー毎のユーザー名を表示するようにする */}
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
                <Copyright sx={{ mt: 8, mb: 4 }} />
            </Container >
        </ThemeProvider >
    );
}