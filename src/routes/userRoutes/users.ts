import express from "express";
import { PrismaClient } from "@prisma/client";
import requireAdmin from "../../middlewares/requireAdmin";
import requireLogin from "../../middlewares/requireLogin";

const router = express.Router();
const prisma = new PrismaClient();


// View all users
router.get("/users", requireLogin, async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).send("Ops, qualcosa è andato storto");
  }
});

// View profile
router.get("/:id/view", requireLogin, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
    });

    if (!user) {
      return res.status(404).send("Utente non trovato");
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).send("Ops, qualcosa è andato storto");
  }
});

// Modify profile
router.put("/:id/modify", requireLogin || requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: {
        username,
        email
      },
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).send("Ops, qualcosa è andato storto");
  }
});

// Delete user
router.delete("/:id/delete", requireLogin, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.user.delete({
      where: { id: Number(id) },
    });

    res.status(200).send("Utente eliminato con successo");
  } catch (error) {
    res.status(500).send("Ops, qualcosa è andato storto");
  }
});

export default router;
