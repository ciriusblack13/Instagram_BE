import { Request, Response, NextFunction } from 'express';

const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  // Controlla se l'utente è un amministratore
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ message: 'Accesso negato.' });
  }

  next();
};

export default requireAdmin;