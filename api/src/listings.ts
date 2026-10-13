import {Router} from "express";
import {z} from "zod";
import {prisma} from './db';
import {requireAuth, AuthRequest} from './middleware/auth';

export const listings = Router();

const createSchema = z.object({
    title: z.string().min(3).max(120),
    description: z.string().min(10).max(5000),
    price: z.number().int().positive(),
    make: z.string().min(1),
    model: z.string().min(1),
    year: z.number().int().min(1950).max(new Date().getFullYear() + 1),
    mileage: z.number().int().min(0),
    fuelType: z.string().min(1),
    transmission: z.string().min(1),
    bodyType: z.string().min(1),
    location: z.string().min(2),
    images: z.array(z.string().url()).max(10).default([]),
});

const querySchema = z.object({
    make: z.string().optional(),
    model: z.string().optional(),
    q: z.string().optional(),
    minPrice: z.coerce.number().int().positive().optional(),
    maxPrice: z.coerce.number().int().positive().optional(),
    yearFrom: z.coerce.number().int().optional(),
    yearTo: z.coerce.number().int().optional(),
    sort: z.enum(['newest','price_Asc','price_desc']).default('newest'),
    page: z.coerce.number().int().min(1).default(1),
    limit:z.coerce.number().int().min(1).max(50).default(12),
});

listings.get('/', async(req,res)=>{
    const p = querySchema.safeParse(req.query);

    if(!p.success) return res.status(400).json(p.error.flatten());
    const f = p.data;

    const where = {
        status: "ACTIVE" as const,
        ...(f.make &&{make: {equals: f.make,mode:"insensitive" as const}}),
        ...(f.model &&{model:{equals: f.model,mode:"insensitive" as const}}),
        ...(f.q &&{
            OR:[
                {title:{contains:f.q, mode:"insensitive" as const}},
                {description:{contains:f.q, mode:"insensitive" as const}},
            ],
        }),
        ...((f.minPrice|| f.maxPrice) && {price:{gte: f.minPrice, lte: f.maxPrice}}),
        ...((f.yearFrom || f.yearTo) && {year: {gte: f.yearFrom, lte: f.yearTo}}),
    };

    const orderBy =
        f.sort === 'price_Asc' ? {price: 'asc' as const}
            : f.sort === 'price_desc' ? {price: 'desc' as const}
            : {createdAt: 'desc'as const};

    const [items, total] = await Promise.all([
        prisma.listing.findMany({
            where,
            orderBy,
            skip:(f.page -1) * f.limit,
            take: f.limit,
            include: {images:{orderBy:{position:'asc'}, take:1}},
        }),
        prisma.listing.count({where}),
    ]);
    res.json({items, total, page:f.page, pages:Math.ceil(total /f.limit)});
});






