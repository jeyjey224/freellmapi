# Belege Scanner mit Konten (Cloud-Version)

Diese Version läuft als eigene Webseite, nicht im Claude-Link. Konten, Belege und Fotos liegen in Supabase.

## Einrichtung (einmalig)

1. **Tabelle anlegen:** Im Supabase-Dashboard unter *SQL Editor* den Inhalt von `supabase/schema.sql` einfügen und *Run* klicken.
2. **Anmeldung konfigurieren:** Unter *Authentication → URL Configuration*
   - *Site URL*: die Adresse, unter der die App läuft (lokal z. B. `http://localhost:8080`)
   - *Redirect URLs*: dieselbe Adresse eintragen, damit Bestätigungs- und Reset-Links funktionieren.
3. **Starten:** Den Ordner `belege-cloud` auf einem Webserver bereitstellen, zum Beispiel
   ```bash
   cd examples/belege-cloud && python3 -m http.server 8080
   ```
   Danach `http://localhost:8080` öffnen.

## Hosting

Die Dateien (`index.html`, `config.js`) lassen sich kostenlos bei Netlify, Cloudflare Pages oder Vercel veröffentlichen. Dafür den Ordner hochladen und die fertige Adresse unter *Site URL* eintragen.

## Lesen der Belegfotos

- **Standard:** Texterkennung direkt im Browser (Tesseract). Das Foto verlässt das Gerät nicht.
- **Optional:** Unter *Einstellungen → Erkennung* einen eigenen Server eintragen, zum Beispiel Ollama mit einem Vision-Modell (`http://localhost:11434/v1`). Ollama braucht dafür `OLLAMA_ORIGINS` mit der Adresse der App.

## Sicherheit

- In `config.js` steht nur der öffentliche *publishable*-Schlüssel. Der geheime Schlüssel `service_role` gehört nie in diese Dateien.
- Jedes Konto sieht nur seine eigenen Belege und Fotos. Das regeln die Regeln in `schema.sql` (Row Level Security).
