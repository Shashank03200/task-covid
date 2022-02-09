const express = require("express");
const morgan = require("morgan");

const dataRouter = require("./routes/data.route");

const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/data", dataRouter);

app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    success: false,
    msg: err.message,
  });
});

app.listen(PORT, () => {
  console.log("Served started on port :", PORT);
});
