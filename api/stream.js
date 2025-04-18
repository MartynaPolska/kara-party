import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { id } = req.query;

  const audioMap = {
    "november-rain": "https://firebasestorage.googleapis.com/v0/b/kara-party-lk.firebasestorage.app/o/november-rain-cover.mp3?alt=media&token=3c08b1ed-17af-4939-84cc-e722b1b3875f",
    "pinwanthiye": "https://firebasestorage.googleapis.com/v0/b/kara-party-lk.firebasestorage.app/o/Pinwanthiye%20Mage.mp3?alt=media&token=8474d722-4b2c-47b6-b46d-e5e145a08396",
    "obe-sina": "https://firebasestorage.googleapis.com/v0/b/kara-party-lk.firebasestorage.app/o/obe-sina-laga-nuwandika-senarathne.mp3?alt=media&token=81e4675b-eaf8-416d-8677-99a2117b2038",
    "billie-eilish": "https://firebasestorage.googleapis.com/v0/b/kara-party-lk.firebasestorage.app/o/What-Was-I-Made-For%20-Billie%20Eilish.mp3?alt=media&token=b3450d92-22e1-46f3-bc3a-b50625fc6c82"
  };

  const url = audioMap[id];
  if (!url) return res.status(404).send("Audio not found");

  try {
    const range = req.headers.range || "bytes=0-";

    const response = await fetch(url, {
      headers: {
        Range: range,
      },
    });

    if (!response.ok && response.status !== 206) {
      return res.status(response.status).send("Error fetching audio");
    }

    // Copy relevant headers for streaming & seeking
    res.setHeader('Content-Type', 'audio/mpeg');
    if (response.headers.has('content-range')) {
      res.setHeader('Content-Range', response.headers.get('content-range'));
      res.setHeader('Accept-Ranges', 'bytes');
      res.setHeader('Content-Length', response.headers.get('content-length'));
      res.status(206); // Partial content
    } else {
      res.setHeader('Content-Length', response.headers.get('content-length'));
      res.status(200); // Full content
    }

    response.body.pipe(res);
  } catch (err) {
    console.error("Stream error:", err);
    res.status(500).send("Server error");
  }
}
