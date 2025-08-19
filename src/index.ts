import express from "express";
import axios from "axios";
import * as cheerio from "cheerio";
import cors from "cors";

const app = express();
const PORT = 8000;

app.use(cors());

app.get("/api/match-squads", async (req, res) => {
  try {
    const url =
      "https://www.cricbuzz.com/cricket-match-squads/117008/aus-vs-rsa-1st-odi-south-africa-tour-of-australia-2025";
    const { data: html } = await axios.get(url);
    const $ = cheerio.load(html);

    const squads = [];

    // Both left and right player cards, group by section if needed
    const players = [];

    $(".cb-player-card-left, .cb-player-card-right").each((i, el) => {
      const name = $(el)
        .find(".cb-player-name-left > div, .cb-player-name-right > div")
        .first()
        .contents()
        .filter(function () {
          return this.type === "text";
        })
        .text()
        .trim();

      const role =
        $(el).find("span.cb-font-12.text-gray").text().trim() || "N/A";

      players.push({ name, role });
    });

    squads.push({ team: "Squad Players and Coaches", players });

    res.json({ squads });
  } catch (error) {
    console.error("Scraping error:", error);
    res.status(500).json({ message: "Failed to scrape match squads." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
