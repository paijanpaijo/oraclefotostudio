const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = async (req, res) => {
  // 1. Atur Header CORS agar index.html bisa memanggil API ini
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Menangani preflight request dari browser
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "API Key tidak ditemukan di environment variable." });
    }

    // 2. Inisialisasi Model (Gunakan 1.5-flash untuk kecepatan)
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt harus diisi." });
    }

    // 3. Generate Konten
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 4. Kirim hasil balik ke frontend
    return res.status(200).json({ result: text });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Terjadi kesalahan pada server.", details: error.message });
  }
};
