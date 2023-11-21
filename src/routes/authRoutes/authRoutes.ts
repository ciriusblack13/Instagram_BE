import express from "express";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import requireLogin from "../../middlewares/requireLogin";

const router = express.Router();
const prisma = new PrismaClient();

const JWT = process.env.JWT;
if (!JWT) {
  throw new Error("La chiave segreta JWT non è definita nel file .env");
}


router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!email || !username || !password) {
      return res.status(400).send("Compila tutti i campi");
    }


    // Verify that the email is not already in use
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).send("L'email scelto è già in uso");
    }


    // Verify that the username is not already in use
    const existingUsername = await prisma.user.findUnique({
      where: { username },
    });
    if (existingUsername) {
      return res.status(400).send("L'username scelto è già in uso");
    }


    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username: username,
        email: email,
        password_hash: hashedPassword,
      },
    });

    res.status(200).send('Registrazione effettuata con successo');
  } catch (error) {
    res.status(500).send("Ops, qualcosa è andato storto");
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      res.status(401).send("Email o password errati");
      return;
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      res.status(401).send("Email o password errati");
      return;
    }

    const token = jwt.sign({ userId: user.id }, JWT, { expiresIn: '10m' });
    res.json({ token });

    res.status(200).send("Accesso effettuato con successo");
  } catch (error) {
    console.error(error);
    res.status(500).send("Ops, qualcosa è andato storto");
  }
});


export default router;
