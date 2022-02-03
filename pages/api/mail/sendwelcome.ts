import { NextApiRequest, NextApiResponse } from "next";
import createTransporter from "../../../lib/mailProvider";
type responseDataT = {
    statusCode: number,
    message: string,
}
interface requestBodyI{
    email: string
}
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<responseDataT>
) {
    const apiKey = req.headers.authorization && req.headers.authorization.split(' ')[1];
    if (apiKey !== process.env.API_KEY) {
        res.status(401).send({
            statusCode: 401,
            message: "Špatný API klíč"
        })
        return;
    }
    let parsedBody: requestBodyI | undefined = undefined;
    try {
        parsedBody = JSON.parse(req.body);
    } catch (error) {
        res.status(500).json({
            statusCode: 500,
            message: "Nelze převést tělo requestu"
        });
        return;
    }
    
    if (!parsedBody?.email) {
        res.status(400).json({
            statusCode: 400,
            message: "Chybí parametry"
        });
        return;
    }
    const transporter = createTransporter();
    try {
        await transporter.sendMail({
            from: '"Robo z Tele Cloudu" <tele-cloud@email.cz>', // sender address
            to: parsedBody?.email, // list of receivers
            subject: "Tele Cloud registrace", // Subject line
            text: `Registrace tvého Tele Cloud účtu proběhla ůspěšně`, // plain text body
            html: `<html><head> <style>*{margin: 0; padding: 0; font-family: 'Roboto', sans-serif; color: rgb(63, 63, 63);}@import url('https://fonts.googleapis.com/css2?family=Roboto:ital@1&display=swap'); </style></head><body> <article style="display: flex; flex-direction: column; width: fit-content; padding: 1rem;"> <p style="font-size: 1.5rem;">Registrace tvého Tele Cloud účtu byla <span style="color: rgb(54, 238, 146); font-weight: 600; background-color: rgb(42, 70, 42); border-radius: 8px; padding: 0.3rem 0.65rem;">úspěšná</span>. </p><p style="font-size: 1.2rem; margin-top: 3rem; margin-bottom: 3rem;">Rád jsem tě poznal. <br>S pozdravem, Robo🤖. </p></p></article></body></html>`, // html body
        });
        res.status(200).json({
            statusCode: 200,
            message: "Email byl poslán"
        });
        return
    } catch (error) {
        res.status(500).json({
            statusCode: 500,
            message: "Email se nepovedlo odeslat",
        });
    }
}