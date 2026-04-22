const express = require("express");
const cors = require("cors");

const saveVideoRoute = require("./saveVideoRoute");

const app = express();

app.use(cors());
app.use(express.json());

// MAIN LUMA ROUTE (SYNC)
app.use("/api/save-video", saveVideoRoute);

app.get("/", (req, res) => {
  res.send("LUMA API running 🚀");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
