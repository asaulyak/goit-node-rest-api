import express from 'express';
import cors from 'cors';
import contactsRouter from './routes/contactsRouter.js';
import { config } from 'dotenv';
import { sequelize } from './db/index.js';
import { authRouter } from './routes/authRouter.js';
import { authMiddleware } from './middleware/authMiddleware.js';

config();

const app = express();

// parse application/json
app.use(express.json());
// cors
app.use(cors());

app.use('/avatars', express.static('public/avatars'));

app.use('/api/contacts', authMiddleware, contactsRouter);
app.use('/api/auth', authRouter);

app.use((_, res, __) => {
  res.status(404).json({
    status: 'error',
    code: 404,
    message: 'Use api on routes: /api/contacts',
    data: 'Not found'
  });
});

app.use((err, _, res, __) => {
  console.log(err.stack);

  const { status = 500, message = 'Server error' } = err;

  res.status(status).json({ message, status: 'fail', code: status });
});

const PORT = process.env.PORT || 3000;

sequelize
  .authenticate()
  .then(() => {
    console.log('Database connection successful');

    app.listen(PORT, function () {
      console.log(`Server running. Use our API on port: ${PORT}`);
    });
  })
  .catch(err => {
    console.log(`Server not running. Error message: ${err.message}`);

    process.exit(1);
  });
