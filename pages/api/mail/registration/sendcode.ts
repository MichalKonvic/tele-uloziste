import { NextApiRequest, NextApiResponse } from "next";
import { randomInt } from 'crypto'
import cache from '../../../../lib/cache'
import createTransporter from "../../../../lib/mailProvider";

interface requestBodyI{
    sendToEmail: string,
}
type responseDataT = {
    statusCode: number,
    message: string,
    cacheUID?:string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<responseDataT>
) {

    const apiKey = req.headers.authorization && req.headers.authorization.split(' ')[1];
    // TODO add cors
    let parsedBody: requestBodyI | undefined = undefined;
    let regCode:string = randomInt(9).toString() + randomInt(9).toString() + randomInt(9).toString() + randomInt(9).toString() + randomInt(9).toString() + randomInt(9).toString();
    try {
        parsedBody = JSON.parse(req.body);
    } catch (error) {
        res.status(500).json({
            statusCode: 500,
            message: "Nelze převést tělo requestu"
        });
        return;
    }
    if (apiKey !== process.env.API_KEY) {
        res.status(401).send({
            statusCode: 401,
            message: "Špatný API klíč"
        })
        return;
    }
    if (!parsedBody?.sendToEmail) {
        res.status(400).json({
            statusCode: 400,
            message: "Chybí parametry"
        })
        return;
    }
    const transporter = createTransporter();
    try {
        await transporter.sendMail({
            from: '"Robo z Tele Cloudu" <tele-cloud@email.cz>', // sender address
            to: parsedBody?.sendToEmail, // list of receivers
            subject: "Tele Cloud registrace", // Subject line
            text: `Ahoj, tvůj registrační kód ke službě Tele Cloud je: ${regCode}`, // plain text body
            html: `<html>
    
    <head>
        <style>
            * {
                margin: 0;
                padding: 0;
                font-family: 'Roboto', sans-serif;
                color: rgb(63, 63, 63);
            }
    
            @import url('https://fonts.googleapis.com/css2?family=Roboto:ital@1&display=swap');
        </style>
    </head>
    
    <body>
        <article style="display: flex; flex-direction: column; width: fit-content; padding: 1rem;">
            <p style="font-size: 2rem;">To jsem já Robo 🤖,<br> mám pro tebe ten kód 👇</p>
            <span title="To je ten kód"
                style="font-size: 2.75rem; color: rgb(161, 89, 228); font-weight: 900; padding: 1rem 2rem; background-color: rgb(224, 224, 224); margin: 3rem  0.7rem; width: fit-content; text-align: center; letter-spacing: 1rem; border-radius: 10px;">
                ${regCode}</span>
            <p style="font-size: 2rem;">👆 Tenhle kód platí <b style="color: rgb(230, 86, 86);">5</b> minut. <br>
            <p style="font-size: 1.2rem; margin-left: 0.5rem; margin-top: 3rem; margin-bottom: 3rem;">Rád jsem tě
                poznal. <br>S pozdravem
                Robo
                🤖.</p>
            </p>
        </article>
    </body>
    
    </html>`, // html body
        });
        const cacheUID = cache.addToMemory({
            registrationCode: regCode,
            registrationEmail: parsedBody.sendToEmail,
            isValidated: false
        }, 600);
        res.status(200).json({
            statusCode: 200,
            message: "Email byl poslán",
            cacheUID: cacheUID
        });
        return
    } catch (error) {
        res.status(500).json({
            statusCode: 500,
            message: "Email se nepovedlo odeslat",
        });
    }
}