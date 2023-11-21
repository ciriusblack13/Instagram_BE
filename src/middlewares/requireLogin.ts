import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';
import types from '../types';

const requireLogin = (req: Request, res: Response, next: NextFunction) => {
    const authorizationHeader = req.headers.authorization;
    if(!authorizationHeader) {
        return res.status(400).json({error:'Devi aver fatto il login per visualizzare questa pagina'});
    }

    const token = authorizationHeader.split(' ')[1];
    try {
        const JWT = process.env.JWT;

        if(!JWT) {
            return res.status(400).send('Nessun token definito');
        }

        const decoded = jwt.verify(token, JWT);

        if(typeof decoded === 'object' && 'userId' in decoded) {
            req.user = { userId: decoded.userId as number};
            next();
        } else {
            throw new Error('Token JWT non valido');
        }

    } catch (error) {
        res.status(401).json({error:'Acesso non autorizzato, perfavore fornire credenziali valide'})
    }
}

export default requireLogin;