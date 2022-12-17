import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import EmailProvider from 'next-auth/providers/email';
import Providers from 'next-auth/providers/credentials';

// credentials の情報から、ログイン可能か判定してユーザー情報を返す関数
const findUserByCredentials = credentials => {
    // 今回は簡易的な例なのでメールアドレスとパスワードが一致する場合にユーザー情報を返却する。
    // データベースでユーザーを管理している場合は、データベースからユーザーを取得して、パスワードハッシュを比較して判定するのがよいかと。
    if (
        credentials.email === process.env.USER_EMAIL &&
        credentials.password === process.env.USER_PASSWORD
    ) {
        // ログイン可ならユーザー情報を返却
        return { id: 1, name: "Taro" }
    } else {
        // ログイン不可の場合は null を返却
        return null
    }
}

export default NextAuth({
    // 認証プロバイダー
    providers: [
        Providers({
            // 表示名 ('Sign in with ...' に表示される)
            name: "Email",
            // credentials は、ログインページで適切なフォームを生成するために使用されます。
            // 送信するフィールドを指定できます。（今回は メールアドレス と パスワード）
            credentials: {
                email: { label: "Email", type: "email", placeholder: "email@example.com" },
                password: { label: "Password", type: "password" },
            },
            // 認証の関数
            authorize: async credentials => {
                const user = findUserByCredentials(credentials)
                if (user) {
                    // 返されたオブジェクトはすべてJWTの`user`プロパティに保存される
                    return Promise.resolve(user)
                } else {
                    // nullまたはfalseを返すと、認証を拒否する
                    return Promise.resolve(null)

                    // ErrorオブジェクトやリダイレクトURLを指定してコールバックをリジェクトすることもできます。
                    // return Promise.reject(new Error('error message')) // エラーページにリダイレクト
                    // return Promise.reject('/path/to/redirect')        // URL にリダイレクト
                }
            },
        }),
    ],
    pages: {
        signIn: '/auth/signin',
        signOut: '/auth/signout',
        error: '/auth/error', // Error code passed in query string as ?error=
        verifyRequest: '/auth/verify-request', // (used for check email message)
        newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
    }
});