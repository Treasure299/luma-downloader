const express = require('express');
const cors = require('cors');
const { downloadAndUpload } = require('./download');

const app = express();
app.use(cors());
app.use(express.json());

// Health check route
app.get('/', (req, res) => {
res.send('Luma API is running');
});

// Main download route
app.post('/download', async (req, res) => {
const { url } = req.body;

if (!url) {
return res.status(400).json({ error: 'No URL provided' });
}

try {
const result = await downloadAndUpload(url);
return res.json(result);
} catch (err) {
console.error(err);
return res.status(500).json({
error: err.message || err.toString(),
});
}
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
});
