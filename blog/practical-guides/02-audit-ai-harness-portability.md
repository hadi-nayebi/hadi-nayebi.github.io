# Audit Whether Your AI Setup Is Actually Portable

*Practical Guide 2 — Find out what would survive a model or provider change, then repair one weak point.*

Changing AI providers should not force you to rebuild the way you work.

A chat export can preserve old conversations. It does not automatically preserve active jobs, durable memory, rules, permissions, tools, verification, or the ability to continue tomorrow. Those capabilities live in the harness around the model.

This guide helps you inspect that layer. You can run the audit with the agent you already use. You do not need to move anything first, and you do not need to make your current setup perfectly independent from every provider.

The objective is narrower:

> Identify what you own, what depends on a provider, what can be adapted, and the smallest change that would make your working system easier to understand, recover, or move.

## Before You Begin

Choose one real workflow. Do not audit your entire relationship with AI at once.

Good candidates include:

- recurring research;
- maintaining a website;
- preparing a weekly report;
- managing a creative project;
- tracking clients or applications;
- publishing a content series; or
- any responsibility that becomes difficult when a conversation ends.

Write its objective in one sentence. Then gather only the evidence needed to explain how the work continues:

- the current conversation or project;
- files, notes, or databases;
- saved instructions;
- scheduled tasks;
- connected tools;
- approval rules;
- tests or review steps; and
- backup or export options.

Do not paste credentials, private client material, employer data, regulated information, or another person's personal information into a new system for this audit.

## The Six-Part Audit

For each dimension, ask the question, identify the evidence, and give it one status.

Use these four statuses:

- **Portable:** the capability can continue with another model or environment with little change.
- **Adaptable:** the underlying information or method is yours, but an adapter or reconstruction step is required.
- **Trapped:** the capability depends on a provider-owned surface with no tested continuation path.
- **Unknown:** you do not yet have evidence.

### 1. Work state

**Question:** If this conversation disappeared, where would the workflow resume?

Look for the objective, current stage, completed work, unresolved questions, dependencies, and next step.

A transcript may contain this information, but it is not durable work state unless the important parts can be found and resumed without rereading the entire history.

**Useful evidence:** a job file, project record, issue, task object, dashboard state, or another inspectable source of truth.

### 2. Durable context

**Question:** What has the system learned that should still matter next month?

Separate durable context from conversation history. Durable context includes accepted decisions, terminology, preferences, reusable methods, and verified facts. It should also show scope: which project, person, or responsibility may use it.

**Useful evidence:** Markdown, structured data, a versioned knowledge file, or an export with a documented way to restore and query it.

### 3. Rules and permissions

**Question:** Which boundaries remain enforceable if the model changes?

A preference inside an old conversation may be forgotten. A rule in an inspectable instruction file, permission system, or approval gate has a clearer owner and continuation path.

Check who may read, write, send, publish, merge, spend, or delete. Identify which actions always require you.

**Useful evidence:** instruction files, tool policies, approval gates, access controls, or tests that fail when a boundary is crossed.

### 4. Tools and interfaces

**Question:** Which capabilities are portable, and which exist only inside one product?

Name tools by function before naming products: search, file editing, email, calendar, code execution, publishing, or database access. Then record the current implementation.

This reveals whether the workflow has a stable behavioral objective with a replaceable adapter, or whether the product itself has become the architecture.

**Useful evidence:** tool manifests, scripts, APIs, documented manual fallbacks, or a list of provider-specific connectors.

### 5. Verification and recovery

**Question:** How does the system prove that work is complete, and how does it recover when it is wrong?

A portable workflow needs more than inputs and outputs. It needs completion criteria, tests, review checkpoints, logs, and a recovery path.

**Useful evidence:** automated tests, checklists, approval records, version history, backups, rollback instructions, or a known-good restore exercise.

### 6. Provider-specific dependencies

**Question:** What would stop working if the current model, account, or product disappeared tomorrow?

List each dependency without treating it as automatically bad. Some provider-specific features are worth using. The objective is to make the dependency visible and deliberate.

For each dependency, record:

1. what value it provides;
2. what data or behavior it holds;
3. whether it can be exported;
4. whether the export can restore operation elsewhere; and
5. the acceptable fallback.

**Useful evidence:** export documentation, local copies, open formats, provider contracts, or a small migration test.

## Copy This Audit Prompt

> Audit one AI-supported workflow for operational portability.
>
> First, ask me which workflow we are auditing and what it must accomplish. Then inspect six dimensions: work state, durable context, rules and permissions, tools and interfaces, verification and recovery, and provider-specific dependencies.
>
> For each dimension:
>
> 1. describe the current mechanism in plain language;
> 2. identify the evidence supporting that description;
> 3. classify it as Portable, Adaptable, Trapped, or Unknown;
> 4. explain what would fail if I changed models or providers; and
> 5. recommend the smallest useful improvement.
>
> Distinguish a data export from a working continuation path. Do not request or expose credentials, private client data, employer information, regulated records, or another person's personal information. Do not make changes yet.
>
> Finish with a table, one overall finding, and one recommended first repair. Wait for my approval before changing files, settings, permissions, integrations, or public surfaces.

## Read the Result Carefully

A useful audit does not produce a single portability percentage. One trapped dependency may be harmless; another may hold the only copy of years of working memory.

Prioritize by consequence:

1. **Can the user lose the ability to continue the work?**
2. **Can private or authority-sensitive information cross a boundary?**
3. **Can the setup be understood and restored?**
4. **Is a provider-specific feature creating enough value to justify the dependency?**
5. **What is the smallest repair that improves the system without rebuilding it?**

Examples of small repairs:

- extract the objective, current state, and next step from one long conversation into a project file;
- copy accepted instructions into a user-owned, versioned document;
- document which actions require approval;
- name a product-specific tool by its stable function and record a fallback;
- export one memory surface and test whether it can actually be used elsewhere;
- add a completion checklist and a recovery note; or
- place one important workflow in a repository with visible history.

## Verify the Repair

Do not mark a capability portable because an export button exists.

Test one real continuation path:

1. make a safe copy of the relevant state;
2. open a different model, account, or local environment;
3. provide only the portable assets you identified;
4. ask the new environment to explain the workflow's objective, current state, authority boundaries, and next step;
5. compare its answer with the source of truth; and
6. record what was missing or provider-specific.

The test does not need to complete the whole workflow. It needs to reveal whether the system can resume coherently.

## What Success Looks Like

A portable harness is not a provider-free harness.

It is a system in which provider dependencies are visible, the user's durable structure remains inspectable, and a model change does not erase the ability to understand and continue the work.

The model supplies intelligence. The harness carries the user's accumulated way of working.

When the audit is complete, keep the evidence with the workflow. Repeat it when a major tool, model, account, permission, or storage layer changes.

For the deeper architectural argument, read [The AI That Grows With You](../principles/the-ai-that-grows-with-you.html). To begin a broader guided path, open [Start Here](../../start-here.html).
