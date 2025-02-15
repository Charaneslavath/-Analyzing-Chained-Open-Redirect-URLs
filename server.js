const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 3000;

app.post("/analyze", async (req, res) => {
  let { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "Invalid URL" });
  }

  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = `https://${url}`;
  }

  try {
    const response = await axios.get(url, {
      maxRedirects: 10,
      validateStatus: (status) => status >= 200 && status < 400,
    });

    res.json({ finalUrl: response.request.res.responseUrl || url });
  } catch (error) {
    res.status(500).json({ error: "Unable to analyze the URL. Please check if the website is accessible." });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
