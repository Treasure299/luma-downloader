const express = require("express");
const downloadVideo = require("./download");
const { exec } = require("child_process");

const router = express.Router();

/**
 * Extract metadata using yt-dlp (fast JSON mode)
 */
function getVideoMetadata(url) {
  return new Promise((resolve, reject) => {

    const command = `./yt-dlp -J "${url}"`;

    exec(command, (error, stdout, stderr) => {

      if (error) {
        return reject(new Error("Metadata extraction failed"));
      }

      try {
        const data = JSON.parse(stdout);

        resolve({
          title: data.title || "Unknown Title",
          thumbnailUrl: data.thumbnail || null,
          platform: detectPlatform(url)
        });

      } catch (err) {
        reject(new Error("Failed to parse metadata"));
      }

    });

  });
}

/**
 * Simple platform detection
 */
function detectPlatform(url) {
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "YouTube";
  if (url.includes("tiktok.com")) return "TikTok";
  if (url.includes("instagram.com")) return "Instagram";
  return "Unknown";
}

/**
 * MAIN ROUTE: /api/save-video
 */
router.post("/", async (req, res) => {

  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        error: "URL is required"
      });
    }

    console.log("SAVE VIDEO REQUEST:", url);

    // 1. Get metadata first
    const metadata = await getVideoMetadata(url);

    // 2. Download + upload video (your existing system)
    const result = await downloadVideo(url);

    // 3. Return LUMA-formatted response
    res.json({
      success: true,
      videoUrl: result.videoUrl,
      title: metadata.title,
      platform: metadata.platform,
      originalUrl: url,
      thumbnailUrl: metadata.thumbnailUrl,
      status: "completed"
    });

  } catch (err) {
    console.error("SAVE VIDEO ERROR:", err);

    res.status(500).json({
      success: false,
      error: "Video processing failed",
      message: err.message
    });
  }

});

module.exports = router;
