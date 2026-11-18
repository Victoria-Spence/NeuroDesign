import { SamplePlan } from '../types';

// Helper to encode SVG string to base64 data URL
function svgToDataUrl(svgString: string): string {
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgString)))}`;
}

const penthouseRcpSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 700" width="1000" height="700" style="background:#fdfcf9; font-family:Arial, sans-serif;">
  <!-- Title Block & Grid -->
  <rect x="20" y="20" width="960" height="660" fill="none" stroke="#2b2d2f" stroke-width="2"/>
  <rect x="20" y="620" width="960" height="60" fill="#f5f2eb" stroke="#2b2d2f" stroke-width="1.5"/>
  <text x="40" y="645" font-size="14" font-weight="bold" fill="#0f766e" font-family="Arial, sans-serif">PROJECT: THE AURA RESIDENCE — PENTHOUSE LIVING &amp; DINING</text>
  <text x="40" y="665" font-size="11" fill="#57534e">DRAWING: REFLECTED CEILING PLAN (RCP-01) | SCALE: 1:50 | STATUS: SCHEMATIC DESIGN TENDER</text>
  <text x="750" y="645" font-size="11" font-weight="bold" fill="#1c1917">NORTH ^</text>
  <text x="750" y="665" font-size="10" fill="#78716c">REV: C | DATE: 2026</text>

  <!-- Room Outline & Walls -->
  <rect x="60" y="60" width="600" height="530" fill="#fcfbfa" stroke="#1c1917" stroke-width="3"/>
  
  <!-- Architectural Openings & Windows (South Daylight Façade) -->
  <line x1="60" y1="590" x2="660" y2="590" stroke="#0ea5e9" stroke-width="6" stroke-dasharray="16,6"/>
  <text x="280" y="610" font-size="11" fill="#0284c7" font-weight="bold">FLOOR-TO-CEILING GLAZING (SOUTH-FACING)</text>

  <!-- Perimeter Architectural Cove (Type L2) -->
  <rect x="80" y="80" width="560" height="490" fill="none" stroke="#d97706" stroke-width="2.5" stroke-dasharray="8,4"/>
  <text x="90" y="100" font-size="10" fill="#d97706" font-weight="bold">[L2] CONCEALED PERIMETER COVE (WARM DIM 2200K-3000K)</text>

  <!-- Living Room Area (West Zone) -->
  <!-- Sofa arrangement outline -->
  <rect x="120" y="160" width="180" height="220" rx="10" fill="#f5f2eb" stroke="#a8a29e" stroke-width="1.5" stroke-dasharray="4,4"/>
  <text x="145" y="275" font-size="12" fill="#78716c">LOUNGE SEATING</text>
  
  <!-- Recessed Downlights (Type L1) over Living Area -->
  <g id="downlights-living">
    <!-- Row 1 -->
    <circle cx="150" cy="190" r="8" fill="#ffffff" stroke="#0f766e" stroke-width="2"/>
    <line x1="142" y1="190" x2="158" y2="190" stroke="#0f766e" stroke-width="1.5"/>
    <line x1="150" y1="182" x2="150" y2="198" stroke="#0f766e" stroke-width="1.5"/>
    <text x="162" y="194" font-size="9" fill="#0f766e">L1 (3000K)</text>

    <circle cx="270" cy="190" r="8" fill="#ffffff" stroke="#0f766e" stroke-width="2"/>
    <line x1="262" y1="190" x2="278" y2="190" stroke="#0f766e" stroke-width="1.5"/>
    <line x1="270" y1="182" x2="270" y2="198" stroke="#0f766e" stroke-width="1.5"/>
    <text x="282" y="194" font-size="9" fill="#0f766e">L1</text>

    <!-- Row 2 -->
    <circle cx="150" cy="350" r="8" fill="#ffffff" stroke="#0f766e" stroke-width="2"/>
    <line x1="142" y1="350" x2="158" y2="350" stroke="#0f766e" stroke-width="1.5"/>
    <line x1="150" y1="342" x2="150" y2="358" stroke="#0f766e" stroke-width="1.5"/>
    <text x="162" y="354" font-size="9" fill="#0f766e">L1</text>

    <circle cx="270" cy="350" r="8" fill="#ffffff" stroke="#0f766e" stroke-width="2"/>
    <line x1="262" y1="350" x2="278" y2="350" stroke="#0f766e" stroke-width="1.5"/>
    <line x1="270" y1="342" x2="270" y2="358" stroke="#0f766e" stroke-width="1.5"/>
    <text x="282" y="354" font-size="9" fill="#0f766e">L1</text>
  </g>

  <!-- North Feature Art Wall & Grazers (Type L4) -->
  <line x1="100" y1="110" x2="360" y2="110" stroke="#e11d48" stroke-width="3"/>
  <circle cx="140" cy="130" r="6" fill="#e11d48"/>
  <polygon points="140,130 132,112 148,112" fill="#fecdd3" stroke="#e11d48" stroke-width="1"/>
  <circle cx="230" cy="130" r="6" fill="#e11d48"/>
  <polygon points="230,130 222,112 238,112" fill="#fecdd3" stroke="#e11d48" stroke-width="1"/>
  <circle cx="320" cy="130" r="6" fill="#e11d48"/>
  <polygon points="320,130 312,112 328,112" fill="#fecdd3" stroke="#e11d48" stroke-width="1"/>
  <text x="180" y="145" font-size="9" fill="#e11d48" font-weight="bold">[L4] ART WALL GRAZERS (2700K, 24° NARROW SPOT)</text>

  <!-- Dining Area (East Zone) -->
  <rect x="420" y="200" width="180" height="260" rx="6" fill="#f5f2eb" stroke="#a8a29e" stroke-width="1.5" stroke-dasharray="4,4"/>
  <text x="460" y="335" font-size="12" fill="#78716c">10-SEAT DINING TABLE</text>
  
  <!-- Suspended Dining Pendant (Type L3) -->
  <ellipse cx="510" cy="270" rx="40" ry="22" fill="#fef3c7" stroke="#b45309" stroke-width="2.5"/>
  <circle cx="510" cy="270" r="4" fill="#b45309"/>
  <ellipse cx="510" cy="390" rx="40" ry="22" fill="#fef3c7" stroke="#b45309" stroke-width="2.5"/>
  <circle cx="510" cy="390" r="4" fill="#b45309"/>
  <text x="450" y="430" font-size="10" fill="#b45309" font-weight="bold">[L3] DUAL LOW-GLARE OPAL PENDANTS</text>

  <!-- Kitchen Island / Bar (North East) -->
  <rect x="420" y="90" width="180" height="60" fill="#e7e5e4" stroke="#57534e" stroke-width="1.5"/>
  <text x="455" y="125" font-size="10" fill="#44403c">PREP ISLAND</text>
  <circle cx="450" cy="120" r="7" fill="#fff" stroke="#0f766e" stroke-width="2"/>
  <circle cx="510" cy="120" r="7" fill="#fff" stroke="#0f766e" stroke-width="2"/>
  <circle cx="570" cy="120" r="7" fill="#fff" stroke="#0f766e" stroke-width="2"/>

  <!-- Nighttime Floor Pathway Indicator -->
  <path d="M 80 480 Q 200 480 340 500 T 600 500" fill="none" stroke="#8b5cf6" stroke-width="2" stroke-dasharray="4,4"/>
  <rect x="85" y="475" width="10" height="10" fill="#8b5cf6"/>
  <rect x="340" y="495" width="10" height="10" fill="#8b5cf6"/>
  <rect x="590" y="495" width="10" height="10" fill="#8b5cf6"/>
  <text x="180" y="475" font-size="9" fill="#7c3aed" font-weight="bold">[L5] STEP-LIGHTING NIGHT PATHWAY (AMBER LED)</text>

  <!-- LEGEND & SPECIFICATION BLOCK (RIGHT COLUMN) -->
  <rect x="680" y="60" width="280" height="530" fill="#ffffff" stroke="#2b2d2f" stroke-width="1.5"/>
  <text x="700" y="90" font-size="13" font-weight="bold" fill="#0f766e" font-family="Arial, sans-serif">LUMINAIRE SCHEDULE</text>
  <line x1="700" y1="100" x2="940" y2="100" stroke="#e5e7eb" stroke-width="1"/>

  <!-- Legend Item 1 -->
  <circle cx="715" cy="125" r="7" fill="#fff" stroke="#0f766e" stroke-width="2"/>
  <text x="735" y="122" font-size="11" font-weight="bold" fill="#1c1917">TYPE L1: Recessed Downlight</text>
  <text x="735" y="138" font-size="9" fill="#57534e">Fixed CCT 3000K, CRI 92, 40° flood. White trim.</text>

  <!-- Legend Item 2 -->
  <line x1="705" y1="175" x2="725" y2="175" stroke="#d97706" stroke-width="3" stroke-dasharray="4,2"/>
  <text x="735" y="172" font-size="11" font-weight="bold" fill="#1c1917">TYPE L2: Architectural Cove</text>
  <text x="735" y="188" font-size="9" fill="#57534e">Warm-Dim LED (2200K-3000K), 1200 lm/m indirect.</text>

  <!-- Legend Item 3 -->
  <ellipse cx="715" cy="225" rx="10" ry="6" fill="#fef3c7" stroke="#b45309" stroke-width="2"/>
  <text x="735" y="222" font-size="11" font-weight="bold" fill="#1c1917">TYPE L3: Dining Pendant</text>
  <text x="735" y="238" font-size="9" fill="#57534e">Diffused handblown opal glass, 2700K dimmable.</text>

  <!-- Legend Item 4 -->
  <circle cx="715" cy="275" r="5" fill="#e11d48"/>
  <text x="735" y="272" font-size="11" font-weight="bold" fill="#1c1917">TYPE L4: Art Accent Grazer</text>
  <text x="735" y="288" font-size="9" fill="#57534e">2700K 95 CRI, 24° narrow spot, honeycomb louver.</text>

  <!-- Legend Item 5 -->
  <rect x="710" y="315" width="10" height="10" fill="#8b5cf6"/>
  <text x="735" y="322" font-size="11" font-weight="bold" fill="#1c1917">TYPE L5: Low-Plinth Plaster Inset</text>
  <text x="735" y="338" font-size="9" fill="#57534e">Amber (595nm), 15 lm, mounted 250mm AFF.</text>

  <!-- Controls Note -->
  <rect x="695" y="370" width="250" height="190" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1" rx="4"/>
  <text x="710" y="395" font-size="11" font-weight="bold" fill="#0f766e">CONTROL STRATEGY (DALI / CASAMBI)</text>
  <text x="710" y="415" font-size="9" fill="#475569">• Scene 1 (Morning Alert): Cove at 3000K 100%,</text>
  <text x="718" y="430" font-size="9" fill="#475569">Downlights 80%, daylight harvesting active.</text>
  <text x="710" y="450" font-size="9" fill="#475569">• Scene 2 (Evening Relax): Downlights OFF,</text>
  <text x="718" y="465" font-size="9" fill="#475569">Cove dimmed to 2200K (15%), Pendants 20%.</text>
  <text x="710" y="485" font-size="9" fill="#475569">• Scene 3 (Night Mode): All primary off,</text>
  <text x="718" y="500" font-size="9" fill="#475569">Type L5 low-level amber pathway only.</text>
  <text x="710" y="525" font-size="9" fill="#b91c1c" font-weight="bold">Note: UGR calculation report pending.</text>
  <text x="710" y="540" font-size="9" fill="#b91c1c" font-weight="bold">Photometric IES files available upon request.</text>
</svg>
`;

const workspaceRcpSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 700" width="1000" height="700" style="background:#fdfcf9; font-family:Arial, sans-serif;">
  <!-- Title Block & Grid -->
  <rect x="20" y="20" width="960" height="660" fill="none" stroke="#2b2d2f" stroke-width="2"/>
  <rect x="20" y="620" width="960" height="60" fill="#f5f2eb" stroke="#2b2d2f" stroke-width="1.5"/>
  <text x="40" y="645" font-size="14" font-weight="bold" fill="#0f766e" font-family="Arial, sans-serif">PROJECT: NEXUS ARCHITECTURAL STUDIO — OPEN PLAN &amp; WORKSPACE</text>
  <text x="40" y="665" font-size="11" fill="#57534e">DRAWING: LIGHTING ERGONOMICS LAYOUT (LT-02) | SCALE: 1:50 | STATUS: PERMIT &amp; SPECIFICATION</text>
  <text x="750" y="645" font-size="11" font-weight="bold" fill="#1c1917">NORTH ^</text>
  <text x="750" y="665" font-size="10" fill="#78716c">REV: B | DATE: 2026</text>

  <!-- Open Office Room Outline -->
  <rect x="60" y="60" width="600" height="530" fill="#fcfbfa" stroke="#1c1917" stroke-width="3"/>
  
  <!-- North Window Ribbon -->
  <line x1="60" y1="60" x2="660" y2="60" stroke="#0ea5e9" stroke-width="6" stroke-dasharray="16,6"/>
  <text x="260" y="50" font-size="11" fill="#0284c7" font-weight="bold">CONTINUOUS NORTH GLAZING (DIFFUSE DAYLIGHT)</text>

  <!-- Workstations Group 1 -->
  <rect x="100" y="140" width="220" height="160" fill="#f1f5f9" stroke="#94a3b8" stroke-width="1.5"/>
  <text x="145" y="225" font-size="11" fill="#64748b">BENCH DESKS 1-4</text>
  <!-- Suspended Direct/Indirect Linear Luminaire over Group 1 -->
  <rect x="120" y="210" width="180" height="16" rx="4" fill="#0f766e" stroke="#115e59" stroke-width="2"/>
  <text x="135" y="222" font-size="9" fill="#ffffff" font-weight="bold">[W1] LINEAR DIR/INDIR (4000K)</text>

  <!-- Workstations Group 2 -->
  <rect x="100" y="360" width="220" height="160" fill="#f1f5f9" stroke="#94a3b8" stroke-width="1.5"/>
  <text x="145" y="445" font-size="11" fill="#64748b">BENCH DESKS 5-8</text>
  <!-- Suspended Direct/Indirect Linear Luminaire over Group 2 -->
  <rect x="120" y="430" width="180" height="16" rx="4" fill="#0f766e" stroke="#115e59" stroke-width="2"/>
  <text x="135" y="442" font-size="9" fill="#ffffff" font-weight="bold">[W1] LINEAR DIR/INDIR (4000K)</text>

  <!-- East Collaboration & Pinup Wall -->
  <line x1="640" y1="120" x2="640" y2="500" stroke="#6366f1" stroke-width="4"/>
  <text x="500" y="310" font-size="11" fill="#4338ca" transform="rotate(-90 500,310)">DESIGN CRITIQUE PINUP BOARD</text>
  <!-- Track Wallwashers for Critique Wall -->
  <line x1="580" y1="140" x2="580" y2="480" stroke="#334155" stroke-width="2"/>
  <circle cx="580" cy="180" r="6" fill="#6366f1"/>
  <circle cx="580" cy="260" r="6" fill="#6366f1"/>
  <circle cx="580" cy="340" r="6" fill="#6366f1"/>
  <circle cx="580" cy="420" r="6" fill="#6366f1"/>
  <text x="470" y="160" font-size="9" fill="#4f46e5" font-weight="bold">[W2] ASYMMETRIC WALLWASH</text>

  <!-- Meeting Pod / Focus Booth -->
  <rect x="360" y="140" width="160" height="120" fill="#fef3c7" stroke="#d97706" stroke-width="1.5"/>
  <text x="390" y="205" font-size="11" fill="#b45309">ACOUSTIC POD</text>
  <circle cx="440" cy="200" r="14" fill="#ffffff" stroke="#b45309" stroke-width="2"/>
  <text x="415" y="240" font-size="9" fill="#b45309">[W3] 3000K ACOUSTIC BELL</text>

  <!-- SPECIFICATION TABLE -->
  <rect x="680" y="60" width="280" height="530" fill="#ffffff" stroke="#2b2d2f" stroke-width="1.5"/>
  <text x="700" y="90" font-size="13" font-weight="bold" fill="#0f766e" font-family="Arial, sans-serif">WORKSPACE LIGHTING SPEC</text>
  <line x1="700" y1="100" x2="940" y2="100" stroke="#e5e7eb" stroke-width="1"/>

  <rect x="700" y="115" width="240" height="85" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1" rx="4"/>
  <text x="710" y="135" font-size="10" font-weight="bold" fill="#0f766e">[W1] PENDANT DIRECT/INDIRECT</text>
  <text x="710" y="152" font-size="9" fill="#334155">• Split: 65% down / 35% up (ceiling wash)</text>
  <text x="710" y="167" font-size="9" fill="#334155">• Micro-prismatic diffuser, UGR &lt; 16 catalogued</text>
  <text x="710" y="182" font-size="9" fill="#334155">• 4000K, Ra &gt; 90, continuous 1-100% DALI dimming</text>

  <rect x="700" y="215" width="240" height="80" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1" rx="4"/>
  <text x="710" y="235" font-size="10" font-weight="bold" fill="#4338ca">[W2] PINUP ASYMMETRIC TRACK</text>
  <text x="710" y="252" font-size="9" fill="#334155">• 3500K, 95 CRI with R9 &gt; 70 for material true color</text>
  <text x="710" y="267" font-size="9" fill="#334155">• Maintained 450 lux vertical uniformity</text>

  <rect x="700" y="310" width="240" height="80" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1" rx="4"/>
  <text x="710" y="330" font-size="10" font-weight="bold" fill="#b45309">[W3] ACOUSTIC FABRIC BELL PENDANT</text>
  <text x="710" y="347" font-size="9" fill="#334155">• 3000K warm focus, internal glare cowl</text>
  <text x="710" y="362" font-size="9" fill="#334155">• Local rotary dimmer inside pod</text>

  <rect x="700" y="405" width="240" height="155" fill="#fdf4ff" stroke="#f0abfc" stroke-width="1" rx="4"/>
  <text x="710" y="425" font-size="10" font-weight="bold" fill="#86198f">TARGET METRICS &amp; CONTROLS</text>
  <text x="710" y="445" font-size="9" fill="#701a75">• Target Desktop Lux: 500 lux maintained</text>
  <text x="710" y="460" font-size="9" fill="#701a75">• Target Uniformity: U0 &gt; 0.65</text>
  <text x="710" y="475" font-size="9" fill="#701a75">• Driver Spec: Ripple current &lt; 1% (PstLM &lt; 0.5)</text>
  <text x="710" y="490" font-size="9" fill="#701a75">• Daylight sensors installed at North window bay</text>
  <text x="710" y="515" font-size="9" fill="#be123c" font-weight="bold">* Note: In-situ desktop sensor verification</text>
  <text x="718" y="530" font-size="9" fill="#be123c" font-weight="bold">required post commissioning.</text>
</svg>
`;

export const SAMPLE_PLANS: SamplePlan[] = [
  {
    id: 'penthouse-rcp',
    title: 'Penthouse Living & Dining Reflected Ceiling Plan (RCP)',
    type: 'Residential Wellness & Circadian Scheme',
    description: 'High-end residential open living & dining suite featuring perimeter cove lighting, recessed downlights, dining pendant, art wall grazers, and nocturnal amber pathway.',
    svgDataUrl: svgToDataUrl(penthouseRcpSvg),
    defaultNotes: `EXPLANATORY DESIGN NOTES & SCHEDULE:
- Space: 75 sq.m luxury penthouse living and dining room with 3.1m clear ceiling height.
- Daylight Exposure: High South-facing floor-to-ceiling glass wall equipped with automated sheer roller shades.
- Luminaire Types:
  * Type L1 (Living Downlights): 4x Recessed 10W LED fixtures, fixed 3000K, 92 CRI, 40-degree flood beam, white baffle trim.
  * Type L2 (Architectural Perimeter Cove): 24 linear meters of high-density warm-dimming LED strip (2200K at 10% to 3000K at 100%), 1200 lm/meter, uplighting matte white ceiling plaster (reflectance rho = 0.85).
  * Type L3 (Dining Suspension): Two handblown opal glass pendants centered over 10-person timber dining table. Diffused omnidirectional glow, warm 2700K lamping.
  * Type L4 (Art Wall Grazer): 3x directional narrow-spot (24 deg) recessed spotlights aimed at northern art collection wall, equipped with honeycomb hex-louvers to eliminate lateral glare.
  * Type L5 (Night Pathway): Low-level recessed step-lights mounted 250mm above finished floor, equipped with 595nm amber LED diodes (zero blue wavelength component) for nocturnal transit.
- Control Scenes (Casambi DALI):
  * Morning / Day Focus (08:00-17:00): Cove at 3000K 90%, downlights at 75%, daylight harvesting active.
  * Evening Relax (19:00-23:00): Downlights L1 powered completely OFF. Cove L2 dimmed to 15% (2200K ultra-warm indirect glow), dining pendants L3 dimmed to 20%.
  * Night Path (23:00-06:00): All ceiling fixtures off. Type L5 step lights activated via occupancy sensor at 15 lux maintained.
- Unknown / Pending Technical Specifications:
  * Specific UGR unified glare calculation file has not been run for living downlights L1.
  * Exact photopic vs melanopic lux ratio (M-EDI) has not been verified with spectrometer software.`,
  },
  {
    id: 'studio-rcp',
    title: 'Nexus Architectural Studio Reflected Ceiling Plan',
    type: 'Commercial Ergonomics & Visual Comfort Scheme',
    description: 'Modern design office featuring balanced direct/indirect linear suspended luminaires over bench workstations, asymmetric track wallwashers, and daylight-integrated dimming.',
    svgDataUrl: svgToDataUrl(workspaceRcpSvg),
    defaultNotes: `EXPLANATORY DESIGN NOTES & SCHEDULE:
- Space: 120 sq.m open-plan architectural studio with 8 active CAD/BIM workstations, critique pinup wall, and private meeting pod.
- Daylight Integration: North-facing continuous strip window providing diffuse natural ambient daylight without harsh direct sun.
- Luminaire Types:
  * Type W1 (Workstation Linears): Suspended continuous linear profile fixtures with dual-chamber optical distribution (65% direct downward through micro-prismatic lens, 35% indirect upward against white acoustic plaster ceiling). 4000K neutral white, Ra 92, R9 65.
  * Type W2 (Critique Wall Track): Asymmetric wallwash track heads tilted at 28 degrees to achieve 450 lux maintained across the pinup surface for drawing inspections. 3500K, CRI 95.
  * Type W3 (Acoustic Meeting Pod): Suspended acoustic felt dome pendant with internal recessed 3000K warm LED engine, manual rotary dimming.
- Control & Sensor Strategy:
  * Open loop daylight sensors positioned 2.5m from North window facade dimming row 1 linears automatically.
  * High-frequency solid-state drivers specified with <1% current ripple (PstLM < 0.5, SVM < 0.2) to prevent stroboscopic screen flicker.
- Unknown / Pending Specifications:
  * Final desk-height lux measurement awaits post-occupancy photometer commissioning.
  * Exact mounting suspension height from floor: currently drawn at 2.4m AFF, ceiling is 3.5m.`,
  },
];
