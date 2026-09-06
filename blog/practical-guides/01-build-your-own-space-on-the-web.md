# Build Your Own Space on the Web

*Practical Guide 1 — Publish a personal static website and grow it through conversation with an AI agent.*

In a few hours, you can create a useful place on the internet that begins with your own idea, lives in files you control, and can grow whenever you have something new to share.

It might become your professional portfolio. It might collect recipes, paintings, research notes, local history, clothing designs, sports analysis, teaching material, travel stories, or a subject that only you would think to organize in this way. It can begin as one page and gradually become a substantial public body of work.

You do not need to learn software development before you begin. You will learn a small amount of practical language—repository, commit, branch, pull request, and deployment—because those words let you understand what your agent is doing and keep you in control of what becomes public.

This is the objective of the guide:

> Build the smallest useful space of your own on the web, publish it at little or no cost, and establish a working relationship in which your AI agent can help you improve it without taking ownership away from you.

## What You Will Have at the End

By the end of the first path, you will have:

- a public web address you can share;
- a website organized around your own purpose;
- the files that create the site;
- a recorded history of every accepted change;
- a way to ask ChatGPT, Codex, or another coding agent to improve it;
- enough vocabulary to review those improvements before publishing them; and
- a foundation that can later move to a custom domain or another host.

The first version does not need to represent everything you may eventually build. Its job is to make the first piece real.

## A Static Website Can Already Do a Great Deal

A static website is made from files that a visitor's browser can load directly: HTML for structure, CSS for appearance, JavaScript for interaction, and images, audio, video, or documents for media.

That foundation supports much more than a page of text. A static site can contain:

- a portfolio, résumé, biography, and contact surface;
- articles, stories, essays, tutorials, or documentation;
- recipes, collections, galleries, maps, and visual archives;
- interactive diagrams, filters, calculators, slideshows, and browser-based tools;
- links or embeds for video, newsletters, booking, events, communities, and social accounts;
- contact and application forms handled by a form service;
- public discussion through a service such as GitHub Discussions and Giscus; and
- payment links or embedded buttons whose secure checkout is handled by a provider such as Stripe.

The site presents and organizes your world. When a specialized service is useful, the site can become the doorway to that service. Stripe, for example, provides hosted Payment Links and embeddable buy buttons, so the website does not need to collect card details itself.

[Hadosh Academy](../../index.html) is itself a static website hosted with GitHub Pages. It includes long-form writing, visual stories, interactive diagrams, project pages, a contact form, GitHub-based discussions, RSS, and links to payment and community services. A static foundation has not prevented the site from becoming a varied public environment.

If you later need accounts, a private database, complex server-side workflows, or a full application, the website can grow toward those capabilities. The pages, writing, visual identity, and accumulated decisions you begin here remain useful context for that next system.

## The Simple Architecture

Your first website has five parts:

1. **You** decide what the space is for and what should become public.
2. **Your AI agent** helps translate your intent into pages, styles, and changes.
3. **The repository** stores the files and remembers their history.
4. **The host** publishes those files at a web address.
5. **Visitors** read or use the published result.

The durable asset is the repository and the content inside it. The model and hosting provider can change later. Your accumulated work does not need to begin again with each change of tool.

## Choose the Easiest Starting Path

There are three useful entry points. They all lead to the same kind of website.

### Path A — Chat and a Web Browser

Use ChatGPT or another conversational AI to prepare the page. Copy the finished file into your repository through the hosting platform's web interface.

This requires no terminal and no local installation. It is the lowest-barrier path and a complete way to publish the first version.

### Path B — Connect a Cloud Agent to the Repository

Authorize a supported agent, such as Codex cloud, to work with the website repository. Ask for an improvement, review the proposed file changes or pull request, provide feedback, and merge when satisfied.

This removes most copying while preserving the repository and review history.

### Path C — Work Locally with a CLI Agent

Clone the repository onto a laptop and open it with Codex CLI, Claude Code, Gemini CLI, Qwen Code, OpenCode, GitHub Copilot, or another agent that can read and edit local files.

This provides the richest working relationship. The agent can inspect the complete site, run it locally, verify links and layouts, manage branches, and help prepare pull requests. You can begin with Path A and move here whenever you are ready.

The rest of this guide uses GitHub Pages and ChatGPT/Codex for the complete first route. Later sections show how the same asset can use other hosts and agents.

## Part 1 — Decide What Your Space Is For

Begin with one conversation. Do not begin by selecting colors or a software framework. Give the agent enough information to understand the human purpose.

You can start with this prompt:

> I want to build a small personal website that I can grow over time. I do not have a technical background. Help me decide the purpose, audience, name, and first three sections. Ask me one question at a time. The first version should be useful within a few hours, not a complete representation of everything I may eventually build.

Your first answer may be as simple as:

- “A professional home for my architecture work.”
- “A place where I collect and explain regional Persian recipes.”
- “A gallery and journal for the hats I design.”
- “A public notebook about the local basketball teams I follow.”
- “A teaching portfolio for parents and schools.”

Choose one primary purpose and a first visitor. You can add other dimensions later.

### First checkpoint

Before creating an account, be able to complete this sentence:

> This website is a place where I __________ for people who __________.

That sentence gives your agent a better design direction than a long list of features.

## Part 2 — Create a Free GitHub Account

GitHub is a repository service: it stores files, records their history, and supports structured review. GitHub Pages publishes static websites directly from those repositories.

1. Open [github.com/signup](https://github.com/signup).
2. Create a free personal account.
3. Choose your username carefully. For the personal-site route, it becomes part of your web address.
4. Verify your email address. GitHub requires a verified address for basic actions such as creating a repository.
5. Set up two-factor authentication while the account is still new.

If your username is `samira-cooks`, the free personal-site address will be:

`https://samira-cooks.github.io`

GitHub Pages is available from public repositories on GitHub Free. GitHub also supports one main user site for an account and project sites associated with other repositories. See GitHub's current [Pages overview](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages) and [account guide](https://docs.github.com/en/account-and-profile/how-tos/account-management/creating-an-account-on-github).

## Part 3 — Create the Website Repository

After signing in to GitHub:

1. Select **New repository**.
2. Name it exactly `YOUR-USERNAME.github.io`, replacing `YOUR-USERNAME` with your actual GitHub username.
3. Set the repository to **Public**.
4. Turn **Add a README file** on.
5. Select **Create repository**.

The exact repository name is important. It tells GitHub that this is the main website for your account.

You now own the container for your website. The repository will hold the visible pages and the instructions that help future agents work with them.

## Part 4 — Ask ChatGPT to Create the First Page

Return to ChatGPT. You can continue the earlier conversation or begin a new one with the purpose sentence you created.

Use this prompt and replace the bracketed parts:

> Create the first version of my personal website as one complete `index.html` file that I can publish with GitHub Pages.
>
> Purpose: [your purpose sentence]
>
> Include: [your name or site name], a clear introduction, three useful sections, and these contact or social links: [links, or “none yet”].
>
> Make it polished, readable, accessible, and responsive on phones and computers. Use plain HTML and CSS inside the single file, with no build system or external framework. Do not invent biography, credentials, projects, testimonials, contact information, or links. Ask me for missing content before finalizing it. When the content is approved, give me the complete file in one code block and explain exactly where to paste it in GitHub.

The one-file constraint is useful for the first publication. It keeps the mechanism visible: one file enters the repository and becomes one website. Your agent can separate styles, scripts, articles, and images into their own files after the site starts growing.

Review the generated page as writing, not as code. Check:

- Is every personal fact correct?
- Does the opening explain what the site is for?
- Would the intended visitor know where to go next?
- Are you comfortable making every sentence and link public?
- Does the design feel close enough to begin?

Ask for changes in ordinary language until the content is ready.

## Part 5 — Put `index.html` in GitHub

In your new repository:

1. Select **Add file**, then **Create new file**.
2. Enter `index.html` as the file name.
3. Paste the complete code from ChatGPT into the editor.
4. Select **Commit changes**.
5. Use a short description such as `Publish the first website page`.
6. Confirm the commit.

A **commit** is a recorded version of the files. You are not merely saving over the past. You are adding a new point to a history that can be inspected and recovered later.

## Part 6 — Turn on GitHub Pages

In the repository:

1. Open **Settings**.
2. In the left sidebar, open **Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select the `main` branch and the `/ (root)` folder.
5. Save the setting.
6. Wait for the first deployment, then open `https://YOUR-USERNAME.github.io`.

GitHub notes that the first publication can take several minutes. Its [Pages quickstart](https://docs.github.com/en/pages/quickstart) shows the current interface and publishing steps.

Your first website is now real. Send the address to someone or open it on another device. The point of this moment is not perfection. It is the shift from discussing an idea to owning a working public surface.

## The Seven Words You Need for the Next Stage

You do not need to memorize Git. You do need enough shared language to understand what your agent proposes.

| Word | What it means in this website |
| --- | --- |
| **Repository** | The complete folder, history, and collaboration surface for the site. Often shortened to “repo.” |
| **Commit** | One recorded set of changes with a short explanation. |
| **Branch** | A separate working line where a change can be prepared without immediately changing the public site. |
| **Diff** | The exact lines added, removed, or changed. |
| **Pull request (PR)** | A review page proposing that one branch be added to the main site. |
| **Merge** | Your acceptance of the pull request into the main branch. |
| **Deploy** | The host publishing the accepted files as the live website. |

The normal rhythm is:

> You describe an improvement → the agent works on a branch → commits the files → opens a pull request → you review and respond → you merge → the host deploys the new site.

These terms are useful because they give you handles for directing the work. You can say, “Show me the diff,” “Keep this on a separate branch,” “Update the PR after my feedback,” or “Do not merge until I see the page.”

## Part 7 — Keep Growing It Through Chat

You can maintain the site without a direct GitHub connection. Ask ChatGPT for an updated complete file, replace the contents of `index.html` in GitHub, and commit the change.

Useful next requests include:

- “Add a portfolio section containing these three projects. Preserve everything else.”
- “Turn this recipe into a readable article and link it from the homepage.”
- “Create an About page using only the biography I provide.”
- “Improve the mobile layout without changing my words.”
- “Add a gallery for these ten images, with useful alternative text.”
- “Review the site for broken links, repeated text, and confusing navigation.”

As the site becomes larger, ask the agent to move shared styling into `styles.css` and create a clear file structure:

```text
YOUR-USERNAME.github.io/
├── index.html
├── about.html
├── articles/
├── projects/
├── assets/
│   └── images/
├── styles.css
├── AGENTS.md
└── README.md
```

The folders should follow your content. A cook may need `recipes/` and `ingredients/`. An artist may need `works/`, `exhibitions/`, and `process/`. A consultant may need `services/`, `case-studies/`, and `writing/`. Do not force every person into the same mature structure.

## Part 8 — Connect ChatGPT or Codex to the Repository

When your ChatGPT account provides the GitHub connection, you can let ChatGPT or Codex work with the repository directly.

### From ChatGPT

1. Open **Plugins** and find the GitHub plugin.
2. Install it and connect your GitHub account.
3. Authorize the website repository. Begin with only the repository the agent needs.
4. Start a new ChatGPT Work or Codex conversation so the connection is available.
5. Name the repository in your request and state whether the agent may edit files, open a pull request, or only advise.

OpenAI's current [plugin guidance](https://learn.chatgpt.com/docs/plugins) explains installation, authentication, connected tools, and repository-scoped permissions.

### From Codex cloud

1. Open Codex and sign in with your ChatGPT account.
2. Connect GitHub when prompted.
3. Select the website repository.
4. Create an environment for it.
5. Describe the change you want.
6. Review the summary and diff, ask for refinements, and open a pull request when ready.

The current [Codex cloud quickstart](https://learn.chatgpt.com/docs/cloud) covers this connection and review flow.

Use an instruction like this for the first connected change:

> Work only in `YOUR-USERNAME/YOUR-USERNAME.github.io`. First inspect the existing pages and explain the current structure in plain language. Then create a focused branch that adds [the requested improvement]. Preserve my approved content and visual identity. Keep the site static, accessible, and usable on phones. Check every changed link and review the final diff. Open a pull request for me, but do not merge it.

The agent is now operating on the asset rather than merely describing code in a separate chat. Your review remains the publication boundary.

## Part 9 — Give Future Agents Durable Instructions

A conversation can end. Repository instructions remain beside the website.

For Codex, create an `AGENTS.md` file in the root of the repository. Begin with a short charter like this:

```markdown
# Website instructions

This repository is my public personal website.

## Purpose

The site exists to [complete this sentence]. Its primary audience is [complete this sentence].

## Working rules

- Preserve my factual claims and voice. Ask when information is missing.
- Keep the site static, responsive, accessible, and easy to move to another host.
- Never add private information, credentials, secret keys, or unpublished personal material.
- Prepare meaningful changes on a focused branch and show me the diff.
- Check changed pages, navigation, and links before opening a pull request.
- Open a pull request for review. Do not merge or publish on my behalf.
```

Adapt the file as you learn what matters. Add preferred language, design principles, content categories, verification steps, and boundaries that have repeatedly proved useful.

Other agent runtimes may look for another instruction filename, such as `CLAUDE.md` or `GEMINI.md`. The principle is stable even when the filename changes: keep the website's purpose and operating rules with the website, where you can inspect and move them.

## Part 10 — Move to a Laptop and a CLI Agent

The browser path can keep working for a long time. A local checkout becomes useful when the site contains many pages or you want richer previews and verification.

Install Git and the CLI agent you want to use. For Codex, follow the current [Codex CLI installation guide](https://learn.chatgpt.com/docs/codex/cli). Then open a terminal and run:

```bash
git clone https://github.com/YOUR-USERNAME/YOUR-USERNAME.github.io.git
cd YOUR-USERNAME.github.io
codex
```

If this is your first time using a terminal, ask the agent to guide one command at a time and explain what each command changes. Authentication belongs to GitHub and your chosen agent; never place passwords, access tokens, or API keys in the public website files.

Start the local relationship with:

> Read `AGENTS.md` and inspect this website. Explain its structure and current publication workflow in plain language. Help me preview it locally. Do not change anything yet. After I confirm that understanding, help me plan one small improvement.

For each improvement, use the same review rhythm:

1. Create a focused branch.
2. Make the change.
3. Preview the page locally.
4. Check the relevant links and responsive layout.
5. Review the diff together.
6. Commit the accepted work.
7. Push the branch and open a pull request.
8. Merge only after your final review.

This is already a small harness. The repository carries purpose, content, history, operating rules, and a repeatable path from conversation to publication.

## Add Services Without Giving Up the Website

Your static site can remain the center while specialized providers perform particular jobs.

### Payments

Create a hosted checkout link or buy button with a payment provider and place the link on your site. Stripe's [Payment Links](https://docs.stripe.com/payment-links) are one example. The provider handles payment details; your page explains the offer and sends the visitor to the secure transaction surface.

### Forms and contact

Use a form service, a hosted form, or a simple email link. The page remains yours while the form provider receives and delivers the submission.

### Discussion and community

Link to a community, forum, or social account, or embed comments backed by a service such as GitHub Discussions. Hadosh Academy uses this pattern to place discussion beside static articles and project pages.

### Scheduling, newsletters, and events

Connect visitors to a booking page, newsletter service, event platform, video channel, or calendar. Your website becomes the stable map that explains how the pieces relate.

### Browser-side interaction

JavaScript can add filters, galleries, interactive diagrams, calculators, reading controls, and other behavior that runs in the visitor's browser. A static site can therefore be interactive without becoming a full server application.

The practical rule is simple: public configuration can live in the site; credentials and secret keys belong in the service that protects them.

## GitHub Is a Starting Route, Not the Definition

The asset should not depend conceptually on one host. GitHub is the primary route in this guide because it combines a free public repository, version history, pull requests, agent integrations, and static hosting in one place.

Other useful routes include:

| Host | What it offers | How the ownership pattern carries over |
| --- | --- | --- |
| **GitLab Pages** | Static sites from GitLab projects on its Free tier, with CI/CD deployment and custom-domain support. | Keep the site in a GitLab repository and use merge requests instead of pull requests. |
| **Cloudflare Pages** | A free Pages plan, Git integration, direct upload, preview deployments, and custom domains. | Keep the canonical files in GitHub or GitLab and let Cloudflare publish each accepted change. |
| **Netlify** | Git-connected continuous deployment, deploy previews, and direct drag-and-drop publishing. | Keep the repository as the source of truth even if Netlify becomes the host. |
| **Vercel** | A free Hobby plan for personal, non-commercial work, Git integration, previews, and automatic HTTPS. | Connect the same repository and move to a suitable plan if the site becomes commercial. |

See the providers' current documentation before choosing: [GitLab Pages](https://docs.gitlab.com/user/project/pages/), [Cloudflare Pages](https://developers.cloudflare.com/pages/), [Netlify deploys](https://docs.netlify.com/deploy/create-deploys/), and [Vercel plans](https://vercel.com/docs/plans).

You can also keep the repository on GitHub and host the site elsewhere. Repository provider, publishing provider, domain registrar, and AI agent are separable roles. That separability is part of the ownership design.

## Your Agent Can Change Too

Codex is the primary worked example because it can operate in ChatGPT, in the cloud, and locally against a repository. It is not the only possible runtime.

Claude Code, Gemini CLI, Qwen Code, OpenCode, GitHub Copilot, and other coding agents can all participate in a repository-based workflow. Some work locally. Some connect through GitHub Actions or their own cloud integrations. The stable requirements are more important than the brand:

- the agent can inspect the existing files before changing them;
- it can edit the repository rather than trapping the result in a chat response;
- it can respect repository-level instructions;
- it can show the proposed change;
- it can run relevant checks; and
- it can leave publication or merge authority with you.

If you change agents, begin with the repository, `README.md`, and the applicable instruction file. Ask the new agent to explain the current structure before it edits anything. The intelligence provider changes; the website and its accumulated context stay in place.

## Move to a Personal Domain When It Becomes Valuable

The free address is enough to begin. Later, you can buy a domain such as `yourname.com` or a name connected to your subject and point it to the same static site.

A personally registered domain gives the public address another layer of portability. You can move from GitHub Pages to GitLab Pages, Cloudflare Pages, Netlify, or another host while keeping the address people already know. The repository continues to hold the site; the domain continues to point visitors toward it.

The useful sequence is:

1. Build something worth visiting.
2. Learn what name and structure actually fit it.
3. Add a domain when a stable public identity is valuable.
4. Keep the files and history portable throughout.

You do not need to delay the first page while deciding the final form of the tenth version.

## A Good First Month

After publishing, grow the website through small, visible cycles.

### Week 1 — Establish the home

Publish the homepage, purpose, first three sections, and a reliable way to contact or follow you.

### Week 2 — Add one real piece of work

Publish one article, project, recipe, artwork, analysis, story, or resource that gives the site substance.

### Week 3 — Improve the path for visitors

Ask someone to use the site. Improve navigation, readability, mobile behavior, and the next action a visitor should take.

### Week 4 — Improve the agent relationship

Update the repository instructions with what you learned. Add a simple review checklist. Ask the agent to identify repeated manual work that could become a reliable script or workflow.

After four weeks, the value is larger than four pages. You have a public asset, a working vocabulary, a history of decisions, and experience directing an agent through a real project.

## Your Completion Check

The first version is established when you can answer yes to these questions:

- Can I open the website from its public address?
- Does it clearly express one purpose that belongs to me?
- Is at least one piece of real content present?
- Do I know where its files and history live?
- Can I ask my agent for one focused change?
- Can I inspect that change before it becomes public?
- Could I download or clone the site and continue with another tool?

If yes, you have built more than a profile inside another platform. You have established a small place on the open web, learned the first language needed to direct its development, and created an asset that can grow with your interests and professional life.

The next improvement can begin as simply as the first one:

> Visit my website, understand what it is becoming, and help me add one useful thing without losing what already works.

---

*Practical Guide 1. Build something small enough to begin and useful enough to keep.*
