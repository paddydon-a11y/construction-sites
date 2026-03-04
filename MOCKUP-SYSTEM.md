# Construction Sites — Mockup Generation System

## Purpose

This file is the single source of truth for generating prospect mockup websites. Claude Code reads a `brief.json` file from a prospect folder and produces a complete, ready-to-deploy `index.html` mockup with zero ambiguity. No reference to other mockups is needed.

---

## How It Works

1. You create a folder in `public/mockups/{company-slug}/`
2. You drop in a `brief.json` (see schema below) plus any assets (logo, photos)
3. You tell Claude Code: `Read public/mockups/{company-slug}/brief.json and generate the mockup following MOCKUP-SYSTEM.md`
4. Claude Code reads the brief, applies the rules below, and outputs `index.html` in that folder

---

## Prospect Brief Schema (brief.json)

```json
{
  "company": "Smith Electrical Services",
  "slug": "smith-electrical",
  "trade": "electrical",
  "location": "Manchester",
  "locationShort": "Manchester",
  "areas": ["Manchester", "Salford", "Stockport", "Bolton", "Bury", "Oldham", "Rochdale", "Tameside", "Trafford", "Wigan"],
  "phone": "07912345678",
  "phoneFormatted": "07912 345 678",
  "whatsapp": "447912345678",
  "email": "",
  "postcode": "M1",
  "address": "",

  "heroStyle": "auto",

  "logo": false,
  "logoFile": "",
  "logoColours": [],

  "heroImage": false,
  "heroImageFile": "",

  "photos": [],

  "reviews": [],
  "reviewSource": "google",
  "googleRating": 0,
  "googleReviewCount": 0,

  "services": [],
  "accreditations": [],
  "aboutText": "",

  "overrideTheme": "",
  "overrideAccent": "",
  "notes": ""
}
```

### Field Guide

| Field | Required | Description |
|-------|----------|-------------|
| `company` | YES | Full company name as they use it |
| `slug` | YES | Folder name, lowercase-hyphenated |
| `trade` | YES | One of: `electrical`, `plumbing`, `building`, `roofing`, `joinery`, `maintenance`, `gas` |
| `location` | YES | Full location description for hero/meta |
| `locationShort` | YES | Short version for repeated use (e.g. "Manchester") |
| `areas` | YES | Array of areas served. Aim for 10-20 |
| `phone` | YES | Phone number, no spaces |
| `phoneFormatted` | YES | Phone number with spaces for display |
| `whatsapp` | YES | WhatsApp number with country code, no + |
| `email` | NO | Email address if available |
| `postcode` | NO | First part of postcode for location display |
| `address` | NO | Full street address if available (shown in contact section) |
| `heroStyle` | NO | `"auto"` (default), `"single-image"`, `"dual-image"`, or `"no-image"`. Auto picks based on available photos: 2+ good photos = dual-image hero, 1 photo = single-image, 0 photos = no-image (text-only hero with gradient) |
| `logo` | NO | `true` if logo file exists in folder |
| `logoFile` | NO | Filename of logo image (e.g. `logo.png`) |
| `logoColours` | NO | Array of hex colours extracted from logo (e.g. `["#2563eb", "#ffffff"]`). If you don't know them, leave empty and Claude Code will extract them from the logo file |
| `heroImage` | NO | `true` if custom hero image exists |
| `heroImageFile` | NO | Filename of hero image |
| `photos` | NO | Array of photo filenames in the folder (e.g. `["job1.jpg", "job2.jpg"]`) |
| `reviews` | NO | Array of review objects (see below) |
| `reviewSource` | NO | `"google"`, `"checkatrade"`, `"trustpilot"`, or `"mixed"` |
| `googleRating` | NO | Google star rating (e.g. `4.8`) |
| `googleReviewCount` | NO | Total Google review count |
| `services` | NO | Array of service strings. If empty, use trade defaults |
| `accreditations` | NO | Array of accreditation strings (e.g. `["NICEIC", "Part P"]`) |
| `aboutText` | NO | Paragraph of about text if available |
| `overrideTheme` | NO | Force `"dark"` or `"light"` regardless of auto-detection |
| `overrideAccent` | NO | Force a specific hex accent colour |
| `notes` | NO | Free text notes for anything unusual |

### Review Object Format

```json
{
  "name": "Dave Thornton",
  "initial": "D",
  "text": "Had them out to do a full rewire...",
  "rating": 5,
  "source": "Google Review",
  "date": ""
}
```

If `reviews` array is empty, generate 6 realistic placeholder reviews appropriate to the trade and location. Make them sound natural — use local names, mention specific services, reference the area. Never use obviously fake names or generic text.

---

## Content Sourcing — How to Get the Best Content

Claude Code should gather content from multiple sources and use the BEST version of each piece of information. Priority order:

### Source Priority (highest to lowest)

1. **Explicit brief fields** (reviews array, services array, etc.) — if someone took the time to fill these in, use them
2. **The raw dump** (`rawDump` field) — this is a messy paste of everything the user found. Parse it intelligently for:
   - Google reviews (look for names, star ratings, review text patterns)
   - Services mentioned
   - About text or company descriptions
   - Accreditations or qualifications mentioned
   - Staff names (especially the owner/main tradesperson)
   - Phone numbers, email, address if not already in the brief
   - Google rating and review count
   - Any unique selling points or specialisms
3. **Their existing website** (`existingWebsite` field) — if a URL is provided, fetch it and extract:
   - Their actual services list (use their wording, not generic defaults)
   - About text / company story
   - Staff names and roles
   - Accreditations, certifications, memberships
   - Areas they say they cover
   - Any testimonials or reviews on their site
   - Their colour scheme / branding clues (helps with theme/accent decisions)
   - Contact details (address, email, hours)
   - Photos if accessible (note the URLs for use in the mockup)
4. **Trade defaults** from this document — only use these as a last resort when nothing else is available

### Merging Content

When the same information exists in multiple sources, use this logic:

- **Reviews:** Prefer real reviews from the raw dump or their website. Only generate placeholder reviews if you have zero real ones.
- **Services:** Prefer their actual services from their website or raw dump. Supplement with trade defaults if they only list a few.
- **About text:** Use their own words from their website or raw dump. Don't generate generic about text if real content exists.
- **Areas:** Merge areas from all sources. The brief areas field + any areas mentioned on their website.
- **Accreditations:** Combine from all sources — brief checkboxes + anything mentioned in the raw dump or on their website.
- **Owner/tradesperson name:** If a name is identified (from reviews, raw dump, or website), use it throughout the mockup to personalise. "Call Dave" beats "Call Us". "WhatsApp Mike" beats "WhatsApp Us".
- **Phone/contact:** Brief fields take priority, but fill in gaps from other sources.

### Parsing the Raw Dump

The raw dump will be messy — copied straight from Google, Checkatrade, or wherever. Claude Code should be smart about parsing it:

- **Google reviews** typically follow this pattern: reviewer name, time ago, star rating, review text, sometimes an owner reply
- **Ignore owner replies** — just extract the customer review
- **Look for patterns** like "5 stars", "★", review counts, "Google reviews" to identify rating info
- **Look for phone numbers** in any format and normalise them
- **Look for addresses** and postcodes
- **Look for accreditation keywords:** Gas Safe, NICEIC, NAPIT, Part P, 18th Edition, Checkatrade, TrustMark, etc.
- **Look for the owner's name** — often mentioned in reviews ("Gavin was great", "Ben came out same day")

### When Scraping Their Website

- Be respectful — one fetch is enough, don't spider the whole site
- If the site is a single page, fetch that
- If it has obvious sub-pages (/services, /about, /contact), fetch those too (max 3-4 pages)
- Extract text content, ignore navigation/footer boilerplate
- Note any images that could be used (but don't hotlink — note URLs for manual download)
- If the site is terrible (which is why they need us), don't copy the terrible content — use it as a reference but improve the copy

---

## Decision Rules

### 1. Theme & Colour Scheme — Logo-Driven Design

The colour scheme for every mockup should be **custom-built from the logo colours**. This is how real designers work — they don't pick from two presets, they build a palette from the brand. Every mockup should feel unique because every logo has different colours.

**Step 1: Extract Logo Colours**

If a logo file exists in the brief, Claude Code MUST analyse it and identify:
- The **dominant colour** (the most prominent colour in the logo)
- The **secondary colour** (if there is one)
- Whether the logo is on a **light or dark background**

If `logoColours` is provided in the brief, use those. If not, extract them from the image file.

**Step 2: Build the Palette**

Based on the logo colours, build a full CSS variable palette:

**If the dominant logo colour is DARK (navy, dark green, dark red, charcoal, etc.):**
Use the logo's dark colour as the site background base. This creates a rich, branded feel.

```css
:root {
  --bg: {LOGO_DARK_COLOUR};                    /* e.g. #0b1a3b navy */
  --card: {LOGO_DARK_COLOUR_LIGHTENED_5%};      /* e.g. #0f2247 */
  --card-hover: {LOGO_DARK_COLOUR_LIGHTENED_8%}; /* e.g. #132a52 */
  --border: {LOGO_DARK_COLOUR_LIGHTENED_10%};    /* e.g. #1a2d54 */
  --border-light: {LOGO_DARK_COLOUR_LIGHTENED_15%}; /* e.g. #213766 */
  --accent: {LOGO_SECONDARY_OR_COMPLEMENTARY};  /* bright/vibrant colour */
  --accent-hover: {ACCENT_DARKENED_10%};
  --accent-glow: {ACCENT_AT_15%_OPACITY};
}
```

Text colours stay the same as dark theme (white headings, gray-300/400 body text).

Examples:
- Navy logo (#0b1a3b) → navy background, card backgrounds slightly lighter navy
- Dark green logo (#1a3a2a) → forest green background, lighter green cards
- Dark red logo (#4a0e0e) → deep burgundy background, lighter burgundy cards
- Maroon logo (#3b0a1a) → rich maroon background

**If the dominant logo colour is BRIGHT/VIBRANT (red, blue, orange, yellow, etc.):**
Use a neutral dark or light background and make the logo colour the accent.

For vibrant colours that are medium-dark (like royal blue #2563eb):
```css
:root {
  --bg: #0a0a0a;          /* neutral dark */
  --accent: #2563eb;       /* the logo's blue */
}
```

For vibrant colours that are light/warm (like yellow #f59e0b, orange #f97316):
```css
:root {
  --bg: #0a0a0a;          /* neutral dark */
  --accent: #f59e0b;       /* the logo's yellow */
}
```

**If the logo is on a WHITE background or has light colours:**
Go light theme with the logo's most vibrant colour as the accent:

```css
:root {
  --bg: #ffffff;
  --card: #f8fafc;
  --accent: {LOGO_VIBRANT_COLOUR};
}
```

Apply all the light theme text colour inversions (dark headings, medium body text, etc.)

**If the logo is BLACK AND WHITE or GRAYSCALE:**
Default to dark theme (#0a0a0a) with trade default accent colour.

**If there is NO LOGO:**
Default to dark theme (#0a0a0a) with trade default accent colour. But vary it — don't make every no-logo site identical. Use slightly different background tones:
- Electrical (no logo): #0a0a0a (pure dark)
- Plumbing (no logo): #0a1019 (dark with blue tint)
- Building (no logo): #12100a (dark with warm tint)
- Roofing (no logo): #0d0f11 (dark with slate tint)
- Gas (no logo): #0a0a12 (dark with subtle blue)

**Step 3: Choose the Accent Colour**

The accent colour is the eye-catching colour used for buttons, highlights, badges, and interactive elements.

Priority:
1. `overrideAccent` in brief → use that
2. Logo has a bright/vibrant secondary colour → use that
3. Logo is monochrome dark → pick a complementary vibrant colour that works with the background
4. No logo → use trade defaults:

| Trade | Accent Hex | Accent Name |
|-------|-----------|-------------|
| `electrical` | `#f59e0b` | Amber |
| `plumbing` | `#2563eb` | Blue |
| `gas` | `#2563eb` | Blue |
| `building` | `#f97316` | Orange |
| `roofing` | `#f59e0b` | Amber |
| `joinery` | `#d97706` | Warm Amber |
| `maintenance` | `#0891b2` | Teal |

**Step 4: Ensure Contrast**

After building the palette, verify:
- Accent colour has sufficient contrast against the background (must be clearly visible)
- If accent and background are too similar (e.g. blue accent on navy background), adjust the accent to be brighter/more saturated
- White text must be readable on the background
- Accent text must be readable on card backgrounds
- CTA buttons must stand out clearly from everything around them

**Step 5: Generate Supporting Colours**

From the base palette, derive:
- `--accent-hover`: accent darkened 10%
- `--accent-glow`: accent at 15% opacity (for radial gradient, badge backgrounds)
- `--green`: always #22c55e (WhatsApp green)
- Gray scale: keep the standard gray-50 through gray-500 values, they work on both dark and light backgrounds

### 2. Accent Colour for CTA Buttons

The CTA button colour should CONTRAST with the accent:
- If the accent colour is used for the main CTA → that's fine (most cases)
- If the site's accent is quite dark or muted → use amber (#f59e0b) or a bright complementary for CTAs to make them pop
- WhatsApp button is always #25d366
- The two hero buttons (Call + WhatsApp) must both stand out clearly against the hero background

### 3. Template Family Selection

Based on content density:

| Content Available | Template |
|-------------------|----------|
| Has logo + photos + real reviews + about text | **Full** — Inter/Jakarta, all sections |
| Has some real content (reviews OR photos OR logo) | **Standard** — Inter/Jakarta, core sections |
| Company name + trade + location only | **Minimal** — Barlow, streamlined sections |

### 4. Section Inclusion Rules

**Always include (every mockup):**
- Nav (fixed top)
- Hero
- Trust bar
- Services
- Reviews (real or generated)
- Contact form
- Footer
- Floating CTA buttons (call + WhatsApp)

**Include if content exists:**
- Gallery → only if `photos` array has 3+ items
- About section → only if `aboutText` is provided
- Areas served → always include if `areas` array has items (it should)
- Why Choose Us → include for Full and Standard density, skip for Minimal
- CTA Band (mid-page) → include for Full and Standard density

**Section order for Full/Standard (Inter/Jakarta):**
```
nav → hero → trust-bar → services → cta-band → why-us → reviews → gallery → areas → contact → footer
```

**Section order for Minimal (Barlow):**
```
nav → hero → trust-bar → services → reviews → contact → footer
```

### 5. Font Rules

| Template | Heading Font | Body Font |
|----------|-------------|-----------|
| Inter/Jakarta (Full/Standard) | Plus Jakarta Sans (700, 800, 900) | Inter (400, 500, 600, 700) |
| Barlow (Minimal) | Barlow Condensed (600, 700, 800) | Barlow (400, 500, 600, 700, 800) |

### 6. Service Defaults by Trade

If `services` array is empty, use these defaults:

**Electrical:**
- Domestic Electrical Installation
- Commercial Electrical Services
- Rewiring & Upgrades
- Fuse Board Replacements
- EICR Testing & Inspection
- Fault Finding & Repairs
- Lighting Design & Installation
- EV Charger Installation
- Fire Alarm & Emergency Lighting
- Alarm Systems & Security

**Plumbing:**
- Boiler Installation & Replacement
- Boiler Servicing & Repairs
- Central Heating Installation
- Radiator Installation & Repairs
- Bathroom Installation
- Leak Detection & Repairs
- Power Flushing
- Unvented Hot Water Cylinders
- Underfloor Heating
- Gas Safety Certificates

**Gas:**
- Boiler Installation & Replacement
- Boiler Servicing & Repairs
- Central Heating Systems
- Gas Safety Certificates (CP12)
- Landlord Gas Safety Checks
- Gas Cooker & Hob Installation
- Gas Fire Installation & Servicing
- Radiator Installation & Repairs
- Power Flushing
- Emergency Gas Repairs

**Building:**
- Extensions & Conversions
- Loft Conversions
- New Builds
- Renovations & Refurbishments
- Roofing & Repairs
- Brickwork & Blockwork
- Plastering & Rendering
- Driveways & Patios
- Structural Work
- Project Management

**Roofing:**
- Roof Repairs
- Full Re-Roofs
- Flat Roofing (EPDM/GRP)
- Slate & Tile Roofing
- Lead Work & Flashing
- Chimney Repairs
- Fascias, Soffits & Guttering
- Roof Cleaning & Moss Removal
- Emergency Roof Repairs
- Commercial Roofing

**Joinery:**
- Bespoke Kitchens
- Fitted Wardrobes & Storage
- Staircases
- Internal & External Doors
- Windows & Frames
- Decking & Pergolas
- Flooring
- Skirting & Architrave
- Shelving & Built-In Units
- Commercial Fit-Outs

**Maintenance:**
- Plumbing Repairs
- Electrical Repairs
- Painting & Decorating
- Carpentry & Joinery
- Bathroom & Kitchen Repairs
- Plastering & Patching
- Gutter Cleaning & Repairs
- Lock Changes & Security
- Flat Pack Assembly
- General Property Maintenance

### 7. Accreditation Defaults by Trade

If `accreditations` array is empty, use relevant defaults:

| Trade | Default Accreditations |
|-------|----------------------|
| `electrical` | Part P, 18th Edition, Fully Insured |
| `plumbing` | Gas Safe (if gas work), Fully Insured |
| `gas` | Gas Safe Registered, Fully Insured |
| `building` | Fully Insured, Free Quotes |
| `roofing` | Fully Insured, Free Quotes |
| `joinery` | Fully Insured, Free Quotes |
| `maintenance` | Fully Insured, DBS Checked |

### 8. Trust Bar Items

**IMPORTANT — Hero Layout Variations:**

The hero section should NOT always look the same. Pick the layout based on available content:

| heroStyle | When to Use | Layout |
|-----------|-------------|--------|
| `dual-image` | 2+ good work photos available | Text on left, two stacked/side-by-side photos on right. Premium look — use this whenever possible. See Luton Electricians as reference. |
| `single-image` | 1 hero image or 1 work photo | Text on left, single image on right with overlay badge |
| `no-image` | No photos at all | Full-width text hero with radial gradient glow background. Logo can float right if available. |

If `heroStyle` is `"auto"` (default):
- 2+ photos in the brief → `dual-image`
- 1 photo or heroImage → `single-image`  
- 0 photos → `no-image`

For `dual-image`, pick the two best/most varied photos from the photos array for the hero, and use the rest in the gallery.

**CRITICAL — Hero CSS Structure:**

The `.hero` section always contains two children: `.hero-inner` (the content/images) and `.trust-bar`. The hero MUST use `flex-direction: column` so these stack vertically. Without it, they render side-by-side and the layout breaks completely.

```css
.hero {
  display: flex;
  flex-direction: column;   /* REQUIRED — never omit this */
  align-items: center;
  justify-content: center;
  min-height: 90vh;
  padding: 140px 0 0;
}
```

For `dual-image`, the `.hero-inner` uses a grid to place text left and images right:
```css
.hero-inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
  width: 100%;
  max-width: 1200px;
}
```

### 9. Review Display Style

Adapt review presentation based on what you've got:

- **Short reviews (under 30 words each):** Display as punchy one-liner quote cards. More impactful.
- **Long reviews (30+ words):** Display as full paragraph cards with author details.
- **Mix:** Use the shortest, punchiest ones in the main grid. Long reviews can go below or be truncated with "..." 

Always aim for the reviews to feel real and specific. Short and punchy beats long and generic.

### 10. Trust Bar Items

Always show 4-5 trust items. Pick from this list based on what's relevant:

- Fully Qualified (electrical)
- Fully Insured (all)
- Free Quotes (all)
- No Call-Out Charge (all)
- Part P Certified (electrical)
- Gas Safe Registered (plumbing/gas)
- 18th Edition (electrical)
- NICEIC Approved (electrical, if in accreditations)
- 5-Star Rated (if googleRating >= 4.5)
- DBS Checked (maintenance)
- {X}+ Years Experience (if mentioned in notes/about)

---

## CSS Variable System

Every mockup's colour scheme is custom-built from the logo (see Decision Rules section 1). The CSS variables below are the STRUCTURE — the actual hex values come from the logo-driven palette.

### Dark / Logo-Coloured Theme (most common)

```css
:root {
  --bg: {PALETTE_BG};               /* from logo or #0a0a0a default */
  --card: {PALETTE_BG_LIGHTER_5%};
  --card-hover: {PALETTE_BG_LIGHTER_8%};
  --border: {PALETTE_BG_LIGHTER_10%};
  --border-light: {PALETTE_BG_LIGHTER_15%};
  --accent: {PALETTE_ACCENT};
  --accent-hover: {PALETTE_ACCENT_DARKENED_10%};
  --accent-glow: {PALETTE_ACCENT_AT_15%_OPACITY};
  --green: #22c55e;
  --white: #ffffff;
  --gray-50: #f9fafb;
  --gray-100: #f3f4f6;
  --gray-200: #e5e7eb;
  --gray-300: #d1d5db;
  --gray-400: #9ca3af;
  --gray-500: #6b7280;
  --heading: '{HEADING_FONT}', sans-serif;
  --body: '{BODY_FONT}', sans-serif;
}
```

### Light Theme (when logo dictates it)

```css
:root {
  --bg: #ffffff;
  --card: #f8fafc;
  --card-hover: #f1f5f9;
  --border: #e2e8f0;
  --border-light: #cbd5e1;
  --accent: {PALETTE_ACCENT};
  --accent-hover: {PALETTE_ACCENT_DARKENED_10%};
  --accent-glow: {PALETTE_ACCENT_AT_10%_OPACITY};
  --green: #22c55e;
  --white: #1e293b;
  --gray-50: #1e293b;
  --gray-100: #334155;
  --gray-200: #475569;
  --gray-300: #64748b;
  --gray-400: #64748b;
  --gray-500: #94a3b8;
  --heading: '{HEADING_FONT}', sans-serif;
  --body: '{BODY_FONT}', sans-serif;
}
body { background: var(--bg); color: #475569; }
h1, h2, h3, h4, h5 { color: #1e293b; }
.nav { background: #ffffff; border-bottom: 1px solid #e2e8f0; }
.nav-logo { color: #1e293b; }
.footer { background: #f8fafc; }
```

**IMPORTANT for light theme:** The `--white` variable becomes dark text. All explicit `#fff` or white references in the dark template must be swapped to dark text colours.

---

## Animations & Interactive Details

Every mockup must include these. They're non-negotiable — they make the difference between looking like a template and looking like a premium build.

### Hero Animations (on page load)

All hero elements should animate in on load with staggered timing using CSS keyframes:

1. **Hero badge** — fade in + slide up, 0.3s delay
2. **Hero h1** — fade in + slide up, 0.5s delay
3. **Hero subtitle** — fade in + slide up, 0.7s delay
4. **Hero buttons** — fade in + slide up, 0.9s delay
5. **Hero image(s)** — fade in + scale from 0.95 to 1, 0.6s delay

```css
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes fadeScale {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
.hero-badge { opacity: 0; animation: fadeUp 0.6s ease forwards 0.3s; }
.hero h1 { opacity: 0; animation: fadeUp 0.6s ease forwards 0.5s; }
.hero-sub { opacity: 0; animation: fadeUp 0.6s ease forwards 0.7s; }
.hero-btns { opacity: 0; animation: fadeUp 0.6s ease forwards 0.9s; }
.hero-image { opacity: 0; animation: fadeScale 0.8s ease forwards 0.6s; }
```

### Hero Word-Reveal Animation (JS)

If using the staggered word-reveal effect on the h1 (splitting into `<span class="hero-word">` elements via JS), the h1 starts with `visibility: hidden` in CSS. The JS **MUST** set `heroHeading.style.visibility = 'visible'` immediately after replacing the innerHTML — before the setTimeout that adds the `revealed` class. Without this, the entire heading stays invisible.

```javascript
heroHeading.innerHTML = result;
heroHeading.style.visibility = 'visible';  // REQUIRED — without this, title is invisible
setTimeout(function(){ /* add .revealed to each .hero-word */ }, 200);
```

### Scroll Reveal Animations

All sections below the fold should animate in when they scroll into view using IntersectionObserver:

```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
```

```css
.reveal { opacity: 0; transform: translateY(30px); transition: opacity 0.6s ease, transform 0.6s ease; }
.reveal.revealed { opacity: 1; transform: translateY(0); }
```

Add the `.reveal` class to: section headings, service cards (stagger each card with transition-delay), review cards, gallery images, why-us items, area tags, contact form.

Stagger service cards and review cards:
```css
.service-card:nth-child(1) { transition-delay: 0s; }
.service-card:nth-child(2) { transition-delay: 0.1s; }
.service-card:nth-child(3) { transition-delay: 0.2s; }
.service-card:nth-child(4) { transition-delay: 0.3s; }
/* ... continue pattern */
```

### Pulsing Floating CTA Buttons

The floating call and WhatsApp buttons must have a subtle pulse animation to draw attention:

```css
@keyframes pulse-ring {
  0% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.4); }
  70% { box-shadow: 0 0 0 12px rgba(245, 158, 11, 0); }
  100% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0); }
}
@keyframes pulse-ring-wa {
  0% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.4); }
  70% { box-shadow: 0 0 0 12px rgba(37, 211, 102, 0); }
  100% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0); }
}
.fab-call { animation: pulse-ring 2s ease-in-out infinite; }
.fab-wa { animation: pulse-ring-wa 2s ease-in-out infinite; }
```

The pulse colour should match the button — amber/accent for call, green for WhatsApp. The pulse stops on hover (add `animation: none` on hover state).

### Hero Badge Pulse

The green dot in the hero badge (e.g. "● NAPIT Approved") must pulse:

```css
@keyframes dot-pulse {
  0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4); }
  50% { opacity: 0.7; box-shadow: 0 0 0 6px rgba(34, 197, 94, 0); }
}
.hero-badge .dot { animation: dot-pulse 2s ease-in-out infinite; }
```

### Service Card Hover

Service cards must have the accent-coloured top border that slides in on hover (already in the CSS template but confirming it's required):

```css
.service-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: var(--accent);
  transform: scaleX(0);
  transition: transform 0.3s;
  transform-origin: left;
}
.service-card:hover::before { transform: scaleX(1); }
```

### Button Hover Effects

All CTA buttons must lift on hover:

```css
.btn:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(0,0,0,0.2); }
```

### NO Animation on These

- Nav bar (should feel stable/fixed)
- Footer (not worth animating)
- Floating buttons appearance (they already fade in on scroll — don't add extra animation to their entrance)

---

## Premium Design Rules — MANDATORY

These details are what make the mockup feel like a £3,000 build, not a template. Every single mockup must include ALL of these. Claude Code should treat this section as non-negotiable.

### Typography That Feels Expensive

- **Hero h1 must be BIG.** Desktop: minimum 3.2rem, ideally 3.5rem+. It should dominate the viewport.
- **Letter-spacing on headings:** Always negative (-0.03em to -0.04em). This is what separates amateur from premium typography.
- **Section labels** (the small text above section titles like "Our Services"): Always uppercase, always letter-spaced (0.12em+), always accent colour, always tiny (0.7rem). This is a luxury design pattern.
- **Line height on body text:** 1.7 minimum. Generous spacing = premium feel.
- **Font weight contrast:** Headings at 800-900, body at 400. The contrast between thick headings and light body text is key.

### Subtle Gradient & Glow Effects

- **Hero background glow:** Always include a radial gradient glow behind the hero in the accent colour at very low opacity (10-15%). This creates depth without being obvious.
```css
.hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 80% 60% at 50% 0%, var(--accent-glow), transparent 70%);
  pointer-events: none;
}
```
- **Accent text gradient on hero h1:** The key phrase in the h1 should use a gradient text effect:
```css
.hero h1 .accent {
  background: linear-gradient(135deg, var(--accent), {ACCENT_LIGHTER_20%});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```
- **Card hover glow:** On dark themes, service cards and review cards should get a very subtle glow on hover:
```css
.service-card:hover {
  border-color: var(--border-light);
  background: var(--card-hover);
  box-shadow: 0 0 20px rgba(var(--accent-rgb), 0.05);
}
```

### Glassmorphism Nav (Dark Theme Only)

On dark theme, the nav should use a frosted glass effect instead of solid black. This instantly feels more modern:

```css
.nav {
  background: rgba(10, 10, 10, 0.8);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}
```

### Hero Image Treatment

When photos are used in the hero:
- **Always** add a subtle border-radius (16px)
- **Always** add a 1px border in the border colour for definition
- **On dark theme:** Add a gradient overlay from transparent to the background colour at the bottom of the image
- **Add a floating badge** on the hero image (e.g. "5.0★ · 22 Reviews" or "NAPIT Approved" or "Fully Qualified"). This small detail looks incredibly polished:
```css
.hero-image-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(10, 10, 10, 0.85);
  backdrop-filter: blur(8px);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 10px 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}
```

### Google Review Integration That Looks Real

- **Always show the Google "G" logo** next to the star rating (use the inline SVG coloured Google G)
- **Always show exact rating and count** (e.g. "5.0" with stars and "22 reviews on Google")
- **Review cards must have:** star icons (filled amber), the quote in italics, author name in bold, "Google Review" in muted text, and a circular avatar with the author's initial in the accent colour
- **If the rating is 4.8+**, add a "Top Rated" or "5-Star Rated" trust bar item — social proof stacking

### Spacing That Breathes

Premium design uses MORE whitespace than you think:
- **Section padding:** 80px top and bottom on desktop minimum, 60px on mobile
- **Between section title and content:** 40px minimum
- **Between cards in a grid:** 16-20px gap
- **Hero padding top:** 140px (clear of nav + breathing room)
- Never let sections feel cramped. When in doubt, add more space.

### Micro-Interactions

Small touches that make it feel alive:
- **Area tags:** Border colour transitions to accent on hover
- **Nav links:** Colour transition on hover (0.2s ease)
- **Contact form inputs:** Border transitions to accent colour on focus
- **"Send Enquiry" button:** Same lift + shadow as other CTAs
- **Gallery images:** Slight scale on hover (transform: scale(1.03)) with overflow hidden on container

### The CTA Band Must Hit Hard

The mid-page CTA band (between sections) should feel like a pattern interrupt:
- **On dark theme:** Use `var(--card)` background with top/bottom borders
- **On light theme:** Use the accent colour as background with white text — this creates a bold colour block that breaks up the page
- **Headline should be direct and urgent:** "Need an Electrician in {location}?" not "Get in Touch"
- **Always two buttons:** Call + WhatsApp, side by side, centred

### Contact Section Polish

- **Two-column layout:** Info on left, form on right
- **Form card:** Slightly elevated with border and subtle background difference from the page
- **Labels:** Tiny, uppercase, letter-spaced — matching the section label style
- **Input fields:** Clean, generous padding (12-14px), accent border on focus
- **The submit button must be full-width** within the form and use the primary accent colour

### Footer — Simple but Considered

- Logo/company name centred
- Copyright line
- "Site by construction-sites.co.uk" link
- Subtle top border
- That's it. No clutter. Premium brands have minimal footers.

### Logo Placement — NEVER in the Nav

The nav bar must ALWAYS use the company name as text, never a logo image. Logo images in navs always look tiny, blurry, and cheap at 40-50px height.

Instead, place the logo prominently in ONE of these locations depending on what works best:

1. **Hero section** — floating alongside or below the hero text as a trust/branding element. Works well at 120-180px width with a subtle background card or border. Best option when there's no hero image.
2. **About section** — if there's an about/why-us section, the logo works well as a visual anchor at the top of that section.
3. **Contact section** — above or beside the contact form, reinforcing brand at the point of conversion.
4. **Footer** — displayed larger than typical (80-120px) as the footer's centrepiece above the copyright line.

Pick the placement that gives the logo the most impact WITHOUT cluttering the hero. The logo should feel like a badge of trust, not a header decoration.

For the nav, always use:
```html
<a href="#" class="nav-logo">{Company Name}</a>
```
With the accent colour on one word for visual interest (e.g. "Redbrook <span>Electrical</span>").

### Mobile Must Feel Native

The responsive design should feel like a dedicated mobile site, not a squeezed desktop:
- **Floating CTAs must stay as circles:** The floating call and WhatsApp buttons must remain as 52px pulsing circles on mobile — NEVER stretch them into a full-width bottom bar. Keep the same `bottom: 16px; right: 16px` positioning on all screen sizes. Do NOT override `.fab` to `border-radius: 0; flex: 1; width: auto` on mobile.
- **Hero text:** Centred on mobile, minimum 2rem h1
- **Single column everything** below 768px
- **Touch-friendly:** All buttons minimum 44px tap target
- **Gallery:** 2-column grid on mobile, not single column
- **Bottom padding on body** to account for floating CTA buttons (80px+)
- **Hero images on mobile (dual-image):** When two hero images sit side-by-side on mobile, each wrapper MUST have `flex: 1; min-width: 0` so they share the row equally. Without `min-width: 0`, flexbox children won't shrink below their content size and will overflow the viewport.

---

## Google Analytics & Tracking

Every mockup must include this in `<head>`:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=AW-17958918628"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'AW-17958918628');
  gtag('config', 'G-WG747WXNB6');
</script>
```

---

## Meta Tags

```html
<title>{company} | {locationShort}</title>
<meta name="description" content="{googleRating}-star rated {trade} serving {location}. {first 2-3 services}. Fully qualified. Free quotes.">
```

---

## Contact Form

The contact form `action` should be empty (handled by the main site's form handler). The form fields are always:
- Name (required)
- Phone (required)
- Email (optional)
- Service Needed (dropdown of their services + "Other")
- Message (textarea)
- Submit button

---

## Image Paths

All image paths must be relative to the mockup's deployment location:
- Logo: `/mockups/{slug}/{logoFile}`
- Hero: `/mockups/{slug}/{heroImageFile}`
- Photos: `/mockups/{slug}/{photoFilename}`

---

## Gallery Section (only if 3+ photos)

Use a responsive grid with lightbox functionality. Each photo should be clickable to view full-size. Use the same lightbox pattern as existing mockups — pure CSS/JS, no external libraries.

---

## WhatsApp Link Format

```
https://wa.me/{whatsapp}?text=Hi%2C%20I%20found%20you%20online%20and%20would%20like%20a%20quote%20please
```

---

## Quality Checklist (Claude Code must verify before finishing)

1. ✅ Company name is correct and consistent throughout
2. ✅ Phone number is correct in all locations (nav CTA, hero buttons, contact section, floating buttons, WhatsApp links)
3. ✅ Location is correct and doesn't repeat incorrectly (e.g. "Blackpool & Blackpool")
4. ✅ Services are appropriate for the trade
5. ✅ Reviews sound natural and mention the company name, location, and specific services
6. ✅ Areas list is populated and relevant to the location
7. ✅ All image paths are correct
8. ✅ Google Analytics tags are present
9. ✅ Mobile responsive (check all breakpoints are included)
10. ✅ Floating CTA buttons are present with correct phone/WhatsApp links
11. ✅ Contact form has service dropdown populated with their services
12. ✅ Meta title and description are set
13. ✅ No placeholder text like "Lorem ipsum" or "[COMPANY]" remains
14. ✅ The theme (light/dark) and accent colour are applied correctly throughout
15. ✅ Nav logo text uses company name (not trade name repeated)

---

## Common Mistakes to Avoid

- **"Blackpool & Blackpool"** — don't duplicate the location in CTA text. Write "Need an Electrician in Blackpool?" not "Need an Electrician in Blackpool or Blackpool?"
- **"Fully Qualified & Fully Qualified"** — don't repeat trust items in the Why Us section
- **Generic review text** — if generating reviews, make them specific. Mention the company by name, reference a real service, mention a nearby area
- **Wrong phone in WhatsApp link** — WhatsApp needs country code format (447xxx), not 07xxx
- **Mismatched theme colours** — if using light theme, don't leave dark-theme-only styles like `color: var(--white)` which would show as white text on white background
- **Nav logo saying "SAB Electrical Electrical"** — the company name IS the logo. Don't append the trade unless it's part of their actual name
- **Missing accent colour in SVG icons** — service card icons and trust bar icons must use the accent colour, not hardcoded amber

---

## Example Prompt for Claude Code

```
Read public/mockups/smith-electrical/brief.json and generate the mockup index.html following the rules in MOCKUP-SYSTEM.md. Put the output at public/mockups/smith-electrical/index.html
```

That's it. One line. The brief.json + this document contain everything needed.
