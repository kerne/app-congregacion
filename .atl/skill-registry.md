# Skill Registry — app-congregacion

Generated: 2026-04-11

## User Skills

| Skill | Trigger |
|-------|---------|
| agent-development | "create an agent", "add an agent", "write a subagent", agent frontmatter, agent structure |
| appscript-backend | Google Apps Script backend, Code.gs, google.script.run, Sheets access |
| appscript-config | appsscript.json, deployment, OAuth scopes, Apps Script setup |
| appscript-frontend | Google Apps Script SPA, Index.html, Bootstrap 5, google.script.run frontend |
| appscript-sheets-access | Apps Script permissions, OAuth authorization, executeAs config |
| branch-pr | Creating a pull request, opening a PR, preparing changes for review |
| ddd | Domain-Driven Design, aggregates, bounded contexts, ubiquitous language, domain events |
| find-skills | "find a skill for X", "is there a skill that can...", discover capabilities |
| frontend-design | Build web components, pages, or applications; production-grade frontend interfaces |
| go-testing | Go tests, Bubbletea TUI testing, teatest, adding test coverage |
| google-drive | Google Drive read/write/search, Docs/Sheets via MCP |
| hook-development | "create a hook", PreToolUse/PostToolUse/Stop hooks, prompt-based hooks, event-driven automation |
| issue-creation | Creating a GitHub issue, reporting a bug, requesting a feature |
| judgment-day | "judgment day", adversarial review, dual review, "que lo juzguen" |
| mcp-integration | "add MCP server", integrate MCP, .mcp.json, Model Context Protocol |
| pensamiento-critico | "analizar críticamente", "pensar con rigor", critical thinking, pensamiento crítico |
| skill-creator | "create a new skill", add agent instructions, document patterns for AI |
| skill-development | "create a skill", "add a skill to plugin", skill structure, progressive disclosure |
| web-design-moderno | HTML/CSS creation or review, responsive/inclusive web design |
| writing-hookify-rules | "create a hookify rule", hookify syntax, configure hookify |

## Project Stack Context

- **Frontend**: React (SPA)
- **Backend**: Supabase (PostgreSQL + Auth + Realtime)
- **Hosting**: Vercel
- **Key constraint**: RLS policies ALWAYS required on Supabase tables

## Project Conventions

| File | Description |
|------|-------------|
| .claude/settings.json | Project permissions — npm run lint/test allowed, .env reads denied |

## Compact Rules

### web-design-moderno
- Apply when creating or reviewing HTML/CSS/web interfaces
- Design must be responsive, inclusive, modern — usable by young, adult, and elderly users
- Use semantic HTML5, CSS custom properties, accessible color contrast (WCAG AA minimum)

### frontend-design
- Create distinctive interfaces — avoid generic AI aesthetics
- Use creative layouts, meaningful whitespace, intentional typography
- Prioritize visual hierarchy and UX quality

### branch-pr
- Always create an issue before a PR (issue-first enforcement)
- PR title: short (<70 chars), no colons before tool calls
- PR body: Summary (bullets) + Test plan (checklist)

### ddd
- Apply when designing domain models, reviewing architecture, or naming concepts
- Lead with Ubiquitous Language — name things after the domain, not the implementation
- Identify Bounded Contexts before designing aggregates
