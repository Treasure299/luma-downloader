const express = require('express');
const { exec } = require('child_process');
const path = require('path');

const app = express();
app.use(express.json());

// 🔹 Download Function
const downloadVideo = (url) => {
  return new Promise((resolve, reject) => {
    const cookiesPath = path.join(__dirname, 'cookies.txt');

    const command = `./yt-dlp --sleep-interval 1 --max-sleep-interval 5 --cookies ${cookiesPath} -f best -o output.mp4 "${url}"`;

    exec(command, (err, stdout, stderr) => {
      if (err) {
        console.error('YT-DLP ERROR:', err);
        console.error('STDERR:', stderr);
        return reject({
          error: err.message || err.toString(),
          details: stderr || 'No stderr output',
        });
      }

      console.log('YT-DLP OUTPUT:', stdout);

      resolve({
        success: true,
        message: "Download completed",
        output: stdout,
        fileName: "output.mp4"
      });
    });
  });
};

// 🔹 API Route
app.post('/download', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "No URL provided" });
  }

  try {
    const result = await downloadVideo(url);

    // ⚠️ TEMP: No R2 yet
    res.json({
      success: true,
      message: result.message,
      file: result.fileName
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err.error || "Download failed",
      details: err.details
    });
  }
});

// 🔹 Health Check
app.get('/', (req, res) => {
  res.send("Luma API is running 🚀");
});

// 🔹 IMPORTANT: Render Port
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
