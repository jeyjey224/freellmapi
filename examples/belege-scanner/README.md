# Kuatia

Kuatia (Guaraní für „Papier, Schriftstück“) ist eine Ausgaben-App für Belege aus Paraguay: Ticket oder Factura fotografieren, Claude liest Händler, Betrag, Währung, Datum und RUC aus, die App wertet alles in Guaraní aus.

`index.html` ist die gemeinsame App. Sie läuft

- **lokal / als Claude-Vorschau:** Belege liegen im Browser (IndexedDB), gelesen wird über Claude in der Vorschau, einen eigenen KI-Server oder die Texterkennung im Browser.
- **als Cloud-Version mit Konten:** siehe `../belege-cloud` (wird mit `python3 build.py` aus dieser Datei gebaut).

## Funktionen

- Übersicht mit Betrag, Vergleich zum Vormonat, Monatsbudget mit Tempo-Markierung
- Hinweis-Karten: größter Posten, Hochrechnung, teuerster Tag, stärkste Veränderung, Stammhändler
- Verlauf pro Tag (Balken oder Kalender) und pro Monat, alles anklickbar
- Kategorien-Ring mit Detailansicht und Budget pro Kategorie
- Händler mit Marken-Kacheln (Markenfarben, keine Original-Logos), Detailansicht pro Händler und Tag
- Guaraní als Hauptwährung, USD/BRL/ARS/EUR mit eigenem Kurs pro Beleg
- CSV-Export, Backup, Rückgängig beim Löschen, Hell- und Dunkelmodus
- Tastatur: `N` neuer Beleg, `/` Suche, Pfeiltasten wechseln den Zeitraum

Icons: [Lucide](https://lucide.dev) (ISC-Lizenz), eingebettet.
