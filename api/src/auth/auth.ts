import {Router} from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {z} from 'zod';
import{prisma} from '../lib/prisma';
import {requireAuth, AuthRequest} from '../a';

