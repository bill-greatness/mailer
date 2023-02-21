const express = require("express");
const nodemailer = require("nodemailer")
const cors = require("cors");
const bodyParser = require("body-parser")
const secrets = require("dotenv")
const { google } = require("googleapis");

const OAuth2 = google.auth.OAuth2;

secrets.config()



// transporter
async function createTransporter() {
  // OAuth2Client requires client ID, client secret , google developers playground url (Redirect URL)
  const OAuth2Client = new OAuth2(
    process.env.CLIENTID,
    process.env.CLIENTSECRET,
    "https://developers.google.com/oauthplayground"
  );

  // set OAuth2Client credentails
  OAuth2Client.setCredentials({
    refresh_token:process.env.REFRESHTOKEN,
  });

  // generate new Access Token

  const accessToken = OAuth2Client.getAccessToken()

  const transport = {
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: "clintonbill658@gmail.com",
      clientId:process.env.CLIENTID,
      clientSecret: process.env.CLIENTSECRET,
      refreshToken:process.env.REFRESHTOKEN,
      accessToken: accessToken,
    },
    tls: {
      rejectUnauthorized: false,
    },
  };

  return nodemailer.createTransport(transport);
}

const app = express();

app.use(cors({origin:'localhost:3000'}));

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get("/send-mail", async (req, res) => {
  const { content, target, subject } = req.query;
  
  const mail = {
    from: "LOGIC KIDS GHANA<logickidsteam@gmail.com>",
    to: target,
    subject: subject,
    generateTextFromHTML: true,
    html: content,
  };

  const mailTransporter = await createTransporter();
  mailTransporter.sendMail(mail, (err, resp) => {
    err ? console.log(err) : res.send(resp.response);
    mailTransporter.close();
  });
  res.end();
});

app.listen(4000, () => {
  console.log("Welcome to Mailer");
});
