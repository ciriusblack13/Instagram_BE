import express from 'express';
import { PrismaClient } from '@prisma/client';
import requireLogin from '../../middlewares/requireLogin';

const router =  express.Router();
const prisma = new PrismaClient();

// Create post
router.post('/create', requireLogin, async (req, res) => {
    try {
        const { userId, image_url, caption} = req.body;
        const newPost = await prisma.post.create({
        data: {
            userId,
            image_url,
            caption,
        },
        });
        res.status(200).json(newPost);
    } catch (error) {
        res.status(500).send('Ops, qualcosahaziandato storto');
    }
});


// View a single post
router.get('/:id/view', requireLogin, async (req, res) => {
    try {
        const { id } = req.params;
        const post = await prisma.post.findUnique({
            where: { id: Number(id)},
            include: {
                user: {
                    select: {
                        username: true,
                    }
                },
                comments: true,
                hashtags: true,
            }
        });
        if (post) {
            res.status(200).json(post);
        } else {
            res.status(404).send('Post non trovato');
        }
    } catch (error) {
        res.status(500).send('Ops, qualcosa è andato storto');
    }
});

// Delete a single post
router.delete('/:id/delete', requireLogin, async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.post.delete({
            where: { id: Number(id) },
        });
        res.status(200).send('Post eliminato con successo');
    } catch (error) {
        res.status(500).send('Ops, qualcosa è andato storto');
    }
});

export default router