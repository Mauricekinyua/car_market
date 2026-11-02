import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';


const app = express();
app.use(helmet());

app.use(cors({origin: process.env.WEB_URL ?? 'http://localhost:3000', credentials: true}));

app.use(express.json());
app.use(cookieParser());

app.get('/health',(_req,res)=>res.json({ok:true}))

//start Server
const port = Number(process.env.PORT ?? 4000);
app.listen(port, ()=> console.log(`Listening to port ${port}.`))

