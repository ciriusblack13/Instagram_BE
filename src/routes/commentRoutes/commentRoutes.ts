import express from 'express';
import { PrismaClient } from '@prisma/client';
import requireAdmin from '../../middlewares/requireAdmin';
import requireLogin from '../../middlewares/requireLogin';

const router = express.Router();
const prisma = new PrismaClient();

// Add comment
router.post('/:postId/comment', requireLogin, async (req, res) => {
    try {
        const { postId } = req.params;
        const { userId, text } = req.body;

        if (!postId || isNaN(Number(postId))) {
            return res.status(400).send('ID del post non valido.');
        }
        if (!userId || isNaN(Number(userId))) {
            return res.status(400).send('ID dell\'utente non valido.');
        }
        if (!text || typeof text !== 'string' || text.trim().length === 0) {
            return res.status(400).send('Testo del commento non valido.');
        }

        const newComment = await prisma.comment.create({
            data: {
                text,
                postId: Number(postId),
                userId
            }
        });

        res.status(201).json(newComment);
    } catch (error) {
        res.status(500).send('Ops, qualcosa è andato storto');
    }
});

// View post's comments
router.get('/:postId/comments', requireLogin, async (req, res) => {
    try {
        const { postId } = req.params;
        const comments = await prisma.comment.findMany({
            where: { postId: Number(postId) }
        });

        res.status(200).json(comments);
    } catch (error) {
        res.status(500).send('Ops, qualcosa è andato storto');
    }
});

// Delete comment
router.delete('/:id/delete', requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;

        const comment = await prisma.comment.findUnique({
            where: { id: Number(id) },
            include: { post: true }
        });

        if (!comment) {
            return res.status(404).send('Commento non trovato');
        }

        // Verify the user has permission to delete the comment
        if (comment.userId !== userId && comment.post.userId !== userId) {
            return res.status(403).send('Non hai i permessi per eliminare questo commento');
        }

        await prisma.comment.delete({
            where: { id: Number(id) }
        });

        res.status(200).send('Commento eliminato con successo');
    } catch (error) {
        res.status(500).send('Ops, qualcosa è andato storto');
    }
});

export default router;
