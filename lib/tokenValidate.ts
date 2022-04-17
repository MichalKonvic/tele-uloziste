import jwt, { JsonWebTokenError } from 'jsonwebtoken';
/**
 * Checks if token is signed and verifies payload data
 * @param token 
 * @returns {string|false} email as string or false as boolean
 */
const getTokenPayload = (token: string):string|false => {
    try {
        const jwtData:any = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string, {
            algorithms: ["HS256"]
        });
        if (jwtData?.email) return jwtData.email;
        throw new Error("No payload data!");
    } catch (error) {
        if (error instanceof JsonWebTokenError) {
            return false;
        }
        console.warn(`Unexpected error occured while validating: "${token}"`);
        return false;
    }
} 
export default getTokenPayload;