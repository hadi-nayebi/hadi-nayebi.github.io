# Foundation Terms

**Cluster state:** [draft]  
**Purpose:** establish the smallest shared vocabulary needed before the Academy defines detailed harness anatomy or reusable behavioral patterns.

These entries are proposed definitions. They are not consolidated until Hadi explicitly aligns with them.

## Model [draft]

**Definition.** A model is a learned computational system that transforms supplied input into an inference, prediction, representation, or generated output.

**Role in the harness.** The model supplies general learned capability. It may interpret language, recognize patterns, estimate likely outcomes, generate candidate actions, or support decisions. The harness determines how that capability receives context, which tools it can reach, what state persists, which actions require authority, and how results are verified.

**Boundary and invariants.** A model is not the complete agent. It does not, by itself, establish durable identity, local memory, job continuity, permissions, recovery, or ownership. A model may be commercial or open-weight, remote or local, general or specialized. Replacing the model may change capability, cost, speed, privacy, and compatibility without necessarily replacing the user's harness.

A future model may produce tokens, typed decisions, embeddings, actions, or another form of output. Hadosh Academy therefore uses **model** as the broad class and reserves **LLM** for one important current subclass.

**Relationships.** A model is accessed through a [runtime](#runtime-draft), operates inside a [harness](#harness-draft), and contributes capability to an [agent](#agent-draft).

**Adaptation questions.** Where does inference run? What inputs leave the user's environment? Which outputs are probabilistic? Can the model be replaced? What harness behavior depends on provider-specific features?

**Evidence and realization.** Conceptual; demonstrated across current hosted and local inference systems.

**Avoid.** “The model is the agent,” model intelligence as proof of authority, or model openness as proof that the surrounding harness is open.

## Large language model (LLM) [draft]

**Definition.** An LLM is a model trained to predict or generate language tokens from context, often with additional training that supports instruction-following, tool selection, reasoning-like behavior, or structured output.

**Role in the harness.** In many current harnesses, the LLM is the general reasoning and language operator. It interprets instructions and state, proposes plans, communicates with the user, selects available tools, and helps crystallize conversation into files or software.

**Boundary and invariants.** The LLM remains probabilistic. Fluent output does not prove factual correctness, policy compliance, permission, execution, or completion. The surrounding harness must expose authoritative state, constrain side effects, preserve continuity, and verify important claims.

An LLM may need a thick harness because it does not retain dependable local state across sessions. A future model may internalize more procedure or use a different output mechanism, which could make parts of the harness thinner. Practical agency will still require some interface connecting learned capability to context, state, tools, authority, action, and verification.

**Relationships.** LLM is a subclass of [model](#model-draft). It is animated through a [runtime](#runtime-draft) and becomes part of an [agent](#agent-draft) only when joined to a harness and a responsibility.

**Adaptation questions.** Which context limits and tool semantics apply? Does the runtime support hooks, permissions, structured output, resumable sessions, or local inference? Which guarantees must remain outside model discretion?

**Evidence and realization.** Conceptual and observed across Claude, Codex, Qwen, OpenCode, and other current systems.

**Avoid.** “LLM equals agent,” “token generation equals action,” or assuming a larger context window eliminates the need for durable state.

## Runtime [draft]

**Definition.** A runtime is the operational environment that connects a model to context, tools, processes, interfaces, and execution.

**Role in the harness.** The runtime starts or resumes sessions, assembles model input, exposes tools, returns tool results, manages events, and may enforce permissions or lifecycle controls. It is the mechanism through which model output can affect the environment.

**Boundary and invariants.** A runtime is not identical to the model or the complete harness. A CLI, API orchestration service, desktop application, local server, or agent framework can act as a runtime. Some runtimes are inspectable and user-controlled; others are closed provider services. Their capabilities constrain which behavioral patterns can be implemented honestly.

A written instruction can request behavior. Only the runtime or another deterministic mechanism can guarantee a pre-action block, atomic write, protected merge, or enforced permission boundary.

**Relationships.** The runtime provides access to a [model](#model-draft), animates the structures in the [harness](#harness-draft), and exposes the execution surface used by an [agent](#agent-draft).

**Adaptation questions.** Who controls the runtime? What state does it own? Which lifecycle events are exposed? What can it enforce before side effects? How are failures, retries, logs, and recovery handled?

**Evidence and realization.** Conceptual; demonstrated differently in Codex CLI, Claude Code, Qwen Code, and Origin.

**Avoid.** Treating an executable name as the architecture, or claiming equivalent behavior after replacing only one CLI command.

## Harness [draft]

**Definition.** A harness is the durable operational structure around model capability that makes continuing, bounded, inspectable work possible.

**Role in the harness.** The harness carries the parts that should survive individual inference calls and sessions: selected context, instructions, memory, active jobs, state, tools, permissions, interfaces, verification, history, recovery, and accumulated experience. It turns general capability into a system shaped around a user and their responsibilities.

**Boundary and invariants.** A harness may be thin or extensive, local or partly distributed, mostly textual or heavily coded. It is defined by function rather than by one directory layout. Not every harness requires every component, but a claimed capability must have a real owner and an honest mechanism.

The harness is not merely a prompt, transcript archive, dashboard, CLI, or repository. Those can be parts of it. A user may control files while still depending on a closed runtime or remote model; ownership and locality must therefore be assessed layer by layer.

**Relationships.** A harness supplies durable structure to a [model](#model-draft) through a [runtime](#runtime-draft). Model plus harness plus an active responsibility produce an [agent](#agent-draft). The harness is the primary software surface through which user [agency](#agency-draft) can accumulate.

**Adaptation questions.** What must persist? What can act? Which decisions remain human? How is state verified, stopped, recovered, moved, or deleted? Which components are provider-specific?

**Evidence and realization.** Consolidated direction across Academy work; this exact wording remains draft.

**Avoid.** One universal Hadosh harness, “local folder” as a complete definition, or treating installed tools as proof of coherent architecture.

## Agent [draft]

**Definition.** An agent is model capability operating through a runtime and harness toward a bounded responsibility.

**Role in the harness.** The term names the acting system, not only the model. An agent perceives supplied state, reasons or classifies, uses permitted tools, updates owned state, communicates, and advances work under defined authority and verification.

**Boundary and invariants.** An agent does not become the independent owner of the user's purposes. Its responsibility, permissions, and stopping conditions come from the harness and the user. The same model can animate many distinct agents because each harness supplies different context, state, tools, constraints, and experience.

The boundary of one agent is architectural rather than anthropomorphic. It may be one persistent project, one plugin, one job-specific specialist, or a larger organism with several components. The boundary must say what state, authority, and objective belong together.

**Relationships.** An agent combines a [model](#model-draft), [runtime](#runtime-draft), [harness](#harness-draft), and responsibility. It should expand user [agency](#agency-draft), not silently replace it.

**Adaptation questions.** What is the responsibility? Where is authoritative state? What can the agent change? How does the user interrupt, correct, or recover it? What evidence proves progress or completion?

**Evidence and realization.** Conceptual; reflected across all Academy project lineages.

**Avoid.** “Chatbot,” independent digital personhood, or naming every one-shot model response an agent.

## Agency [draft]

**Definition.** Agency is the capacity to form purposes, make judgments, and cause directed change. In Hadosh Academy, externalized agency means part of a person's practical capacity is expressed through a harness they can understand and govern.

**Role in the harness.** Agency is the human outcome. A useful harness lets the user remember more, sustain more responsibilities, apply learned procedures, inspect consequences, and coordinate work without reconstructing everything from memory.

**Boundary and invariants.** Agent activity is not automatically user agency. More background execution can reduce agency when the user loses visibility, correction, ownership, or the ability to stop. Autonomy is therefore a bounded mechanism; the objective is expanded human capacity.

Externalization does not transfer authorship or responsibility to the model. The harness preserves the user's purposes, accepted decisions, methods, and intervention points in operational form.

**Relationships.** An [agent](#agent-draft) performs bounded work. A [harness](#harness-draft) is the accumulating software structure. Agency is the capability that the person retains and extends through them.

**Adaptation questions.** Which burden is being externalized? Which judgments must stay visible? Does the system make the user more capable and less dependent, or only more automated?

**Evidence and realization.** Foundational Academy principle; wording remains draft.

**Avoid.** Equating agency with autonomy, activity, anthropomorphism, or provider-controlled personalization.

## Context [draft]

**Definition.** Context is the selected information made available for interpreting and acting at a particular cognitive moment.

**Role in the harness.** Context lets a model understand the current responsibility, relevant history, constraints, definitions, state, evidence, and authority. Good context reduces reconstruction while keeping irrelevant or protected material outside the active reasoning surface.

**Boundary and invariants.** Context is not synonymous with memory, knowledge, transcript, or every file the user owns. It is a temporary selection assembled from those sources. Durable information may exist without being loaded; loaded text may be transient and never deserve preservation.

Context quality depends on selection, provenance, freshness, scope, and conflict handling—not only token quantity. An enormous undifferentiated context can obscure the governing evidence as easily as a thin one can omit it.

**Relationships.** The [harness](#harness-draft) stores and routes potential context. The [runtime](#runtime-draft) presents selected context to the [model](#model-draft). Work may produce new candidate context that requires review before becoming durable.

**Adaptation questions.** What does the model need now? What is authoritative? What is stale, inferred, private, or irrelevant? Which source should win when contexts conflict?

**Evidence and realization.** Conceptual and widely demonstrated; selection mechanisms vary by runtime.

**Avoid.** “More context is always better,” transcript dumping, or treating model-visible text as automatically canonical.

## Local [draft]

**Definition.** Local describes a harness layer operating within infrastructure the user directly controls, rather than existing only inside an external provider's hidden application state.

**Role in the harness.** Locality can improve custody, inspectability, continuity, recovery, and the user's ability to replace providers. Ordinary files, repositories, databases, local services, and user-operated machines can provide local surfaces.

**Boundary and invariants.** Local does not automatically mean offline, private, secure, open-source, or entirely self-hosted. A local harness may call a remote model or external service. A private hosted repository may be user-controlled without being local execution. Each dependency must be described honestly.

Locality is layered. Context can be local while inference is remote; execution can be local while credentials or notifications depend on hosted services. The relevant question is what the user controls and what disappears when a dependency is removed.

**Relationships.** A local [harness](#harness-draft) may use a remote [model](#model-draft) through a local [runtime](#runtime-draft). Locality contributes to, but does not prove, [user-owned](#user-owned-draft) status.

**Adaptation questions.** Where does each layer run? What data leaves the environment? What can continue offline? What can the user back up, restore, inspect, or move?

**Evidence and realization.** Conceptual; demonstrated in several partial combinations across Academy projects.

**Avoid.** Calling a connected private GitHub repository local, or treating local storage alone as sufficient privacy and ownership.

## User-owned [draft]

**Definition.** A harness layer is user-owned when the user has durable custody and practical authority to inspect, modify, copy, recover, move, and dispose of it without depending entirely on one provider's permission.

**Role in the harness.** Ownership keeps accumulated methods, state, corrections, and working history as the user's asset. It creates the possibility of replacing models, runtimes, interfaces, or service providers while retaining meaningful continuity.

**Boundary and invariants.** Access is not ownership. Export is not full operational portability. A user may own files while lacking control over the runtime that interprets them. Ownership must be evaluated by layer: data, context, instructions, code, execution, credentials, history, interfaces, and deployment may have different custodians.

Ownership also carries responsibility. The user needs understandable backup, security, permission, and recovery practices. Shared or organizational harnesses require governed ownership rather than pretending one individual controls collective state.

**Relationships.** [Local](#local-draft) operation can support ownership but is not identical to it. A [harness](#harness-draft) becomes an accumulating user asset only to the extent its important layers meet this definition.

**Adaptation questions.** Can the user retrieve the complete operational state? Can another suitable runtime use it? Can the user refuse changes, recover prior state, and remove access? Which dependencies remain non-portable?

**Evidence and realization.** Foundational Academy direction; individual claims require layer-specific evidence.

**Avoid.** “The user can log in, therefore the user owns it,” export-only portability, or ignoring organizational and third-party rights.

## Seed [draft]

**Definition.** A seed is the smallest coherent context or substrate from which a distinct harness can grow through use.

**Role in the harness.** The seed gives an agent enough shared language, boundaries, and developmental method to begin without pre-deciding the user's mature system. It reduces blank-page cost while preserving differentiation.

**Boundary and invariants.** A seed is not a miniature finished agent. It should contain only the foundations needed to orient construction, preserve authority, and select the first useful behavior. Additional anatomy is earned by real responsibilities, evidence, and user decisions.

A seed can be primarily contextual, as in this library, or include a minimal executable substrate, as in Origin. Framework-specific Seed repositories may accumulate selected components. These are different seed forms and should not be collapsed.

**Relationships.** The Academy's abstraction library is a public context seed. [Origin](../projects/origin.html), [Seed Agent](../projects/seed-agent.html), and [Q-Seed](../projects/q-seed.html) are distinct implementation or accumulation surfaces. A seed matures into a user-specific [harness](#harness-draft) through adaptation and evidence.

**Adaptation questions.** What is the smallest useful starting responsibility? Which assumptions should remain undecided? What must be understood before the first consequential change?

**Evidence and realization.** Foundational Academy metaphor, observed across several lineages; this cross-lineage definition remains draft.

**Avoid.** Treating the seed as a standard installation, pre-populating every possible component, or measuring maturity by file count.
