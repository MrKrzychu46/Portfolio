const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Generowanie 200 unikalnych produktów
let dane = Array.from({ length: 200 }, (_, i) => ({
  id: i + 1,
  title: `${generateRandomName()}`,
  description: generateRandomDescription()
}));

function generateRandomName() {
  const categories = ["Smartwatch", "Głośnik", "Laptop", "Konsola", "Telefon", "Kamera", "Dron", "Monitor", "Mysz", "Słuchawki", "Router", "Projektor", "Tablet", "Kolekcja", "Gadżet"];
  const adjectives = ["Pro", "Ultra", "X", "Max", "Plus", "Limited Edition", "Gaming", "AI", "Nano", "4K", "Elite", "Vision", "Tech", "Smart"];
  return `${categories[Math.floor(Math.random() * categories.length)]} ${adjectives[Math.floor(Math.random() * adjectives.length)]}`;
}

function generateRandomDescription() {
  const features = [
    "Zaawansowana technologia AI",
    "Obudowa odporna na wstrząsy",
    "Wodoodporność do 50m",
    "Najlepsza jakość dźwięku",
    "Ekran OLED 120Hz",
    "Bateria wytrzymująca 48h",
    "Obsługa sterowania głosem",
    "Szybkie ładowanie 2.0",
    "Integracja z aplikacją mobilną",
    "Tryb nocny i HDR",
    "Nowoczesny design premium",
    "Bezprzewodowa łączność Bluetooth 5.2",
    "Wbudowany system chłodzenia",
    "Obsługa 5G i WiFi 6",
    "Ultra-lekka konstrukcja"
  ];
  return `Ten produkt oferuje: ${features[Math.floor(Math.random() * features.length)]}, ${features[Math.floor(Math.random() * features.length)]}, ${features[Math.floor(Math.random() * features.length)]}.`;
}

// Pobieranie wszystkich produktów
app.get("/api/dane", (req, res) => {
  res.json(dane);
});

// Pobieranie pojedynczego produktu
app.get("/api/dane/:id", (req, res) => {
  const item = dane.find(d => d.id == req.params.id);
  if (item) res.json(item);
  else res.status(404).json({ error: "Nie znaleziono" });
});

// Uruchomienie serwera
const PORT = 3000;
app.listen(PORT, () => console.log(`✅ Serwer działa na http://localhost:${PORT}`));
