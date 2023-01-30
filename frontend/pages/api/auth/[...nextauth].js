import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import EmailProvider from 'next-auth/providers/email';
import SequelizeAdapter from "@next-auth/sequelize-adapter";
import { createTransport } from "nodemailer"
import { Sequelize } from "sequelize"
import axios from 'axios';
import signInEmail from "./signInEmail"
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
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD
        }
      },
      from: process.env.EMAIL_FROM,
      sendVerificationRequest({ identifier, url, provider }) {
        signInEmail({ identifier, url, provider });
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    })
  ],
  callbacks: {
    async session({ session, user, token }) {
      try {
        const result = await axios.post(`${process.env.NEXT_PUBLIC_API_ENDPOINT}account/get`, {
          email: user.email,
        });

        session.id = result.data.id;
        session.username = result.data.username;
        session.avatar = result.data.avatar
      } catch (error) {
      }

      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    verifyRequest: '/auth/verify-request',
    newUser: '/auth/new-user'
  }
});