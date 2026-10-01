import { LectureData } from '../types/lecture';
import { DEFAULT_PRECOMPUTED_LECTURE } from './defaultLecture';

export const SAMPLE_NEURO_LECTURE: LectureData = {
  id: 'sample-neuro-ltp',
  title: 'Neurobiology: Long-Term Potentiation & Synaptic Plasticity',
  subject: 'Neurobiology & Medicine',
  createdAt: new Date().toISOString(),
  originalTranscript: `Good morning class. Today in Cellular Neurobiology, we are addressing one of the most magnificent questions in science: how does biological tissue learn? How does physical wiring in your brain encode the memory of your first bicycle ride or the biochemical formula you memorized for this course?...`,
  wordCount: 1380,
  durationMinutesEstimated: 50,
  mode: 'exam-cram',
  starred: true,
  coreThesis: 'Long-Term Potentiation (LTP) at hippocampal CA1 synapses relies on NMDA receptors acting as molecular coincidence detectors: only when high-frequency AMPA depolarization ejects the magnesium block can calcium enter to trigger CaMKII and structural synaptic strengthening.',
  executiveSummary: `This lecture provides a comprehensive biochemical and neurophysiological dissection of Long-Term Potentiation (LTP), the primary cellular mechanism underlying learning and memory formation in the mammalian brain. Centered on Donald Hebb's 1949 postulate ("Neurons that fire together, wire together"), the professor explores the trisynaptic circuit of the hippocampus, focusing specifically on excitatory Schaffer collateral inputs to CA1 pyramidal neurons.

Under baseline low-frequency conditions, presynaptic glutamate release activates AMPA receptors, producing moderate sodium influx and mild EPSPs, while NMDA receptors remain non-conductive due to electrostatic blockage by extracellular Magnesium ions (Mg2+). During high-frequency tetanus, intense spatial and temporal summation through AMPA receptors depolarizes the dendritic membrane to approximately -20mV, electrostatically expelling the Mg2+ ion.

Because opening the NMDA pore requires simultaneous presynaptic glutamate binding AND postsynaptic depolarization, it functions as a molecular coincidence detector. Influx of Calcium ions (Ca2+) activates CaMKII, which immediately enhances AMPA channel conductance and recruits reserve intracellular AMPA receptors to the postsynaptic density (early-phase LTP). For late-phase LTP, sustained calcium triggers the PKA/CREB pathway, initiating gene transcription and permanent structural dendritic spine enlargement.`,
  keyTakeaways: [
    'The NMDA receptor is a molecular coincidence detector requiring both presynaptic glutamate and postsynaptic depolarization.',
    'Under resting potential (-70mV), extracellular Magnesium (Mg2+) physically blocks the NMDA channel pore.',
    'Depolarization to ~ -20mV by AMPA-mediated sodium influx repels Mg2+, allowing Calcium (Ca2+) to enter the postsynaptic cell.',
    'Early-phase LTP is mediated by CaMKII phosphorylating AMPA receptors and driving insertion of reserve AMPA receptors from endosomes.',
    'Late-phase LTP requires protein synthesis mediated by cAMP, Protein Kinase A (PKA), and CREB gene transcription in the nucleus.'
  ],
  sections: [
    {
      timestamp: '00:00 - 10:30',
      heading: 'Hebb\'s Postulate & The Hippocampal Circuit',
      summary: 'Introduction to synaptic plasticity and the CA3-to-CA1 Schaffer collateral excitatory synapse.',
      bullets: [
        'Discovered by Terje Lømo and Timothy Bliss in 1973 in rabbit hippocampus.',
        'Hebb\'s rule: coincident activity between pre- and post-synaptic neurons strengthens their connection.',
        'CA1 pyramidal dendritic spines house both AMPA and NMDA ionotropic glutamate receptors.'
      ],
      lecturerNoteOrAnalogy: 'Think of memory as a physical walking trail through tall grass: every time thousands of footsteps walk the same path, the grass stays permanently beaten down.'
    },
    {
      timestamp: '10:31 - 25:10',
      heading: 'The Magnesium Block & Molecular Coincidence Detection',
      summary: 'Mechanics of the resting membrane potential and why NMDA receptors remain dormant under normal transmission.',
      bullets: [
        'Resting potential is approximately -70mV.',
        'Extracellular Mg2+ is positively charged and electrostatically pulled into the NMDA receptor channel.',
        'High-frequency stimulation (100 Hz tetanus) causes massive Na+ influx through AMPA receptors.',
        'Local membrane depolarization to -30mV/-20mV repels the Mg2+ ion via electrostatic repulsion.'
      ],
      lecturerNoteOrAnalogy: 'The Mg2+ ion is like a stubborn cork jammed in a champagne bottle; only the explosive pressure of AMPA depolarization can pop the cork out.'
    },
    {
      timestamp: '25:11 - 38:00',
      heading: 'Early-Phase LTP: Calcium Influx & CaMKII Activation',
      summary: 'The biochemical cascade triggered by postsynaptic calcium influx.',
      bullets: [
        'Unblocked NMDA receptors allow Ca2+ to enter the dendritic spine.',
        'Calcium activates CaMKII (calcium/calmodulin-dependent protein kinase II).',
        'Action 1: CaMKII phosphorylates existing AMPA receptors (increasing conductance).',
        'Action 2: CaMKII promotes exocytosis of reserve AMPA receptors from endosomes into the postsynaptic density.'
      ],
      lecturerNoteOrAnalogy: 'Synaptic upgrade: CaMKII not only widens the existing doorways (AMPA receptors) but installs twice as many new doorways on the wall.'
    },
    {
      timestamp: '38:01 - 50:00',
      heading: 'Late-Phase LTP & Structural Spine Remodeling',
      summary: 'Transitioning from short-term enhancement to permanent anatomical memory through CREB-mediated gene transcription.',
      bullets: [
        'Sustained calcium stimulates adenylyl cyclase, raising cAMP and activating PKA.',
        'PKA translocates to the nucleus to phosphorylate transcription factor CREB.',
        'Gene transcription yields BDNF and actin scaffold proteins, physically enlarging the spine.',
        'NMDA antagonists like ketamine and APV abolish LTP induction.'
      ],
      lecturerNoteOrAnalogy: 'Early LTP is like jotting notes on a whiteboard; Late LTP is the carpenter arriving to chisel the letters permanently into granite.'
    }
  ],
  keyConcepts: [
    {
      term: 'NMDA Receptor',
      definition: 'An ionotropic glutamate receptor and coincidence detector that requires both glutamate binding and postsynaptic depolarization to relieve an extracellular Mg2+ block and conduct Ca2+.',
      simpleExplanation: 'A locked biochemical doorway that needs two separate keys at the exact same millisecond: glutamate and electrical voltage.',
      significance: 'Essential trigger for synaptic plasticity and associative memory formation.',
      category: 'Receptor & Channel',
      formulaOrExample: 'Permeable to Ca2+, Na+, K+; blocked by Mg2+ at -70mV.'
    },
    {
      term: 'Magnesium Block (Mg2+ Block)',
      definition: 'The voltage-dependent blocking of the NMDA receptor ion channel pore by an extracellular divalent magnesium ion at hyperpolarized or resting membrane potentials.',
      simpleExplanation: 'A positive ion plug stuck in the channel pore that only pops out when the cell interior becomes positively charged.',
      significance: 'Prevents premature or accidental calcium influx during trivial baseline neuronal firing.',
      category: 'Biophysical Mechanism',
      formulaOrExample: 'Relieved at approximately -30mV to -20mV.'
    },
    {
      term: 'CaMKII',
      definition: 'Calcium/calmodulin-dependent protein kinase II; an autonomous kinase enzyme activated by calcium influx that phosphorylates AMPA receptors and directs their trafficking to the synaptic membrane.',
      simpleExplanation: 'The master construction foreman enzyme inside the neuron that multiplies the power of incoming signals.',
      significance: 'The biochemical memory molecule responsible for early-phase LTP maintenance.',
      category: 'Enzyme / Kinase',
      formulaOrExample: 'Auto-phosphorylates at Thr286 to remain active even after calcium drops.'
    },
    {
      term: 'CREB Transcription Factor',
      definition: 'cAMP response element-binding protein; a nuclear transcription factor phosphorylated by PKA that initiates de novo protein synthesis for late-phase LTP and dendritic structural remodeling.',
      simpleExplanation: 'The genetic switch that turns on the production of building materials for long-term structural memories.',
      significance: 'Required for consolidating temporary working memories into long-term permanent storage.',
      category: 'Nuclear Factor',
      formulaOrExample: 'Phosphorylated by PKA -> binds CRE sequence on DNA.'
    }
  ],
  revisionPoints: [
    {
      topic: 'NMDA vs AMPA Receptor Roles',
      highYieldFacts: [
        'AMPA receptors open immediately to glutamate and pass Na+ to cause depolarization.',
        'NMDA receptors do not conduct at resting membrane potential due to the Mg2+ block.',
        'Calcium (Ca2+) passes primarily through NMDA, NOT baseline AMPA receptors.',
        'NMDA receptors are the INDUCER of LTP; AMPA receptors are the EFFECTOR of LTP.'
      ],
      commonPitfallsOrMisconceptions: [
        'Confusing LTP induction with LTP maintenance: NMDA is required for induction, but once established, blocking NMDA does NOT erase LTP!',
        'Assuming glutamate alone can open NMDA channels (it requires membrane depolarization).'
      ],
      potentialExamQuestions: [
        'Explain why NMDA receptors are termed molecular coincidence detectors.',
        'What would happen to hippocampal LTP if an experimenter introduced intracellular BAPTA (a rapid calcium chelator)?'
      ]
    },
    {
      topic: 'Early vs Late Phase LTP Distinctions',
      highYieldFacts: [
        'Early LTP (1-3 hours) requires kinase activity (CaMKII, PKC) and receptor trafficking, but NO new protein synthesis.',
        'Late LTP (>3 hours to days) is abolished by anisomycin or cycloheximide (protein synthesis inhibitors).',
        'Late LTP requires transcription factor CREB and structural actin remodeling (BDNF).'
      ],
      commonPitfallsOrMisconceptions: [
        'Stating that early LTP requires gene transcription in the nucleus. Early LTP relies entirely on pre-existing proteins and endosomes!'
      ],
      potentialExamQuestions: [
        'Contrast the molecular requirements and time courses of early-phase versus late-phase LTP.'
      ]
    }
  ],
  flashcards: [
    {
      id: 'neuro-fc-1',
      front: 'Why does the NMDA receptor not conduct calcium at a resting membrane potential of -70 mV?',
      back: 'Because an extracellular Magnesium (Mg2+) ion is electrostatically lodged in the channel pore, physically blocking ion transit.',
      hint: 'Think about a positive ion attracted to a negative cell interior.',
      tag: 'Ion Channels'
    },
    {
      id: 'neuro-fc-2',
      front: 'What two simultaneous conditions are required to open the NMDA receptor channel?',
      back: '1. Presynaptic glutamate binding to the receptor.\n2. Postsynaptic membrane depolarization to expel the Mg2+ block.',
      hint: 'Coincidence detection.',
      tag: 'Mechanisms'
    },
    {
      id: 'neuro-fc-3',
      front: 'What are the two primary actions of CaMKII in early-phase LTP?',
      back: '1. Phosphorylates existing AMPA receptors (increasing conductance).\n2. Promotes exocytosis and insertion of reserve AMPA receptors from endosomes into the postsynaptic density.',
      hint: 'Upgrade existing + deliver new ones.',
      tag: 'Enzymes'
    },
    {
      id: 'neuro-fc-4',
      front: 'How can an experimenter distinguish early-phase LTP from late-phase LTP pharmacologically?',
      back: 'By applying protein synthesis inhibitors (e.g. anisomycin or cycloheximide). They leave early LTP intact, but completely abolish late LTP.',
      hint: 'Translation of new proteins.',
      tag: 'Pharmacology'
    }
  ],
  quizQuestions: [
    {
      id: 'neuro-q-1',
      question: 'Which of the following interventions would prevent the induction of early-phase LTP at the CA3-CA1 hippocampal synapse?',
      options: [
        'Applying an NMDA receptor antagonist like APV during high-frequency tetanus.',
        'Applying a protein synthesis inhibitor like anisomycin 5 minutes before tetanus.',
        'Bathing the slice in extra magnesium ions without applying glutamate.',
        'Blocking ribosomal RNA translation in the cell nucleus.'
      ],
      correctOptionIndex: 0,
      explanation: 'APV blocks NMDA receptors, preventing the calcium influx essential for activating CaMKII and inducing early-phase LTP. Protein synthesis inhibitors only abolish late-phase LTP, leaving early LTP unaffected.',
      conceptTested: 'LTP Induction Pharmacological Blockade'
    },
    {
      id: 'neuro-q-2',
      question: 'Why does the magnesium ion (Mg2+) exit the NMDA receptor pore during high-frequency stimulation?',
      options: [
        'Glutamate binds directly to the magnesium ion and pulls it out.',
        'AMPA-mediated sodium influx depolarizes the intracellular membrane potential, electrostatically repelling the positively charged Mg2+ ion.',
        'Calcium ions enter and push magnesium into the cell.',
        'The receptor denatures and drops the magnesium ion.'
      ],
      correctOptionIndex: 1,
      explanation: 'Under resting negative potential (-70mV), the positive Mg2+ is drawn into the pore. When AMPA receptors depolarize the cell to approximately -20mV, the positive interior repels the positive Mg2+ ion out into extracellular space.',
      conceptTested: 'Electrostatic Repulsion of Mg2+'
    }
  ],
  mindmap: [
    { id: 'n-root', label: 'Long-Term Potentiation (LTP)', parentId: '', description: 'Cellular basis of associative memory', color: 'emerald' },
    { id: 'n-coinc', label: '1. Coincidence Detection', parentId: 'n-root', description: 'Dual requirement for opening pore', color: 'emerald' },
    { id: 'n-ampa', label: 'AMPA Depolarization', parentId: 'n-coinc', description: 'Na+ influx brings voltage to -20mV', color: 'slate' },
    { id: 'n-mg', label: 'Mg2+ Expulsion', parentId: 'n-coinc', description: 'Electrostatic repulsion clears the pore', color: 'slate' },
    { id: 'n-early', label: '2. Early-Phase LTP', parentId: 'n-root', description: '1-3 hours; no protein synthesis', color: 'amber' },
    { id: 'n-camk', label: 'CaMKII Activation', parentId: 'n-early', description: 'Phosphorylates AMPA & inserts reserves', color: 'amber' },
    { id: 'n-late', label: '3. Late-Phase LTP', parentId: 'n-root', description: 'Structural remodeling lasting days/weeks', color: 'purple' },
    { id: 'n-creb', label: 'CREB Transcription', parentId: 'n-late', description: 'PKA activation & BDNF synthesis', color: 'purple' }
  ]
};

export const SAMPLE_MACRO_LECTURE: LectureData = {
  id: 'sample-macro-inflation',
  title: 'Macroeconomics: Monetary Policy, Central Banks & Inflation Dynamics',
  subject: 'Economics & Finance',
  createdAt: new Date().toISOString(),
  originalTranscript: `Welcome back to Macroeconomic Theory. Today we turn to central banking, the Federal Reserve, and the dynamics of inflation...`,
  wordCount: 1190,
  durationMinutesEstimated: 40,
  mode: 'executive',
  starred: true,
  coreThesis: 'Modern central banks combat demand-pull and cost-push inflation primarily by adjusting the benchmark policy rate and expectations; anchored inflation expectations are the single most critical variable preventing self-fulfilling price-wage spirals.',
  executiveSummary: `This lecture provides an executive overview of central bank monetary policy frameworks, inflation mechanics, and financial transmission channels. The professor contrasts demand-pull inflation (excess aggregate demand exceeding productive potential) with cost-push inflation (supply-side input price shocks, such as oil disruptions), which can trigger stagflation.

The Federal Reserve and global central banks utilize the Federal Funds Rate and balance sheet adjustments (Quantitative Tightening) to control liquidity. Raising interest rates cascades through commercial prime lending, mortgage demand, corporate bond yields, and capital expenditure decisions, ultimately cooling economic activity.

A major focus is the expectations-augmented Phillips Curve. The professor emphasizes that expected inflation is the dominant variable in wage negotiations and enterprise price-setting: if inflation expectations become unanchored, inflation becomes self-fulfilling regardless of immediate output gaps.`,
  keyTakeaways: [
    'Demand-pull inflation results from excessive aggregate demand, whereas cost-push inflation is driven by supply-side commodity or supply chain shocks.',
    'Stagflation represents the dangerous combination of stagnant economic output and high inflation, which monetary tightening struggles to fix without inducing recessions.',
    'The monetary transmission mechanism works through mortgage rates, corporate bond yields, exchange rates, and bank lending standards.',
    'Expected inflation is the single most critical term in the modern Phillips curve; losing central bank credibility leads to self-fulfilling wage-price spirals.'
  ],
  sections: [
    {
      timestamp: '00:00 - 12:00',
      heading: 'Demand-Pull vs Cost-Push Inflation',
      summary: 'Differentiating the economic origins of consumer price surges.',
      bullets: [
        'Demand-pull: too much money chasing too few goods (fiscal stimulus, low rates).',
        'Cost-push: leftward shift in aggregate supply (energy shocks, supply chain friction).',
        'Stagflation: combination of high inflation and high unemployment, as in the 1970s.'
      ],
      lecturerNoteOrAnalogy: 'Demand-pull is like an auction where everyone suddenly has twice as much cash; cost-push is like a flood destroying half the timber mills.'
    },
    {
      timestamp: '12:01 - 26:00',
      heading: 'Monetary Transmission Mechanism',
      summary: 'How central bank rate hikes filter through commercial financial markets.',
      bullets: [
        'Federal Funds Rate changes overnight interbank borrowing costs.',
        'Spreads to 30-year fixed mortgages, dampening real estate and housing construction.',
        'Hikes borrowing costs for corporate capital expenditure (CapEx) and hiring.'
      ],
      lecturerNoteOrAnalogy: 'The central bank policy rate is the thermostat of the economy; turn it up to cool down the boiling pot.'
    },
    {
      timestamp: '26:01 - 40:00',
      heading: 'The Expectations-Augmented Phillips Curve & QT',
      summary: 'The critical role of forward guidance and central bank credibility in anchoring price expectations.',
      bullets: [
        'Equation: Inflation = Expected Inflation - beta*(Output Gap) + Supply Shocks.',
        'Unanchored expectations trigger wage-price feedback spirals.',
        'Quantitative Tightening drains excess liquidity from commercial bank reserves.'
      ],
      lecturerNoteOrAnalogy: 'If workers believe groceries will cost 10% more next year, they demand 10% wage increases today, forcing stores to raise prices by 10%.'
    }
  ],
  keyConcepts: [
    {
      term: 'Federal Funds Rate',
      definition: 'The interest rate at which commercial depository institutions lend reserve balances to other depository institutions overnight.',
      simpleExplanation: 'The baseline master interest rate set by the central bank that dictates the price of borrowing money across the entire economy.',
      significance: 'Primary monetary policy lever used by the Federal Reserve to regulate inflation and employment.',
      category: 'Policy Lever',
      formulaOrExample: 'Target range set by the FOMC (e.g. 5.25% - 5.50%).'
    },
    {
      term: 'Expectations-Augmented Phillips Curve',
      definition: 'An economic model demonstrating that inflation depends on expected inflation, cyclical unemployment or output gaps, and supply shock variables.',
      simpleExplanation: 'What people believe prices will do next year matters just as much as how many people are currently employed.',
      significance: 'Explains why central bank credibility and forward guidance are vital.',
      category: 'Economic Model',
      formulaOrExample: 'pi = pi^e - beta*(u - u*) + v'
    },
    {
      term: 'Quantitative Tightening (QT)',
      definition: 'A contractionary monetary policy whereby a central bank allows maturing Treasury bonds and mortgage-backed securities to roll off its balance sheet without replacement, reducing market liquidity.',
      simpleExplanation: 'The central bank vacuuming cash out of the financial system by letting its bond investments expire.',
      significance: 'Complementary tool to rate hikes for tightening monetary conditions.',
      category: 'Monetary Tool',
      formulaOrExample: 'Balance sheet runoff cap (e.g. $60B Treasuries / month).'
    }
  ],
  revisionPoints: [
    {
      topic: 'Demand-Pull vs Cost-Push & Policy Dilemma',
      highYieldFacts: [
        'Demand-pull inflation can be tackled cleanly with interest rate hikes without necessarily causing long-term structural supply damage.',
        'Cost-push inflation presents a policy dilemma: raising rates crushes demand to match contracted supply, risking deep recessions.'
      ],
      commonPitfallsOrMisconceptions: [
        'Believing that central banks can fix oil supply shortages by printing less money. Central banks cannot pump oil; they can only suppress demand.'
      ],
      potentialExamQuestions: [
        'Why does a supply-side cost-push shock create an acute trade-off between the Federal Reserve\'s dual mandates?'
      ]
    }
  ],
  flashcards: [
    {
      id: 'macro-fc-1',
      front: 'What is the crucial difference between Demand-Pull and Cost-Push inflation?',
      back: 'Demand-pull is driven by excess aggregate consumer/business demand; Cost-push is driven by supply-side input shocks (e.g. oil, wheat, wages) shifting aggregate supply left.',
      hint: 'Demand side vs Supply side.',
      tag: 'Inflation Types'
    },
    {
      id: 'macro-fc-2',
      front: 'Why is Expected Inflation considered the most dangerous term in the Phillips curve?',
      back: 'Because if expectations become unanchored, businesses pre-emptively raise prices and unions demand higher wages, making high inflation self-fulfilling regardless of economic slack.',
      hint: 'Self-fulfilling prophecy.',
      tag: 'Models'
    }
  ],
  quizQuestions: [
    {
      id: 'macro-q-1',
      question: 'Which of the following describes stagflation?',
      options: [
        'Stagnant or contracting economic output combined with high inflation and elevated unemployment.',
        'Rapid GDP growth paired with falling consumer prices.',
        'Zero interest rates with exploding asset prices.',
        'High government debt with balanced federal budgets.'
      ],
      correctOptionIndex: 0,
      explanation: 'Stagflation is the toxic combination of economic stagnation (high unemployment / low output) alongside persistent inflation, famously seen during the 1973-1979 oil shocks.',
      conceptTested: 'Stagflation Definition'
    }
  ],
  mindmap: [
    { id: 'm-root', label: 'Central Banking & Inflation', parentId: '', description: 'Macroeconomic policy framework', color: 'amber' },
    { id: 'm-types', label: '1. Inflation Sources', parentId: 'm-root', description: 'Demand vs Supply drivers', color: 'amber' },
    { id: 'm-dp', label: 'Demand-Pull', parentId: 'm-types', description: 'Excess spending & stimulus', color: 'slate' },
    { id: 'm-cp', label: 'Cost-Push (Stagflation)', parentId: 'm-types', description: 'Energy & input shocks', color: 'slate' },
    { id: 'm-trans', label: '2. Transmission Mechanism', parentId: 'm-root', description: 'How rate hikes filter into markets', color: 'indigo' },
    { id: 'm-fed', label: 'Fed Funds Rate', parentId: 'm-trans', description: 'Mortgages, corporate debt, CapEx', color: 'indigo' },
    { id: 'm-exp', label: '3. Expectations & QT', parentId: 'm-root', description: 'Credibility and balance sheet runoff', color: 'rose' }
  ]
};

export const SAMPLE_ASTRO_LECTURE: LectureData = {
  id: 'sample-astro-blackholes',
  title: 'Astrophysics: Stellar Evolution & Black Hole Thermodynamics',
  subject: 'Physics & Astronomy',
  createdAt: new Date().toISOString(),
  originalTranscript: `Welcome everyone to Introduction to Astrophysics. Today we explore the death of massive stars and the birth of nature's most enigmatic objects: Black Holes...`,
  wordCount: 1300,
  durationMinutesEstimated: 50,
  mode: 'eli5',
  starred: true,
  coreThesis: 'A star endures while core thermonuclear radiation balances inward gravitational collapse; when fuel is exhausted, the remnant mass dictates whether electron degeneracy (white dwarf), neutron degeneracy (neutron star), or an inescapable gravitational singularity (black hole) forms.',
  executiveSummary: `This lecture surveys stellar lifecycles, quantum degeneracy pressures, and relativistic black hole thermodynamics. A main sequence star resides in continuous hydrostatic equilibrium: outward thermal radiation pressure generated by hydrogen fusion balances relentless inward gravitational collapse.

When nuclear fuel is exhausted, the star's remnant core mass determines its fate. Under the Chandrasekhar Limit (1.44 solar masses), electron degeneracy pressure prevents collapse, yielding a white dwarf. Above this threshold, electron capture creates neutrons; cores between 1.44 and ~2.1 solar masses (the Tolman-Oppenheimer-Volkoff limit) stabilize as neutron stars supported by neutron degeneracy pressure.

If the collapsing core exceeds 3 solar masses, no known quantum force can arrest collapse, producing a black hole bounded by an Event Horizon at the Schwarzschild radius (R_s = 2GM/c^2). The lecture concludes with Stephen Hawking's quantum discovery: virtual particle fluctuations at the event horizon emit Hawking radiation, causing black holes to slowly radiate energy and eventually evaporate.`,
  keyTakeaways: [
    'Hydrostatic equilibrium: stars survive by balancing outward fusion radiation pressure against inward gravitational pull.',
    'The Chandrasekhar Limit (1.44 solar masses) represents the maximum mass supported by Electron Degeneracy Pressure.',
    'The TOV Limit (~2.1 solar masses) marks the threshold where Neutron Degeneracy Pressure fails, forcing collapse into a Black Hole.',
    'The Schwarzschild radius defines the Event Horizon boundary from which escape velocity exceeds the speed of light.',
    'Hawking radiation demonstrates that quantum vacuum fluctuations near event horizons cause black holes to emit thermal radiation and slowly evaporate.'
  ],
  sections: [
    {
      timestamp: '00:00 - 15:00',
      heading: 'Hydrostatic Equilibrium & Stellar Lifecycles',
      summary: 'The balance of forces in living stars and the death of low-mass stars.',
      bullets: [
        'Outward thermal radiation pressure balances inward gravitational contraction.',
        'Main sequence stars fuse hydrogen into helium in their cores.',
        'Low to medium mass stars form planetary nebulae and leave white dwarfs.'
      ],
      lecturerNoteOrAnalogy: 'A star is like a titanic thermonuclear bomb that is prevented from exploding because its own gravitational weight holds it together.'
    },
    {
      timestamp: '15:01 - 32:00',
      heading: 'Quantum Degeneracy Pressures & The Mass Limits',
      summary: 'Pauli exclusion principle, the Chandrasekhar limit, and neutron star formation.',
      bullets: [
        'Pauli Exclusion Principle prevents identical fermions from occupying the same state.',
        'Chandrasekhar Limit: 1.44 M_sun is the maximum mass for electron degeneracy.',
        'TOV Limit: ~2.1 M_sun is the maximum mass for neutron degeneracy.'
      ],
      lecturerNoteOrAnalogy: 'Electron degeneracy is like packing a subway car so full that passengers physically cannot be compressed any closer together.'
    },
    {
      timestamp: '32:01 - 50:00',
      heading: 'Event Horizons & Hawking Radiation',
      summary: 'General relativity, Schwarzschild radius, and black hole thermodynamic evaporation.',
      bullets: [
        'Schwarzschild radius: R_s = 2GM/c^2.',
        'Inside the event horizon, space-time is warped so the center is in the timelike direction.',
        'Quantum virtual particle-antiparticle pairs at horizon yield Hawking radiation.'
      ],
      lecturerNoteOrAnalogy: 'For the mass of Earth, the event horizon would be the size of a marble (9 millimeters).'
    }
  ],
  keyConcepts: [
    {
      term: 'Chandrasekhar Limit',
      definition: 'The maximum theoretical mass of a stable white dwarf star (~1.44 solar masses), above which electron degeneracy pressure cannot overcome gravitational collapse.',
      simpleExplanation: 'The cosmic weight limit for a dying star: if it weighs more than 1.44 suns, electrons get crushed into protons.',
      significance: 'Explains Type Ia supernovae and the boundary between white dwarfs and neutron stars.',
      category: 'Astrophysical Limit',
      formulaOrExample: 'M_Ch ≈ 1.44 M_☉'
    },
    {
      term: 'Schwarzschild Radius (Event Horizon)',
      definition: 'The radius of the boundary surrounding a non-rotating spherically symmetric mass within which the escape velocity exceeds the speed of light.',
      simpleExplanation: 'The point of no return around a black hole where not even light can escape.',
      significance: 'Defines the observable boundary of a black hole in general relativity.',
      category: 'Relativistic Metric',
      formulaOrExample: 'R_s = (2GM) / c^2'
    },
    {
      term: 'Hawking Radiation',
      definition: 'Blackbody thermal radiation predicted to be emitted by black holes due to quantum vacuum fluctuations near the event horizon.',
      simpleExplanation: 'Black holes leak tiny amounts of heat and slowly evaporate over trillions of years.',
      significance: 'First bridge connecting general relativity, thermodynamics, and quantum mechanics.',
      category: 'Quantum Gravity',
      formulaOrExample: 'Temperature inversely proportional to mass: T_H = ħc^3 / (8πGMk_B)'
    }
  ],
  revisionPoints: [
    {
      topic: 'Stellar Death Hierarchy',
      highYieldFacts: [
        'Core < 1.44 M_☉ -> White Dwarf (supported by Electron Degeneracy).',
        'Core 1.44 - 2.1 M_☉ -> Neutron Star (supported by Neutron Degeneracy).',
        'Core > 3 M_☉ -> Black Hole (gravity completely overcomes degeneracy).'
      ],
      commonPitfallsOrMisconceptions: [
        'Confusing the initial star mass with the final core remnant mass (a 20 solar mass star blows off most of its envelope, leaving a 3-5 solar mass core).'
      ],
      potentialExamQuestions: [
        'Derive or explain the physical meaning of the Schwarzschild radius equation R_s = 2GM/c^2.'
      ]
    }
  ],
  flashcards: [
    {
      id: 'astro-fc-1',
      front: 'What is the Chandrasekhar Limit and what is its exact approximate value?',
      back: 'The maximum mass of a white dwarf supported by electron degeneracy pressure, approximately 1.44 solar masses (M_☉).',
      hint: '19-year-old Subrahmanyan Chandrasekhar.',
      tag: 'Limits'
    },
    {
      id: 'astro-fc-2',
      front: 'What quantum phenomenon prevents a white dwarf from collapsing into a black hole?',
      back: 'Electron Degeneracy Pressure, governed by the Pauli Exclusion Principle (no two fermions can occupy the same quantum state).',
      hint: 'Pauli exclusion.',
      tag: 'Quantum Physics'
    }
  ],
  quizQuestions: [
    {
      id: 'astro-q-1',
      question: 'What physical quantum force balances gravity in a neutron star?',
      options: [
        'Neutron Degeneracy Pressure',
        'Thermal radiation pressure from hydrogen fusion',
        'Magnetic repulsion of electrons',
        'Centrifugal force from rapid rotation alone'
      ],
      correctOptionIndex: 0,
      explanation: 'Neutron stars are held in equilibrium against immense gravity by Neutron Degeneracy Pressure, resulting from the Pauli exclusion principle acting on tightly packed neutrons.',
      conceptTested: 'Neutron Star Physics'
    }
  ],
  mindmap: [
    { id: 'a-root', label: 'Stellar Evolution & Black Holes', parentId: '', description: 'Death of stars and relativistic gravity', color: 'rose' },
    { id: 'a-hydro', label: '1. Hydrostatic Equilibrium', parentId: 'a-root', description: 'Thermal fusion pressure vs gravity', color: 'slate' },
    { id: 'a-limits', label: '2. Degeneracy Limits', parentId: 'a-root', description: 'Quantum Pauli exclusion thresholds', color: 'amber' },
    { id: 'a-chandra', label: 'Chandrasekhar (1.44 M_sun)', parentId: 'a-limits', description: 'White dwarf electron limit', color: 'amber' },
    { id: 'a-tov', label: 'TOV Limit (~2.1 M_sun)', parentId: 'a-limits', description: 'Neutron star collapse threshold', color: 'amber' },
    { id: 'a-bh', label: '3. Black Holes', parentId: 'a-root', description: 'Infinite curvature & thermodynamics', color: 'rose' },
    { id: 'a-event', label: 'Schwarzschild Event Horizon', parentId: 'a-bh', description: 'R_s = 2GM/c^2', color: 'rose' },
    { id: 'a-hawk', label: 'Hawking Evaporation', parentId: 'a-bh', description: 'Quantum vacuum pair production', color: 'purple' }
  ]
};

export const PRECOMPUTED_SAMPLES: Record<string, LectureData> = {
  'sample-cs-cap': DEFAULT_PRECOMPUTED_LECTURE,
  'sample-neuro-ltp': SAMPLE_NEURO_LECTURE,
  'sample-macro-inflation': SAMPLE_MACRO_LECTURE,
  'sample-astro-blackholes': SAMPLE_ASTRO_LECTURE,
};
