---
name: LevProductions
description: A recording-session track sheet in cream, studio black and grease-pencil orange; scroll is the tape transport.
colors:
  session-cream: "#FEF6EB"
  sheet-cream: "#F9F0E3"
  tape-sand: "#DBCEBC"
  grease-pencil-orange: "#F53C17"
  control-room-black: "#171717"
  console-grey: "#212121"
  rack-black: "#1B1B1B"
  studio-brown: "#655B4F"
  dust-grey: "#A29D96"
typography:
  display:
    fontFamily: "Bebas Neue, Impact, Arial Narrow, sans-serif"
    fontSize: "clamp(3.4rem, 10.5vw, 8.5rem)"
    fontWeight: 400
    lineHeight: 0.9
    letterSpacing: "-0.03em"
  hero:
    fontFamily: "Bebas Neue, Impact, Arial Narrow, sans-serif"
    fontSize: "clamp(4.2rem, min(26vw, 24svh), 19rem)"
    fontWeight: 400
    lineHeight: 0.9
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Bebas Neue, Impact, Arial Narrow, sans-serif"
    fontSize: "clamp(1.9rem, 3.4vw, 2.8rem)"
    fontWeight: 400
    lineHeight: 0.9
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 700
    letterSpacing: "0.14em"
rounded:
  none: "0px"
  clip: "3px"
spacing:
  xs: "8px"
  sm: "16px"
  md: "24px"
  lg: "40px"
  xl: "64px"
  xxl: "112px"
components:
  button-primary:
    backgroundColor: "{colors.grease-pencil-orange}"
    textColor: "{colors.control-room-black}"
    rounded: "{rounded.none}"
    padding: "11px 24px"
    height: "48px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.control-room-black}"
    rounded: "{rounded.none}"
    padding: "11px 24px"
  tape-card:
    backgroundColor: "{colors.tape-sand}"
    textColor: "{colors.control-room-black}"
    rounded: "{rounded.none}"
    padding: "10px 10px 14px"
  plan-card:
    backgroundColor: "{colors.session-cream}"
    textColor: "{colors.control-room-black}"
    rounded: "{rounded.none}"
    padding: "24px"
  field:
    backgroundColor: "{colors.sheet-cream}"
    textColor: "{colors.control-room-black}"
    rounded: "{rounded.none}"
    height: "48px"
---

# Design System: LevProductions

## Overview

**Creative North Star: "The Session Sheet"**

The site is one recording session laid out on a studio track sheet. Every section is a numbered track on the sheet, and scrolling works like the tape transport: reels turn, the timecode runs, a playhead sweeps the lanes. It is warm and hand-marked, not corporate: grease-pencil orange circles the prices, photos are taped to the sheet, artists are tape boxes on a shelf.

Two rooms alternate. Cream sheet stock holds the paperwork (intro, pricing, about). The control room, near-black, holds the work itself (services timeline, artists, FAQs, contact). The hero photograph of the real studio carries the first viewport.

**Key Characteristics:**
- Bebas Neue lettering at poster scale against calm Inter body copy.
- Hard offset shadows and 2px ink borders on interactive things; soft tinted shadows on paper things.
- Numbering everywhere: 02 / 08 section strips, [01]-[04] lanes, Take 01-10, tape-box [01]-[08].
- Motion is the transport. Everything animates with transform and opacity only, and a static sheet is always the fallback.

## Colors

A two-room palette: warm paper, studio black, and one signal colour used for marks, never for fills of whole sections except the discovery band.

### Primary
- **Grease-Pencil Orange** (#F53C17): Primary action, REC dot, waveform clips, price circles, section dots, the word RELEASE. Text on it is always near-black (4.7:1); orange as small text only appears on dark rooms.

### Neutral
- **Session Cream** (#FEF6EB): page ground and card faces; headline text on dark.
- **Sheet Cream** (#F9F0E3): alternate paper for pricing and about; input fields.
- **Tape Sand** (#DBCEBC): tape-box and photo borders, secondary text on dark.
- **Control-Room Black** (#171717): text on paper; ground of the dark rooms; borders and hard shadows.
- **Console Grey** (#212121): lane cover and panel fills inside dark rooms.
- **Rack Black** (#1B1B1B): footer ground.
- **Studio Brown** (#655B4F): secondary text on paper (6.3:1 on cream).
- **Dust Grey** (#A29D96): muted text on dark (6.6:1 on black).

### Named Rules
**The Marks-Not-Fields Rule.** Orange is a mark on paper and a signal in the dark. It fills a whole region only once (the discovery band).
**The Ink-On-Orange Rule.** Anything set on orange is near-black, never cream or white.

## Typography

**Display Font:** Bebas Neue (Impact, Arial Narrow fallback)
**Body Font:** Inter (system-ui fallback)

**Character:** Condensed poster caps against a quiet humanist sans, like a gig poster pinned above a clipboard.

### Hierarchy
- **Hero** (400, clamp(4.2rem, min(26vw, 24svh), 19rem), 0.9): the three stacked lines of the first viewport.
- **Display** (400, clamp(3.4rem, 10.5vw, 8.5rem), 0.9, -0.03em): section headings.
- **Title** (400, clamp(1.9rem, 3.4vw, 2.8rem), 0.9): lane names, package names, tape-box names.
- **Body** (400, 1.0625rem, 1.7): copy, max about 58-68ch.
- **Label** (700, 0.8125rem, +0.14em, uppercase): section strips, eyebrows, tags, form labels.

### Named Rules
**The Tight-Caps Rule.** Display type is always uppercase with -0.03em tracking and line-height 0.9; never mix-case Bebas.

## Layout

A 12-column sheet. Light sections carry faint vertical column rules (a repeating gradient at 7% ink) so the grid is visible. Content sits in a 1360px wrapper with a fluid gutter of 4vw (16-48px). Spacing steps: 8 / 16 / 24 / 40 / 64 / 112px. Every section opens with a "strip": a 2px ink rule, its number, name and a dashed leader.

Responsive: mobile-first. Under 1000px the pinned timeline and shelf become stacked lanes and a native scroll-snap shelf; header navigation collapses to a full-width menu. The first viewport always shows the primary button, at 375px included.

## Elevation & Depth

Hybrid. Interactive elements are flat with a hard offset shadow (4px 4px 0 ink) that grows on hover and collapses on press. Paper objects (cards, taped photos) lift with layered, warm-tinted soft shadows. Dark rooms get depth from tonal layers (black, console grey, cream cards), not glow.

### Shadow Vocabulary
- **Key press** (`box-shadow: 4px 4px 0 #171717`): buttons at rest; 7px on hover; 1px pressed.
- **Paper lift** (`0 2px 0 rgba(23,23,23,.05), 0 18px 34px -14px rgba(101,91,79,.45), 0 6px 12px -6px rgba(245,60,23,.14)`): pricing cards, taped photos.
- **Slip drop** (`8px 8px 0 #F53C17`): the contact slip.

### Named Rules
**The Press Rule.** Buttons move toward their shadow when pressed; nothing glows.

## Shapes

Square. Zero radius on controls, cards and fields; 3px on waveform clips only. Borders are 2px ink (1.5px on tags). Photos carry a tape strip in orange and a slight rotation (-4 to +4 degrees). Hand-drawn orange ellipses mark the call to action and prices.

## Components

### Buttons
- **Shape:** square, 2px ink border, 48px minimum height.
- **Primary:** orange fill, near-black Bebas label (1.45rem), 4px hard shadow.
- **Ghost:** transparent, currentColor border and shadow.
- **Cream:** cream fill on dark rooms.
- **Hover / Focus / Active:** translate (-2px,-2px) with 7px shadow; focus-visible is a 3px orange outline (ink on orange surfaces); active presses to 1px.

### Tape box (artists)
Sand card, 2px cream border, orange colour-blend over the photo that lifts on hover or focus to reveal true colour; name in Bebas, catalogue number in a label.

### Plan card
Cream face, 2px ink border, paper-lift shadow, tags, orange sub-line, a price circled in orange, session boxes that fill in, dashed rule, square-bullet feature list.

### Faders (mix and master)
Four console strips with a black rail and an orange knob positioned by price; amount in Bebas below.

### Lane (services)
Label column (number, name, VU bars) and a body (orange waveform clip, description). In the pinned build a cover slides off the clip as the playhead passes; the name turns orange when its lane is live.

### Inputs / Fields
Sheet-cream fill, 2px ink border, 48px minimum height, visible uppercase label above, errors in dark red (#B3220A) with an inset left bar.

### Navigation
Sticky cream bar with a 2px ink bottom rule and a scroll-progress bar in orange. Links are 13px bold caps with tracking; mobile uses a full-width Bebas menu.

### Signature: the transport
Reels (hero), REC dot, running timecode and progress bar, services playhead. All are driven by scroll position and disabled (static) under reduced motion.

## Do's and Don'ts

### Do:
- **Do** set text on orange in #171717.
- **Do** keep orange text only on dark grounds or at display size.
- **Do** number things (sections, lanes, takes, tape boxes).
- **Do** animate only transform and opacity, and give every moving thing a still fallback.
- **Do** give every control a hover, focus-visible and active state and a 44px target.

### Don't:
- **Don't** use rounded corners, glassmorphism or glow.
- **Don't** introduce a third typeface or a colour outside the nine tokens.
- **Don't** autoplay audio; Spotify loads only on a click.
- **Don't** hijack scroll: pins are bounded and native scrolling stays in charge.
