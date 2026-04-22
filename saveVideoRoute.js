const express = require("express");
const downloadVideo = require("./download");

const router = express.Router();

/**
 * SYNC LUMA API
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

    console.log("REQUEST:", url);

    const result = await downloadVideo(url);

    // platform detection
    let platform = "Unknown";
    if (url.includes("youtube") || url.includes("youtu.be")) platform = "YouTube";
    if (url.includes("tiktok")) platform = "TikTok";
    if (url.includes("instagram")) platform = "Instagram";

    res.json({
      success: true,
      videoUrl: result.videoUrl,
      title: result.title,
      platform,
      originalUrl: url,
      thumbnailUrl: result.thumbnailUrl,
      status: "completed"
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

module.exports = router;
