# Belege Scanner

Eine eigenständige Web-App (eine einzige HTML-Datei) zum Scannen von Rechnungen und Quittungen, mit Ausgaben-Übersicht und Diagrammen.

## Funktionen

- **Scannen & Hochladen:** Kamera (Handy), Bilder, PDFs, mehrere Dateien gleichzeitig, Drag & Drop
- **Automatische Erkennung** von Händler, Betrag, Datum, Kategorie und Typ (Rechnung/Quittung)
  - OCR läuft lokal im Browser (Tesseract.js, Deutsch)
  - Bei digitalen PDFs wird direkt der eingebettete Text gelesen
  - Optional: KI-Erkennung über eine OpenAI-kompatible API, z. B. FreeLLMAPI (`http://localhost:3001/v1`)
- **Übersicht:** Gesamtausgaben, Anzahl, Durchschnitt, Top-Kategorie, Vergleich mit dem Vorzeitraum
- **Diagramme:** Ausgaben nach Kategorie (Donut), Monatsverlauf (gestapelt), Top-Händler
- **Belegliste** mit Suche und Filtern, Bearbeiten und Löschen
- **Export:** CSV (Excel-kompatibel), JSON-Backup und Import
- Hell- und Dunkelmodus, für Handy optimiert

Alle Daten bleiben lokal im Browser (IndexedDB).

## Starten

```bash
cd examples/belege-scanner
python3 -m http.server 8080
# dann http://localhost:8080 öffnen
```

Auf dem Handy: Rechner und Handy im selben WLAN, `http://<IP-des-Rechners>:8080` öffnen.
Für den Kamera-Zugriff über das Netzwerk ist meist HTTPS nötig; der Datei-Upload („Dateien wählen“ → Foto aufnehmen) funktioniert aber auch ohne.
