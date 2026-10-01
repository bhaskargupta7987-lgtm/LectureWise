import { LectureData } from '../types/lecture';

export const DEFAULT_PRECOMPUTED_LECTURE: LectureData = {
  id: 'lecture-precomputed-cap',
  title: 'Distributed Systems: CAP Theorem & Consistency Tradeoffs',
  subject: 'Computer Science',
  createdAt: new Date().toISOString(),
  originalTranscript: `Welcome everyone to CS 452: Distributed Systems Architecture. Today's lecture is arguably one of the most foundational topics you will ever learn for designing scalable backends: the CAP Theorem, first conjectured by Eric Brewer at Berkeley in 2000 and later formally proven by Seth Gilbert and Nancy Lynch in 2002...`,
  wordCount: 1250,
  durationMinutesEstimated: 45,
  mode: 'comprehensive',
  starred: true,
  coreThesis: 'In a real-world asynchronous distributed network, network partitions are an unavoidable physical reality; architects must intentionally choose between strict Linearizable Consistency (CP) or high Availability (AP) during failures.',
  executiveSummary: `This lecture provides a rigorous examination of Eric Brewer's CAP Theorem and its foundational role in modern distributed database and backend engineering. The professor begins by dismantling the naive assumption of reliable physical networks, arguing that geographically dispersed servers running across international data centers will inevitably encounter hardware cuts, routing misconfigurations, and packet loss.

The lecture carefully disambiguates the terms: Consistency in CAP refers strictly to Linearizability (atomic, single-machine illusion), contrasting it with ACID consistency (schema preservation). Availability guarantees that every non-failing node returns a non-error response without hanging. Partition Tolerance represents the network's resilience when message channels sever.

Crucially, the professor establishes why "CA systems" cannot exist in distributed physical networks: partition tolerance is not an optional toggle. When a partition strikes, engineers must choose between CP (refusing stale reads to preserve truth, as in Google Spanner, Apache HBase, and Zookeeper) or AP (serving immediate local data and accepting temporary divergence, as in Amazon DynamoDB and Cassandra). The lecture concludes with the PACELC theorem, guiding trade-offs during steady-state normal operations.`,
  keyTakeaways: [
    'You cannot "choose CA": Partition Tolerance (P) is an immutable physical reality of network cables, fiber cuts, and packet loss.',
    'CAP Consistency is Linearizability (every read returns the most recent write), strictly distinct from ACID Consistency (maintaining database constraints).',
    'During network partitions, systems must choose between CP (preserving truth by rejecting stale operations) and AP (maintaining uptime by serving stale or divergent data).',
    'PACELC theorem extends CAP: during a Partition (P), trade off Availability (A) vs Consistency (C); Else (E) during normal operations, trade off Latency (L) vs Consistency (C).',
    'Real-world databases fall into deliberate camps: Google Spanner / Zookeeper / Raft prioritize CP, whereas Cassandra / DynamoDB prioritize AP with eventual consistency.'
  ],
  sections: [
    {
      timestamp: '00:00 - 08:30',
      heading: 'The Physical Reality of Distributed Networks',
      summary: 'Transitioning from monolithic mainframes to multi-datacenter clusters introduces asynchronous networks prone to fiber cuts and packet drops.',
      bullets: [
        'Commodity hardware spread across worldwide regions cannot guarantee instant communication.',
        'Asynchronous network latency is unbounded.',
        'CAP Theorem was proposed by Eric Brewer in 2000 and mathematically proven by Gilbert & Lynch in 2002.'
      ],
      lecturerNoteOrAnalogy: 'Think of fiber cables running under city streets: a single construction backhoe digging in the wrong spot creates an instantaneous network partition between Virginia and Tokyo.'
    },
    {
      timestamp: '08:31 - 21:15',
      heading: 'Defining the 3 Pillars: Consistency, Availability, Partition Tolerance',
      summary: 'Precise definitions of C, A, and P, highlighting common student misconceptions on examinations.',
      bullets: [
        'Consistency = Linearizability (atomic, sequential consistency). Every read returns the latest write or an error.',
        'ACID Consistency vs CAP Consistency: ACID is about application business rules (no negative balance); CAP is about multi-node state synchronization.',
        'Availability = Every non-failing node must return a non-error response without infinite latency.',
        'Partition Tolerance = The distributed cluster continues operating despite communication loss between sub-clusters.'
      ],
      lecturerNoteOrAnalogy: 'In CAP, availability does not mean 99.999% SLA; it means a live node must answer right now without throwing an error or waiting on unreachable peers.'
    },
    {
      timestamp: '21:16 - 34:40',
      heading: 'The Fallacy of "CA" & The Forced Trade-Off',
      summary: 'Why CA is an impossible fantasy in networked environments, illustrated through the Bank Teller across the English Channel analogy.',
      bullets: [
        'Partition tolerance is not an optional switch you turn on or off.',
        'When the network severs, a node must either deny service (CP) or answer with potentially stale local state (AP).',
        'CP databases: Google Spanner, Apache HBase, Apache ZooKeeper, CockroachDB, Raft/Paxos clusters.',
        'AP databases: Amazon DynamoDB, Apache Cassandra, CouchDB.'
      ],
      lecturerNoteOrAnalogy: 'The Two-Teller Bank: When the telegraph cable under the English Channel snaps, does the London teller refuse to tell Bob his balance (CP), or give him yesterday\'s balance and risk an overdraft (AP)?'
    },
    {
      timestamp: '34:41 - 45:00',
      heading: 'Beyond CAP: The PACELC Theorem & Eventual Consistency',
      summary: 'Daniel Abadi\'s PACELC theorem, Vector Clocks, CRDTs, and modern consensus algorithms.',
      bullets: [
        'PACELC: If Partition (P) -> Availability (A) vs Consistency (C); Else (E) -> Latency (L) vs Consistency (C).',
        'In normal operations without partitions, linearizable consistency requires multi-node roundtrips, increasing client latency.',
        'AP systems utilize techniques like CRDTs, vector clocks, and Last-Write-Wins (LWW) to reconcile divergent states after partitions heal.'
      ],
      lecturerNoteOrAnalogy: 'Even when the network is 100% healthy, waiting for 5 nodes across the globe to agree on a write adds 150ms of speed-of-light latency to your mobile app.'
    }
  ],
  keyConcepts: [
    {
      term: 'Linearizability (CAP Consistency)',
      definition: 'A consistency model where all operations appear to execute atomically at a specific point in time between their invocation and response, ensuring all clients observe the same monotonic state sequence.',
      simpleExplanation: 'The entire multi-server database behaves as if there is only one single instantaneous computer.',
      significance: 'Prevents reading stale data or phantom reads across different worldwide users.',
      category: 'Core Principle',
      formulaOrExample: 'Read(x) after Write(x, 5) returns 5 on any server cluster-wide.'
    },
    {
      term: 'Network Partition',
      definition: 'A fault condition in a distributed system where communication links fail, splitting the cluster into two or more isolated subsets of nodes that can no longer exchange messages.',
      simpleExplanation: 'The wire between Server Room A and Server Room B is cut, but both rooms still have electricity and are running.',
      significance: 'The catalyst event that triggers the mandatory CAP trade-off.',
      category: 'Fault Model',
      formulaOrExample: 'Node A sends packet to Node B -> TCP timeout / link severed.'
    },
    {
      term: 'CP (Consistency + Partition Tolerance)',
      definition: 'A distributed system architecture that prioritizes linearizability during network partitions by refusing or failing requests on nodes that cannot reach a consensus quorum.',
      simpleExplanation: 'If a server cannot guarantee it has the latest truth, it tells you "Error: network partition" instead of giving you a wrong answer.',
      significance: 'Essential for financial ledgers, banking balances, booking systems, and distributed locks.',
      category: 'Architectural Pattern',
      formulaOrExample: 'Examples: Google Spanner, Apache ZooKeeper, etcd.'
    },
    {
      term: 'AP (Availability + Partition Tolerance)',
      definition: 'An architecture that ensures every surviving node continues to accept reads and writes during partitions, allowing temporary divergence of state across partitions.',
      simpleExplanation: 'Keep the app running and let users like, tweet, or add to cart; we will sort out conflicting edits later when the network reconnects.',
      significance: 'Essential for social feeds, shopping carts, analytics, and high-uptime global services.',
      category: 'Architectural Pattern',
      formulaOrExample: 'Examples: Apache Cassandra, Amazon DynamoDB, CouchDB.'
    },
    {
      term: 'PACELC Theorem',
      definition: 'An extension to the CAP theorem formulated by Daniel Abadi stating that if there is a Partition (P), trade off Availability (A) vs Consistency (C); Else (E), trade off Latency (L) vs Consistency (C).',
      simpleExplanation: 'Even when nothing is broken, you still have to choose: do you want answers to be blazing fast (low latency), or 100% perfectly synced (high consistency)?',
      significance: 'Explains the design trade-offs of distributed databases during day-to-day normal operation.',
      category: 'Theorem',
      formulaOrExample: 'P-A/C + E-L/C'
    },
    {
      term: 'Eventual Consistency',
      definition: 'A consistency model guaranteeing that, in the absence of new updates, all replicas will eventually converge to the same value.',
      simpleExplanation: 'If everyone stops typing, all servers will eventually agree on the final text.',
      significance: 'The mathematical underpinning of AP databases and distributed collaborative software.',
      category: 'Consistency Model',
      formulaOrExample: 'Reconciled via CRDTs (Conflict-free Replicated Data Types) or Vector Clocks.'
    }
  ],
  revisionPoints: [
    {
      topic: 'Exam Trap: ACID vs CAP Consistency',
      highYieldFacts: [
        'The "C" in ACID is application-level invariant preservation (e.g., balance >= 0, foreign key integrity).',
        'The "C" in CAP is strictly Linearizability (atomic chronological consistency across concurrent replicas).',
        'A system can be ACID compliant on a single node without being CAP consistent across a network.'
      ],
      commonPitfallsOrMisconceptions: [
        'Confusing Brewer\'s Availability with High Availability (99.999% SLA uptime). CAP availability requires non-error responses from ANY non-failing node.',
        'Writing that an architect can "choose CA". CA does not exist in any networked distributed system.'
      ],
      potentialExamQuestions: [
        'Explain why a distributed database cannot simultaneously guarantee Linearizability, 100% Availability, and Partition Tolerance in the presence of an asynchronous network fault.',
        'Differentiate between the Consistency guarantees of ACID versus CAP.'
      ]
    },
    {
      topic: 'Real-World Database Categorization',
      highYieldFacts: [
        'ZooKeeper, etcd, and Consul use consensus protocols (ZAB / Raft) and are strictly CP.',
        'Cassandra and DynamoDB use peer-to-peer hashing rings with tunable consistency (Quorum reads/writes) and are primarily AP.',
        'Google Cloud Spanner implements TrueTime hardware GPS/atomic clocks to achieve CP while delivering high practical availability.'
      ],
      commonPitfallsOrMisconceptions: [
        'Assuming Spanner breaks the CAP theorem: it does not break CAP; when network partitions occur, Spanner sacrifices availability to preserve consistency.'
      ],
      potentialExamQuestions: [
        'A global e-commerce retail platform experiences an undersea cable sever between EU and US. Contrast the user experience under an AP design versus a CP design for the checkout cart.'
      ]
    }
  ],
  flashcards: [
    {
      id: 'fc-1',
      front: 'What does the "C" in CAP Theorem stand for, and what is its formal definition?',
      back: 'Consistency, formally defined as Linearizability (atomic consistency). Every read operation must return the value of the most recent write or throw an error.',
      hint: 'It is NOT the same as the "C" in ACID transactions!',
      tag: 'Definitions'
    },
    {
      id: 'fc-2',
      front: 'Why is "CA" (Consistency + Availability) considered an impossible architecture in real distributed networks?',
      back: 'Because Partition Tolerance (P) is an immutable physical property of physical networks (cables cut, router failures). You cannot choose not to have partitions; you can only choose how to behave when one happens.',
      hint: 'Think about physical fiber cables and packet loss.',
      tag: 'Core Principle'
    },
    {
      id: 'fc-3',
      front: 'What is the definition of Availability under Brewer\'s CAP theorem?',
      back: 'Every non-failing node must return a non-error response to every request it receives (no timeouts, no infinite blocking, no explicit error codes).',
      hint: 'It does not mean 5 nines uptime.',
      tag: 'Definitions'
    },
    {
      id: 'fc-4',
      front: 'In the Two-Teller bank analogy, what action does a CP system take when the telegraph cable snaps?',
      back: 'The disconnected teller refuses to answer Bob\'s balance inquiry to prevent reading stale data or allowing an overdraft.',
      hint: 'Safety over service.',
      tag: 'Analogies'
    },
    {
      id: 'fc-5',
      front: 'What does the PACELC theorem add to the CAP theorem?',
      back: 'It addresses normal operations: If Partition (P) -> Availability (A) vs Consistency (C); Else (E) -> Latency (L) vs Consistency (C).',
      hint: 'What happens when there is NO partition?',
      tag: 'Theorems'
    },
    {
      id: 'fc-6',
      front: 'Name two widely used CP distributed systems and two widely used AP systems.',
      back: 'CP: Google Spanner, Apache ZooKeeper, etcd. AP: Apache Cassandra, Amazon DynamoDB, CouchDB.',
      hint: 'Consensus/locks vs ring/shopping cart.',
      tag: 'Database Systems'
    },
    {
      id: 'fc-7',
      front: 'How does an AP database reconcile diverging data once a network partition heals?',
      back: 'Using conflict resolution mechanisms such as Vector Clocks, CRDTs (Conflict-free Replicated Data Types), or Last-Write-Wins (LWW).',
      hint: 'Data structures that merge deterministically.',
      tag: 'Replication'
    },
    {
      id: 'fc-8',
      front: 'How does Google Spanner minimize latency while strictly adhering to CP linearizability?',
      back: 'By utilizing TrueTime API—synchronized GPS receivers and atomic clocks in data centers that bound time uncertainty (epsilon).',
      hint: 'Hardware clocks and GPS.',
      tag: 'Modern Architecture'
    }
  ],
  quizQuestions: [
    {
      id: 'quiz-1',
      question: 'A distributed database has two replicas, Node 1 in New York and Node 2 in London. A fiber cut severs their connection. A client attempts to write data to Node 1, and another client immediately reads from Node 2. If the system is CP, what happens?',
      options: [
        'Node 2 returns the stale old value immediately to maintain uptime.',
        'Node 2 rejects the read request or returns an error because it cannot verify the latest write with Node 1.',
        'Node 2 magically receives the write via quantum entanglement.',
        'Node 1 and Node 2 both crash automatically.'
      ],
      correctOptionIndex: 1,
      explanation: 'In a CP system, Consistency (Linearizability) is prioritized over Availability. Because Node 2 is isolated from Node 1 and cannot verify if a newer write occurred, it must refuse or fail the request rather than serve stale data.',
      conceptTested: 'CP Architectural Behavior'
    },
    {
      id: 'quiz-2',
      question: 'How does "Consistency" in the CAP theorem differ from "Consistency" in ACID database transactions?',
      options: [
        'There is no difference; they are exact synonyms in computer science literature.',
        'ACID consistency refers to atomic cluster replication; CAP consistency refers to foreign key constraints.',
        'CAP consistency means Linearizability (every read sees the latest write); ACID consistency means preserving application-level business invariants.',
        'CAP consistency is only for SQL databases; ACID consistency is only for NoSQL.'
      ],
      correctOptionIndex: 2,
      explanation: 'In ACID, Consistency means transactions preserve integrity constraints (e.g. account balances cannot drop below zero). In CAP, Consistency specifically denotes Linearizability—the external illusion of a single atomic state copy across all nodes.',
      conceptTested: 'CAP vs ACID Disambiguation'
    },
    {
      id: 'quiz-3',
      question: 'According to the PACELC theorem, what must a distributed system trade off when the network is operating normally with NO partitions?',
      options: [
        'Security versus Privacy',
        'Cost versus Storage capacity',
        'Latency versus Consistency',
        'Throughput versus Encryption strength'
      ],
      correctOptionIndex: 2,
      explanation: 'In the PACELC theorem, "E" stands for Else (normal operation): systems must trade off Latency (L) versus Consistency (C). To get strict consistency, nodes must coordinate over the network, adding roundtrip latency.',
      conceptTested: 'PACELC Theorem'
    },
    {
      id: 'quiz-4',
      question: 'Why is it technically incorrect for a cloud provider to advertise their database as a "CA" system across multi-region deployments?',
      options: [
        'Because multi-region deployments operate over asynchronous physical networks where network partitions are an inevitable physical reality.',
        'Because CA systems require quantum computing to operate.',
        'Because California (CA) data privacy laws forbid it.',
        'Because all cloud databases are required to run SQLite.'
      ],
      correctOptionIndex: 0,
      explanation: 'Partition Tolerance is not a feature you can disable. Because physical networks will experience packet loss, cuts, and routing errors, any distributed system running across multiple machines MUST be partition-tolerant, making CA an impossible option across network boundaries.',
      conceptTested: 'Partition Tolerance Reality'
    }
  ],
  mindmap: [
    { id: 'm-root', label: 'CAP Theorem in Distributed Systems', parentId: '', description: 'Foundational trade-off theorem for distributed data stores', color: 'indigo' },
    { id: 'm-phys', label: '1. Asynchronous Networks', parentId: 'm-root', description: 'Packet loss, latency, and physical fiber cuts', color: 'slate' },
    { id: 'm-part', label: 'Partition Tolerance (P)', parentId: 'm-phys', description: 'Non-negotiable reality of networking', color: 'slate' },
    
    { id: 'm-trade', label: '2. The Fundamental Trade-off', parentId: 'm-root', description: 'When a partition occurs, choose CP or AP', color: 'amber' },
    { id: 'm-cp', label: 'CP: Consistency Focus', parentId: 'm-trade', description: 'Linearizable truth; reject stale queries', color: 'rose' },
    { id: 'm-spanner', label: 'Spanner, ZooKeeper, etcd', parentId: 'm-cp', description: 'Raft consensus & TrueTime clocks', color: 'rose' },
    
    { id: 'm-ap', label: 'AP: Availability Focus', parentId: 'm-trade', description: 'Always respond; accept temporary divergence', color: 'emerald' },
    { id: 'm-cass', label: 'Cassandra, DynamoDB', parentId: 'm-ap', description: 'Eventual consistency, CRDTs, Vector clocks', color: 'emerald' },

    { id: 'm-ext', label: '3. Extensions & Nuance', parentId: 'm-root', description: 'Modern understanding beyond naive 3-letter model', color: 'purple' },
    { id: 'm-pacelc', label: 'PACELC Theorem', parentId: 'm-ext', description: 'Else (normal): Latency vs Consistency', color: 'purple' },
    { id: 'm-acid', label: 'ACID vs CAP Consistency', parentId: 'm-ext', description: 'Invariants vs Linearizability', color: 'cyan' }
  ]
};
