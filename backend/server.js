const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");

require("dotenv").config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/users", require("./routes/userRoutes"));
app.use("/admin", require("./routes/adminRoutes"));
app.use("/attend", require("./routes/attendRoutes"));
app.use("/leave", require("./routes/leaveRoutes"));
app.use("/expense", require("./routes/expenseRoutes"));
app.use("/log", require("./routes/logRoutes"));

app.get("/", (req, res) => {
    res.send("Hello Node.js");
});

app.listen(3000, () => console.log("http://localhost:3000 에서 서버 실행 중"));
