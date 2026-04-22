const express = require('express');
const cors = require('cors');
const downloadAndUpload = require('./download');

const app = express();

app.use(express.json());
app.use(cors());

// Health check
app.get('/', (req, res) => {
res.send('Luma API is running');
});

// Download route
app.post('/download', async (req, res) => {
try {
console.log('BODY RECEIVED:', req.body);

```
const url = req.body.url;

if (!url) {
  return res.status(400).json({ error: 'No URL provided' });
}

const result = await downloadAndUpload(url);

return res.json(result);
```

} catch (err) {
console.error('SERVER ERROR:', err);
return res.status(500).json({
error: err.message || err.toString(),
});
}
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
console.log('Server running on port ' + PORT);
});
