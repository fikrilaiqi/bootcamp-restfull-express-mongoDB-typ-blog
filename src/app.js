import express from "express";
import utils from "./utils/index.js";

const app = express();
const PORT = utils.getEnv("PORT");

app.use(express.json({ limit: "2MB" }));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("Hello Express");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
