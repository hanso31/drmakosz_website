# dermatologe-basel.ch — Website der dermatologischen Praxis Dr. med. T. Makosz

Statische Website (Astro), dreisprachig (DE/EN/FR), redaktionell pflegbar über Decap CMS.

- **Produktiv-URL:** https://www.dermatologe-basel.ch
- **Hosting:** Cloudflare Pages (alternativ GitHub Pages/Netlify möglich)
- **CMS:** Decap CMS unter `/admin` (GitHub-Backend)

## Tech-Stack

| Bereich | Wahl | Begründung |
|---|---|---|
| Static Site Generator | **Astro** | Content Collections mit Frontmatter-Validierung, eingebautes i18n-Routing, null JavaScript im ausgelieferten HTML (sehr schnell, barrierearm) |
| CMS | **Decap CMS** | Git-basiert, kostenlos, läuft komplett im Browser, GitHub-Backend |
| Fonts | Quicksand + Open Sans | Selbst gehostet (via Fontsource), keine Google-Fonts-Tracker |
| Formular | Formspree | Kein eigener Server nötig |
| Bilder | lokal in `public/images/` | von der alten Website übernommen |

## Entwicklung

Voraussetzung: Node.js ≥ 22.

```bash
npm install        # Abhängigkeiten installieren
npm run dev        # Entwicklungsserver (http://localhost:4321)
npm run build      # Produktions-Build nach dist/
npm run preview    # Build lokal testen
```

## Projektstruktur

```
src/
├── content/               # ALLE redaktionellen Inhalte (via CMS pflegbar)
│   ├── leistungen/{de,en,fr}/*.md   # Leistungsseiten (Erkrankungen & Schönheit)
│   ├── pages/{de,en,fr}/*.md        # Startseite, Über uns, Kontakt, Rechtliches
│   ├── news/{de,en,fr}/*.md         # Aktuelles (vorbereitet, noch ohne Beiträge)
│   └── settings/{de,en,fr}.json     # Kontaktdaten & Sprechstunden
├── components/            # Header, Footer, Formular, Seiten-Templates
├── layouts/Base.astro     # Grundgerüst (SEO, hreflang, JSON-LD)
├── i18n/ui.ts             # UI-Texte (Navigation, Buttons …) in 3 Sprachen
└── styles/global.css      # Design-System (Markenfarben, Typografie)
public/
├── admin/                 # Decap CMS (index.html + config.yml)
├── images/                # Alle Bilder inkl. Logo (logo.svg)
├── _redirects             # 301-Weiterleitungen alter URLs (Cloudflare Pages)
└── robots.txt
```

## Deployment (Cloudflare Pages)

1. Repository zu GitHub pushen: `https://github.com/hanso31/drmakosz_website`
2. In Cloudflare Pages: **Projekt erstellen → GitHub-Repo verbinden**
3. Build-Einstellungen:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Node-Version:** Umgebungsvariable `NODE_VERSION = 22`
4. Domain `www.dermatologe-basel.ch` im Cloudflare-DNS auf das Pages-Projekt zeigen lassen (CNAME). Die Datei `public/_redirects` leitet alle alten WordPress-URLs automatisch auf die neue Struktur um.

Jeder Push auf `main` (auch CMS-Änderungen) löst automatisch einen neuen Build aus.

## Decap CMS einrichten (einmalig)

Damit sich Fr. Dr. Makosz unter `/admin` mit ihrem GitHub-Login anmelden kann, wird ein OAuth-Dienst gebraucht (GitHub verlangt das für CMS-Logins). Empfohlener Weg mit Cloudflare Workers (kostenlos):

1. **GitHub OAuth App anlegen** (unter https://github.com/settings/developers):
   - Homepage URL: `https://www.dermatologe-basel.ch`
   - Authorization callback URL: `https://<IHR-WORKER>.workers.dev/callback`
2. **OAuth-Worker deployen**, z. B. mit dem Projekt [`decap-cms-cloudflare-pages` / `decap-oauth`](https://github.com/steroids/decap-cms-cloudflare-oauth) — Client ID & Secret des OAuth Apps als Worker-Secrets hinterlegen.
3. **URL des Workers eintragen** in `public/admin/config.yml` unter `backend.base_url` (aktuell Platzhalter `https://decap-oauth.example.workers.dev`).
4. Fr. Dr. Makosz als **Collaborator** zum GitHub-Repo einladen (Settings → Collaborators).

Danach: `https://www.dermatologe-basel.ch/admin` öffnen → „Login with GitHub“ → Inhalte bearbeiten.

> Alternative: Wird die Seite doch auf Netlify gehostet, genügt Netlify Identity + Git Gateway (kein eigener OAuth-Worker nötig).

## Formspree-Formular aktivieren (einmalig)

1. Kostenloses Konto unter https://formspree.io anlegen (Empfänger: team@dermatologe-basel.ch).
2. Neues Formular erstellen → Form-ID kopieren (steht in der URL, z. B. `xqkrgnbz`).
3. In `src/components/ContactForm.astro` die Konstante `formspreeId = 'DEINE_FORM_ID'` durch die echte ID ersetzen.
4. Commit + Push — das Formular ist aktiv.

---

# Pflegeanleitung für die Praxis (Fr. Dr. Makosz)

## Anmelden

1. Rufen Sie `https://www.dermatologe-basel.ch/admin` auf.
2. Klicken Sie auf **„Login with GitHub“** und melden Sie sich mit Ihrem GitHub-Konto an.

## Inhalte bearbeiten

In der linken Seitenleiste finden Sie die Bereiche — jeder Inhalt liegt in drei Sprachen vor:

- **Leistungen (Deutsch / English / Français):** Alle Behandlungsseiten (z. B. Akne, Lasertherapie). Titel, Kurzbeschreibung, Titelbild und Text ändern Sie direkt im Editor. Eine **Vorschau** sehen Sie rechts.
- **Seiten (DE/EN/FR):** Startseite, Über uns, Kontakt, Impressum, Datenschutz, Bildquellen.
- **Aktuelles (DE/EN/FR):** News-Beiträge. Ein Beitrag erscheint erst auf der Website, wenn der Schalter **„Veröffentlicht“** aktiv ist. (Der News-Bereich ist auf der Website aktuell versteckt und kann bei Bedarf eingeblendet werden.)
- **Praxis-Daten:** Telefonnummern, E-Mail, Adresse und **Sprechstunden** — diese erscheinen automatisch im Footer jeder Seite und auf der Kontaktseite.

## Bilder hochladen

Beim Bearbeiten eines Titelbilds: auf das Bildfeld klicken → **„Upload“** → Datei auswählen. Bitte vor dem Hochladen:

- Bilder möglichst als **JPG oder WebP**, max. ca. 2500 px Breite
- Dateiname ohne Leerzeichen und Umlaute (z. B. `laser-geraet.jpg`)
- Immer das Feld **„Bild-Alt-Text“** ausfüllen (kurze Bildbeschreibung, wichtig für Barrierefreiheit und Google)

## Speichern & Veröffentlichen

- **„Save“** speichert als Entwurf. Über den Workflow-Reiter oben können Sie Änderungen als **„Ready“** markieren und dann **„Publish“** klicken.
- Nach dem Veröffentlichen dauert es ca. 1–2 Minuten, bis die Änderung auf der Website sichtbar ist (automatischer Neuaufbau).

## Wichtig zu wissen

- **Änderungen an einer Sprache wirken nicht automatisch auf die anderen.** Wenn Sie z. B. die Sprechstunden ändern, bitte in allen drei Sprachdateien anpassen (unter „Praxis-Daten“).
- Dateinamen und das Feld „Kategorie“ bitte nicht ändern — sonst verschieben sich URLs und Menüeinträge.
- Bei Problemen (oder wenn etwas „kaputt“ aussieht): nichts geht verloren — jede Änderung ist in GitHub versioniert und kann rückgängig gemacht werden.

## Rechtlicher Hinweis

Die Texte von **Impressum** und **Datenschutzerklärung** wurden 1:1 von der alten Website übernommen. Die Datenschutzerklärung erwähnt teils technische Dienste der alten WordPress-Seite (z. B. Borlabs Cookie). Die neue Website setzt **keine Cookies und keine Tracker**; einzig das Kontaktformular (Formspree) verarbeitet Daten. Die Datenschutzerklärung sollte von einer Rechtsberatung an den neuen Stand angepasst werden.
