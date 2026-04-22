const express = require("express");
const cors = require("cors");
const downloadVideo = require("./download");
const saveVideoRoute = require("./saveVideoRoute");

const app = express();

app.use(cors());
app.use(express.json());

// Legacy route (still works if you need it)
app.post("/download", async (req, res) => {
  try {
    const { url } = req.body;

    const result = await downloadVideo(url);

    res.json(result);

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// ✅ NEW LUMA ROUTE
app.use("/api/save-video", saveVideoRoute);

app.get("/", (req, res) => {
  res.send("LUMA API running 🚀");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
