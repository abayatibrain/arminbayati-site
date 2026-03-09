# LinkedIn Schematics - Interactive HTML/SVG Figures

This directory contains 4 interactive HTML/SVG schematic figures designed for scientific communication and LinkedIn articles. Each figure combines interactive tooltips, gradient fills, and scientific accuracy.

## Files Created

### 1. fig-endolysosomal-trafficking.html
**Title:** Endolysosomal Trafficking Pathway

Comprehensive overview of the endocytic pathway:
- **Early Endosome** (EEA1+, Rab5+, pH 6.0)
- **Sorting Endosome** (transitional zone)
- **Late Endosome/MVB** (Rab7+, CD63+, ESCRT, pH 5.5)
- **Lysosome** (LAMP1/2+, pH 4.5, degradation)
- **Recycling Endosome** (Rab11+, retrograde pathway to plasma membrane)
- **Exosome Release** (CD63+, CD81+ extracellular vesicles)
- **pH Gradient** scale (6.0 → 4.5)
- Interactive tooltips with marker annotations and Rab GTPase details

### 2. fig-autophagy-lysosome-axis.html
**Title:** Autophagy-Lysosome Degradation Axis

Detailed autophagy pathway with selective autophagy and master regulation:
- **Canonical Pathway:** Phagophore → Elongation (ATG5-12, LC3-II) → Autophagosome → Autolysosome
- **Selective Autophagy:**
  - Mitophagy (PINK1/Parkin) for damaged mitochondria
  - Aggrephagy (p62/SQSTM1) for protein aggregates
- **TFEB Master Regulator** panel showing mTORC1-mediated control
- **Four Failure Points in Parkinson's Disease:**
  - ULK1 initiation inhibition
  - LC3 lipidation impairment
  - Lysosomal dysfunction and capacity collapse
  - Parkin loss-of-function/aggregation
- Consequences and rescue targets

### 3. fig-proteostasis-network.html
**Title:** Cellular Proteostasis Network

Integrated protein quality control system:
- **De Novo Folding:** Ribosome → Hsp70/Hsp90 → Native Protein
- **Misfolded Protein Pathways:**
  - **UPS (Ubiquitin-Proteasome System):** E1/E2/E3 ligases, 26S proteasome
  - **Aggresome Formation:** HDAC6-mediated sequestration at MTOC
  - **Autophagy:** p62-mediated, selective autophagy of aggregates
- **ER Stress Response (UPR):**
  - PERK (phosphorylates eIF2α, ATF4 activation)
  - IRE1α (XBP1 splicing, ERAD)
  - ATF6 (chaperone upregulation)
- **Color Coding:** Green (healthy) → Yellow (stressed) → Red (failed)
- Recovery vs. apoptosis outcomes

### 4. fig-membrane-dynamics.html
**Title:** Membrane Trafficking & Organelle Contact Sites

Two-part schematic of membrane trafficking and inter-organellar communication:

**Part 1 - Endocytic Pathway:**
- **Clathrin-coated pit** formation on plasma membrane
- Dynamin-mediated scission to coated vesicles (CCV)
- Uncoating (Hsc70, auxilin)
- SNARE machinery annotation (v-SNAREs, t-SNAREs)
- Rab GTPases (Rab5, Rab7, Rab4/11) trafficking coordination
- Early Endosome (Rab5+, EEA1+)

**Part 2 - Membrane Contact Sites (MAMs):**
- **ER-Mitochondria Contact** (MAM): VAPB-PTPIP51, Junctophilin-4, SigmaR1
  - Ca2+ transfer, lipid synthesis
- **ER-Lysosome Contact:** VAPs, ORP1L/ORP5 (sterol transfer)
  - Cholesterol homeostasis, mTORC1 signaling
- **Mitochondria-Lysosome Contact:** PACS2, ORP5
  - Mitophagy docking, selective autophagy

All with interactive information panels on tethering proteins and contact site functions.

## Design System

All files follow the established design system:

### CSS Variables
```
--ink: #0f1419 (text, dark mode: #e8e6e1)
--paper: #fafaf7 (background, dark mode: #111318)
--mid: #6b7280 (secondary text, dark mode: #9ca3af)
--accent: #c0392b (highlights)
--rule: #d4d0c8 (borders, dark mode: #2a2d35)
--card: #ffffff (white backgrounds, dark mode: #1a1d24)
--section-bg: #f4f3ef (panels, dark mode: #15171d)
```

### Typography
- **Serif:** DM Serif Display (titles)
- **Sans:** IBM Plex Sans (body text)
- **Mono:** IBM Plex Mono (labels, technical info)

### Features
- **Dark mode support** via CSS media queries and JavaScript
- **Interactive tooltips** on hover (SVG elements)
- **Gradient fills** for visual hierarchy and depth
- **Rounded rectangles & bezier curves** for modern aesthetic
- **SVG viewBox:** ~1060x600-720 px (responsive)
- **Hover effects:** Brightness filter on interactive elements
- **Legend grids** with color coding and descriptions

## Usage

Each HTML file is standalone with:
- Inline CSS (no external stylesheets)
- Inline JavaScript for tooltips and dark mode
- Embedded SVG (no external images)
- Google Fonts API for typography

Simply open in a browser. All files support dark mode (system preference detection).

## Technical Details

- **SVG viewBox:** Responsive scaling for all viewport sizes
- **Tooltip System:** Position-absolute, opacity-based, max-width 220-240px
- **Marker Annotations:** Small text labels, hierarchy via font-weight/size
- **Color Gradients:** Linear gradients for visual depth
- **Accessibility:** Semantic HTML, hover states, tooltip text contrast

## File Sizes

- fig-endolysosomal-trafficking.html: 17 KB
- fig-autophagy-lysosome-axis.html: 22 KB
- fig-proteostasis-network.html: 25 KB
- fig-membrane-dynamics.html: 24 KB

Total: ~88 KB (highly optimized, no external dependencies)

---

Created: March 8, 2026
For: LinkedIn Scientific Communication & Research Documentation
