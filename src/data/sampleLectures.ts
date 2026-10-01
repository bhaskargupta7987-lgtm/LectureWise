export interface SampleLecture {
  id: string;
  title: string;
  subject: string;
  duration: string;
  wordCount: number;
  previewSnippet: string;
  transcript: string;
  defaultMode: 'comprehensive' | 'exam-cram' | 'eli5' | 'executive';
}

export const SAMPLE_LECTURES: SampleLecture[] = [
  {
    id: 'sample-cs-cap',
    title: 'Distributed Systems: CAP Theorem & Consistency Models',
    subject: 'Computer Science',
    duration: '45 mins',
    wordCount: 1250,
    previewSnippet: 'Network partitions are inevitable physics. Therefore, you cannot choose CA in a real distributed network; the real choice is CP versus AP...',
    defaultMode: 'comprehensive',
    transcript: `Welcome everyone to CS 452: Distributed Systems Architecture. Today's lecture is arguably one of the most foundational topics you will ever learn for designing scalable backends: the CAP Theorem, first conjectured by Eric Brewer at Berkeley in 2000 and later formally proven by Seth Gilbert and Nancy Lynch in 2002.

Let us start by defining what distributed systems actually face in the real world. When you move away from a single monolithic database running on a high-end mainframe to hundreds or thousands of commodity servers spread across AWS regions—say Virginia, Frankfurt, and Tokyo—you run into an uncomfortable physical reality: networks are asynchronous, unpredictable, and fallible. Cables get cut by backhoes, switches get misconfigured, and fiber links suffer temporary packet loss.

This brings us to the three letters in CAP: Consistency, Availability, and Partition Tolerance.

First, Consistency. And here is where students often stumble on midterm exams: do not confuse the 'C' in CAP with the 'C' in ACID database transactions! In ACID, consistency means maintaining application-level schema invariants—like your bank account balance never dropping below zero. In CAP, Consistency means Linearizability, or atomic consistency. Every single read operation across any node must return the most recent write or an explicit error. To an external client, the entire multi-node cluster behaves as if it were a single instantaneous machine.

Second, Availability. In CAP terminology, availability does not merely mean "99.999% uptime." Brewer's theorem defines Availability as: every non-failing node must return a non-error response to every request it receives. Even if that node cannot talk to its peers, it must still serve the user's read or write without hanging indefinitely or throwing a network timeout error.

Third, Partition Tolerance. A partition occurs when the communication network breaks between two or more sets of nodes, such that Node A in Frankfurt cannot send messages to Node B in Virginia, yet both nodes are still powered on and operating normally.

Now, here is the golden punchline that you must write in your exam notes: you cannot choose "CA". Why? Because Partition Tolerance is not an optional configuration flag you toggle in an XML file! Network partitions are an immutable physical reality of operating over TCP/IP across physical geography. Therefore, when—not if—a network partition occurs, your architecture is forced into an existential trade-off: Consistency versus Availability.

Let us walk through an intuitive real-world analogy. Imagine a two-teller bank. Teller A is stationed in Paris; Teller B is stationed in London. Normally, when Alice deposits 100 Euros with Teller A in Paris, Teller A sends a quick telegram across the English Channel to Teller B, updating the ledger. But suddenly, the undersea telegraph cable is severed! A network partition has struck.

Now, Bob walks into the London branch and asks Teller B: "How much money does Alice have?" 
Teller B has two choices:
Choice 1: Teller B says, "I cannot communicate with the Paris branch right now, so to prevent showing you stale or wrong money, I refuse to answer." That is CP (Consistency over Availability). Systems like Apache HBase, Zookeeper, and Google Cloud Spanner choose CP. Spanner achieves high availability in practice using TrueTime GPS and atomic clocks, but fundamentally prioritizes strict serializability.

Choice 2: Teller B says, "Based on my last local ledger before the cable snapped, Alice has 50 Euros, so here is your answer!" That is AP (Availability over Consistency). Systems like Amazon DynamoDB or Apache Cassandra favor AP. They guarantee the client gets an immediate response, but allow temporary data divergence, resolving it later using techniques like vector clocks, conflict-free replicated data types (CRDTs), or Last-Write-Wins.

Remember the PACELC theorem as an extension: If there is a Partition (P), trade-off Availability (A) versus Consistency (C); Else (E), when the network is running normally, trade-off Latency (L) versus Consistency (C).

Next Tuesday, we will dive into Raft consensus algorithm and Paxos. Review your lecture notes on linearizability before then!`
  },
  {
    id: 'sample-neuro-ltp',
    title: 'Neurobiology: Long-Term Potentiation & Synaptic Plasticity',
    subject: 'Neurobiology & Medicine',
    duration: '50 mins',
    wordCount: 1380,
    previewSnippet: 'How does an evanescent thought or temporary classroom experience transform into a permanent structural memory? The answer lies in the hippocampal trisynaptic circuit...',
    defaultMode: 'exam-cram',
    transcript: `Good morning class. Today in Cellular Neurobiology, we are addressing one of the most magnificent questions in science: how does biological tissue learn? How does physical wiring in your brain encode the memory of your first bicycle ride or the biochemical formula you memorized for this course?

The cellular foundation of learning and memory is termed Synaptic Plasticity, famously conceptualized by Donald Hebb in 1949: "Neurons that fire together, wire together." Today, we examine the molecular mechanics of Long-Term Potentiation, or LTP, discovered in the rabbit hippocampus by Terje Lømo and Timothy Bliss in 1973.

We will focus our lens on the CA1 pyramidal neurons in the hippocampus, which receive excitatory glutamatergic inputs from CA3 Schaffer collaterals. 

On the postsynaptic dendritic spine, two critical ionotropic glutamate receptors coexist side by side: the AMPA receptor and the NMDA receptor.

Under baseline, low-frequency transmission, presynaptic vesicles release glutamate into the synaptic cleft. Glutamate binds to both AMPA and NMDA receptors. AMPA receptors open immediately, allowing Sodium (Na+) ions to rush down their electrochemical gradient into the postsynaptic cell, causing a modest excitatory postsynaptic potential, or EPSP.

However, at normal resting membrane potentials—around negative 70 millivolts—the NMDA receptor channel is physically blocked by an extracellular Magnesium ion (Mg2+). Think of the magnesium ion like a stubborn cork stuck in the neck of a wine bottle. Even though glutamate is bound to the NMDA receptor, ions cannot pass through because the negative voltage inside the cell electrostatically pulls and lodges the positively charged Mg2+ ion directly in the pore.

Now, consider what happens during high-frequency stimulation, such as a tetanus train of 100 action potentials per second, or when you are actively focusing intently on studying new material. Rapid, repetitive glutamate release causes massive, cumulative sodium influx through AMPA receptors. This strongly depolarizes the dendritic spine, bringing the local membrane potential up to approximately negative 30 or negative 20 millivolts.

This positive internal voltage repels the positively charged magnesium ion! The Mg2+ cork is ejected from the NMDA receptor pore by electrostatic repulsion. 

Because the NMDA receptor requires two simultaneous events—presynaptic glutamate binding AND postsynaptic membrane depolarization—neurobiologists call the NMDA receptor a molecular coincidence detector.

Once unblocked, the NMDA channel permits an influx of Calcium ions (Ca2+). Calcium acts as a potent intracellular second messenger. It immediately activates calcium/calmodulin-dependent protein kinase II, or CaMKII. 

CaMKII performs two critical actions that define early-phase LTP:
First, it phosphorylates existing AMPA receptors, significantly increasing their single-channel ion conductance.
Second, CaMKII drives exocytosis of reserve AMPA receptors stored in intracellular endosomes, inserting dozens of new AMPA receptors into the postsynaptic density membrane.

Now, during the next casual release of glutamate, the postsynaptic spine has twice as many AMPA receptors. The identical stimulus yields a much larger EPSP. The synapse has been physically potentiated!

For late-phase LTP lasting weeks or years, prolonged calcium activates adenylyl cyclase, boosting cyclic AMP and activating Protein Kinase A (PKA), which translocates to the cell nucleus to phosphorylate CREB (cAMP response element-binding protein). CREB initiates gene transcription, synthesizing new scaffolding proteins, actin remodelers, and BDNF (Brain-Derived Neurotrophic Factor), leading to permanent structural enlargement and bifurcated dendritic spines.

Key clinical takeaway: drugs that block NMDA receptors, such as ketamine or phencyclidine, profoundly inhibit LTP induction and impair new episodic memory formation.`
  },
  {
    id: 'sample-macro-inflation',
    title: 'Macroeconomics: Monetary Policy, Central Banks & Inflation Dynamics',
    subject: 'Economics & Finance',
    duration: '40 mins',
    wordCount: 1190,
    previewSnippet: 'Milton Friedman proclaimed that inflation is always and everywhere a monetary phenomenon. But the 21st-century reality is far more intricate...',
    defaultMode: 'executive',
    transcript: `Welcome back to Macroeconomic Theory. Today we turn to central banking, the Federal Reserve, and the dynamics of inflation. 

Milton Friedman famously asserted that "inflation is always and everywhere a monetary phenomenon." While that dictum captures the danger of Weimar Germany or Zimbabwe printing trillions of bank notes, contemporary central bankers operate in an economy shaped by globalized supply chains, inflation expectations, and financial asset balance sheets.

Let us dissect the two primary flavors of inflation: Demand-Pull and Cost-Push.

Demand-pull inflation occurs when aggregate demand outpaces aggregate productive capacity: "too much money chasing too few goods." Consider the massive fiscal stimulus checks and zero-interest rate policies during post-pandemic recovery: household disposable incomes surged, consumers ordered goods en masse, and factories operating at full capacity simply raised prices to clear the market.

Cost-push inflation, on the other hand, originates on the supply side. Imagine an oil embargo or geopolitical disruption in the Strait of Hormuz. Energy is an essential input for agriculture, transport, manufacturing, and heating. When input costs spike, aggregate supply shifts leftward, producing higher consumer prices even while economic output contracts. This treacherous combination—stagnant growth paired with high inflation—is what we call stagflation, as witnessed in the 1970s.

Now, how does a modern central bank combat rising inflation? Their primary lever is the Federal Funds Rate—the interest rate at which commercial depository institutions lend reserve balances to each other overnight.

When the Fed implements monetary tightening, it raises the target policy rate. This cascades through the entire financial transmission mechanism:
1. Commercial banks raise the Prime Rate and mortgage rates. A 30-year fixed mortgage climbing from 3% to 7% drastically dampens housing demand and construction employment.
2. The cost of corporate debt financing escalates. Companies delay capital expenditures, pause hiring, and cut discretionary budgets.
3. Consumer borrowing on credit cards and auto loans becomes expensive, encouraging household saving rather than immediate consumption.

Consequently, aggregate demand cools, unemployment ticks upward, and businesses lose pricing power, decelerating consumer price increases.

We model this dynamic using the modern expectations-augmented Phillips Curve:
Inflation equals Expected Inflation minus beta times the Output Gap (or cyclical unemployment), plus supply shock terms.
Notice that the single most vital variable in that equation is Expected Inflation! If workers and businesses expect 8% inflation next year, labor unions demand 8% wage hikes, and companies pre-emptively raise catalog prices by 8%. Inflation becomes self-fulfilling! This is why central bank credibility and forward guidance are paramount.

Finally, we have Quantitative Tightening (QT), where the central bank shrinks its balance sheet by allowing maturing Treasury bonds and Mortgage-Backed Securities to roll off without reinvestment, directly draining liquidity from the commercial banking sector.

For Thursday's seminar, please read the Jackson Hole symposium papers on the neutral interest rate, r-star.`
  },
  {
    id: 'sample-astro-blackholes',
    title: 'Astrophysics: Stellar Evolution & Black Hole Thermodynamics',
    subject: 'Physics & Astronomy',
    duration: '50 mins',
    wordCount: 1300,
    previewSnippet: 'A star is an ongoing thermonuclear war against its own gravity. When the nuclear fuel runs out, gravity always wins...',
    defaultMode: 'eli5',
    transcript: `Welcome everyone to Introduction to Astrophysics. Today we explore the death of massive stars and the birth of nature's most enigmatic objects: Black Holes.

To understand a black hole, you must first appreciate what a star is doing throughout its millions or billions of years of life. A main sequence star like our Sun is locked in a continuous state of hydrostatic equilibrium. Outward thermal radiation pressure generated by hydrogen-to-helium fusion in the stellar core precisely balances the relentless inward crushing force of gravity. A star is literally a titanic thermonuclear bomb that doesn't explode because its own weight holds it together.

However, nuclear fuel is finite. In low to medium mass stars (up to about 8 solar masses), once helium fusion ceases, the star sloughs off its outer envelope as a planetary nebula, leaving behind a white dwarf. What prevents the white dwarf from collapsing to a point? The answer is Quantum Mechanics: Electron Degeneracy Pressure, governed by the Pauli Exclusion Principle. Two identical fermions cannot occupy the same quantum state.

In 1930, nineteen-year-old Subrahmanyan Chandrasekhar calculated the relativistic limit for this pressure on a boat ride to England: if the stellar remnant core exceeds 1.44 solar masses—the Chandrasekhar Limit—the inward gravitational force overcomes electron degeneracy. Electrons are crushed into protons via electron capture, forming neutrons and neutrinos.

If the core is between 1.44 and approximately 2.1 solar masses (the Tolman-Oppenheimer-Volkoff or TOV limit), it stabilizes as an ultra-dense Neutron Star, supported by Neutron Degeneracy Pressure. One teaspoon of neutron star material weighs as much as Mount Everest!

What if the collapsing iron core exceeds 3 solar masses?
Physics has no known force or degeneracy pressure capable of halting the collapse. The star collapses catastrophically into an infinite gravitational singularity: a Black Hole.

Surrounding the singularity is the Event Horizon, defined mathematically by the Schwarzschild radius: R_s equals 2 times G times Mass divided by c squared. For an object with the mass of the Earth, the event horizon radius would be roughly 9 millimeters—the size of a marble! Once any matter or light passes inside this boundary, the escape velocity exceeds the speed of light in vacuum. In fact, inside the event horizon, space-time is warped so severely that the radial coordinate toward the singularity becomes a timelike direction; moving toward the center is as inevitable as moving into the future.

In 1974, Stephen Hawking combined general relativity and quantum field theory to make a shocking discovery: black holes are not completely black! Near the event horizon, vacuum quantum fluctuations continuously create virtual particle-antiparticle pairs. Occasionally, one particle falls into the event horizon with negative energy relative to an observer at infinity, while the other escapes as real thermal radiation—Hawking Radiation.

Consequently, isolated black holes slowly radiate energy, lose mass, and eventually evaporate over unfathomable timescales—roughly 10 to the 67th power years for a solar-mass black hole!

Next week we will examine gravitational waves detected by LIGO from binary black hole mergers.`
  }
];
