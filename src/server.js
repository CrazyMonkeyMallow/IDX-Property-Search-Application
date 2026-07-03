require("dotenv").config();

const express = require("express");
const cors = require("cors");
const healthRoutes = require("./routes/health");
const propertyRoutes = require("./routes/properties");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/health", healthRoutes);
app.use("/api/properties", propertyRoutes);

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

server.on("error", (error) => {
  console.error("Server failed to start:", error.message);
  process.exit(1);
});
