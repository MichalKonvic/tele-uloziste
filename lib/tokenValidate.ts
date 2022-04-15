import jwt, { JsonWebTokenError } from 'jsonwebtoken';
const isTokenValid = (token: string) => {
    try {
        const jwtData:any = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string, {
            algorithms: ["HS256"]
        });
        return true;
    } catch (error) {
        if (error instanceof JsonWebTokenError) {
            return false;
        }
        console.warn(`Unexpected error occured while validating: "${token}"`);
        return false;
    }
} 
export default isTokenValid;