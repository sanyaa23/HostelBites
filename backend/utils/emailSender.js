import { ApiError } from "./ApiError.js";
import dotenv from 'dotenv';
import nodemailer from "nodemailer"
import { google } from "googleapis"

dotenv.config({
    path: '../.env',
});

const oAuth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
);
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

console.log(process.env.REFRESH_TOKEN);

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

console.log("oAuth2Client credentials set");

const emailSender =  async (email, description, body) => {
        console.log("Before fetching");
        const accessToken = await oAuth2Client.getAccessToken();
        // console.log(accessToken)
        const transport = nodemailer.createTransport({
            service: "gmail",
            port: 587,
            secure: true,
            auth: {
                type: "OAuth2",
                user: "sanyagpt2310@gmail.com",
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: process.env.REFRESH_TOKEN,
                accessToken: accessToken,
            },
        });

        const options = {
            from: "sanyagpt2310@gmail.com",
            to: email,
            subject: description,
            html: body
        };

        const res = await transport.sendMail(options);
        console.log(res)
        return res;

};
export { emailSender }