// Supabase Edge Function "read-receipt": liest ein Belegfoto mit Claude aus.
// Der Anthropic-API-Schlüssel liegt als Secret ANTHROPIC_API_KEY in Supabase, nie im Browser.
import Anthropic from "npm:@anthropic-ai/sdk@1.6.0";
import { createClient } from "npm:@supabase/supabase-js@2.49.8";

const DAILY_LIMIT = 100; // Scans pro Konto in 24 Stunden
const CATEGORIES = [
  "Lebensmittel", "Restaurant & Café", "Tanken & Auto", "Mobilität", "Gesundheit", "Wohnen & Haushalt",
  "Elektronik", "Kleidung", "Telefon & Internet", "Freizeit & Abos", "Online & Courier", "Gebühren & Steuern", "Sonstiges",
];
const GROUPS = [
  "Obst & Gemüse", "Fleisch & Fisch", "Milch & Käse", "Brot & Backwaren", "Grundnahrung", "Getränke", "Alkohol", "Snacks & Süßes",
  "Haushalt & Reinigung", "Körperpflege", "Medikamente", "Essen & Trinken", "Kraftstoff", "Elektronik & Zubehör", "Kleidung & Schuhe",
  "Dienstleistung", "Sonstiges",
];
const SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["merchant", "ruc", "date", "amount", "currency", "category", "type", "items"],
  properties: {
    merchant: { type: "string", description: "Name des Geschäfts ohne S.A. oder S.R.L." },
    ruc: { type: "string", description: "RUC des Geschäfts wie 80012345-6, sonst leer" },
    date: { type: "string", description: "Datum des Belegs als YYYY-MM-DD" },
    amount: { type: "number", description: "Endbetrag (Total a pagar)" },
    currency: { type: "string", enum: ["PYG", "USD", "BRL", "ARS", "EUR"] },
    category: { type: "string", enum: CATEGORIES },
    type: { type: "string", enum: ["Rechnung", "Quittung"], description: "Rechnung bei Factura, sonst Quittung" },
    items: {
      type: "array",
      description: "Einzelne Positionen des Belegs, leer wenn keine lesbar",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["name", "qty", "amount", "group"],
        properties: {
          name: { type: "string", description: "Kurzer, lesbarer Produktname" },
          qty: { type: "number", description: "Menge, Stück oder kg/Liter" },
          amount: { type: "number", description: "Zeilenbetrag" },
          group: { type: "string", enum: GROUPS },
        },
      },
    },
  },
};
const PROMPT = `Lies diesen Beleg (Ticket, Factura oder Rechnung, meist aus Paraguay) und gib die Daten zurück.
Guaraní haben keine Dezimalstellen: "125.000" bedeutet 125000. Ohne Währungsangabe ist es PYG.
Der Betrag ist der Endbetrag (TOTAL A PAGAR), nicht Zwischensumme, IVA, Efectivo oder Vuelto.
Ist ein Feld nicht lesbar, gib für Text einen leeren String zurück.
Lies alle Produktzeilen mit Menge und Zeilenbetrag und ordne jede einer Gruppe zu.`;

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

const anthropic = new Anthropic(); // liest ANTHROPIC_API_KEY

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "Nur POST erlaubt." }, 405);

  // Nur angemeldete Nutzer dürfen scannen.
  const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, {
    global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } },
  });
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return json({ error: "Bitte melde dich an." }, 401);

  // Tageslimit, damit die Kosten planbar bleiben.
  const since = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
  const { count } = await sb.from("scans").select("id", { count: "exact", head: true }).gte("created_at", since);
  if ((count ?? 0) >= DAILY_LIMIT) return json({ error: `Tageslimit von ${DAILY_LIMIT} Scans erreicht. Morgen geht es weiter.` }, 429);

  const body = await req.json().catch(() => ({}));
  const image = body?.image, mediaType = body?.media_type;
  if (typeof image !== "string" || image.length > 7_000_000 || !["image/jpeg", "image/png", "image/webp"].includes(mediaType)) {
    return json({ error: "Das Bild fehlt oder ist zu groß." }, 400);
  }

  try {
    // Claude Haiku 5.5: das günstigste Modell, rund 0,02 US-Cent pro Beleg.
    const msg = await anthropic.messages.create({
      model: "claude-haiku-5-5",
      max_tokens: 8000,
      output_config: { effort: "low", format: { type: "json_schema", schema: SCHEMA } },
      messages: [{
        role: "user",
        content: [
          { type: "image", source: { type: "base64", media_type: mediaType, data: image } },
          { type: "text", text: PROMPT },
        ],
      }],
    } as any);
    if (msg.stop_reason === "refusal") return json({ error: "Dieser Beleg konnte nicht gelesen werden." }, 422);
    const text = msg.content.find((b: any) => b.type === "text")?.text ?? "";
    const result = JSON.parse(text);
    await sb.from("scans").insert({ user_id: user.id });
    return json(result);
  } catch (e) {
    console.error(e);
    return json({ error: "Lesen fehlgeschlagen. Versuch es gleich noch einmal." }, 502);
  }
});
