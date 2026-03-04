# Steven Godin - Portfolio

> Production-grade Next.js application focused on performance, security, and architectural rigor.
> This project reflects how I design and ship modern frontend systems.

[![CI](https://github.com/Yvelchrome/portfolio/workflows/CI/badge.svg)](https://github.com/Yvelchrome/portfolio/actions) [![Coverage](https://img.shields.io/badge/coverage-98.5%25-brightgreen.svg)](https://github.com/Yvelchrome/portfolio)

[![Live Website](https://img.shields.io/badge/svgd.vercel.app-323330?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjY3IiBoZWlnaHQ9IjUwMCIgdmlld0JveD0iMCAwIDI2NyA1MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0zOC42Njk1IDQ5NC4xOTdDNDEuNzI5NiA0OTUuMDY0IDQ0LjgzOTMgNDk1Ljg4OCA0Ny45OTIzIDQ5Ni42NjJMNDQuODM5MyA1MDBMMzguNjY5NSA0OTQuMTk3WiIgZmlsbD0iIzMzOTlDQyIvPgo8cGF0aCBkPSJNMjAwLjIxOCAzMzQuNzAyTDQ3Ljk5MjYgNDk2LjY2OEM0NC44Mzk2IDQ5NS44OTQgNDEuNzI5OSA0OTUuMDcgMzguNjY5OCA0OTQuMjAzTDguMzI4NzQgNDY1LjY5N1Y0NjUuMjM5TDEyOC45NzQgMzM2LjkwMUw3NS41OTU3IDI4Ni43ODFDOTQuMTk4IDI3OS4zOCAxMTQuMDI3IDI3NC40OTQgMTM0Ljk1OCAyNzMuMzkxTDIwMC4yMTggMzM0LjcwMloiIGZpbGw9IiM2NkNDRkYiLz4KPHBhdGggZD0iTTEzNC45NTggMjczLjM5QzExNC4wMjcgMjc0LjQ4NyA5NC4xOTc5IDI3OS4zNzMgNzUuNTk1NiAyODYuNzhMMC4zNzQ4MTcgMjE2LjA1NUwzNC44Nzg2IDE3OS4zMjVMMTM0Ljk1OCAyNzMuMzk3VjI3My4zOVoiIGZpbGw9IiMzMzk5Q0MiLz4KPHBhdGggZD0iTTE4NS41NDMgMjAzLjU4M0MxODQuNjI2IDIzMS4xMyAyMjkuNDU2IDI0Ni4zMDMgMTgyLjY2MyAyNjIuMjQzTDY0Ljg1NCAxNTEuNjc5TDIyOS4yNzcgMEwyNjYuMDE3IDM0LjQ5NTFMMTM2LjA5OCAxNDkuNDQ0TDE4Ni40NiAxOTYuNjg0QzE4NS45MDggMTk5LjAxMyAxODUuNjM2IDIwMS4yOTggMTg1LjU0MyAyMDMuNTgzVjIwMy41ODNaIiBmaWxsPSIjNjZDQ0ZGIi8+CjxwYXRoIGQ9Ik0yNjQuNTYxIDI2OS45NjZWMjcwLjQyNEwyMzAuMjg3IDMwNi45MjZMMTgyLjY2OSAyNjIuMjQzQzIyOS40NjMgMjQ2LjI5NiAxODQuNjMzIDIzMS4xMjkgMTg1LjU0OSAyMDMuNTgzQzE4NS42NDIgMjAxLjI5NyAxODUuOTE1IDE5OS4wMTIgMTg2LjQ2NiAxOTYuNjg0TDI2NC41NjcgMjY5Ljk2NkgyNjQuNTYxWiIgZmlsbD0iIzMzOTlDQyIvPgo8L3N2Zz4K)](https://svgd.vercel.app) [![LinkedIn](https://img.shields.io/badge/Steven_godin-0077B5?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0iI2ZmZmZmZiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTM1LjIzODEgMEg0Ljc2MTlDMi4xMzMzMyAwIDAgMi4xMzMzMyAwIDQuNzYxOVYzNS4yMzgxQzAgMzcuODY2NyAyLjEzMzMzIDQwIDQuNzYxOSA0MEgzNS4yMzgxQzM3Ljg2NjcgNDAgNDAgMzcuODY2NyA0MCAzNS4yMzgxVjQuNzYxOUM0MCAyLjEzMzMzIDM3Ljg2NjcgMCAzNS4yMzgxIDBaTTEyLjM4MSAxNS4yMzgxVjMzLjMzMzNINi42NjY2N1YxNS4yMzgxSDEyLjM4MVpNNi42NjY2NyA5Ljk3MTQzQzYuNjY2NjcgOC42MzgxIDcuODA5NTIgNy42MTkwNSA5LjUyMzgxIDcuNjE5MDVDMTEuMjM4MSA3LjYxOTA1IDEyLjMxNDMgOC42MzgxIDEyLjM4MSA5Ljk3MTQzQzEyLjM4MSAxMS4zMDQ4IDExLjMxNDMgMTIuMzgxIDkuNTIzODEgMTIuMzgxQzcuODA5NTIgMTIuMzgxIDYuNjY2NjcgMTEuMzA0OCA2LjY2NjY3IDkuOTcxNDNaTTMzLjMzMzMgMzMuMzMzM0gyNy42MTlDMjcuNjE5IDMzLjMzMzMgMjcuNjE5IDI0LjUxNDMgMjcuNjE5IDIzLjgwOTVDMjcuNjE5IDIxLjkwNDggMjYuNjY2NyAyMCAyNC4yODU3IDE5Ljk2MTlIMjQuMjA5NUMyMS45MDQ4IDE5Ljk2MTkgMjAuOTUyNCAyMS45MjM4IDIwLjk1MjQgMjMuODA5NUMyMC45NTI0IDI0LjY3NjIgMjAuOTUyNCAzMy4zMzMzIDIwLjk1MjQgMzMuMzMzM0gxNS4yMzgxVjE1LjIzODFIMjAuOTUyNFYxNy42NzYyQzIwLjk1MjQgMTcuNjc2MiAyMi43OTA1IDE1LjIzODEgMjYuNDg1NyAxNS4yMzgxQzMwLjI2NjcgMTUuMjM4MSAzMy4zMzMzIDE3LjgzODEgMzMuMzMzMyAyMy4xMDQ4VjMzLjMzMzNaIi8+Cjwvc3ZnPgo=&logoColor=white)](https://www.linkedin.com/in/steven-godin/)

---

## Engineering Focus

- **98%+ Test Coverage** - isolated logic testing and API route validation
- **Strict Type Safety** — 100% TypeScript strict mode, 0 type errors
- **Runtime Validation** — all external data validated with Zod
- **Security-First API Design** - CSRF protection, honeypot, input validation
- **Performance Optimized** - Lighthouse 95+ with optimized rendering and assets
- **Internationalized** - production-ready i18n architecture

---

## Architecture Principles

- **Server/Client separation** using App Router boundaries

- **Pure utilities isolated for testability**

- **Feature-based component structure** for scalability

- **Schema-driven validation** shared between client and server

- **Strict layering** between UI, services, and domain logic

This repository is structured as a maintainable production application rather than a simple showcase.

---

## Tech Stack

### Core

![Next.js](https://img.shields.io/badge/Next.js-323330?style=for-the-badge&logo=Next.js) ![React](https://img.shields.io/badge/React-323330?style=for-the-badge&logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-323330?style=for-the-badge&logo=typescript) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-323330?style=for-the-badge&logo=tailwind-css)

### Quality & Validation

![Vitest](https://img.shields.io/badge/Vitest-323330?style=for-the-badge&logo=vitest) ![Testing Library](https://img.shields.io/badge/Testing_Library-323330?style=for-the-badge&logo=Testing-Library) ![Zod](https://img.shields.io/badge/Zod-323330?style=for-the-badge&logo=Zod) ![ESLint](https://img.shields.io/badge/ESLint-323330?style=for-the-badge&logo=ESLint)

### UX & UI

![Motion](https://img.shields.io/badge/Motion-323330?style=for-the-badge&logo=framer) ![shadcn/ui](https://img.shields.io/badge/shadcn/ui-323330?style=for-the-badge&logo=shadcn/ui) ![Radix UI](https://img.shields.io/badge/Radix_UI-323330?style=for-the-badge&logo=RadixUI)

## Infrastructure

![Resend](https://img.shields.io/badge/Resend-323330?style=for-the-badge&logo=Resend) ![React Email](https://img.shields.io/badge/React_Email-323330?style=for-the-badge&logo=react-email) ![next-intl](https://img.shields.io/badge/next_intl-323330?style=for-the-badge&logo=next-intl) ![Vercel](https://img.shields.io/badge/Vercel-323330?style=for-the-badge&logo=Vercel)

---

## Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/Yvelchrome/portfolio.git
cd portfolio

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your values

# Run development server
pnpm run dev
```

### Quality Standards

- CI enforced
- 95%+ coverage required
- Strict TypeScript
- All tests must pass before merge
- Lint + type-check in pipeline

---

## What This Project Demonstrates

- How I structure scalable frontend codebases
- How I enforce correctness through typing and testing
- How I integrate runtime validation for real-world robustness
- How I treat performance and security as first-class concerns

---

## Contact

**Steven Godin**  
https://svgd.vercel.app  
https://linkedin.com/in/steven-godin
