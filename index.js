const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const { chromium } = require("playwright");

const app = express();
const PORT = 4000;

app.use(express.json());

const extractJob = async (url) => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: "networkidle" });

  const title = (await page.textContent("h1"))?.trim();

  // let description = await page.evaluate(() => {
  //   const descElement = document.querySelector(".job-description");
  //   return descElement ? descElement.innerText : null;
  // });

  await browser.close();

  return {
    title,
  };
};

app.get("/extract-job", async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "Job URL is required" });
  }

  try {
    const jobData = await extractJob(url);
    res.json(jobData);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to extract job content" });
  }
});

app.get("/", (req, res) => {
  res.send("Job Extraction API is running");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
