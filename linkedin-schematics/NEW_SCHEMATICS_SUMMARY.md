# New LinkedIn Schematics - Summary

## Files Created (4 Total)

All files are fully self-contained, publication-quality HTML with embedded SVG, CSS, and JavaScript. Each is optimized for LinkedIn sharing and includes professional styling, dark mode support, and interactive hover effects.

### 1. **fig-microscopy-resolution-ladder.html**
**Title:** Microscopy Resolution Ladder

**Description:**
Comprehensive visualization showing the spectrum of biological imaging techniques from cell morphology to atomic protein structure.

**Content:**
- 7 imaging modalities in vertical ladder layout
- Phase Contrast/Brightfield (~1 μm)
- Widefield Fluorescence (~300 nm)
- Confocal Point-Scanning (~200 nm)
- Spinning Disk Confocal (~200 nm)
- Structured Illumination SIM (~100 nm)
- STED Nanoscopy (~50 nm)
- Cryo-EM (~3 Å)

**Features:**
- Resolution scale axis (left side)
- Biological structures visible at each resolution level
- Color-coded by microscopy category
- Interactive hover effects on each modality
- Legend showing imaging categories

**File Size:** 216 lines, ~9.6 KB

---

### 2. **fig-drug-screening-cascade.html**
**Title:** Phenotypic Drug Screening Cascade

**Description:**
Systematic visualization of compound narrowing from initial library through lead optimization in neurodegenerative disease drug discovery.

**Content:**
- 7-stage funnel workflow
- Stage 1: Chemical Library (10,000+ compounds)
- Stage 2: Primary Screen (2,500-5,000 initial hits)
- Stage 3: Hit Confirmation (100-200 confirmed)
- Stage 4: Dose-Response (50-80 active)
- Stage 5: Counter-Screens (20-30 validated)
- Stage 6: Mechanism of Action (5-8 leads)
- Stage 7: Lead Optimization (2-3 final leads)

**Features:**
- Decision gates with go/no-go criteria between stages
- Z'-factor and quality metrics
- Timeline annotations (1-2 months primary, 6-8 months HTS-to-MOA)
- Color gradient indicating stage progression
- Assay type and key metrics for each stage

**File Size:** 251 lines, ~12 KB

---

### 3. **fig-exosome-propagation.html**
**Title:** Exosome-Mediated Cell-to-Cell Propagation

**Description:**
Cell biology schematic showing pathological protein transfer via extracellular vesicles in neurodegenerative disease (prion-like propagation mechanism).

**Content:**
- **Donor Cell (left):** protein aggregates → endosome → MVB formation → exosome release
- **Extracellular Space (center):** exosomes in transit carrying pathological cargo (α-synuclein, tau)
- **Recipient Cell (right):** exosome uptake → endosomal trafficking → lysosomal delivery → seeding/misfolding
- Alternative pathway: tunneling nanotubes (TNTs) for direct transfer

**Key Molecules:**
- CD63, CD81 (exosomal surface markers)
- TSG101, Alix (ESCRT machinery)
- nSMase2, Rab27a (exosome biogenesis)
- GW4869 (nSMase2 inhibition point)

**Features:**
- Animated protein fibrils (pulsing effect)
- Color-coded cellular compartments
- Detailed molecular machinery labels
- Inhibition zone for pharmacological intervention
- Legend of key molecular players

**File Size:** 310 lines, ~14 KB

---

### 4. **fig-multiomics-integration.html**
**Title:** Multi-Omics Data Integration Strategy

**Description:**
Complex systems biology workflow showing convergence of proteomics, transcriptomics, and functional assays into integrated analysis for disease mechanism discovery.

**Content:**

**LEFT PANEL - Data Generation (3 parallel tracks):**
- **Proteomics (blue):** Sample → Lysis → Digestion → TMT Labeling → LC-MS/MS → MaxQuant → Protein Abundance
- **Transcriptomics (green):** Sample → RNA extraction → Library prep → Sequencing → FASTQ → STAR/CellRanger → Gene Expression
- **Functional Assays (orange):** Sample → HCI imaging → Flow cytometry → Electrophysiology → Phenotypic Readouts

**CENTER PANEL - Integration Layer (purple):**
- Pathway Enrichment Analysis (GSEA, IPA, Reactome)
- Network & Correlation Analysis (PPI, eQTL, consensus modules)
- Dimensionality Reduction (PCA, t-SNE, UMAP)
- Multi-Modal Correlation & Predictive Modeling

**RIGHT PANEL - Outputs:**
- Biomarker Candidates
- Therapeutic Targets
- Disease Mechanisms
- Publication Figures

**Features:**
- QC checkpoints at each data generation step
- Detailed workflow steps with tool/method names
- Data flow arrows showing progression
- Quality metrics per omics type
- Color-coded by omics platform
- Integration layer highlighted separately

**File Size:** 425 lines, ~24 KB

---

## Design Standards Applied

### All Files Include:

✓ **CSS Variables** (exact implementation):
- Color palette: `--ink`, `--paper`, `--mid`, `--accent`, `--rule`, `--card`, `--section-bg`
- Fonts: `--serif` (DM Serif Display), `--sans` (IBM Plex Sans), `--mono` (IBM Plex Mono)

✓ **Dark Mode Support**:
- `prefers-color-scheme` media query detection
- Automatic switching with user system preferences
- Manual toggle persistence via JavaScript

✓ **Attribution Box**:
- Position: bottom-right corner (fixed)
- Text: "Armin Bayati · arminbayati.com"
- Styling: subtle, non-obtrusive (10px font, 85% opacity)
- Font: monospace for technical aesthetic

✓ **Interactive Features**:
- Hover effects with CSS transitions (200ms)
- Element opacity changes on hover
- Smooth state transitions

✓ **Professional Styling**:
- Publication-quality typography (serif titles, sans-serif body)
- Generous padding and breathing room
- SVG viewBox sized to prevent content cutoff
- Card-based layout with subtle shadows
- Grid-aligned visual hierarchy

✓ **LinkedIn Optimization**:
- Responsive viewport settings
- Self-contained (no external dependencies except Google Fonts)
- Clean, modern aesthetics
- Scientific credibility through careful design choices

---

## File Locations

All files are located at:
```
/sessions/vibrant-dreamy-lovelace/mnt/Cowork/arminbayati-site/linkedin-schematics/
```

- `fig-microscopy-resolution-ladder.html`
- `fig-drug-screening-cascade.html`
- `fig-exosome-propagation.html`
- `fig-multiomics-integration.html`

---

## Usage Notes for LinkedIn

1. **Open any file in a web browser** to view the schematic
2. **Dark mode** automatically adapts to your system theme
3. **SVGs are fully scalable** and render crisply at any resolution
4. **Hover over elements** for interactive effects (visual feedback)
5. **No external dependencies** - files work offline
6. **Screenshot-friendly** - right-click → Save image for LinkedIn posts

---

## Technical Details

- **Language:** HTML5 with embedded SVG and CSS3
- **No JavaScript libraries** - vanilla JS only
- **Responsive design** - works on desktop, tablet, mobile
- **Accessibility:** semantic HTML, proper contrast ratios
- **Performance:** optimized SVG paths, minimal CSS complexity

Each schematic is ready for immediate use in your scientific portfolio and LinkedIn sharing.
