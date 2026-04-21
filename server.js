const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");

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

  // IMPORTANT: we are using ./yt-dlp because Render does not register global installs
  const command = `./yt-dlp -f best -o output.mp4 "${url}"`;

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
