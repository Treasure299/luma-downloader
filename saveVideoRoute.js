const express = require("express");
const downloadVideo = require("./download");
const { createJob, updateJob, getJob } = require("./jobStore");
const { v4: uuidv4 } = require("uuid");

const router = express.Router();

/**
 * POST /api/save-video
 * RETURNS jobId immediately
 */
router.post("/", async (req, res) => {

  const { url } = req.body;

  if (!url) {
    return res.status(400).json({
      success: false,
      error: "URL is required"
    });
  }

  const jobId = uuidv4();

  // create job
  createJob(jobId, {
    url
  });

  res.json({
    success: true,
    jobId,
    status: "processing"
  });

  // 🔥 background processing (no waiting for user)
  processJob(jobId, url);
});

async function processJob(jobId, url) {
  try {

    updateJob(jobId, { progress: 10 });

    const result = await downloadVideo(url);

    updateJob(jobId, {
      progress: 100,
      status: "completed",
      result
    });

  } catch (err) {
    updateJob(jobId, {
      status: "failed",
      error: err.message
    });
  }
}

module.exports = router;
