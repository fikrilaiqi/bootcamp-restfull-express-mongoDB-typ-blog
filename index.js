import express from "express";
import db from "./src/configs/db.js";
import router from "./src/routers.js";

const app = express();
const PORT = 5500;

db.connectDb();

app.use(express.json({ limit: "2MB" }));
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1", router);

app.get("/", (req, res) => {
    res.send("Hello Express");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
