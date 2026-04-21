const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Download endpoint
app.post("/download", (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "No URL provided" });
  }

  const filename = `video_${Date.now()}.mp4`;
  const filepath = path.join(__dirname, filename);

  const command = `yt-dlp -o "${filepath}" "${url}"`;

  exec(command, (error) => {
    if (error) {
      return res.status(500).json({ error: "Download failed" });
    }

    res.download(filepath, () => {
      fs.unlinkSync(filepath); // delete after sending
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
