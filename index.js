import express from "express";

const app = express();
const PORT = 5500;

app.get("/", (req, res) => {
    res.send("Hello Express");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
