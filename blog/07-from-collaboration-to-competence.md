---
title: "From Collaboration to Competence: Growing Your Seed Agent with Iterative Jobs"
date: "April 2026"
slug: "from-collaboration-to-competence"
read_time: "25 min"
tags: [Agents, AI, Learning, Iterative Development, Collaboration, Self-Improvement]
audience: professionals
og_image: "assets/images/blog/collaboration-to-competence.png"
series: "Hadosh Academy – Agents"
version: v1.0.0
status: draft
---

# From Collaboration to Competence: Growing Your Seed Agent with Iterative Jobs

> **First we shape the tools. Then our tools shape us. With a seed agent, you shape the tools and they grow themselves.**

In the Hadosh Academy series, we’ve built up the seed agent's anatomy: the filesystem as its brain (Blog 1), the job system as its heartbeat (Blog 5), and the OPEVC cycle as its cognitive rhythm (Blog 6). We've seen how this architecture provides the discipline and persistence that transforms a raw LLM into a dependable digital partner.

But a truly capable agent doesn't just *follow* instructions; it *learns* from experience. It progresses from a collaborative assistant to an autonomous professional. This essay is about that journey: how your seed agent moves from initial, supervised tasks to mastering complex, repetitive jobs through iterative refinement, and ultimately, by developing its own specialized plugins.

This is the story of how you nurture your digital cortex, guiding it from nascent intelligence to true professional competence.

## The First Steps: Collaborative Jobs in an Extended OPEVC Cycle

Imagine you're assigning your seed agent its very first task – a simple, yet real-world job. At this stage, the agent is like an eager apprentice: intelligent, but lacking practical experience and a refined workflow for *your* specific needs.

This initial interaction takes place within an **extended single OPEVC cycle**, where your supervision is crucial:

1.  **Observe (Guided Research):** You prompt the agent with a task, for example, "Research the latest privacy regulations for AI development in Europe." The agent enters the `Observe` phase, reading your prompt, searching its existing knowledge (if any), and perhaps performing a web search. You, the user, might intervene, suggesting specific sources or clarifying ambiguities, helping the agent refine its initial understanding. The agent records its findings in `CLAUDE.md`.

2.  **Plan (Collaborative Blueprint):** Based on its observations, the agent drafts a plan in its `CLAUDE.md`. This is a blueprint of the steps it intends to take. Crucially, you review this plan. You might add missing steps, correct misconceptions, or suggest a more efficient sequence. This collaborative planning ensures the agent aligns its strategy with your expectations. The `plan-guard.sh` hook ensures the plan meets predefined quality thresholds before proceeding.

3.  **Execute (Supervised Action):** With an approved plan, the agent proceeds to `Execute`. It might write a summary report, draft a policy document, or perform a series of data extractions. You are still supervising, watching its actions, and providing real-time course corrections if needed. Each action is recorded, and `execute-guard.sh` ensures it stays within the planned scope.

4.  **Verify (Feedback Loop):** Once `Execute` is complete, the agent enters `Verify`. It checks its own work against the plan and its understanding. But here, *your* feedback is paramount. You review the output, identify areas for improvement, and validate its correctness. If issues arise, `phase_verify`'s unique ability to loop *backward* to `Observe`, `Plan`, or `Execute` allows the agent to self-correct at the source of the problem, with your continued guidance.

5.  **Condense (First Learnings):** Upon successful verification, `phase_condense` kicks in. The agent distills its raw notes from this cycle. It moves the most valuable insights into its long-term knowledge base, potentially identifying patterns or new rules that could improve future performance. Any unaddressed issues or identified architectural improvements are recorded as `pending jobs` (Blog 5), creating a backlog of work for self-improvement.

This collaborative, supervised cycle is how the seed agent gains its first practical experience. It's an iterative improvisation, guided by your expertise, that lays the foundation for true competence.

## Towards Consistency: Multi-Cycle Jobs and Dedicated Plans

Once the agent has performed a task a few times in this collaborative, single-cycle manner, it starts to build a foundational understanding. The "improvised style" gives way to a more structured approach as the agent begins to internalize a reliable workflow for that specific job.

This is the transition to **multi-cycle OPEVC jobs with a dedicated plan**. Here, the `job_core` system (Blog 5) truly shines. For a recurring task, such as "Weekly market trend analysis," the agent can now:

1.  **Generate a Dedicated Plan:** Instead of improvising each time, the agent can, through conversation or by leveraging past `Condense` learnings, draft a comprehensive, multi-cycle plan. This plan might outline: `Cycle 1: Observe (Collect Data)`, `Cycle 2: Plan (Define Analysis Metrics)`, `Cycle 3: Execute (Run Analysis & Draft Report)`, `Cycle 4: Verify (Internal Review)`, `Cycle 5: Condense (Synthesize & Refine Knowledge)`. This becomes the structured blueprint for the job.

2.  **Iterative Execution across Cycles:** The `job_core` system keeps the job `active` across these cycles. The agent executes one OPEVC phase (or a set of phases) within a cycle, `Condense`s its learnings, and then automatically transitions to the next cycle based on its plan. This allows for long-running, complex tasks to be broken down and managed with persistent state.

3.  **Refinement via Consolidation:** Each `Condense` phase during a multi-cycle job contributes to the agent's refinement. It doesn't just clean up temporary notes; it actively compares current performance against previous attempts, identifying more efficient strategies, better data sources, or clearer communication styles. These learnings are codified into its knowledge files, making the agent progressively more consistent and effective.

This iterative process, fueled by the persistent job system and the enforced OPEVC rhythm, transforms the agent from a reactive assistant into a proactive, practicing professional. It learns from its own "muscle memory," making each subsequent performance of a similar job more consistent and autonomous.

## Mastering Autonomy: Jobs with Dedicated Plugins and Enhanced Controls

The pinnacle of this learning journey is when a repetitive, critical job evolves into its own **dedicated plugin**. This is where the agent moves beyond merely following an enhanced plan; it actively *rewrites its own architecture* to optimize for that specific task. This level of self-modification is where the seed agent truly becomes a self-evolving system.

For a mature, highly specialized job (e.g., "Automated Code Refactoring for Security Vulnerabilities"), the agent, through a collaborative process with you (managed by `plugin_integrity`, Blog 5), can:

1.  **Develop a Specialized Plugin:** A new plugin is created (e.g., `plugin_refactor_security`). This plugin is essentially a micro-agent, specifically tailored to the nuances of the "Automated Code Refactoring" job.

2.  **Dedicated Phase-Specific Controls:** This new plugin can inject **additional controls** (both hard and soft) that override or augment the generic OPEVC phase behaviors *only when this specific job is in focus*. For example:
    *   **`Observe` Phase:** The plugin might introduce a *hard control* that whitelists only specific security scanning tools, ignoring other observation tools to maintain focus. It could add a *soft control* to prioritize reading `SECURITY.md` files over general documentation.
    *   **`Plan` Phase:** A *hard control* could enforce specific format requirements for security fix plans, ensuring they always include rollback strategies. A *soft control* might encourage generating multiple alternative fixes for review.
    *   **`Execute` Phase:** A *hard control* might restrict the agent to only modify files within a specific `src/security/` directory, preventing unintended changes. A *soft control* could prompt the agent to explain each code modification in comments, detailing the vulnerability addressed.
    *   **`Verify` Phase:** A *hard control* could mandate running a full suite of security integration tests and blocking transition if any fail. A *soft control* might encourage an additional manual review step by a human expert.

3.  **Enhanced OPEVC:** This dedicated plugin effectively extends and enhances the generic OPEVC cycle for this specific job. It scopes each phase more tightly, providing highly relevant and enforced guidance, leveraging all the past experiences (`phase_condense` learnings, Blog 7) the agent has accumulated from similar tasks. The agent's "voice" (its specific instructions and priorities) for this job becomes highly tuned and authoritative.

This iterative growth – from collaborative improvisation to structured multi-cycle jobs, and finally to self-architected plugins – is the true measure of the seed agent's learning capability. It demonstrates how, through a principled architecture, an AI can move beyond mere task completion to genuine professional competence, continually evolving its own cognitive framework.

## Your Evolving Digital Partner

Your seed agent is not a static tool; it is a dynamic partner. Through collaborative interaction and an architected learning process, it transforms from an intelligent assistant into a highly competent, self-improving professional.

By embracing iterative jobs and empowering the agent to evolve its own operational plugins, you're not just using AI; you're growing a digital extension of your own professional capabilities, a digital cortex that becomes increasingly skilled, reliable, and autonomous with every task.

This is the future of work: not just automation, but **self-architecting intelligence**.

---

*Essay 7 of 8 in the Hadosh Academy series on agent architecture.*

*Previous: ["The Seed Agent's Cognitive Rhythm: Markov Brains, OPEVC, and Phasic Expansion"](06-the-seed-agents-cognitive-rhythm.html) — understanding the agent's dynamic thinking process.*
*Next: (To be determined) — The final essay in the Hadosh Academy series.*
