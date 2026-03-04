# Construction Sites — Project Instructions

## Mockup Generation
When generating any mockup or processing a mockup brief, always read MOCKUP-SYSTEM.md in full first and apply ALL rules including:
- Content sourcing (parse raw dump, scrape existing website if URL provided)
- Theme and colour selection based on logo
- Animation and interactive details (hero fade-in, scroll reveals, pulsing CTAs)
- Premium design rules (glassmorphism nav, gradient text, generous spacing, micro-interactions)
- Quality checklist before finishing

This applies to ANY prompt that mentions mockups, briefs, or the mockup-creator. Never skip sections of MOCKUP-SYSTEM.md.

## Mockup Brief Prompts
When you receive a prompt that starts with "Generate a mockup site for" and includes curl commands, this came from the mockup creator form. Follow these steps:
1. Read MOCKUP-SYSTEM.md fully
2. Fetch the brief from the API URL provided
3. Download all images (logo, photos) into public/mockups/{slug}/
4. Parse the raw dump for reviews, services, owner name, accreditations
5. If existingWebsite URL is in the brief, fetch it and extract useful content
6. Generate public/mockups/{slug}/index.html following all MOCKUP-SYSTEM.md rules
7. Git add, commit and push

## Theme Decision — READ THIS
Do NOT default to dark theme on every mockup. Check the logo:
- Logo on WHITE background → LIGHT theme, use logo's vibrant colour as accent
- Logo with DARK dominant colour (navy, forest green, burgundy) → use that dark colour AS the background
- Logo with BRIGHT colours on dark → dark theme with the bright colour as accent
- Black/white logo or no logo → dark theme with trade default accent
EVERY mockup should feel different. If the last 3 were dark, seriously consider making the next one light.

## Tech Stack
- Next.js on Vercel
- Upstash Redis for CRM and mockup briefs
- Vercel Blob for image storage
- Admin auth: client-side password gate (admin2026 for admin access)
