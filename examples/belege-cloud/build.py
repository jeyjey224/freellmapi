"""Baut die Cloud-Version (index.html) aus der gemeinsamen App ../belege-scanner/index.html.

Die App erkennt den Cloud-Modus selbst, sobald config.js (SB_URL, SB_KEY) und supabase-js geladen sind.
Aufruf:  python3 build.py
"""
from pathlib import Path
from urllib.parse import quote

here = Path(__file__).parent
app = (here.parent / "belege-scanner" / "index.html").read_text(encoding="utf-8")

logo = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="9" fill="#0c0e13"/>'
        '<path d="M10 7.2h12v17.6l-2-1.45-2 1.45-2-1.45-2 1.45-2-1.45-2 1.45z" fill="#fff"/>'
        '<rect x="6.4" y="18" width="19.2" height="2.4" rx="1.2" fill="#3b5bfd"/></svg>')
head = (
    '<!doctype html>\n<html lang="de">\n<head>\n<meta charset="utf-8">\n'
    '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
    f'<link rel="icon" href="data:image/svg+xml,{quote(logo)}">\n'
    '<meta name="theme-color" content="#f4f5f7">\n'
    '<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.49.8/dist/umd/supabase.min.js"></script>\n'
    '<script src="config.js"></script>\n'
)
i = app.index("<style>")
out = head + app[:i] + "</head>\n<body>\n" + app[i:].rstrip() + "\n</body>\n</html>\n"
(here / "index.html").write_text(out, encoding="utf-8")
print("index.html gebaut:", len(out), "Bytes")
