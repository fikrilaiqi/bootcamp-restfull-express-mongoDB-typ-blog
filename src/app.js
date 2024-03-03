import express from "express";
import db from "./configs/db.js";
import utils from "./utils/index.js";
import router from "./routers.js";

const app = express();
const PORT = utils.getEnv("PORT");

db.connectDb();

app.use(express.json({ limit: "2MB" }));
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1", router);

app.get("/", (req, res) => {
    res.send("Hello Express");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
