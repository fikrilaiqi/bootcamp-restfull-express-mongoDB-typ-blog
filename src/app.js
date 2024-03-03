import express from "express";

const app = express();
const PORT = 5500;

app.use(express.json({ limit: "2MB" }));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("Hello Express");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
