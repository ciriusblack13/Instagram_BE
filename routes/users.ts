import express from 'express';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

router.post('/register', async (req, res) => {
    try {
        const {username, email, password} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await prisma.user.create({
            data: {
                username: username,
                email: email,
                password: hashedPassword
            }
        });

        res.status(200).send('Registrazione avvenuta con successo');
    } catch (error) {
        res.status(500).send('Ops, qualcosa è andato storto');
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });

        if (!user) {
            res.status(401).send('Credenziali non valide');
            return;
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            res.status(401).send('Credenziali non valide');
            return;
        }

        res.status(200).send('Accesso effettuato con successo');
    } catch (error) {
        console.error(error);
        res.status(500).send('Ops, qualcosa è andato storto');
    }
});


export default router