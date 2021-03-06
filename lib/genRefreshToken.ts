import jwt from 'jsonwebtoken';
const generateRefreshToken = (email: string):string => {
    return jwt.sign({ email }, process.env.JWT_REFRESH_SECRET as string, {
        algorithm: "HS256",
        expiresIn: "30 days"
    }); 
}
export default generateRefreshToken;