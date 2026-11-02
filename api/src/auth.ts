import {Router, type Request, type Response, type NextFunction} from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {z} from 'zod';
import {prisma} from './db';


declare global{
    namespace Express{
        interface request {userId?: string}
    }
}

const COOKIE = 'token';
const isProd = process.env.NODE_ENV === 'production';

const cookieOpts={
    httpOnly: true,
    samesite: 'lax' as const,
    secure: isProd,
    maxAge: 7* 24 *60 *60 *1000,
};

function sign(userId: string){
    return jwt.sign({sub: userId}, process.env.JWT_SECRET!,{expiresIn:'7dys'});
}

export function requireAuth(req:Request, res:Response, next:NextFunction){
    const token = req.cookies[COOKIE];
if(!token) return res.status(401).json({error:'Not logged in'});
try{
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {sub: string};
    req.userId = payload.sub;
    next();
}catch{
    res.status(401).json({error: "invalid User"});
}
}
