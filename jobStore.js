const jobs = {};

/**
 * Create a new job
 */
function createJob(id, data) {
  jobs[id] = {
    id,
    status: "processing",
    progress: 0,
    result: null,
    error: null,
    ...data
  };
}

/**
 * Update job progress
 */
function updateJob(id, updates) {
  if (!jobs[id]) return;

  jobs[id] = {
    ...jobs[id],
    ...updates
  };
}

/**
 * Get job
 */
function getJob(id) {
  return jobs[id];
}

module.exports = {
  createJob,
  updateJob,
  getJob
};
