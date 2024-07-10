import express from 'express';
import cors from 'cors';
import contactsRouter from './routes/contactsRouter.js';
import { config } from 'dotenv';
import mongoose from 'mongoose';

config();

const app = express();

// parse application/json
app.use(express.json());
// cors
app.use(cors());

app.use('/api/contacts', contactsRouter);

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
const uriDb = process.env.DB_HOST;

const connection = mongoose.connect(uriDb, {});

connection
  .then(() => {
    app.listen(PORT, function () {
      console.log(`Server running. Use our API on port: ${PORT}`);
    });
  })
  .catch(err => console.log(`Server not running. Error message: ${err.message}`));
