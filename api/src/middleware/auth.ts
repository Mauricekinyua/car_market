import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';

//express req userId
export interface AuthRequest extends Request{
    userId?: string;
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction){

    // look for token in a cookie first
    const header = req.headers.authorization;
    const token =
        req.cookies?.token?? (header?.startsWith('Bearer')? header.slice(7): undefined);

    if(!token){
        return res.status(401).json({error: 'Not logged in'});
    }
    try{
        const payload = jwt.verify(token, process.env.JWT_SECRET!) as { userId:string};
        req.userId = payload.userId;
        next();
    }catch{
        res.status(401).json({error: 'Invalid or expired token'});
    }
}