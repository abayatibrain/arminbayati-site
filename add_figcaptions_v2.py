#!/usr/bin/env python3
"""
Script to add figcaptions to images across HTML pages.
Correctly handles two types: standalone full-width images and gallery thumbnails.
"""

import re
from pathlib import Path
from html.parser import HTMLParser

# Image captions based on filename and alt text
CAPTIONS = {
    # ipscs.html - Standalone images
    "ipsc-differentiation-protocol.png": "Schematic of iPSC differentiation pathways to dopaminergic, cortical, and other neuronal lineages, showing protocol timeline and key developmental stages.",

    "ipscs-da-neuron-characterization.jpg": "Immunocytochemistry panel confirming dopaminergic identity via DAT, GIRK2, Neurofilament 160kD, and TH with DAPI, MAP2, and composite overlays. From Bayati et al., Nature Neuroscience 2024.",

    "ipscs-mea-raster.png": "Microelectrode array (MEA) raster plot showing spontaneous spike waveforms across dopaminergic and cortical neurons at DIV 42.",

    "ipscs-calcium-imaging.png": "Calcium imaging fluorescence traces (Fluo-4) revealing spontaneous and KCl-evoked transients in iPSC-derived dopaminergic neurons.",

    "disease-modeling-parkinson.jpg": "Schematic of the dual-hit Parkinson's disease model: microglia activation, cytokine release, α-synuclein PFF uptake via macropinocytosis, lysosomal dysfunction, and formation of membrane-bound Lewy body–like inclusions.",

    # ipscs.html - Gallery images
    "ipscs-dualhit-confocal.png": "Confocal microscopy comparison of PFF-only (small puncta) vs dual-hit PFF + IFN-γ treatment (large perinuclear inclusions) in dopaminergic neurons.",

    "ipscs-dualhit-em.png": "Electron microscopy of Lewy body–like inclusions at low (5 µm) and high (500 nm) magnification, showing fibrillar architecture, lysosomes, and mitochondria.",

    "ipscs-dualhit-em-mature.png": "High-magnification electron microscopy of a compact, mature Lewy body–like inclusion closely resembling patient-tissue Lewy bodies with organized fibrillar structure.",

    "ipscs-cortical-neurons.jpg": "Confocal image of control cortical neurons showing MAP2 dendritic network and DAPI nuclear stain, demonstrating lack of inclusion formation.",

    "ipscs-da-neuron-psyn.jpg": "Confocal image of a dopaminergic neuron showing TH (red), nanogold-labeled PFF (green), and phospho-α-synuclein–enriched perinuclear inclusion after 14-day IFN-γ treatment.",

    "ipscs-synha-psyn-neurons.jpg": "Confocal colocalization of Syn-HA (green) and phospho-α-synuclein (red) in iPSC-derived neurons ± IFN-γ, revealing inclusion enrichment with pathogenic phospho-synuclein.",

    "genetics-ipsc-synucleinopathy.jpg": "iPSC-derived dopaminergic neurons comparing SNCA knockout, wild-type, and SNCA triplication for TH and phospho-α-synuclein; only triplication shows robust pathological accumulation.",

    "ipscs-coculture-microglia.png": "Neuron–microglia co-culture showing accelerated α-synuclein inclusion formation and synaptic loss due to activated microglia-derived proinflammatory cytokines.",

    "ipscs-coculture-astrocyte.png": "Neuron–astrocyte co-culture demonstrating reduced α-synuclein accumulation and enhanced synaptic preservation, indicating astrocyte-mediated neuroprotection.",

    "ipscs-coculture-comparison.png": "Direct side-by-side comparison of neuronal viability, synapse density, and α-synuclein accumulation across neuron-alone, neuron–microglia, and neuron–astrocyte conditions.",

    # cellular-assays.html - Standalone images
    "assays-autophagy-IFN-treatment.jpg": "Confocal time-course (Day 2–21) of LC3B puncta (autophagy marker) showing progressive impairment under PFF + IFN-γ dual-hit vs PFF-only control.",

    "endocytosis-modeling-disease-propogation.jpg": "Schematic illustrating macropinocytosis of α-synuclein PFFs, multivesicular body (MVB) formation, and exosomal release as a mechanism for disease propagation between neurons.",

    # cellular-assays.html - Gallery images
    "assays-mitophagy-lysosensor.png": "LysoSensor fluorescence measurement of lysosomal pH across untreated, PFF, and dual-hit conditions, revealing lysosomal acidification defects.",

    "assays-mitophagy-lysotracker.png": "LysoTracker Red puncta quantification showing significant reduction under dual-hit PFF + IFN-γ conditions, indicating impaired lysosomal-autophagy flux.",

    "assays-endo-combined.png": "Electron microscopy panels showing nanogold-labeled α-synuclein fibrils at plasma membrane, macropinocytosis initiation, macropinosome formation, and nascent multivesicular body.",

    "assays-endo-confocal-uptake.png": "Confocal time-lapse showing rapid α-synuclein fibril uptake and lysosomal colocalization within 30 minutes of macropinocytosis.",

    "assays-endo-sars.png": "Confocal microscopy of SARS-CoV-2 spike protein internalization via clathrin-mediated endocytosis in epithelial cells, with colocalization markers.",

    "assays-ace2-receptor.jpg": "Confocal image showing ACE2 receptor (green) and SARS-CoV-2 spike protein (red) colocalization on the surface of epithelial cells.",

    "assays-calu3-epithelial.jpg": "Calu-3 lung epithelial cells stained for CK2 marker and SARS spike protein puncta, demonstrating tropism and infection efficiency.",

    "assays-spike-uptake.jpg": "Confocal image at 15-minute timepoint showing SARS-CoV-2 spike protein puncta with DAPI nuclear counterstain in epithelial cells.",

    "assays-pff-lysosome-wga.jpg": "Confocal colocalization of α-synuclein PFF-488 (green), LysoTracker (red), and wheat germ agglutinin membrane stain (blue) in internalized puncta.",

    "assays-exo-gold-em.png": "Electron microscopy showing nanogold-labeled α-synuclein PFFs associated with exosomes at the recipient cell membrane during exosomal transfer.",

    "assays-exo-confocal-transfer.png": "Confocal microscopy demonstrating CD63 (exosome marker) and α-synuclein fibril signal transfer to naïve recipient cells via exosomal uptake.",

    "assays-exo-cd63-ruffles.png": "Confocal image of CD63-GFP membrane ruffles and macropinocytic activity upon α-synuclein PFF exposure, with and without Manumycin A endocytosis inhibitor.",

    # genetics.html - Standalone images
    "genetics-ipsc-colony-qc.png": "Quality control imaging of iPSC colonies showing pluripotency marker expression, morphology, and karyotype confirmation.",

    "Lentiviral-ipsc-knockdown.jpg": "Confocal immunohistochemistry showing successful LAMP2 shRNA knockdown (reduced LAMP2 signal) in iPSC-derived dopaminergic neurons.",

    "adenovirus-ipsc-endogenous-alphasyn-IFN-treatment.jpg": "Confocal time-course showing adenoviral α-synuclein-HA overexpression in iPSC neurons ± IFN-γ treatment, revealing IFN-induced accumulation.",

    "biochemical-isolation-synuclein-inclusions.jpg": "Western blot of biochemical fractionation (soluble, membrane, and pellet) showing α-synuclein distribution with and without inclusion formation.",

    # genetics.html - Gallery images
    "genetics-lyso-westerns.png": "Western blots quantifying LAMP1, LAMP2, TFEB, and NRF2 protein levels in wild-type vs dual-hit neurons, showing IFN-γ–induced downregulation.",

    "genetics-lyso-galectin.png": "Confocal imaging showing galectin-3 puncta (markers of ruptured lysosomes) on disrupted LAMP1-positive lysosomes in dual-hit dopaminergic neurons.",

    "genetics-lyso-em.png": "Electron microscopy revealing α-synuclein fibrils inside broken/leaky lysosomes with disrupted membranes and electron-dense contents.",

    "genetics-lyso-ip.png": "Validation of lysosomal immunoprecipitation (lyso-IP) capturing α-synuclein and LAMP1 together, confirming lysosomal localization of fibrils.",

    "genetics-lyso-nanogold.png": "Electron microscopy tracking nanogold-labeled α-synuclein PFFs during trafficking through early endosomes, MVBs, and lysosomes.",

    "genetics-gba-ko-lamp1-pff.jpg": "Confocal imaging of GBA knockout neurons showing enlarged LAMP1-positive lysosomes and α-synuclein accumulation even without PFF, establishing lysosomal vulnerability.",

    "genetics-galectin3-npc.jpg": "Confocal image of dopaminergic neural progenitor cells (NPCs) stained for galectin-3 showing puncta consistent with lysosomal rupture markers.",

    "genetics-lyso-dysfunction.jpg": "Confocal multi-channel image combining PFF, LAMP1, and Phalloidin (actin) showing relationship between lysosomal dysfunction, fibrils, and cytoskeletal collapse.",

    "genetics-lyso-em-Ifn-induced-dysfunctional-morphology.jpg": "Electron microscopy revealing IFN-γ–induced lysosomal morphology changes: electron density increase, membrane disruption, and organellar disarray.",

    # drug-discovery.html - Standalone images
    "drugdiscovery-PAH-inclusion-reduction.jpg": "Confocal immunofluorescence showing reduced α-synuclein–positive perinuclear inclusions in neurons treated with PAH (parkin agonist) vs vehicle control.",

    "drugdiscovery-PAH-inclusion-reduction-westernblot.jpg": "Western blot quantification of α-synuclein and phospho-α-synuclein levels in cell lysates ± PAH treatment, demonstrating dose-dependent inclusion reduction.",

    "drugdiscovery-sars-antiviral-entry.jpg": "Schematic of SARS-CoV-2 viral entry mechanisms: ACE2 receptor binding, membrane fusion, and intracellular trafficking pathways targeted by CSNK2 and PIKfyve inhibitors.",

    "drugdiscovery-sars-inhibition-entry.jpg": "Confocal imaging showing inhibition of SARS-CoV-2 spike protein internalization by CSNK2 and PIKfyve inhibitor co-treatment vs control.",

    "drug-pseudovirus-gfp.jpg": "Fluorescence microscopy of pseudovirus-GFP infection assay in epithelial cells, quantifying viral entry efficiency with and without pharmacological inhibitors.",

    "drug-spike-tilescan.jpg": "High-resolution confocal tile-scan showing SARS-CoV-2 spike protein distribution and cellular uptake patterns across a multi-cell epithelial monolayer.",

    # microscopy.html - Gallery images (confocal)
    "micro-confocal-PFF-inclusion.png": "Confocal z-stack maximum projection of α-synuclein PFF-induced perinuclear inclusion with multi-channel markers for synaptic and inclusion content.",

    "micro-confocal-sars.png": "Confocal imaging of SARS-CoV-2 spike protein at multiple infection timepoints, showing cellular trafficking and perinuclear accumulation.",

    "micro-confocal-lyso-stress.png": "Confocal image revealing IFN-γ–induced lysosomal stress: enlarged lysosomes, reduced acidification (LysoSensor), and compromised cargo clearance.",

    "micro-sted-sub-lysosomal.png": "STED super-resolution microscopy resolving sub-lysosomal architecture and fibril organization within 100 nm, revealing internal filamentous structure.",

    "micro-A53T.png": "Confocal image of A53T α-synuclein transgenic iPSC neurons showing enhanced inclusion propensity and pathological aggregation vs wild-type.",

    "micro-confocal-coculture.png": "Confocal multi-cell imaging of neuron–microglia co-culture showing microglia morphology, cytokine signaling, and neighboring neuron pathology.",

    "micro-neuronal-network-overlay.jpg": "Confocal overlay of entire neuronal network showing MAP2 (dendrites), synaptophysin (synapses), and α-synuclein accumulation patterns.",

    "micro-tom20-lamp1-pff.jpg": "Confocal colocalization of Tom20 (mitochondrial outer membrane), LAMP1 (lysosomes), and α-synuclein PFF within damaged organellar compartments.",

    "micro-sted-comparison.jpg": "Side-by-side comparison of confocal and STED super-resolution imaging of α-synuclein fibrils, revealing fibril ultrastructure unresolved by diffraction-limited microscopy.",

    # microscopy.html - Gallery images (EM)
    "micro-em-inclusion.png": "Transmission electron microscopy of α-synuclein–positive perinuclear inclusion at low magnification, showing 5–10 µm membrane-bound compartment.",

    "micro-em-neurite.png": "TEM of neurite showing α-synuclein fibril accumulation, disrupted organelles, and lysosomal degradation machinery at high magnification (50,000×).",

    "micro-em-mature.png": "TEM of compact, mature Lewy body–like inclusion with organized core fibrils and surrounding membranous material resembling patient-derived Lewy body.",

    "micro-em-lewy-collection.jpg": "TEM survey showing multiple Lewy body–like inclusions in a single cell during peak pathology (Day 21 dual-hit), demonstrating widespread accumulation.",

    "micro-em-49000x.jpg": "TEM at 49,000× magnification showing fibrillar architecture and individual filament bundles within α-synuclein inclusions.",

    "micro-em-98000x-nanogold.jpg": "TEM at 98,000× magnification with 10 nm nanogold labeling revealing individual α-synuclein fibrils and their organization in cross-sectional profiles.",

    # microscopy.html - Standalone images
    "micro-thioflavin.png": "Thioflavin S fluorescence assay quantifying amyloid-like β-sheet content in α-synuclein inclusions across treatment conditions and timepoints.",

    "micro-antibody-profiling.jpg": "Western blot panel of α-synuclein antibodies (pSyn129, pSyn87, pSyn181, total α-syn) profiling phosphorylation patterns in wild-type vs diseased neurons.",

    # coding.html - Standalone
    "automorphotrack-interface.jpg": "AutoMorphoTrack Python package interface showing automated neurite outgrowth quantification, branch point detection, and morphological feature extraction.",
}

def process_html_file(filepath):
    """Process HTML file, wrapping standalone images in figures and adding captions to gallery images."""
    print(f"\nProcessing: {filepath}")

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Split into lines for line-by-line processing
    lines = content.split('\n')

    # Track which lines to modify and how
    modifications = []

    for i, line in enumerate(lines):
        if '<img' in line and 'src=' in line:
            # Extract filename
            src_match = re.search(r'src=["\']([^"\']+)["\']', line)
            if not src_match:
                continue

            filename = Path(src_match.group(1)).name
            caption = CAPTIONS.get(filename)
            if not caption:
                continue

            # Check if this is a gallery image
            is_gallery = False
            for j in range(max(0, i-3), i):
                if 'gallery-thumb' in lines[j]:
                    is_gallery = True
                    break

            modifications.append({
                'line_idx': i,
                'filename': filename,
                'caption': caption,
                'is_gallery': is_gallery
            })

    # Apply modifications in reverse order to preserve line indices
    for mod in reversed(modifications):
        i = mod['line_idx']
        caption = mod['caption']
        filename = mod['filename']
        is_gallery = mod['is_gallery']

        if is_gallery:
            # For gallery images, add a caption div AFTER the img tag
            caption_div = f'<div style="font-size:11px; color:var(--mid); padding:4px 6px; line-height:1.3; font-style:italic;">{caption}</div>'
            lines.insert(i + 1, caption_div)
            print(f"  Gallery: {filename}")
        else:
            # For standalone images, wrap in figure tags
            # Check if already wrapped
            if i > 0 and '<figure' in lines[i-1]:
                print(f"  Skipping (already wrapped): {filename}")
                continue

            img_tag = lines[i]
            figure_start = '<figure style="margin:0;">'
            figcaption = f'<figcaption style="font-size:13px; color:var(--mid); font-style:italic; max-width:640px; line-height:1.5; margin-bottom:20px;">{caption}</figcaption>'
            figure_end = '</figure>'

            # Replace the img line with figure+img+figcaption+figure_end
            lines[i] = figure_start
            lines.insert(i + 1, img_tag)
            lines.insert(i + 2, figcaption)
            lines.insert(i + 3, figure_end)
            print(f"  Standalone: {filename}")

    # Write back
    new_content = '\n'.join(lines)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)

    print(f"  ✓ Updated {filepath}")

def main():
    base_path = Path('/sessions/vibrant-dreamy-lovelace/mnt/Cowork/arminbayati-site')

    target_files = [
        'ipscs.html',
        'cellular-assays.html',
        'genetics.html',
        'drug-discovery.html',
        'microscopy.html',
        'coding.html'
    ]

    for filename in target_files:
        filepath = base_path / filename
        if filepath.exists():
            process_html_file(filepath)
        else:
            print(f"Warning: {filepath} not found")

    print("\n✓ All files processed!")

if __name__ == '__main__':
    main()
