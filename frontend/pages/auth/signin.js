import { getCsrfToken, getProviders } from "next-auth/react";
import { useSession, signIn, signOut } from "next-auth/react";
import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Copyright from '../../components/Copyright';
import styles from '../../styles/Signin.module.css'
import { useRouter } from 'next/router';

const theme = createTheme();

export default function SignIn({ csrfToken, providers }) {
    const router = useRouter();
    const query = router.asPath
        .slice(1)
        .split('&')
        .map((str) => [str.split('=')[0], str.split('=')[1]])
        .reduce((acc, a) => {
            acc[a[0]] = a[1];
            return acc;
        }, {});

    let error = '';
    if (query["error"]) {
        switch (query["error"]) {
            case "OAuthSignin":
                error = "認証URLの作成中にエラーが発生しました";
                break;
            case "OAuthCallback":
                error = "OAuth プロバイダーからの応答の処理中にエラーが発生しました";
                break;
            case "OAuthCreateAccount":
                error = "データベースに OAuth プロバイダー ユーザーを作成できませんでした。";
                break;
            case "EmailCreateAccount":
                error = "データベースに電子メール プロバイダー ユーザーを作成できませんでした。";
                break;
            case "Callback":
                error = "OAuthコールバックハンドラルートのエラー";
                break;
            case "OAuthAccountNotLinked":
                error = "アカウントの電子メールが既にリンクされていますが、このOAuthアカウントにはリンクされていません";
                break;
            case "EmailSignin":
                error = "検証トークンを含む電子メールの送信に失敗しました、メールアドレスを正しく入力しているか確認してください";
                break;
            case "SessionRequired":
                error = "このページのコンテンツでは、常にサインインする必要があります";
                break;
            case "Default":
            default:
                error = `不明なサインインエラー: ${query["error"]}`;
        }
    }
    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <div className={styles.cardWrapper}>
                        <div className={styles.cardContent}>
                            <p>{error}</p>
                            <form method="post" action="/api/auth/signin/email">
                                <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
                                <label>
                                    Email address
                                    <input type="email" id="email" name="email" />
                                </label>
                                <button type="submit">Sign in with Email</button>
                            </form>
                            <hr />
                            {providers &&
                                Object.values(providers).filter(v => v.name !== 'Email').map(provider => (
                                    <div key={provider.name} style={{ marginBottom: 0 }}>
                                        <button onClick={() => signIn(provider.id)} >
                                            Sign in with{' '} {provider.name}
                                        </button>
                                    </div>
                                ))}
                        </div>
                    </div>
                </Box>
                <Copyright sx={{ mt: 8, mb: 4 }} />
            </Container>
        </ThemeProvider >
    )
}

export async function getServerSideProps(context) {
    const providers = await getProviders()
    const csrfToken = await getCsrfToken(context)
    return {
        props: {
            providers,
            csrfToken
        },
    }
}