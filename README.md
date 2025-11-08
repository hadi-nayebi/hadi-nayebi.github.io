# Claude Code Engineering Course Website

A course website for learning to build and customize AI agents using Claude Code.

## Overview

This website serves as:
- Landing page for the Claude Code Engineering course
- Documentation for the template agent
- Showcase of customized agent examples
- Each agent example manages its own page autonomously

## Design Philosophy

**Core Message**: "Engineering my own agents is not complex and overwhelming. It is easy, smooth, and relaxed."

The website uses a dark, glassy, space-like aesthetic to visually communicate that building AI agents is:
- Approachable and accessible
- Smooth and intuitive
- Not intimidating or overwhelming

## Structure

```
/
├── index.html              # Landing page (course overview)
├── bio.html                # Personal bio page
├── template-agent.html     # Template agent documentation
├── agents/
│   ├── example-1.html      # Agent-managed page 1
│   ├── example-2.html      # Agent-managed page 2
│   ├── example-3.html      # Agent-managed page 3
│   └── CLAUDE.md           # Agent pages working memory
├── assets/
│   ├── css/
│   │   ├── main.css        # Core styles, design system
│   │   ├── glassmorphism.css   # Glass effects
│   │   └── components.css  # UI components
│   ├── js/
│   │   └── main.js         # Minimal interactions
│   └── images/
├── .claude/                # Knowledge management system
│   ├── CLAUDE.md
│   └── knowledge/
└── CLAUDE.md               # Root instructions
```

## Technology Stack

- **Pure HTML/CSS/JS** - No build process, no dependencies
- **Static site** - Fast, simple, easy to maintain
- **GitHub Pages ready** - Deploy directly from repository
- **Agent-friendly** - Agents can update pages via git commits

## Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/[username]/hadi-nayebi.github.io.git
   cd hadi-nayebi.github.io
   ```

2. Open in browser:
   ```bash
   # Simple HTTP server (Python 3)
   python3 -m http.server 8000

   # Or using Node.js
   npx http-server
   ```

3. Visit `http://localhost:8000`

## Agent-Managed Pages

Pages in `/agents/` are designed to be autonomously updated by customized agents:
- Each agent has its own dedicated page
- Agents update content via git commits
- Workflow and topics TBD (see `agents/CLAUDE.md`)

## Current Status

**Phase**: Structure with placeholders
- ✅ Site structure created
- ✅ Dark glassy space styling implemented
- ✅ All pages created with placeholders
- ⏳ Content to be added in next phase
- ⏳ Agent topics to be defined
- ⏳ Agent workflow to be configured

## Design System

See `/assets/css/main.css` for the complete design system including:
- Color palette (dark space theme)
- Typography scale
- Spacing system
- Glass effect parameters
- Component styles

## Contributing

This is a course website. Updates should maintain:
1. Design philosophy and aesthetic
2. Placeholder format `[Description]`
3. Compartmentalization (structure vs. content)
4. HTML/CSS/JS simplicity

## License

[TBD]

---

Built with ❤️ using pure HTML, CSS, and JavaScript.
