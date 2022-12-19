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
        maxAge: 30 * 24 * 60 * 60,
        updateAge: 24 * 60 * 60,
    },
    adapter: SequelizeAdapter(sequelize),
    providers: [
        EmailProvider({
            server: {
                host: process.env.SMTP_HOST,
                port: process.env.SMTP_PORT,
                secure: false,
            },
            from: process.env.SMTP_FROM,
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        })
    ],
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            console.log('signin');
            return true
        },
        async redirect({ url, baseUrl }) {
            console.log('redirect');
            return baseUrl
        },
        async session({ session, user, token }) {
            console.log('session');
            return session
        },
        async jwt({ token, user, account, profile, isNewUser }) {
            console.log('jwt');
            return token
        }
    },
    pages: {
        signIn: '/auth/signin'
    }
});