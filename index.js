const express = require("express");
require("dotenv").config();
const port = 3000;
const app = express();
const cors = require("cors");
const connectDB = require("./config/db");
const adminRoutes = require("./routes/Admin_routes");

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());
connectDB();
app.use("/admin", adminRoutes);
app.listen(port, () => {
  console.log(`server started on port http://localhost:${port}`);
});
