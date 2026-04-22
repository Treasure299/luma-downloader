const express = require("express");
const { getJob } = require("./jobStore");

const router = express.Router();

/**
 * GET job status
 */
router.get("/:id", (req, res) => {
  const job = getJob(req.params.id);

  if (!job) {
    return res.status(404).json({
      success: false,
      error: "Job not found"
    });
  }

  res.json(job);
});

module.exports = router;
