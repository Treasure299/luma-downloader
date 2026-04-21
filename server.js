const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// Health check route
app.get("/", (req, res) => {
  res.send("Luma Downloader API is running 🚀");
});

// Download endpoint
app.post("/download", async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "No URL provided" });
  }

  // Path to your cookies.txt file (make sure this file exists in your project directory)
  const cookiesPath = path.join(__dirname, 'cookies.txt');
  
  // Update the yt-dlp command with the delay and cookies
  const command = `./yt-dlp --sleep-interval 1 --max-sleep-interval 5 --cookies ${cookiesPath} -f best -o output.mp4 "${url}"`;

  exec(command, (err, stdout, stderr) => {
    if (err) {
      // 🔥 THIS IS THE IMPORTANT FIX (REAL ERROR OUTPUT)
      console.error("YT-DLP ERROR:", err);
      console.error("STDERR:", stderr);

      return res.status(500).json({
        error: err.message || err.toString(),
        details: stderr || "No stderr output",
      });
    }

    console.log("YT-DLP OUTPUT:", stdout);

    return res.json({
      success: true,
      message: "Download completed",
      output: stdout,
    });
  });
});

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
