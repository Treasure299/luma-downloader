const express = require('express');
const cors = require('cors');
const { downloadAndUpload } = require('./download');

const app = express();

// VERY IMPORTANT (force JSON parsing properly)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

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

if (!url || typeof url !== 'string') {
  return res.status(400).json({
    error: 'Invalid or missing URL',
  });
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
