---
title: "The Seed Agent's Cognitive Rhythm: Markov Brains, OPEVC, and Phasic Expansion"
date: "April 2026"
slug: "the-seed-agents-cognitive-rhythm"
read_time: "22 min"
tags: [Agents, AI, Architecture, Cognitive Rhythm, OPEVC, Markov Chain]
audience: professionals
og_image: "assets/images/blog/cognitive-rhythm-opevc.png"
series: "Hadosh Academy – Agents"
version: v1.0.0
status: draft
---

# The Seed Agent's Cognitive Rhythm: Markov Brains, OPEVC, and Phasic Expansion

> **A drumbeat is just a series of sounds. A rhythm creates a dance.**

In our previous essays, we established that a raw LLM, left to its own devices, performs a "random walk" through its action space – a brilliant but unpredictable sequence of probabilistic decisions (Blog 1). We also introduced the OPEVC (Observe, Plan, Execute, Verify, Condense) cycle as the agent's core workflow (Blog 1) and the Persistent Job System (Blog 5) as its enduring heartbeat.

Now, we bring these concepts together. This essay dives into the **cognitive rhythm** of the seed agent, revealing how a seemingly simple sequence of phases transforms a probabilistic LLM into a disciplined, goal-directed intelligence. We'll explore how this rhythm functions as a sophisticated **Markov brain architecture**, guiding the agent through complex tasks, enabling multi-cycle jobs, and providing the framework for future expansion.

## The Markov Brain: From Random Walk to Disciplined Flow

Imagine the LLM's raw action space as a sprawling network of possibilities. Each node is a potential action (read, write, think, respond), and the connections are the probabilistic paths the LLM might take. Without structure, this is a Markov chain where any path is equally likely, leading to the "random walk problem" (Blog 1).

Our **phasic system (`phasic_system`)** imposes a *controlled* Markov brain architecture. It defines a set of allowed states (phases) and strictly controls the transitions between them. The agent doesn't randomly jump from observation to execution; it *must* follow the predefined path: Observe → Plan → Execute → Verify → Condense. This transforms a chaotic web into a deliberate, goal-oriented flow.

![Diagram showing the OPEVC cycle as a directed graph, with each phase (Observe, Plan, Execute, Verify, Condense) as a node. Arrows represent allowed transitions. CLAUDE.md and hooks shown as influencing transitions and state within each phase.](../assets/images/blog/markov-brain-phasic-system.png)
*The phasic system transforms the LLM's probabilistic action space into a disciplined, directed flow. Each arrow represents an enforced transition, guided by CLAUDE.md files and hooks.*

Each phase is not just a label; it’s a **bounded context** with specific rules, objectives, and permitted tools, enforced by powerful hooks. This ensures that the agent dedicates its full cognitive resources to the task at hand for that specific stage.

## OPEVC: The Core Cognitive Rhythm Revisited

The OPEVC cycle is the seed agent's fundamental cognitive rhythm, guiding it through the complete lifecycle of a task. Each phase plays a distinct, critical role:

1.  **Observe (`phase_observe`):** The agent's sensory intake. It gathers context from files, user input, and other sources. Its goal is to build a comprehensive understanding of the problem space. The `observe-guard.sh` hook and point system (recall Blog 4's discussion of hooks as reflexes) ensure a thorough initial investigation before moving forward.
    *   **Goal:** Understand the problem, gather context, identify relevant information.
    *   **Mechanism:** Reads `CLAUDE.md` files, searches codebase, analyzes user prompt.

2.  **Plan (`phase_plan`):** The agent's strategic formulation. Here, observations are translated into a detailed, step-by-step action plan. The `plan-guard.sh` hook ensures the plan is sufficiently detailed and aligned with the observations, preventing premature or ill-conceived actions. The `CLAUDE.md` layer becomes a "shared context bus," as described in its documentation, where this plan is laid out for collaborative refinement.
    *   **Goal:** Define concrete, actionable steps to solve the problem.
    *   **Mechanism:** Writes detailed plan into `CLAUDE.md`, utilizes `plan_file` for complex plans.

3.  **Execute (`phase_execute`):** The agent's "motor cortex." This is where the actual work happens – code writing, file modifications, command execution. Crucially, `execute-guard.sh` ensures that the agent only performs actions strictly within the scope defined by the plan, often leveraging the "altered list" passed down from `Observe` and `Plan` (Blog 1). A multi-commit checkpoint system ensures progress is saved incrementally.
    *   **Goal:** Implement the solution defined in the plan.
    *   **Mechanism:** Uses `replace`, `write_file`, `run_shell_command` tools, records implementation lessons.

4.  **Verify (`phase_verify`):** The agent's quality assurance gate. After execution, the agent must rigorously check its work. This phase uses a powerful set of hooks (`verify-guard.sh`, `verify-commit.sh`) to ensure that changes are correct, tests pass, and objectives are met. As discussed in our initial codebase review, `phase_verify` is unique in its ability to loop *backward* to any of the preceding phases (`Observe`, `Plan`, `Execute`) if issues are found, enabling iterative refinement directly at the source of the problem. Only upon successful verification can the agent move forward.
    *   **Goal:** Confirm correctness and completeness of the executed work.
    *   **Mechanism:** Runs tests, checks file contents, validates against criteria, can trigger backward transitions for self-correction.

5.  **Condense (`phase_condense`):** The agent's learning and consolidation phase. As detailed in Blog 7, this phase converts raw operational learnings into durable knowledge. The "Deflation Gate" (enforced by `condense-commit.sh`) forces the agent to distill temporary notes, migrate valuable insights to long-term memory, and create "pending jobs" for future architectural upgrades. This is where the agent becomes a "tidy learner," actively preventing working memory bloat and ensuring continuous self-improvement.
    *   **Goal:** Synthesize learnings, update knowledge, clean working memory, prepare for next task.
    *   **Mechanism:** Distills `CLAUDE.md` notes, creates pending jobs, resets altered list.

This cycle is not merely a suggestion; it is mechanically enforced. The hooks act as the "brakes and accelerators" of this Markov brain, ensuring that the agent remains on its disciplined path.

## Multi-Cycle Jobs: Sustained Professional Competence

While a single OPEVC cycle might complete a small, self-contained task, true professional competence often requires sustained effort over days or weeks. This is where **multi-cycle OPEVC jobs** come into play.

Thanks to the `job_core` plugin (Blog 5), the agent's state for a given job is persisted on disk. This means that a complex task can span multiple OPEVC cycles. The agent might `Observe` and `Plan` in one cycle, `Execute` partially in another, `Verify` in a third, and then `Condense` its learnings while still having `active` tasks remaining for the job.

*   **Example:** A job to "Develop a new user management module" might involve:
    *   **Cycle 1:** `Observe` (research requirements), `Plan` (outline API, database schema), `Condense` (create pending jobs for sub-tasks).
    *   **Cycle 2:** `Execute` (implement API endpoints), `Verify` (run unit tests), `Condense` (record bugs, update knowledge).
    *   **Cycle 3:** `Execute` (implement frontend integration), `Verify` (run integration tests), `Condense` (finalize documentation).

This continuous flow, driven by the persistent job system and the enforced OPEVC rhythm, allows the seed agent to tackle truly large-scale, long-duration projects without losing context or coherence. The agent's "identity" and progress are anchored in the filesystem, not the fleeting context window of the LLM.

## Expanding the Cognitive Horizon: New Phases and Transitions

The `phasic_system` is designed for extensibility. The core OPEVC rhythm, while powerful, is not immutable. The architecture allows for the introduction of **new phases** and the modification of **transition rules** to adapt to specialized workflows or emerging needs.

*   **Example: A `Debug` Phase:** For a highly technical agent, a `Debug` phase could be introduced between `Execute` and `Verify`. This phase would have specific tools (e.g., debuggers, log analyzers) and objectives (e.g., reproduce bug, identify root cause), with transition rules allowing it to loop back to `Plan` or `Execute` with newfound insights.
*   **Dynamic Transitions:** Beyond fixed transitions, hooks (Blog 1) can be used to implement dynamic transition rules. For instance, a `PreTransition` hook could evaluate the agent's confidence or the complexity of the current task and decide whether to proceed to the next phase or loop back for further refinement.

This ability to expand and adapt its own cognitive rhythm is what makes the seed agent a truly **complex system** (Blog 2), capable of evolving its intelligence to meet new challenges. It's not just following a predefined script; it's internalizing and extending its own operational framework.

## The Agent as a Master of its Own Flow

The seed agent's cognitive rhythm, built upon its Markov brain architecture, is far more than a simple set of instructions. It is a dynamic, self-enforcing system that channels the immense power of the LLM into reliable, goal-directed behavior.

By leveraging OPEVC, multi-cycle jobs, and the ability to expand its own phasic system, the agent develops genuine professional competence. It learns not just from *what* it does, but from *how* it does it, continually refining its internal processes to become an increasingly effective and autonomous digital collaborator.

This disciplined approach is what truly distinguishes a seed agent from a mere chatbot. It is the rhythm that creates the dance of intelligence.

---

*Essay 6 of 8 in the Hadosh Academy series on agent architecture.*

*Previous: ["The Agent's Unsung Heroes: The Job System and Non-Phasic Plugins"](05-the-agents-unsung-heroes.html) — the silent machinery that ensures persistence and stability.*
*Next: ["From Collaboration to Competence: Growing Your Seed Agent with Iterative Jobs"](07-from-collaboration-to-competence.html) — how the agent learns and self-improves through iterative tasks.*
