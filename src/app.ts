import express from 'express';
import usersRouter from './routes/userRoutes/users';
import authRouter from './routes/authRoutes/authRoutes';
import postRouter from './routes/postRoutes/postRoutes';
import hashtagRouter from './routes/hashtagRoutes/hastagRoutes';
import commetRouter from './routes/commentRoutes/commentRoutes';
import 'dotenv/config';

const app = express();

app.use(express.json());
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/post', postRouter);
app.use('/hashtag', hashtagRouter);
app.use('/comment', commetRouter);

const PORT = 8080;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})
