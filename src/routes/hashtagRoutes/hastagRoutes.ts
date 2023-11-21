import express from 'express';
import { PrismaClient } from '@prisma/client';
import requireLogin from '../../middlewares/requireLogin';

const router = express.Router();
const prisma = new PrismaClient();

// Create hastag
router.post('/hastag', requireLogin, async (req, res) => {
    try {
        const { tag } = req.body;

        if(!tag || typeof tag != 'string' || tag.trim().length == 0) {
            return res.status(400).send('Inserire un tag valido')
        }
        const newHastag = await prisma.hashtag.create({
            data: {
                tag
            }
        });
        res.status(200).json(newHastag);
    } catch (error) {
        res.status(500).send('Ops, qualcosahaziandato storto');
    }
})

// Get a post from hastag
router.get('/hastag/:tag/posts', requireLogin, async (req, res) => {
    try {
        const { tag } = req.params;
        const posts = await prisma.hashtag.findUnique({
            where: { tag },
            include: { posts: true}
        })

        if(!posts) {
            return res.status(400).send("L'hashtag scelto non ha prodotto alcun risultato")
        }

        res.status(200).json(posts);

    } catch (error) {
        res.status(400).send('ops, qualcosa è andato storto')
    }
});

export default router;