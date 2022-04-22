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
function mediaNotFound(res:NextApiResponse) {
    res.status(201).json({
            statusCode: 404,
            message: "Media not found"
        });
}

export { serverError, mediaCreated,mediaNotFound};