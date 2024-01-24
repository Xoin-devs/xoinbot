import 'dotenv/config';
import express from 'express';
import { VerifyDiscordRequest, getRandomEmoji, DiscordRequest } from './utils.js';

// Create an express app
const app = express();
// Get port, or default to 3000
const PORT = process.env.PORT || 3000;
// Parse request body and verifies incoming requests using discord-interactions package
app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));

app.get('/test', (req, res) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
    console.log('Listening on port', PORT);
  });