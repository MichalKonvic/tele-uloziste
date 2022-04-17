import { NextApiResponse } from "next";
function serverError(res:NextApiResponse) {
    res.status(500).json({
            statusCode: 500,
            message: "Došlo k problému"
        });
}
function mediaCreated(res:NextApiResponse) {
    res.status(201).json({
            statusCode: 201,
            message: "Media created"
        });
}

export { serverError, mediaCreated};