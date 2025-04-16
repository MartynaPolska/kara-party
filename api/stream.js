export default async function handler(req, res) {
    const { id } = req.query;
  
    const audioLinks = {
      "november-rain": "https://firebasestorage.googleapis.com/v0/b/kara-party-lk.firebasestorage.app/o/november-rain-cover.mp3?alt=media&token=3c08b1ed-17af-4939-84cc-e722b1b3875f",
      "pinwanthiye": "https://firebasestorage.googleapis.com/v0/b/kara-party-lk.firebasestorage.app/o/Pinwanthiye%20Mage.mp3?alt=media&token=8474d722-4b2c-47b6-b46d-e5e145a08396",
      "obe-sina": "https://firebasestorage.googleapis.com/v0/b/kara-party-lk.firebasestorage.app/o/obe-sina-laga-nuwandika-senarathne.mp3?alt=media&token=81e4675b-eaf8-416d-8677-99a2117b2038",
      "what-was-i-made-for": "https://firebasestorage.googleapis.com/v0/b/kara-party-lk.firebasestorage.app/o/What-Was-I-Made-For%20-Billie%20Eilish.mp3?alt=media&token=b3450d92-22e1-46f3-bc3a-b50625fc6c82"
    };
  
    const url = audioLinks[id];
    if (!url) return res.status(404).send("Audio not found");
  
    const response = await fetch(url);
    if (!response.ok) return res.status(500).send("Failed to stream audio");
  
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Cache-Control", "no-store");
  
    response.body.pipe(res);
  }
  