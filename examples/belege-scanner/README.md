# Kuatia

Kuatia (Guaraní für „Papier, Schriftstück“) ist eine Ausgaben-App für Belege aus Paraguay: Ticket oder Factura fotografieren, Claude liest Händler, Betrag, Währung, Datum und RUC aus, die App wertet alles in Guaraní aus.

`index.html` ist die gemeinsame App. Sie läuft

- **lokal / als Claude-Vorschau:** Belege liegen im Browser (IndexedDB), gelesen wird über Claude in der Vorschau, einen eigenen KI-Server oder die Texterkennung im Browser.
- **als Cloud-Version mit Konten:** siehe `../belege-cloud` (wird mit `python3 build.py` aus dieser Datei gebaut).

## Funktionen

- Alles in Guaraní; Fremdwährungen werden mit dem Kurs des Belegs umgerechnet
- Geld pro Monat: Budget und Eingänge (z. B. Gehalt) eintragen, „Übrig“ auf einen Blick
- Produkte: Claude liest die Positionen mit, eigene Ansicht nach Produktgruppen und Top-Produkten
- Hinweis-Karten: größter Posten, Hochrechnung, teuerster Tag, stärkste Veränderung, Stammhändler
- Verlauf pro Tag (Balken oder Kalender) und pro Monat, alles anklickbar
- Kategorien-Ring: beim Drüberfahren teuerste Belege und Produktgruppen, Klick öffnet Details mit Budget
- Händler mit Firmenlogos (einmalig von den Webseiten geladen und eingebettet, Markenrechte bei den jeweiligen Firmen), Detailansicht pro Händler und Tag
- CSV-Export, Backup, Rückgängig beim Löschen, Hell- und Dunkelmodus
- Tastatur: `N` neuer Beleg, `/` Suche, Pfeiltasten wechseln den Zeitraum

Icons: [Lucide](https://lucide.dev) (ISC-Lizenz), eingebettet.
