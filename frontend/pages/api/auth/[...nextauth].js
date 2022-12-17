import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import EmailProvider from 'next-auth/providers/email';
import CredentialsProvider from "next-auth/providers/credentials";
import SequelizeAdapter from "@next-auth/sequelize-adapter";
import { Sequelize } from "sequelize"
const sequelize = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_USERNAME, process.env.MYSQL_PASSWORD, {
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    dialect: 'mysql',
});

export default NextAuth({
    debug: true,
    session: {
        strategy: 'database',
    },
    adapter: SequelizeAdapter(sequelize),
    providers: [
        CredentialsProvider({
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
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        })
    ],
    pages: {
        signIn: '/auth/signin'
    }
});