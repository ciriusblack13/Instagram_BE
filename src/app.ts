import express from 'express';
import usersRouter from './routes/userRoutes/users';
import authRouter from './routes/authRoutes/authRoutes';
import postRouter from './routes/postRoutes/postRoutes';
import hashtagRouter from './routes/hashtagRoutes/hastagRoutes';
import 'dotenv/config';

const app = express();

app.use(express.json());
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/post', postRouter);
app.use('/hashtag', hashtagRouter);

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})

app.get('/', (req, res) => {
    res.send('Benvenuto nel server Express!');
  })