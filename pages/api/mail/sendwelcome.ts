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
            html: `<html><head> <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/> <meta name="viewport" content="width=device-width, initial-scale=1.0"/> <style>*{margin: 0; padding: 0; font-family: 'Roboto', sans-serif; color: rgb(63, 63, 63);}@import url('https://fonts.googleapis.com/css2?family=Roboto:ital@1&display=swap'); @media only screen and (max-width: 600px){.mainContent{max-width: 100% !important; margin: 0 !important;}.mainContent table{height: 100%; border-radius: 0px !important;}}</style></head><body> <div style="margin: 30px auto; width: 600px;" class="mainContent"> <table style="border-radius: 20px; width: 100%; background-color: rgb(225, 225, 225);"> <tr style="height: 75px;"></tr><tr> <th></th> <th><img src="https://raw.githubusercontent.com/MichalKonvic/tele-uloziste/master/public/favicon.svg" alt="Tele Cloud" width="100rem"></th> <th></th> </tr><tr style="height: 20px;"></tr><tr> <th></th> <th> <h1 style="font-size: 2.75rem; font-weight: 500;">Registrace</h1> </th> <th></th> </tr><tr style="height: 20px;"></tr><tr style="height: 50px;"> <th></th> <th> <h2 style="font-weight: 400; font-size: 1.75rem; color: rgb(80, 80, 80);">Registrace účtu byla: </h2> </th> <th></th> </tr><tr> <th style="width: 10%;"></th> <th style="border-radius: 10px; padding: 1.5rem; width: 80%; height: fit-content; background-color: rgb(28, 67, 34); box-shadow: rgba(0, 0, 0, 0.25) 0px 25px 50px -12px;"> <hr style="height: 30px; border: none;"> <p style="font-size: 3.5rem; color: rgb(81, 223, 117); font-weight: 600;"> Úspěšná</p><hr style="height: 30px; border: none;"> </th> <th style="width: 10%;"></th> </tr><tr style="height: 50px;"></tr><tr> <th></th> <th> <p style="font-weight: 100; font-size: 1.5rem; color: rgb(118, 118, 118);"> Rád jsem tě poznal. <br>S pozdravem, <span style="color: rgb(90, 90, 90); font-weight: 600;">Robo</span>. </span> </th> <th></th> </tr><tr style="height: 75px;"></tr><tr> <th></th> <th> <img src="https://raw.githubusercontent.com/MichalKonvic/tele-uloziste/master/public/long_logo.svg" alt="Tele Cloud" width="215rem"> </th> <th></th> </tr><tr style="height: 50px;"></tr><tr> <th></th> <th style="font-size: 1rem; font-weight: 100; color: gray;">© ${new Date().getFullYear()} Tele Cloud </th> <th></th> </tr><tr style="height: 30px;"></tr></table> </div></body></html>`, // html body
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