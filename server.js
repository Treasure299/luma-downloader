const express = require("express");
const cors = require("cors");

const saveVideoRoute = require("./saveVideoRoute");
const jobRoute = require("./jobRoute");

const app = express();

app.use(cors());
app.use(express.json());

// start job
app.use("/api/save-video", saveVideoRoute);

// check job status
app.use("/api/job", jobRoute);

app.get("/", (req, res) => {
  res.send("LUMA Job System Running 🚀");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
