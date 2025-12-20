const dialogflow = require('@google-cloud/dialogflow');
const { WebhookClient, Suggestion } = require('dialogflow-fulfillment');
const express = require("express")
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
app.use(express.json())
app.use(cors());

const PORT = process.env.PORT || 8080;

app.get('/', (req, res) => {
    res.send('Dialogflow Server is Running!')
})

app.post("/webhook", async (req, res) => {
    var id = (res.req.body.session).substr(43);
    console.log(id)
    const agent = new WebhookClient({ request: req, response: res });

    function welcome(agent) {
        console.log(`intent  =>  hi`);
        agent.add("Hi there, how can I help you")

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: "goodluckhassan921192119211@gmail.com",
                pass: "gtiu uwjj konf nxof",
            },
        });

        // Wrap in an async IIFE so we can use await.
        (async () => {
            const info = await transporter.sendMail({
                from: '"Hassan" <goodluckhassan921192119211@gmail.com>',
                to: "goodluckhassan921192119211@gmail.com",
                subject: "Hello ✔",
                text: "Hello me Hassan ?", // plain‑text body
                html: "<b>Hello me Hassan ?</b>", // HTML body
            });

            console.log("Message sent:", info.messageId);
        })();
    }

    function donation(agent) {
        const { amount, email, phone } = agent.parameters;
        agent.add(`Hey, Your donation of ${amount} is confirmed for ${email} and ${phone}`)

        console.log('Amount is :', amount)
     

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: "goodluckhassan921192119211@gmail.com",
                pass: "gtiu uwjj konf nxof",
            }
        });

        // Wrap in an async IIFE so we can use await.
        (async () => {
            const info = await transporter.sendMail({
                from: '"Hassan" <goodluckhassan921192119211@gmail.com>',
                to: email,
                subject: "Donation Confirmed ✔",
                text: `Hey, Your donation of ${amount} is confirmed`,
            });
            console.log("Message sent:", info.messageId);
        })();

    }

    let intentMap = new Map();
    intentMap.set('Default Welcome Intent', welcome);
    intentMap.set('donation', donation);
    agent.handleRequest(intentMap);
})
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});