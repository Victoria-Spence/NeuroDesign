import { ResearchPreset } from '../types';

export const RESEARCH_PRESETS: ResearchPreset[] = [
  {
    id: 'circadian-residential',
    title: 'Circadian Health in Residential Interiors',
    subtitle: 'WELL v2 L03, Figueiro et al. (2019), Rea et al. (2021)',
    description: 'Guidelines on melanopic stimulus, evening melatonin suppression, and dynamic CCT curves for living and rest areas.',
    content: `RESEARCH OVERVIEW: CIRCADIAN STIMULUS & RESIDENTIAL LIGHTING HEALTH
Sources:
1. WELL Building Standard v2, Feature L03: Circadian Lighting Design (International WELL Building Institute, 2020).
2. Figueiro, M. G., Steverson, B., Heerwagen, J., & Rea, M. S. (2019). "Light, Sleep, and Circadian Rhythms in Living Environments." Lighting Research & Technology, 51(3), 441-458.
3. Rea, M. S., & Figueiro, M. G. (2021). "Light as a Public Health Measure: Circadian Stimulus (CS) in Domestic Architecture." Frontiers in Neuroscience, 15, 638.

KEY FINDINGS & CRITERIA EXTRACTED:
- Criterion A (Evening Melatonin Protection): Figueiro et al. (2019) show that exposure to light with correlated color temperature (CCT) > 3000K or direct vertical eye illuminance exceeding 30 melanopic lux within 2 hours of bedtime suppresses melatonin production and delays sleep onset. Evening lighting in living and bedroom zones must deliver warm CCT (<= 2700K, ideally 2200K-2400K) and rely on indirect or low-level perimeter illumination below eye level.
- Criterion B (Daytime Alertness & High Vertical Illuminance): Under WELL v2 Feature L03, living and active daytime areas should achieve at least 150-200 Equivalent Melanopic Lux (EML) at eye level (approx. 1.2m above floor) between 09:00 and 15:00, utilizing either high daylight aperture integration or tunable 4000K-5000K diffused indirect ambient lighting.
- Criterion C (Visual Glare & Discomfort Mitigation): Rea & Figueiro (2021) demonstrate that high luminance contrasts (>10:1 between luminaire aperture and immediate background surface) cause pupillary strain and visual fatigue. Recessed downlights in lounge and reading zones must incorporate deep baffles (cut-off angle >= 30 degrees) or diffused lensing.
- Criterion D (Nighttime Navigation & Low Blue-Hazard): Nocturnal pathway lighting (hallways, powder rooms) must maintain illuminance under 10-20 lux at floor level with spectral emission concentrated above 590nm (amber/warm red tones with zero blue wavelength component) to avoid phase-shifting the circadian master clock.`,
  },
  {
    id: 'hospitality-dining',
    title: 'Atmosphere & Focal Hierarchy in Hospitality',
    subtitle: 'Boyce (2014), Cuttle (2008), Flynn (1973)',
    description: 'Principles of intimacy, sparkling focal emphasis, and perceived spaciousness through wall washing.',
    content: `RESEARCH OVERVIEW: PSYCHOLOGICAL & SPATIAL IMPRESSIONS IN INTERIOR LIGHTING
Sources:
1. Flynn, J. E. (1973). "The Psychology of Light: Spatial Impressions of Intimacy, Spaciousness, and Relaxation." Architectural Record, 154(4), 143-148.
2. Cuttle, C. (2008). "Lighting by Design: Perceived Illuminance, Accent Ratios, and Surface Illumination." Architectural Press / Routledge, 2nd Edition.
3. Boyce, P. R. (2014). "Human Factors in Lighting." CRC Press / Taylor & Francis Group, 3rd Edition.

KEY FINDINGS & CRITERIA EXTRACTED:
- Criterion A (Intimacy & Peripheral Dimming): Flynn (1973) established that impressions of social intimacy and conversational relaxation are maximized when perimeter and overhead ambient illuminance is kept subdued (< 100 lux), while tables or seating niches receive localized warm pools of light (2400K-2700K) with a high contrast ratio relative to the room envelope.
- Criterion B (Focal Accent Ratios for Visual Interest): Cuttle (2008) details that architectural features, art, or key hospitality centerpieces require an illuminance ratio of 5:1 to 10:1 relative to the surrounding ambient field to be registered as focal highlights without causing visual glare.
- Criterion C (Perceived Spaciousness via Vertical Surface Washing): Boyce (2014) and Flynn (1973) found that uniform vertical wall illumination (wall grazing or wall washing >= 150 lux) dramatically increases the subjective appraisal of room spaciousness and clarity, offsetting feelings of claustrophobia in low-ceiling hospitality rooms.
- Criterion D (Color Rendering & Food/Skin Appearance): Boyce (2014) emphasizes that dining and lounge luminaires must have a Color Rendering Index (CRI) Ra >= 90 and TM-30 Rf >= 85, with particular emphasis on high R9 values (saturated red > 50) to render food presentation, wood finishes, and human skin tones favorably without ashen undertones.`,
  },
  {
    id: 'workplace-focus',
    title: 'Workplace Visual Comfort & Cognitive Ergonomics',
    subtitle: 'EN 12464-1, CIE S 008, van Bommel (2006)',
    description: 'Illuminance uniformity, unified glare rating (UGR < 19), and direct/indirect balance.',
    content: `RESEARCH OVERVIEW: VISUAL ERGONOMICS & COGNITIVE PERFORMANCE IN WORKING INTERIORS
Sources:
1. European Standard EN 12464-1 (2021). "Light and Lighting – Lighting of Work Places – Part 1: Indoor Work Places." CEN.
2. CIE S 008/E:2001. "Lighting of Indoor Work Places." International Commission on Illumination.
3. van Bommel, W. J. M. (2006). "Non-visual Biological Effects of Lighting and the Practical Consequences for Indoor Lighting." Lighting Research & Technology, 38(1), 41-49.

KEY FINDINGS & CRITERIA EXTRACTED:
- Criterion A (Unified Glare Rating Threshold): EN 12464-1 specifies that for continuous screen and paperwork tasks, the Unified Glare Rating (UGR) must not exceed 19. Luminaires located within the normal field of view must use micro-prismatic optics or deep louver shielding to prevent direct and reflected veiling reflections.
- Criterion B (Task Plane Illuminance & Uniformity): CIE S 008 mandates maintained illuminance of >= 500 lux on desktop work planes, with an illuminance uniformity (U0 = Emin / Eavg) of at least 0.60 across the immediate task area, and >= 0.40 in surrounding areas to minimize accommodation fatigue.
- Criterion C (Balanced Direct/Indirect Distribution): van Bommel (2006) proves that lighting schemes incorporating 30% to 50% indirect ceiling uplight significantly reduce pupil constriction fatigue and create a shadow-soft environment compared to 100% direct downward troffers.
- Criterion D (Flicker & Stroboscopic Effect Prevention): High-frequency solid-state drivers with Temporal Light Artefacts (PstLM <= 1.0 and SVM <= 0.4) are mandatory to eliminate invisible flicker that induces headaches and cognitive fatigue during extended visual tasks.`,
  },
];
