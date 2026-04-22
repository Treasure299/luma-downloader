const express = require("express");
const downloadVideo = require("./download");

const router = express.Router();

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

    // Wait for download + R2 upload
    const result = await downloadVideo(url);

    // Detect platform
    let platform = "Unknown";
    if (url.includes("youtube.com") || url.includes("youtu.be")) platform = "YouTube";
    else if (url.includes("tiktok.com")) platform = "TikTok";
    else if (url.includes("instagram.com")) platform = "Instagram";

    // Return LUMA-ready response
    return res.json({
      success: true,
      videoUrl: result.videoUrl,
      title: result.title || "Unknown Title",
      platform,
      originalUrl: url,
      thumbnailUrl: result.thumbnailUrl || null,
      status: "completed"
    });

  } catch (err) {
    console.error("SAVE VIDEO ERROR:", err);

    return res.status(500).json({
      success: false,
      error: "Video processing failed",
      message: err.message
    });
  }
});

module.exports = router;
