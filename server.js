import express from 'express';
import router from './routes/router_index.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const API_PORT = process.env.API_PORT || 5000;

app.use('/', router);

app.listen(API_PORT, () => {
  console.log(`Innovative Learning Platform API server is listening on http://localhost:/${API_PORT}`);
});
