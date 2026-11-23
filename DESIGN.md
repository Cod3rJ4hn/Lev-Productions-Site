---
name: LevProductions
description: A minimal gig poster: fat poster type, lots of air, flat colour fields, one musical motion idea per section.
colors:
  session-cream: "#FEF6EB"
  sheet-cream: "#F9F0E3"
  tape-sand: "#DBCEBC"
  signal-orange: "#F53C17"
  control-room-black: "#171717"
  console-grey: "#212121"
  studio-brown: "#655B4F"
  dust-grey: "#A29D96"
  error-salmon: "#FF9B88"
typography:
  display:
    fontFamily: "Bowlby One, Bowlby Fallback, Impact, sans-serif"
    fontSize: "clamp(2.2rem, 6.4vw, 5.4rem)"
    fontWeight: 400
    lineHeight: 0.98
    letterSpacing: "-0.025em"
  hero:
    fontFamily: "Bowlby One, Bowlby Fallback, Impact, sans-serif"
    fontSize: "clamp(3rem, min(14.5vw, 17svh), 13rem)"
    fontWeight: 400
    lineHeight: 0.98
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Bowlby One, Bowlby Fallback, Impact, sans-serif"
    fontSize: "clamp(1.4rem, 2.4vw, 1.9rem)"
    fontWeight: 400
    lineHeight: 1.1
  body:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 700
    letterSpacing: "0.16em"
rounded:
  pill: "999px"
  photo: "24px"
  thumb: "20px"
spacing:
  xs: "8px"
  sm: "16px"
  md: "24px"
  lg: "40px"
  xl: "72px"
  xxl: "128px"
components:
  button-primary:
    backgroundColor: "{colors.signal-orange}"
    textColor: "{colors.control-room-black}"
    rounded: "{rounded.pill}"
    padding: "13px 27px"
    height: "52px"
  button-ink:
    backgroundColor: "{colors.control-room-black}"
    textColor: "{colors.session-cream}"
    rounded: "{rounded.pill}"
    padding: "13px 27px"
  photo:
    rounded: "{rounded.photo}"
  field:
    backgroundColor: "transparent"
    textColor: "{colors.session-cream}"
    height: "52px"
---

# Design System: LevProductions

## Overview

**Creative North Star: "The Minimal Poster"**

One loud idea per section, then air. Headlines are set in a fat poster face; everything else is quiet: flat colour fields, hairline rules, rounded photographs and a lot of empty space. The musical feeling comes from motion that responds to the visitor's scroll (an equaliser that dances, a playhead that sweeps four tracks, a shelf of artists that slides sideways), not from decoration.

Three rooms: cream paper for reading, a black room for the work (services, artists, contact), and one full orange field for the discovery call.

**Key Characteristics:**
- Poster-scale Bowlby One against calm Bricolage Grotesque body text.
- No boxes. Structure comes from spacing, a single hairline, or a change of colour field.
- Pills for actions, generous rounding for photographs.
- Transform and opacity only for motion; a static page is always the fallback.

## Colors

Cream, black and one signal orange. Orange is big or absent: display words, flat buttons, the call block, the equaliser accents.

### Primary
- **Signal Orange** (#F53C17): primary buttons, the word RELEASE, stat numbers, waveform clips, the full discovery block, bullet dots. Text on orange fills is always near-black.

### Neutral
- **Session Cream** (#FEF6EB): page ground; text on black.
- **Sheet Cream** (#F9F0E3): the About section ground.
- **Tape Sand** (#DBCEBC): photo placeholders, soft text on black.
- **Control-Room Black** (#171717): text on cream; the black rooms; ink buttons.
- **Console Grey** (#212121): photo placeholders on black.
- **Studio Brown** (#655B4F): secondary text on cream (6.3:1).
- **Dust Grey** (#A29D96): secondary text on black (6.6:1).
- **Error Salmon** (#FF9B88): form errors on black only.

### Named Rules
**The Big-Or-Absent Rule.** Orange is either a large field or large type, or it is not on the screen. Small orange text appears only on black.
**The Ink-On-Orange Rule.** Anything set on an orange fill is near-black.

## Typography

**Display Font:** Bowlby One (Bowlby Fallback, Impact)
**Body Font:** Bricolage Grotesque (system-ui fallback)

**Character:** A heavy, friendly gig-poster face over a warm, slightly quirky grotesque. Loud headlines, quiet reading.

### Hierarchy
- **Hero** (400, clamp(3rem, min(14.5vw, 17svh), 13rem), 0.98): the three stacked lines; uppercase.
- **Display** (400, clamp(2.2rem, 6.4vw, 5.4rem), 0.98, -0.025em): section headings in sentence case.
- **Title** (400, clamp(1.4rem, 2.4vw, 1.9rem), 1.1): plan names, lane names, artist names.
- **Body** (400, 1.0625rem, 1.7): copy at 46-66ch.
- **Label** (700, 0.8125rem, +0.16em, uppercase): small section kickers and form labels.

### Named Rules
**The One-Face-Per-Job Rule.** Bowlby sets headings, prices and names only. Never body copy.

## Layout

A 1280px wrapper with a fluid gutter (20-56px). Sections breathe: 72-128px vertical padding. Two-column layouts are asymmetric (5:6 or 4:7) and collapse to one column under 900-1000px. Hairlines (1px, 16% ink) divide plans and price rows; there are no card boxes.

Under 1000px the pinned services timeline becomes stacked lanes and the artist shelf a native scroll-snap row. The primary action sits in the first viewport at every width.

## Elevation & Depth

Flat. Colour fields and rounded photographs create the layers. One soft lift shadow (`0 22px 40px -22px rgba(101,91,79,.45)`) sits under the portrait photo; the Spotify player floats with a large diffuse shadow. No hard offsets and no glow.

## Shapes

Pills for every button and the package chip. Photographs and the artist thumbnails are rounded (24px and 20px). Form fields are open, underlined lines, not boxes. Bullets are small orange dots.

## Components

### Buttons
- **Shape:** pill, 52px minimum height, no border, no shadow.
- **Primary:** orange fill, near-black bold label.
- **Ink:** near-black fill, cream label; used on orange.
- **Hover / Focus / Active:** a fill slides up from below (transform), the label flips, the button lifts 2px; focus-visible is a 3px orange outline (ink on orange); active scales to 0.97.

### Plan (pricing)
An open column: small tag line, title, one paragraph, a huge price, meta line, dotted feature list under a hairline, extras, pill button. Two columns split by one vertical hairline.

### Price rows
Name and descriptor left, price in Bowlby right, hairline between rows, a small uppercase group label above a 2px rule.

### Lane (services)
Number and name left, a thin orange waveform and description right. In the pinned build a cover slides off the waveform as the playhead passes and the name turns orange.

### Equaliser
Sixty-four thin bars in a band; their height follows scroll position.

### Artist
Bare rounded photo, name in Bowlby below; the photo scales slightly on hover or focus.

### Inputs / Fields
Transparent field with a 2px cream underline at 35%; hover brightens, focus turns the underline orange; errors turn the underline salmon with a message below. Labels are small uppercase grey.

### Navigation
Cream bar, wordmark left, text links with an orange underline that grows on hover, a pill "Book a session". Mobile: wordmark and a menu button opening a full-width list in Bowlby.

## Do's and Don'ts

### Do:
- **Do** give each section one big type moment and leave the rest empty.
- **Do** set text on orange in #171717.
- **Do** animate only transform and opacity, and give every moving thing a static fallback.
- **Do** keep every control at 44px or larger with hover, focus-visible and active states.

### Don't:
- **Don't** put content in boxes or cards; use space, a hairline or a colour change.
- **Don't** add decorative motion that carries no information (no tickers, no spinning props).
- **Don't** autoplay audio; Spotify loads only on a click.
- **Don't** introduce another typeface or colour outside the palette.
