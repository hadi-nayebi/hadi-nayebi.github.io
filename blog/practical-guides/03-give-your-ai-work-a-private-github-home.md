# Give Your AI Work a Private GitHub Home

*Practical Guide 3 — Build a low-barrier continuity layer that you can reach from your phone and use with ChatGPT, Codex, or another repository-connected agent.*

If you already use an AI agent for work that matters, you may have felt the cost of beginning again: a new conversation does not know the current state, an important correction disappears into history, or a second agent cannot tell what the first one decided.

A private GitHub repository can become a simple operational home for that work. It gives your agent a place to read the accepted context, gives you a visible place to make requests, and gives both of you a reviewable path from an idea to an accepted change.

You do not need to become a developer. This guide asks you to learn a small amount of GitHub language because those words give you useful controls. Your agent should explain each term through your own work, take one step at a time, and verify the result with you before continuing.

This is the objective:

> Establish one private, user-controlled repository where an agent can recover a project's purpose and current state, where you can open requests from your phone, and where proposed changes remain visible until you accept them.

This is a practical starting layer, not a complete local harness. GitHub supplies hosted files, history, Issues, branches, and pull requests. It does not by itself supply local hooks, private runtime control, independent execution, or every form of automation. Those can come later if your work needs them.

## What You Will Have at the End

You will have:

- a private repository owned by your GitHub account;
- a small set of files describing one real project;
- the GitHub Mobile app for requests, comments, notifications, and review;
- Issues used as request and interaction points;
- an agent connection tested against the repository itself;
- a clear read-only path and a write-capable path;
- a first branch and pull request, when the connection supports them;
- a human acceptance boundary: the agent proposes, you review, and you merge; and
- a fresh-conversation test showing whether the repository carries enough context to continue.

The repository is useful even if you later change models or agents. Its files and history remain a separate asset under your control.

## The Shortest Useful Route

If the full guide feels long, keep this sequence in view:

1. Choose one continuing project.
2. Create one private repository and secure the account.
3. Install GitHub Mobile.
4. Add a short README, project instructions, current state, and decision record.
5. Connect one agent to only that repository.
6. Test the direct connection without allowing a change.
7. Open one Issue from your phone.
8. Review one proposed patch or pull request.
9. Start a fresh conversation and test whether it can recover the work.

The agent can guide each step. You only need to understand the decision being made now and where its result will live.

## Choose One Real Project

Do not begin by building a universal personal operating system. Choose one continuing responsibility that already creates repeated context.

Examples include:

- a filmmaker developing a production or marketing workflow;
- a clinician organizing non-patient educational material;
- a consultant developing a service, proposal, or research project;
- a teacher planning a course;
- a founder maintaining product decisions;
- an artist organizing a body of work; or
- a household coordinating a move, renovation, or long trip.

Complete this sentence:

> I want my agent to help me continue __________ without making me repeatedly reconstruct __________.

The guide should adapt to your answer. A filmmaker's repository may organize concepts, footage notes, release decisions, and trailer experiments. A teacher's may organize learning objectives, lessons, feedback, and revisions. The building blocks are similar; the useful contents are not identical.

## Why a Filesystem, Why Git, and Why GitHub

Hadosh Academy begins from a simple distinction: the language model is not the complete agent. The continuing agent emerges from the system around the model—files, memory, instructions, tools, permissions, jobs, verification, and retained experience. The earlier essay [LLMs Are Not the Agents](../b1/01-llms-are-not-the-agents.html) introduces this argument, and [The Language of Agents](../b4/04-the-language-of-agents.html) develops the working vocabulary.

A filesystem is a strong first substrate because it makes context inspectable. You can open a file, see what the agent sees, correct it, move it, compare it, and give it to another suitable agent. But ordinary folders do not automatically explain what changed, preserve accepted versions, or keep several proposed edits from colliding.

That is where Git becomes useful. Git records versions of a set of files, compares changes, supports isolated branches, and reconciles work from many contributors. It was created for the Linux kernel—a very large project developed through distributed, nonlinear work—and was designed for speed, scale, and many simultaneous branches. The official Git history describes those origins, while the [Git overview](https://git-scm.com/about) explains its scaling and history model.

For this practical layer:

- **the filesystem holds the context;**
- **Git records how that context changes;**
- **GitHub hosts and connects the repository;**
- **Issues hold requests and discussion;**
- **branches compartmentalize proposals;**
- **pull requests expose changes for review;** and
- **your merge records acceptance.**

This does not mean Git is the only possible substrate for a harness. A local CLI, another Git host, a database-backed application, or an agent framework can implement the same abstractions differently. Each form tests which parts of the abstraction remain stable. The shared form may become clearer as several working implementations accumulate.

GitHub is useful here because it packages Git history, permissions, Issues, pull requests, notifications, and a mobile app into one low-barrier hosted service. The repository is user-controlled and file-based, but it is not local to your device merely because it belongs to you. It becomes locally available when you clone or download it, and a local CLI harness adds execution and controls that this hosted guide does not provide.

## Understand the Layer Before You Build It

The simplest useful loop is:

1. **You open an Issue** describing a request, correction, question, or decision.
2. **The agent reads the repository** before proposing work.
3. **The agent asks for missing context** in the Issue or your connected conversation.
4. **The agent prepares a change** on a branch, when it has write access.
5. **A pull request shows the exact proposal** and its relationship to the Issue.
6. **You review the diff and respond.**
7. **You merge only when the change represents your intent.**
8. **The accepted context becomes available to the next conversation.**

Nothing in this loop makes the repository an autonomous agent. It creates dependable friction: a request is visible, a proposal is isolated, acceptance is explicit, and the result survives the chat.

## The GitHub Words That Give You Control

Your agent should not recite definitions at you. It should ask enough about your background to explain these building blocks through a familiar example, then return to the exact GitHub meaning.

| GitHub word | What it does for you |
| --- | --- |
| **Repository (repo)** | The project home: its files, history, requests, and review surfaces. |
| **README** | The front door. It tells a person or agent what the project is and where to begin. |
| **Project instructions** | A file such as `AGENTS.md` that states how an agent should work, what it must preserve, and what it must not do. |
| **Issue** | A durable request, question, correction, or decision thread. This is the main phone-friendly interaction point in this guide. |
| **Comment** | A continuation of the Issue or pull-request conversation that remains attached to the work. |
| **Commit** | A named checkpoint recording a set of file changes. |
| **Branch** | An isolated line of proposed work that does not change the accepted `main` state. |
| **Diff** | The exact additions, removals, and replacements between two versions. |
| **Pull request (PR)** | The review packet that explains a branch and proposes adding it to `main`. |
| **Merge** | Your acceptance of the pull request into the repository's current state. |
| **`main`** | The accepted current version of the project, not an eternal final version. |

For a filmmaker, an Issue may be a request to develop a trailer-selection method. The branch is the editing room where the method is proposed. The diff shows exactly how the method changed. The pull request is the review screening. Merge is the filmmaker's decision that this version is ready to become part of the working system.

That analogy helps only if it matches the person. A physician, architect, parent, or researcher should receive an example from their own world.

## Part 1 — Create or Secure Your GitHub Account

If you already have a personal GitHub account that you control, use it. Otherwise:

1. Open [github.com/signup](https://github.com/signup).
2. Create a personal account and verify its email address.
3. Enable two-factor authentication.
4. Store the recovery codes somewhere you can reach if you lose your phone.

Do not give your password, authentication code, recovery code, personal access token, or secret key to an AI agent. Authentication should occur in GitHub's own screens.

GitHub currently recommends a time-based one-time-password app as the primary second factor and a passkey or security key as a backup. GitHub Mobile can also be a backup method. Follow GitHub's current [two-factor authentication guidance](https://docs.github.com/en/authentication/securing-your-account-with-two-factor-authentication-2fa/about-mandatory-two-factor-authentication).

## Part 2 — Install GitHub Mobile

GitHub Mobile is available for Android and iOS. Use GitHub's official [GitHub Mobile page](https://github.com/mobile) to reach the current store listing for your device.

1. Install **GitHub** from the Apple App Store or Google Play.
2. Sign in to the same account that will own the repository.
3. Complete authentication in GitHub's own flow.
4. Allow notifications if you want to see Issue comments, pull-request activity, review requests, or mentions.
5. Open the **Profile** tab and confirm that the expected username is active.

GitHub Mobile can browse repositories, work with Issues and pull requests, review notifications, search code, and support account verification. GitHub's current capabilities are listed in the [GitHub Mobile documentation](https://docs.github.com/en/get-started/using-github/github-mobile).

Use the phone for short, consequential interactions: opening a request, correcting the agent, answering a question, inspecting the summary and diff, and deciding whether work needs another revision. Use a computer when a large diff or account setting needs more space.

## Part 3 — Create One Private Repository

It is usually easiest to create and configure the repository in a web browser.

1. Sign in to GitHub and open [github.com/new](https://github.com/new).
2. Choose your personal account as the owner.
3. Give the repository a plain name connected to the work, such as `film-workspace`, `course-development`, or `studio-operations`.
4. Add a short description.
5. Select **Private**.
6. Turn **Add a README file** on.
7. Create the repository.

Private means the repository is not publicly visible by default. It does not mean it is a password vault or an approved home for every category of data. Do not place credentials, secret keys, authentication codes, patient information, unapproved employer or client material, regulated records, or another person's private information in it. Use dedicated secret managers and the policies that govern your work.

Give an agent access only to the repository it needs. Access to one project should not silently become access to every repository in your account.

## Part 4 — Let the Agent Learn the Person Before Designing the Files

The repository should reflect the user's work rather than impose a universal folder structure.

Ask your agent:

> Help me turn one continuing project into a small private GitHub workspace. Before suggesting files, use what you already know about me and ask one high-value question at a time about the project's purpose, current state, repeated work, important decisions, privacy boundaries, and what I want to stop reconstructing. Explain GitHub terms through my background. Do not create or change anything yet.

The agent should form a provisional model and let you correct it. It should identify:

- the purpose of the project;
- what is currently happening;
- which facts and decisions should persist;
- which requests recur;
- which material must stay out of the repository;
- what the agent may propose;
- what always requires human review; and
- what a future conversation must be able to recover.

Only then should it propose the smallest useful structure.

## Part 5 — Create the Smallest Useful Context

A beginning structure might be:

```text
your-project/
├── README.md
├── AGENTS.md
└── context/
    ├── current-state.md
    └── decisions.md
```

This is a starting vocabulary, not a required architecture.

### `README.md`

The README answers:

- What is this project?
- Why does it matter?
- What is happening now?
- Where should a person or agent look next?

### `AGENTS.md`

The instruction file answers:

- How should an agent begin?
- What must it preserve?
- What may it change?
- What must never enter the repository?
- Which checks should it run?
- Who is allowed to merge?

`AGENTS.md` is the conventional project-instruction filename for Codex. Another agent may use a different instruction filename. The stable idea is more important than the name: keep the working agreement beside the work, and do not duplicate it into several files unless the tools you actually use require that.

A useful first version is:

```markdown
# Project instructions

Read `README.md`, `context/current-state.md`, and `context/decisions.md`
before proposing work.

## Working relationship

- Explain unfamiliar terms in language connected to the user's background.
- Ask when intent, evidence, privacy, or authority is unclear.
- Treat Issues as requests and interaction threads.
- Prepare material changes on a focused branch and link the pull request to the Issue.
- Show the exact diff and summarize what changed, what remains open, and how it was checked.
- Never merge, publish, send, purchase, or contact another person without explicit approval.
- Never add credentials, secret keys, regulated data, private client or employer material, or another person's personal information.
- Accepted context can improve later. When new information changes an earlier decision or explanation, identify the affected files and propose a backward audit.
```

### `context/current-state.md`

Keep this short enough that a new conversation can recover the work quickly:

- present objective;
- current stage;
- recent progress;
- blockers or uncertainties;
- next useful action; and
- last reviewed date.

### `context/decisions.md`

Record decisions that should survive conversation:

- decision;
- reason;
- evidence or source;
- date;
- what it affects; and
- what could cause it to be revisited.

Do not preserve every sentence from every chat. Preserve the context needed to continue, review, and correct the work.

### Put the first files in the repository

If you have not connected an agent yet, use GitHub's web interface:

1. Open the repository.
2. Select **Add file**, then **Create new file**.
3. Create `AGENTS.md` and commit it with a message such as `Add project working agreement`.
4. Repeat for `context/current-state.md` and `context/decisions.md`. GitHub creates the `context` folder when the slash is part of the file name.

These first scaffolding commits can go directly to `main` because you are establishing an empty repository. After the working relationship exists, use branches and pull requests for material changes.

If your connected agent already has verified write access, you can instead ask it to create the initial structure on a branch and open a pull request. Review the wording before merging; the files will shape later conversations.

## Part 6 — Connect ChatGPT, Codex, or Another Agent

The exact interface depends on the product and account. Treat every connection as a permission decision.

### ChatGPT or ChatGPT Work

On a supported ChatGPT surface:

1. Open **Plugins**.
2. Find and install the GitHub plugin.
3. Connect your GitHub account when prompted.
4. Authorize only the repository or repositories required for the work.
5. Start a new chat so the installed connection is available.

OpenAI's current [plugin documentation](https://learn.chatgpt.com/docs/plugins) explains installation, authentication, and use. A workspace administrator may control which plugins are available.

### Codex cloud

1. Open Codex and sign in with your ChatGPT account.
2. Connect GitHub when prompted.
3. Select the private repository.
4. Create an environment for it.
5. Begin with a read-only inspection request.
6. Review summaries and diffs before opening or merging a pull request.

OpenAI's current [Codex cloud guide](https://learn.chatgpt.com/docs/cloud) describes the repository and environment flow.

### Another agent

Use the provider's official repository integration. Grant the narrowest practical access, verify the exact repository, and ask the agent to state what it can actually do before relying on it.

## Part 7 — Test the Direct Repository Connection

Do not accept a web search result, a public website page, or a remembered copy as proof that the agent can use your private repository.

Give the connected agent this test:

> Use the direct GitHub connection, not web browsing. Work only with `[OWNER/REPOSITORY]`. Do not change anything. Read `README.md` and any project instruction file. Then tell me: (1) the repository's purpose, (2) its current state, (3) which exact GitHub capabilities you have here—read files, read or create Issues, comment, create branches, change files, open pull requests, or merge—and (4) which of those capabilities you have not verified. Treat access and authority as different: even if a tool permits a merge, do not merge for me.

The test succeeds only when the agent names the correct repository and reports its observed capability honestly.

If the agent cannot reach the repository, fix the connection or repository authorization. Do not substitute browsing the repository's website as if that were the same capability.

Use the observed result—not the product name—to choose the next route:

| What the agent demonstrates | What to do next |
| --- | --- |
| It cannot identify or read the exact repository | Stop and repair the connection or repository authorization. |
| It can read files but cannot read Issues | Keep requests in chat temporarily or copy the Issue text, while treating repository files as accepted context. |
| It can read files and Issues but cannot write | Use the read-only patch path. |
| It can comment or create Issues but cannot change files | Use Issues for interaction and apply approved file changes manually or through another authorized agent. |
| It can change files and open pull requests | Use the branch-and-PR path, while keeping merge authority with the user. |
| A capability is untested | Mark it unknown and test it with a harmless, reversible action only when that capability becomes necessary. |

### Keep an exit path

You should know how to reduce or remove the connection. In GitHub, open **Settings**, then **Applications**, and review the authorized or installed GitHub Apps and OAuth apps. Narrow repository access or revoke an app you no longer use. GitHub's current guidance explains how to [review installed GitHub Apps](https://docs.github.com/en/apps/using-github-apps/reviewing-and-modifying-installed-github-apps) and [review authorized OAuth apps](https://docs.github.com/en/apps/oauth-apps/using-oauth-apps/reviewing-your-authorized-oauth-apps).

Revoking a connection may stop future tool access. It does not delete the repository or its accepted history.

## Part 8 — Use Issues as Requests From Your Phone

Open the repository in GitHub Mobile, select **Issues**, and create a new Issue. GitHub supports Issue creation through the web interface and GitHub Mobile; the exact button placement can change.

If **Issues** is not available, open the repository settings in a browser and confirm that the Issues feature is enabled before treating the connection as broken.

Use a short title that describes the outcome:

> Define how trailer candidates should be selected

The body can follow this small pattern:

```markdown
## Outcome
What should be different when this request is complete?

## Why it matters
Why is this worth doing now?

## Context
What should the agent read or know?

## Boundaries
What must not change or happen?

## Done when
What evidence would let me review the result?
```

You do not need to complete every heading perfectly. The Issue begins the request; the agent can ask questions in the thread.

Use comments for clarification, correction, and review. If the request changes substantially, ask the agent to summarize the revised understanding before it continues. A correction should not vanish into conversation: when it has continuing value, the accepted change should update the relevant file or instruction.

GitHub describes Issues as a way to plan, discuss, and track requests, ideas, bugs, and other work. See [About Issues](https://docs.github.com/en/issues/tracking-your-work-with-issues/learning-about-issues/about-issues) and [Creating an Issue](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/creating-an-issue).

## Part 9 — Follow the Path Your Agent Actually Supports

### Path A — Read and write with pull requests

Ask the agent to:

1. read the Issue and relevant repository context;
2. restate the requested outcome and unresolved questions;
3. create a focused branch;
4. make the smallest coherent change;
5. check the result;
6. open a pull request linked to the Issue; and
7. wait for your review.

The pull request should explain:

- what changed;
- why it changed;
- what files are affected;
- what was checked;
- what remains uncertain; and
- what earlier context may need a backward audit.

### Path B — Read-only repository access

The agent can still read the accepted context and the Issue. Ask it to prepare:

- the exact proposed replacement text or patch;
- the target file and location;
- a review summary; and
- any unanswered question that blocks a responsible change.

You can apply the patch through GitHub's editor, give it to a write-capable agent, or move to a local tool later. Do not pretend read access is write access.

### Path C — No direct connection yet

Use the repository manually while you repair or establish the connection. Copy the Issue text into the conversation and copy approved results back into GitHub. The repository can still be the accepted home even when transport is manual.

## Part 10 — Review on GitHub Mobile

When a pull request is ready, open it from the notification or repository.

1. Read the agent's summary.
2. Open **Files changed** and inspect the diff.
3. Ask what was removed, not only what was added.
4. Check whether the change follows the Issue and preserves unrelated context.
5. Comment with corrections or questions.
6. Request another revision if the result is not ready.
7. Merge only when the proposal represents your intent and the relevant checks are credible.

For a large or consequential change, review on a larger screen. Mobile access makes the interaction continuous; it does not make every decision small.

After merge, close the Issue when its request is genuinely resolved. If the work reveals a different request, create a new Issue and link the two rather than stretching one thread into an invisible project.

## Part 11 — Run the Fresh-Conversation Test

Start a new conversation with the connected agent and provide only the repository name.

Ask:

> Read the accepted repository context through the direct GitHub connection. Without using our earlier chat, explain the project's objective, current state, important decisions, open request, human authority boundary, and next useful action. Cite the files or Issues that support each part. Do not change anything.

The repository is beginning to work as a continuity layer if the agent can recover:

- the right objective;
- the current stage;
- the decision history;
- the active question or request;
- what it may and may not do; and
- the next action without inventing missing context.

If it fails, do not add every chat transcript. Identify the smallest missing context and improve the relevant README, state file, decision record, Issue, or instruction.

## What This Layer Gives You—and What It Does Not

This setup gives you user-controlled context, visible requests, version history, isolated proposals, review, and recovery. It can reduce repeated explanation and let more than one suitable agent begin from the same accepted state.

It does not automatically provide:

- local execution under your control;
- hooks that run before or after agent actions;
- background jobs or schedules;
- independent credential management;
- strong enforcement of every natural-language rule;
- complete portability of provider-specific behavior; or
- proof that the agent understood the work correctly.

Those limitations are not failures of the first step. They define what this hosted layer is and show when a local or more complete harness may become valuable.

## Keep the Repository Alive Without Treating It as Final

Accepted files are the current stable layer, not permanent truth.

When new work introduces a better distinction, correction, or method, ask:

- Which current file should change?
- Does this new context alter an earlier decision or instruction?
- Which other Issues, guides, or project surfaces now need review?
- Is there enough evidence to update them, or should the question remain open?

This backward audit prevents the repository from becoming a pile of locally correct but mutually inconsistent documents. It also avoids forcing an answer before the project has enough context to support one.

## Copy This Guided-Conversation Instruction

Give the following instruction—and the link to this guide—to the agent you want to help you onboard:

> Run Hadosh Academy Practical Guide 3, “Give Your AI Work a Private GitHub Home,” with me as an adaptive guided conversation.
>
> Treat this guide as one entry point into the wider Hadosh Academy context. Read the linked Academy pages that are relevant to my situation, and use [Start Here](../../start-here.html) when broader orientation is useful. Do not make me study the whole website before beginning, and do not treat every project or implementation on the website as a prescribed architecture.
>
> Begin with what you already know about my background, projects, tools, and level of technical comfort. State a short provisional understanding, label uncertainty, and ask me to correct it. Ask one high-value question or one small related group at a time. Do not administer a fixed questionnaire, repeat what you already know, or assume I am a developer.
>
> Teach the central substrate model when it helps: files make context inspectable; Git records and compartmentalizes change; GitHub supplies hosted permissions, Issues, pull requests, notifications, and mobile access. Explain that this is a user-controlled, file-based hosted layer, not yet a fully local runtime. If I later clone the repository or use a local CLI, explain what additional locality and control that provides.
>
> Help me choose one real continuing project where durable context would reduce repeated explanation. Teach repository, README, project instructions, Issue, comment, commit, branch, diff, pull request, merge, and `main` through examples connected to my own work, then state their exact GitHub meanings.
>
> Guide me through creating or securing a GitHub account, enabling recovery-aware two-factor authentication, installing GitHub Mobile on my phone, creating one narrowly scoped private repository, and deciding what information must stay outside it. Authentication must remain in GitHub's screens. Never ask me to paste passwords, authentication codes, recovery codes, access tokens, secret keys, regulated information, private client or employer data, or another person's personal information into the conversation or repository.
>
> Before proposing repository structure, understand the project's purpose, current state, repeated work, important decisions, privacy boundaries, review needs, and what a future conversation must recover. Propose the smallest useful set of files and explain why each one earns its place. Treat Issues as the main request and interaction surface, especially from GitHub Mobile.
>
> Help me connect GitHub to ChatGPT, Codex cloud, or the agent I am using through the product's supported connection. Grant the narrowest practical repository access. Then test the direct repository connection without browsing the web or changing files. Report observed capabilities separately: reading files; reading, creating, or commenting on Issues; creating branches; changing files; opening pull requests; and merging. Never infer a capability from the product name. Access is not authority.
>
> Follow the path the verified capability supports. With write access, use a focused branch and pull request. With read-only access, prepare an exact patch for review. With no connection, keep the repository as the accepted home while helping me move approved context manually and repair the connection.
>
> Preserve human authority. Do not merge, publish, send, purchase, contact another person, expand permissions, or make another consequential external change without my explicit approval. Show the exact diff, what was removed, what was checked, what remains uncertain, and which earlier context may need a backward audit.
>
> Finish by helping me open one useful Issue from my phone, carry it through the supported review path, and run a fresh-conversation continuity test. The result should be a working hosted continuity layer I understand—not a claim that we have built a complete local harness.

## Completion Check

The first version is established when you can answer yes to these questions:

- Do I own and control the private repository?
- Can I reach it through GitHub Mobile?
- Can I open a useful Issue as a request?
- Can my agent prove direct access to the correct repository?
- Do I know whether that access is read-only or write-capable?
- Can a fresh conversation recover the project's objective and current state?
- Can I see an exact proposal before accepting it?
- Does merge remain my decision?
- Do I know which sensitive material must stay outside the repository?
- Do I understand that this is a hosted continuity layer rather than a complete local harness?

If yes, you have created a practical bridge between conversational AI and a user-controlled working context. You can now improve it through real use: one request, one correction, one reviewed change, and one retained lesson at a time.

For a diagnosis of your broader AI-use and ownership position, run [Practical Guide 2: The Agentic AI Use Doctor](02-audit-ai-harness-portability.html). If your project should become a public website, continue with [Practical Guide 1: Build Your Own Space on the Web](01-build-your-own-space-on-the-web.html).

---

*Practical Guide 3. Start with one repository, one real project, and one reviewable request.*
