const { WebhookClient } = require("dialogflow-fulfillment");
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const { createClient } = require('@supabase/supabase-js');

// 1. Supabase Setup
const SUPABASE_URL = "https://stmnusrpgghgzdeawzdf.supabase.co";
// !!! YAHAN APNI ASLI "anon public" KEY DALO (eyJhb...) !!!
const SUPABASE_KEY = "sb_publishable_-woXpYcungGbM3IaLFRH5g_R4c1RrdD"; 

const supabase = createClient("https://stmnusrpgghgzdeawzdf.supabase.co", "sb_publishable_-woXpYcungGbM3IaLFRH5g_R4c1RrdD");

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 8080;

// 2. Nodemailer Setup
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: "goodluckhassan921192119211@gmail.com",
        pass: "gtiu uwjj konf nxof", // App Password
    },
});

app.get('/', (req, res) => {
    res.send('Saylani Server is online!');
});

app.post("/webhook", async (req, res) => {
    const agent = new WebhookClient({ request: req, response: res });

    async function handleRegistration(agent) {
        // Dialogflow se parameters lena
        const { userName, userPhone, courseName, email } = agent.parameters; 

        console.log(`Processing: ${userName} for ${courseName}`);

        // STEP 1: Supabase mein Save karna (AWAIT ke sath)
        try {
            const { error } = await supabase
                .from('registrations')
                .insert([
                    {
                        userName: userName,
                        userPhone: userPhone,
                        courseName: courseName,
                        email: email
                    }
                ]);

            if (error) {
                console.error('Supabase Insert Error:', error.message);
            } else {
                console.log('Data saved to Supabase');
            }
        } catch (dbErr) {
            console.error('DB Connection Error:', dbErr);
        }

        // STEP 2: HTML Card Design
        // Random Registration ID generate karne ke liye
        const regId = "SMIT-" + Math.floor(100000 + Math.random() * 900000);

        const htmlCard = `
            <div style="background-color: #f4f7f6; padding: 20px; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
                <div style="max-width: 550px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 15px 35px rgba(0,0,0,0.15); border: 1px solid #e0e0e0;">
                    
                    <div style="background: linear-gradient(135deg, #0D6DB7 0%, #61CE70 100%); padding: 40px 20px; text-align: center; position: relative;">
                        <img src="https://www.saylaniwelfare.com/static/media/logo_saylaniwelfare.22bf2096.png" alt="Saylani Logo" style="width: 140px; filter: brightness(0) invert(1);">
                        <h1 style="color: white; margin: 15px 0 0 0; font-size: 26px; text-transform: uppercase; letter-spacing: 2px; font-weight: 800;">Admission Confirmed</h1>
                        <div style="display: inline-block; background: rgba(255,255,255,0.2); color: white; padding: 5px 15px; border-radius: 50px; margin-top: 10px; font-size: 12px; border: 1px solid rgba(255,255,255,0.3);">Batch 2026 • SMIT-IT-PORTAL</div>
                    </div>

                    <div style="padding: 40px 30px; position: relative;">
                        <div style="text-align: center; margin-bottom: 30px;">
                            <p style="font-size: 18px; color: #444; margin: 0;">Assalam-o-Alaikum, <b>${userName}</b>!</p>
                            <p style="color: #777; font-size: 14px;">Aapka admission process kamyabi se shuru ho gaya hai.</p>
                        </div>

                        <div style="background: #fdfdfd; border: 1.5px dashed #0D6DB7; border-radius: 15px; padding: 25px; margin-bottom: 30px;">
                            <table style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <td style="padding: 10px 0; color: #888; font-size: 13px; text-transform: uppercase;">Registration ID</td>
                                    <td style="padding: 10px 0; font-weight: bold; color: #0D6DB7; text-align: right; font-family: monospace; font-size: 16px;">${regId}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px 0; color: #888; font-size: 13px; text-transform: uppercase;">Selected Course</td>
                                    <td style="padding: 10px 0; font-weight: bold; color: #333; text-align: right;">${courseName}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px 0; color: #888; font-size: 13px; text-transform: uppercase;">Contact Number</td>
                                    <td style="padding: 10px 0; font-weight: bold; color: #333; text-align: right;">${userPhone}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px 0; color: #888; font-size: 13px; text-transform: uppercase;">Email Address</td>
                                    <td style="padding: 10px 0; font-weight: bold; color: #333; text-align: right;">${email}</td>
                                </tr>
                            </table>
                        </div>

                        <div style="background: #f0f9ff; border-radius: 10px; padding: 15px; margin-bottom: 30px;">
                            <p style="margin: 0; font-size: 12px; color: #0D6DB7; line-height: 1.5;">
                                💡 <b>Agla Qadam:</b> Jald hi aapko entry test ki date aur venue email ya SMS ke zariye bhej di jayegi. Bara-e-maherbani is card ko mahfooz rakhein.
                            </p>
                        </div>

                        <div style="text-align: center;">
                            <a href="https://www.saylaniwelfare.com" style="background: #61CE70; color: white; padding: 15px 40px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px rgba(97, 206, 112, 0.3);">Student Portal Login</a>
                        </div>
                    </div>

                    <div style="background: #252b33; color: #999; padding: 20px; text-align: center; font-size: 11px;">
                        <p style="margin: 0 0 5px 0;">Saylani Welfare International Trust (Head Office)</p>
                        <p style="margin: 0; color: #61CE70;">A-25, Bahadurabad Chowrangi, Karachi, Pakistan</p>
                        <div style="margin-top: 15px; border-top: 1px solid #333; padding-top: 15px; color: #666;">
                            This is a computer-generated confirmation. No signature required.
                        </div>
                    </div>
                </div>
            </div>
        `;
        // STEP 3: Email Bhejna (AWAIT ke sath)
        try {
            await transporter.sendMail({
                from: '"Saylani " <goodluckhassan921192119211@gmail.com>',
                to: email,
                subject: `SMIT Registration: ${courseName}`,
                html: htmlCard,
            });
            console.log("📧 Email sent successfully!");
        } catch (mailErr) {
            console.error("Mail Error:", mailErr);
        }

        // STEP 4: Bot ka Response
        agent.add(`Shukriya ${userName}! Aapki ${courseName} ki registration ho gayi hai. Confirmation email check karein.`);
    }

    let intentMap = new Map();
    intentMap.set('Default Welcome Intent', (agent) => agent.add("Welcome! Kya aap SMIT mein register hona chahte hain?"));
    intentMap.set('SMIT_Registration', handleRegistration); // Intent ka naam check kar lena
    
    // Sab se important line for async functions
    return agent.handleRequest(intentMap);
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
