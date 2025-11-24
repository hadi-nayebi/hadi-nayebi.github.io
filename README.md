# Hadosh Academy Website (v2.0)

The official website for Hadosh Academy, the HQ for democratizing AI Agent Engineering.

## Overview

This repository hosts the Hadosh Academy website, which serves as:
-   **Consulting Hub**: Showcasing the "Teaching Assistant" and other custom agents.
-   **Community Gateway**: Linking to the Skool community.
-   **Blog**: A platform for thought leadership on Agentic AI.

## Structure

### v2.0 (Current - Root)
The modern, glassmorphism-based design system.

```
/
├── index.html              # Landing page (The Academy, Skool, Agents)
├── about.html              # Bio page (Hadi Nayebi)
├── blog.html               # Blog with sticky sidebar
├── contact.html            # Contact form (FormSubmit.co)
├── teaching-assistant.html # Agent showcase
├── 404.html                # Custom 404 page
├── css/
│   └── styles.css          # Single source of truth for v2 styling
├── js/
│   ├── theme-manager.js    # Dynamic themes & profile pics
│   └── wheel.js            # Orbit animation logic
└── assets/images/          # Shared image assets
```

### v1.0 (Legacy Archive)
The previous iteration of the site, focused on "Claude Code Engineering" cohorts.
Located in `/v1/`.

```
/v1/
├── index.html              # Legacy landing page
├── bio.html                # Legacy bio
├── agents/                 # Legacy agent examples
└── assets/                 # v1-specific assets (css/js)
```

## Technology Stack

-   **Pure HTML/CSS/JS**: No build steps, easy to deploy.
-   **Design System**: Custom CSS variables for theming (glassmorphism, neon glows).
-   **Dynamic Theming**: JavaScript-based random theme injection on page load.

## Local Development

1.  Clone the repository:
    ```bash
    git clone https://github.com/[username]/hadi-nayebi.github.io.git
    cd hadi-nayebi.github.io
    ```

2.  Run a local server:
    ```bash
    python3 -m http.server 8000
    ```

3.  Visit `http://localhost:8000`

## Contributing

-   **v2 Updates**: Edit files in the root directory. Use `css/styles.css` for styling.
-   **v1 Updates**: Do not update v1 unless necessary for archival purposes.

## License

[TBD]
