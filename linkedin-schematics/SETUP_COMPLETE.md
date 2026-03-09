# LinkedIn Schematics Portfolio - Setup Complete

## 4 High-Quality Interactive HTML/SVG Schematics Created

All files have been successfully created and verified. Each schematic is production-ready for LinkedIn sharing.

### File Locations
All files are saved to: `/sessions/vibrant-dreamy-lovelace/mnt/Desktop--Cowork/arminbayati-site/linkedin-schematics/`

---

## 1. fig-lysosomal-biology.html
**Lysosomal Biology & Dysfunction**
- **Size**: 21 KB
- **Features**:
  - Split-view toggle between healthy and dysfunctional states
  - Healthy state: intact membrane, V-ATPase pumps, pH 4.5, active cathepsins, LAMP1/2 markers, mTORC1 active, TFEB inactive
  - Disease state: membrane permeabilization, pH elevation, cathepsin leakage, galectin-3 recruitment, TFEB nuclear translocation
  - Interactive tooltips on all key components
  - Key readouts: LysoTracker, DQ-BSA, Magic Red, pH levels
  - Color coding: Healthy = warm vibrant colors, Disease = muted/darkened

---

## 2. fig-cell-signaling-crosstalk.html
**Inflammatory Signaling Crosstalk**
- **Size**: 17 KB
- **Features**:
  - 4 interconnected signaling pathways:
    1. JAK/STAT (Blue) - IFN-γ → JAK1/2 → STAT1 → ISG transcription
    2. NF-κB (Orange) - TNFR/TLR → IKK → IκBα degradation → p65/p50 translocation
    3. MAPK (Green) - Stress → ERK/JNK/p38 → AP-1
    4. cGAS-STING (Purple) - Cytosolic DNA → cGAS → 2'3'-cGAMP → STING → IRF3
  - Convergence point showing shared inflammatory gene targets
  - Pharmacological inhibitors panel with 8 key compounds
  - Distinct pathway colors with crosstalk bridges
  - Professional nature publication-style diagram

---

## 3. fig-ipsc-to-organoid.html
**iPSC Disease Modeling Pipeline**
- **Size**: 21 KB
- **Features**:
  - Complete left-to-right pipeline flow:
    1. Patient Sample (blood/biopsy)
    2. Reprogramming (Sendai, episomal, mRNA)
    3. iPSC Colony with QC markers (OCT4, NANOG, SOX2, karyotype)
    4. CRISPR Editing for isogenic controls
    5. Differentiation branching to 4+ cell types:
       - DA neurons
       - Cortical neurons
       - Cardiomyocytes
       - Astrocytes
    6. Disease Modeling & Drug Treatment
    7. Outcomes (screening hits, mechanistic insights, biomarkers)
  - QC checkpoints at each stage
  - Timeline annotations
  - Distinct colors per differentiation pathway
  - Key markers for each stage

---

## 4. fig-flow-cytometry-panels.html
**Multiparameter Flow Cytometry**
- **Size**: 21 KB
- **Features**:
  - Complete workflow visualization:
    1. Antigen Selection (surface & intracellular markers)
    2. Fluorochrome Assignment with spectral overlap matrix
    3. Panel Optimization & compensation
    4. Hierarchical gating strategy tree
  - Spectral overlap visualization for common fluorochromes:
    - FITC, PE, APC, BV421, BV605, BV711, etc.
  - Sample scatter plot schematic (FSC vs SSC)
  - Hierarchical gating tree (FSC/SSC → Live/Dead → CD3+ → CD4/CD8 → functional markers)
  - Controls sidebar (FMO, single stain, unstained, isotype)
  - Real emission colors for each fluorochrome
  - Application examples clearly labeled

---

## Technical Specifications - All Files

### Design Requirements Met
- ✓ Professional scientific figure style (Nature Reviews Cell Biology aesthetic)
- ✓ Clean, modern, publication-quality design
- ✓ Subtle thin black attribution box (bottom-right): "Armin Bayati · arminbayati.com"
- ✓ No content cut-off (generous padding, proper viewBox sizing)
- ✓ Interactive SVG diagrams with hover tooltips
- ✓ Smooth CSS transitions for hover effects

### CSS Variables (Exact Match)
```css
:root {
  --ink: #0f1419;
  --paper: #fafaf7;
  --mid: #6b7280;
  --accent: #c0392b;
  --rule: #d4d0c8;
  --card: #ffffff;
  --section-bg: #f4f3ef;
  --serif: 'DM Serif Display', Georgia, serif;
  --sans: 'IBM Plex Sans', -apple-system, sans-serif;
  --mono: 'IBM Plex Mono', 'Menlo', monospace;
}

html.dark {
  --ink: #e8e6e1;
  --paper: #111318;
  --mid: #9ca3af;
  --rule: #2a2d35;
  --card: #1a1d24;
  --section-bg: #15171d;
}
```

### Features Across All Files
- ✓ Font import from Google Fonts
- ✓ Responsive layout (mobile-friendly)
- ✓ Dark mode support via `prefers-color-scheme` media query
- ✓ Interactive elements with cursor feedback
- ✓ Descriptive tooltips on hover
- ✓ Legend section with color coding
- ✓ Professional typography hierarchy
- ✓ Attribution box CSS (fixed position, subtle styling)
- ✓ High-resolution SVG graphics (scalable, crisp on all devices)

---

## Attribution Box Styling
All files include the required attribution box:
```css
.attribution {
  position: fixed;
  bottom: 12px;
  right: 12px;
  background: rgba(15, 20, 25, 0.85);
  color: #fff;
  font-family: var(--mono);
  font-size: 10px;
  padding: 4px 10px;
  border-radius: 4px;
  letter-spacing: 0.3px;
  z-index: 999;
}
```

HTML: `<div class="attribution">Armin Bayati · arminbayati.com</div>`

---

## Quality Assurance

All files have been verified for:
- File existence and proper sizing
- Attribution presence
- CSS variable definitions
- SVG content quality
- Legend implementation
- Dark mode support
- Viewport meta tags
- Google Fonts integration
- Interactive tooltips
- Professional styling

---

## Usage
Simply open any HTML file in a modern web browser. The schematics are fully self-contained and require no external dependencies beyond Google Fonts (which loads automatically).

Optimized for sharing on LinkedIn with:
- Clear, professional design
- Mobile-responsive layout
- Fast loading times
- High visual impact

---

**Created**: March 8, 2026
**For**: LinkedIn Research Portfolio
**Portfolio Website**: arminbayati.com
