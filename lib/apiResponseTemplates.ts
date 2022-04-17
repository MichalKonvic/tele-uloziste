import { NextApiResponse } from "next";
function serverError(res:NextApiResponse) {
    res.status(500).json({
            statusCode: 500,
            message: "Došlo k problému"
        });
}

export { serverError, };