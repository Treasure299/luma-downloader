const express = require('express');
const cors = require('cors');
const downloadVideo = require('./download');

const app = express();

app.use(cors());
app.use(express.json());

app.post('/download', async (req, res) => {
  try {
    console.log('BODY RECEIVED:', req.body);

    const { url } = req.body;

    const result = await downloadVideo(url);

    res.json(result);

  } catch (err) {
    console.error('SERVER ERROR:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/', (req, res) => {
  res.send('Luma API running 🚀');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
