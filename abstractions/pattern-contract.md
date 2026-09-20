# Canonical Behavioral Pattern Contract

**State:** [draft]  
**Purpose:** define how Hadosh Academy describes reusable harness behavior without prescribing one implementation.

Copy this structure into a new pattern only after a real behavior and evidence source have been identified. Remove unused guidance rather than publishing empty sections.

## Pattern name [draft]

### Behavioral objective

State what must become reliably true for the user. Describe the behavior rather than the historical mechanism that first implemented it.

### User value

Explain the burden reduced, capability added, or authority preserved. Use language a nontechnical user can connect to their own work.

### Problem and trigger

Name the conditions that make the behavior relevant and the events that activate it. Distinguish a continuing responsibility from a one-time action.

### Inputs

List the information, events, state, evidence, or user choices the pattern consumes. Mark which inputs are authoritative, inferred, untrusted, optional, or protected.

### Outputs

List artifacts, state changes, questions, decisions, or signals the pattern produces. Output must not imply acceptance, publication, completion, or authority unless those transitions are explicit.

### Owned state and source of truth

State exactly what durable state the pattern owns, where it lives conceptually, who may change it, and how adjacent components read it. If the realization duplicates state, name the synchronization owner.

### Decisions and transitions

Describe the logical states and legal transitions. Include backward, retry, waiting, cancellation, and terminal paths where they exist. Do not force a state machine when simpler logic is sufficient.

### Authority and protected actions

Separate capability from authority. Name what the agent may do autonomously, what requires user approval, and what no component may infer from conversation alone.

### Soft guidance and deterministic enforcement

Identify which behavior can remain instruction-level guidance and which boundaries require code, permissions, schemas, hooks, protected branches, validation, or another mechanism outside model discretion.

### Composition contract

List:

- required dependencies;
- optional complements;
- incompatible assumptions;
- events or data exposed to adjacent patterns;
- the owner of every cross-pattern decision;
- removal behavior and residual state.

### Failure, recovery, and rollback

Describe missing context, stale state, model error, partial execution, duplicate events, unavailable services, corrupt data, lost credentials, and user disagreement as relevant. State how the user can stop, recover, retry, or revert.

### Verification and acceptance evidence

Define observable evidence that the behavior works. Distinguish structural tests, representative simulation, authenticated local acceptance, and lived-use evidence. A model assertion is not verification.

### Adaptation questions

Ask only the questions that materially change the local realization:

- What terminology does the user use?
- What responsibility and evidence are involved?
- Which runtime capabilities exist?
- What consequences require deterministic protection?
- What must remain local or private?
- What does completion mean to the user?
- Which failure would be unacceptable?

### Known realizations and counterexamples

Link runtime-specific implementations, experiments, failures, and rejected approaches. Preserve privacy and identify whether each is current, target, or research.

### Maturity

Record separately:

- definition state: [draft] or [consolidated];
- evidence state: conceptual, observed, compared, demonstrated, or reusable;
- realization state by adapter: current, target, research, unsupported, or unknown.

### Avoid

List aliases, shortcuts, and implementation assumptions that would collapse an important distinction.

## First candidate pattern families

The initial program will investigate these as independent contracts:

- persistent responsibility;
- continuity and resumption;
- context selection and routing;
- memory admission and correction;
- authority gates and protected actions;
- tool permissions;
- verification and evidence;
- stopping, waiting, and continuation;
- failure recovery and rollback;
- condensation and knowledge promotion;
- instruction evolution from error;
- provenance and privacy boundaries;
- compartment isolation;
- multi-channel engagement;
- scheduling and event-triggered work;
- user-visible operational state;
- model replacement and adapter compatibility;
- human and agent handoff;
- conflict resolution;
- confidence-gated probabilistic decisioning.
