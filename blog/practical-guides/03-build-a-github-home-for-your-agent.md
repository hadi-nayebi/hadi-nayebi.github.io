# Build a GitHub Home for Your AI Agent

*Practical Guide 3 — Give this page to the AI agent you already use. Together, create one private project home that can survive a fresh conversation, a changed model, and the limits of your memory.*

If you use ChatGPT, Claude, or another AI agent for a real project, the conversation may already contain useful decisions, corrections, and plans. But a conversation is not yet a durable project home.

This guide helps you add a practical GitHub layer to work you already do. You do not need to become a developer. Your agent should translate GitHub into the language of your work, guide you one step at a time, and stop whenever a choice affects privacy, permissions, cost, publication, or accepted project state.

**The promise:** begin with one private repository, one real project, and one bounded request. Finish with a project that a fresh authorized agent can read, explain, and continue without depending on one old chat.

GitHub is not the final or universal architecture for a user-owned AI harness. It is an accessible first implementation: files, history, Issues, branches, and pull requests already provide useful surfaces for durable context and controlled change. You can sync the repository to your own computer later or move the same patterns elsewhere.

## Start by Giving This Guide to Your Agent

Send your agent this link and the instruction below. The guide is designed to become a conversation, not a form you must complete alone.

**Agent instruction**

Read this entire Hadosh Academy guide before acting. Help me establish one private GitHub repository as a durable home for one real project.

Begin by asking what project I want to preserve and how familiar I am with GitHub. Ask one high-value question at a time. Explain every GitHub term through an analogy from my own work, then show the exact GitHub meaning.

Use the smallest useful setup. Do not ask for my password, two-factor code, recovery code, API key, access token, or other secret. Do not ask me to paste private conversations or confidential material into the repository. Do not create accounts, repositories, integrations, secrets, branches, pull requests, or public content without telling me exactly what will happen and obtaining my approval for that step.

Keep these authorities separate: reading, proposing, writing, reviewing, merging, publishing, changing visibility, and changing permissions. Repository access is not blanket authority.

Adapt the path to the capabilities actually available in this chat. If you can only read GitHub, say so. If a separate coding or cloud-agent surface is required to write or open pull requests, explain that distinction. If you cannot inspect the live interface, guide me without pretending you clicked anything.

Do not finish after setup. Run the read-back test, help me create one bounded Issue, produce one reviewable proposal or exact patch, and run the fresh-context continuity test. Mark unsupported claims as unknown.

## What You Will Build

By the end, you should have:

- a secured GitHub account;
- GitHub Mobile installed so the project remains reachable away from a desk;
- one private repository for one real project;
- a short README that tells a new reader what the project is;
- an agent instruction file that states how work should be handled;
- small, explicit places for current context, decisions, jobs, and evidence;
- one AI setup with verified read or write capability;
- one Issue containing one complete request;
- one branch and pull request, or an exact patch when the agent is read-only;
- a fresh-context test showing whether continuity actually works.

The target is not “learn GitHub.” The target is “make one project easier to continue and govern.” You learn the pieces because you use them.

## 1. Choose One Project Worth Continuing

Do not begin by moving your entire digital life. Choose one project that is already real enough to benefit from continuity and safe enough to use as a pilot.

Good first projects include:

- a personal research question;
- a writing, course, portfolio, or learning project;
- a small software or automation idea;
- a job-search or professional-development project with sensitive details removed;
- a household, community, or creative project that has clear next steps.

Avoid a first pilot that contains employer secrets, client material, medical or legal records, credentials, regulated data, or another person's private information. “Private repository” means access is restricted on GitHub; it does not mean the contents are local-only, risk-free, or appropriate for every kind of data.

Your agent should ask:

Which one project do you most want a fresh conversation to understand without making you explain everything again?

## 2. Create and Secure the GitHub Account

If you already have a GitHub account, your agent should skip account creation and help you check security. If you do not, create a personal account at [github.com/signup](https://github.com/signup) and verify the email address. GitHub requires a verified email for basic tasks such as creating a repository.

Then enable two-factor authentication. GitHub recommends a time-based one-time-password app and recommends saving recovery codes in a secure location. Your agent should explain the steps, but you must handle the password, authentication codes, recovery codes, and security keys yourself.

**Secret boundary:** never paste a password, two-factor code, recovery code, personal access token, API key, OAuth token, or repository secret into an AI conversation or ordinary repository file.

### Install GitHub Mobile

Install the official [GitHub Mobile app](https://github.com/mobile) for iOS or Android and sign in. GitHub Mobile can read and collaborate on Issues and pull requests, review notifications, browse repositories, and support account authentication.

This matters because the repository should become part of the way you direct work. From your phone, you can capture a bounded request as an Issue, answer a genuine question, or review a proposed change without reconstructing the whole project in a new chat.

## 3. Create One Private Repository

On GitHub, use the **New repository** action. Give the repository a plain name that describes the project, choose **Private**, and initialize it with a README.

Your agent should help you choose the name and first description, but you should confirm:

- the owning GitHub account or organization;
- that visibility is Private;
- that the repository contains no copied secrets or restricted material;
- that changing visibility later would require a separate decision.

A repository is the project's controlled online home. It contains the current files and the history of how they changed. It can later be copied or cloned to a computer, but a GitHub private repository is hosted infrastructure—not the same thing as local storage.

## 4. Learn the Pieces Through Your Own Project

Your agent should translate each term into your domain. If you are writing a book, a branch is a separate revision path. If you are running a community project, an Issue is a complete work request or decision card. If you manage a laboratory, the main branch is closer to the currently accepted protocol than to a scratch notebook.

| GitHub piece | Plain-language role | How this guide uses it |
| --- | --- | --- |
| **Repository** | The controlled online home for one project | Holds durable context, work, evidence, and history |
| **README** | The front door | Explains the objective, current state, boundaries, and where to look next |
| **Files and folders** | The project's organized memory | Separate instructions, context, decisions, jobs, and evidence |
| **Issue** | One bounded request, question, or decision | Lets you direct work from the web or phone without losing the complete request |
| **Branch** | A separate proposal path | Keeps agent changes away from the accepted version while work is underway |
| **Pull request** | The review surface for a proposed change | Shows what changed, why, checks, discussion, and authority before acceptance |
| **Main branch** | The currently accepted project state | Changes only after the appropriate review and decision |
| **Commit and history** | A recorded change and the trail behind it | Make corrections and project development inspectable |

## 5. Seed the Smallest Useful Project Memory

Start with a small structure. Do not create dozens of empty folders. Your agent can propose these files as a starting point:

```
README.md
AGENTS.md
context/current-state.md
decisions/README.md
jobs/README.md
evidence/README.md
```

### README.md — the project front door

Keep it short enough that a fresh agent can orient itself quickly:

```
# Project name

## Objective
What this project is trying to accomplish and for whom.

## Current verified state
What is true now, with dates or evidence where needed.

## Protected boundaries
What must not be published, merged, disclosed, purchased,
deleted, or changed without explicit approval.

## Where work lives
- Instructions: AGENTS.md
- Current state: context/current-state.md
- Decisions: decisions/
- Active work: jobs/
- Evidence: evidence/

## Next executable step
The next action that can be taken now, or the exact boundary
that must be resolved first.
```

### AGENTS.md — how an agent should work here

This file is not a magic command. It is durable guidance that capable repository agents can read. Keep it specific to the project:

```
# Agent instructions

Read README.md and context/current-state.md before proposing work.

State what evidence you inspected. Mark unsupported claims as unknown.

Keep reading, proposing, writing, reviewing, merging, publishing,
visibility changes, permission changes, spending, deletion, and
external contact as separate authority gates.

Use a branch and pull request for changes when the runtime supports it.
If access is read-only, provide an exact patch or replacement text.

Never store credentials or secrets in this repository.
Do not move private material across audiences without explicit approval.

Before claiming completion, verify the result and record what changed.
```

### Context, decisions, jobs, and evidence

- **Current state** tells the next reader what is true now—not the full history.
- **Decisions** preserve choices and their reasons so the project does not relitigate them silently.
- **Jobs** hold bounded ongoing work, owners, evidence, next actions, and real boundaries.
- **Evidence** contains or points to the material supporting claims. Sensitive evidence can remain elsewhere as a scoped reference.

The names can change. The functions matter more than the folders.

## 6. Connect the Agent You Actually Use

“Connect the agent to GitHub” can mean several different things. Your agent should identify the exact surface and verify what it can do before promising work.

**Read**Find and explain authorized repository content.

**Propose**Prepare exact changes without writing them.

**Write**Create a branch, commit, or pull request.

**Accept**Review and merge into the accepted state.

These levels are not interchangeable. A connector that searches repository content may be read-only. A coding agent may work in a repository environment and open a pull request. A GitHub Action may have explicit contents, Issues, and pull-request permissions. None of those facts automatically gives the agent authority to merge, publish, change visibility, or broaden its own permissions.

### ChatGPT: repository reading and Codex work are distinct

A connected GitHub source in ChatGPT can search authorized repository content on demand. A private or new repository must be selected for the GitHub app and may require organization approval. Repository availability can also take a few minutes.

For write-capable repository work, Codex cloud is a separate path: you connect GitHub, choose the repositories Codex can access, create an environment, review the result, and may open a pull request. Do not assume that an ordinary ChatGPT conversation with GitHub reading access can edit the repository.

### Claude: choose the actual Claude surface

Claude products also have different capabilities. Claude Code GitHub Actions can respond to `@claude` in an Issue or pull request and can turn Issues into pull requests when the repository is deliberately configured. Anthropic's documented setup requires repository administration, a GitHub App, explicit permissions, a workflow, and an authentication secret.

That is a powerful route, not a required beginner step. If you use Claude in a surface without repository write access, ask it for a read-back or exact patch. If you use Claude Code locally or in the cloud, verify the repository and permission model for that environment. Never place the authentication secret in an ordinary file or conversation.

### Local or other agents

A CLI or desktop agent may work from a repository cloned to your computer. That can increase local control, but it also introduces filesystem, command, network, and credential permissions. Start with read-only inspection or a disposable branch. Do not equate “runs on my laptop” with “safe by default.”

**Capability check:** ask the agent to state the repository it can access, whether access is read-only or write-capable, how proposed changes are isolated, and which actions still require you.

## 7. Run the Read-Back Test Before Any Edit

Before asking for work, test whether the agent understands the repository.

Read README.md, AGENTS.md, and context/current-state.md first. Tell me:

1. the project objective;
2. the current verified state;
3. the protected boundaries;
4. the next executable step;
5. what remains unknown.

Cite the files you used. Do not edit anything.

If the agent invents state, misses a boundary, or cannot identify the next step, improve the repository before giving it more authority. A failed read-back is useful evidence: it tells you the project memory is incomplete, ambiguous, inaccessible, or not being followed.

## 8. Use One Issue as One Complete Request

An Issue can be a convenient request surface, especially from GitHub Mobile. It should not become a dumping ground for every thought or a substitute for durable accepted context.

Create an Issue only when one complete request, question, or decision is ready. Include:

```
## Objective
What result do I want?

## Current state
What is true now?

## Relevant evidence
Which files, links, examples, or checks matter?

## Protected actions
What may not happen without separate approval?

## Done when
What observable result and verification define completion?
```

Example:

**Objective:** Rewrite the project introduction for a reader who has never used GitHub.

**Current state:** README.md explains the architecture but not the first benefit.

**Relevant evidence:** README.md and decisions/audience.md.

**Protected actions:** Do not merge, publish, change repository visibility, or add new claims without sources.

**Done when:** A branch and pull request contain the revised opening, explain the change, and pass the repository's checks.

During a project, accepted knowledge should move into the appropriate file. Close the Issue when its request is finished or its required answer has been absorbed. Do not leave an Issue open merely to preserve memory that belongs in the repository.

## 9. Produce One Reviewable Change

If the agent can write, it should work on a branch and open a pull request. If it can only read, it should provide an exact patch or replacement text that you can apply through a write-capable surface.

The pull request should answer:

- What changed?
- Why was this change needed?
- What evidence or Issue supports it?
- What checks were run?
- What remains uncertain?
- Who has authority to accept the change?

Review the **Files changed** view. Look for accidental secrets, unrelated changes, unsupported claims, missing context, and changes to permissions or workflows. Review the checks. Ask for revisions when needed.

Merging changes the accepted project state. Keep that as a separate human decision unless you have explicitly designed and tested a narrower authority model.

## 10. Make Corrections Survive the Conversation

The repository becomes a real learning surface when corrections improve the system around the model.

If an agent repeatedly acts before reading, do more than say “be careful.” Ask:

- Which instruction was missing or ambiguous?
- Which evidence should have been read first?
- Which authority boundary was unclear?
- Which check would detect this next time?
- What is the smallest durable surface to update?

The answer might be one line in AGENTS.md, one decision record, one checklist, or one test. Review that correction like any other proposed change. Over time, the project can accumulate not just information, but better ways of working.

## 11. Run the Fresh-Context Continuity Test

Open a fresh conversation—or use another authorized agent—and provide only the repository. Do not paste the old conversation. Ask it to recover:

1. the objective;
2. the current verified state;
3. one accepted decision;
4. the main unresolved question;
5. the authority boundary;
6. the next executable action.

Require file citations and unknown marking. Compare the response with the repository.

| Result | Meaning | Next move |
| --- | --- | --- |
| **Accurate and cited** | The repository carries enough context for bounded continuation. | Try one slightly more complex request. |
| **Mostly accurate, some gaps** | The structure works, but key state or decisions are missing. | Update the smallest relevant file and rerun the test. |
| **Confident invention** | The agent is not grounding itself reliably. | Tighten read-first instructions, evidence requirements, and verification. |
| **Cannot access the repository** | The connection or permissions are incomplete. | Repair access; do not compensate by pasting secrets or bulk private context. |

Passing this test does not prove complete portability or safety. It proves one useful thing: the project no longer depends entirely on one conversation and one person's recollection.

## 12. Use a Small Mobile-to-Review Loop

Once the pilot works, the daily loop can remain simple:

1. Capture one complete request or decision as an Issue from GitHub Mobile.
2. Let an authorized agent read the Issue and repository context.
3. Receive a branch and pull request, or an exact patch.
4. Review the change, evidence, checks, and authority boundary.
5. Accept, revise, or reject it.
6. Move accepted knowledge into durable files and close the Issue.

Not every thought needs an Issue. Not every Issue needs an agent. The goal is a clear path from request to evidence to reviewable change to accepted state.

## Failure and Recovery Rules

- **The agent cannot see the repository:** confirm the correct account, repository selection, organization approval, and connection. New repositories may take time to appear.
- **The agent can read but not write:** use read-back and exact patches. Move to a write-capable surface only when you want that capability.
- **The agent changed too much:** do not merge. Narrow the Issue, compare the diff, and ask for a smaller proposal.
- **A secret entered history:** treat it as compromised, revoke or rotate it, and follow GitHub's sensitive-data removal guidance. Deleting the visible line alone may not remove it from history.
- **The repository is becoming cluttered:** update current state, condense accepted decisions, close absorbed Issues, and archive obsolete material without erasing necessary history.
- **You want local control:** clone the repository to your computer and establish backups. Treat that as the next architecture step, not as proof that every connected service is local.

## Completion Check

The guide is complete when you can answer yes to each question:

- Can I name the one project this repository serves?
- Is the repository private, and do I understand what “private” does and does not mean?
- Is my account protected with two-factor authentication and securely stored recovery methods?
- Can I reach the repository and its Issues from GitHub Mobile?
- Can a fresh authorized agent recover the project's objective, state, decision, question, boundary, and next action from files?
- Do I know whether my current agent can read, propose, write, or open pull requests?
- Have I completed one bounded Issue-to-review cycle?
- Did I personally review what would become accepted state?
- Can I point to one correction that now survives beyond the conversation?

If the fresh-context test fails, the project is not a failure. You have found the next concrete improvement.

## Capability Notes and Official Sources

Product capabilities and setup paths were checked against official documentation on September 22, 2026. Interfaces, plans, and permissions can change; your agent should verify the current product surface before guiding live setup.

- [GitHub: Creating an account](https://docs.github.com/en/account-and-profile/how-tos/account-management/creating-an-account-on-github)
- [GitHub: Configuring two-factor authentication](https://docs.github.com/en/authentication/securing-your-account-with-two-factor-authentication-2fa/configuring-two-factor-authentication)
- [GitHub: GitHub Mobile](https://docs.github.com/en/get-started/using-github/github-mobile)
- [GitHub: Creating a new repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-new-repository)
- [GitHub: About Issues](https://docs.github.com/en/issues/tracking-your-work-with-issues/learning-about-issues/about-issues)
- [GitHub: Pull requests](https://docs.github.com/en/pull-requests/reference/pull-requests)
- [OpenAI: Connecting GitHub to ChatGPT](https://help.openai.com/en/articles/11145903-connecting-github-to-chatgpt-deep-research)
- [OpenAI: Codex cloud](https://learn.chatgpt.com/docs/cloud)
- [Anthropic: Claude Code GitHub Actions](https://code.claude.com/docs/en/github-actions)

## Continue When the First Layer Is Stable

This GitHub arrangement is a beginning. Later, you may sync locally, add backups, define recurring jobs, connect more than one agent, introduce a dashboard, or move to a more open harness. Grow only when a real need appears and the current layer is understandable.

For a diagnosis of your broader AI use and ownership, run [the Agentic AI Use Doctor](02-audit-ai-harness-portability.html). If your first goal is a public personal website, use [Build Your Own Space on the Web](01-build-your-own-space-on-the-web.html).
