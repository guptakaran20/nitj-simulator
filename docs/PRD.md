# NIT Jalandhar Simulator — Product Requirements Document

**Version:** 1.0 | **Status:** Draft | **Date:** June 2025

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Goals & Success Metrics](#3-goals--success-metrics)
4. [Target Users & Personas](#4-target-users--personas)
5. [Scope](#5-scope)
6. [Functional Requirements](#6-functional-requirements)
7. [Non-Functional Requirements](#7-non-functional-requirements)
8. [Technical Architecture](#8-technical-architecture)
9. [UX & Design Principles](#9-ux--design-principles)
10. [Milestones & Timeline](#10-milestones--timeline)
11. [Risks & Mitigations](#11-risks--mitigations)
12. [Open Questions](#12-open-questions)
13. [Appendix](#13-appendix)

---

| Field | Details |
|---|---|
| Product Name | NIT Jalandhar Simulator |
| Document Version | 1.0 |
| Status | Draft — For Review |
| Target Platform | Web (Desktop & Mobile Browser) |
| Primary Audience | NITJ students & alumni, NIT aspirants |
| Date | June 2025 |

---

## 1. Executive Summary

NIT Jalandhar Simulator is a browser-based, 2D top-down role-playing game that recreates student life at Dr. B R Ambedkar National Institute of Technology, Jalandhar. Players choose an engineering branch, navigate a pixel-art campus map, manage a realistic set of academic and social stats, attend (or bunk) classes, take part in placement drives, and experience the authentic chaos of NIT life — from foggy winter mornings on GT Road to late-night LAN sessions in the MBH.

The goal is to deliver a product that is simultaneously a fun, replayable game for current students and a nostalgic time-capsule for alumni, while serving as an aspirational preview for JEE aspirants.

---

## 2. Problem Statement

### 2.1 Opportunity

There is no dedicated, accurate, and engaging digital experience that captures NIT Jalandhar student life. Existing campus-life content is scattered across Reddit threads, YouTube vlogs, and informal blogs. New admits, aspiring students, and alumni have no single interactive medium to explore, relive, or share their NITJ experience.

### 2.2 User Pain Points

- JEE aspirants have no realistic way to preview campus life before choosing an NIT.
- Current students lack a low-stakes sandbox to explore "what if I had joined ECE instead of CSE?"
- Alumni have no interactive nostalgia product tied to NITJ's specific landmarks, culture, and inside jokes.
- Existing college simulator games are not India-specific and miss authentic details like mess food, hostel raids, and CGPA anxiety.

---

## 3. Goals & Success Metrics

### 3.1 Product Goals

- Ship a playable v1 web app that faithfully represents the NITJ campus layout, culture, and academic mechanics.
- Achieve at least 5 minutes average session length within the first month of launch.
- Build a shareable experience — players should want to post their placement outcomes and CGPA on social media.
- Establish a foundation for future AI-powered NPCs using the Gemini API integration already scaffolded in the codebase.

### 3.2 Key Metrics

| Metric | Target (Month 1) | Target (Month 3) |
|---|---|---|
| DAU | 500 | 2,000 |
| Avg. Session Length | 5 min | 9 min |
| Playthroughs Completed | 200 | 1,000 |
| Social Shares | 100 | 500 |
| Crash Rate | < 1% | < 0.5% |
| Mobile Playability | Functional | Polished |

---

## 4. Target Users & Personas

### Persona A — The JEE Aspirant
Age 16–18, preparing for JEE Mains/Advanced. Wants to know what life at an NIT actually looks like. Plays the game to explore branches and campus before making college choices.

### Persona B — The Current NITJ Student
Age 18–22, in any year of their B.Tech programme. Plays to see themselves reflected in the game, share memes with batchmates, and compare placements. Acts as the organic marketing channel — if it resonates, they share it.

### Persona C — The Alumni
Age 23–35, 1–10 years out of NITJ. Motivated by nostalgia: recognises the MBH, Amul Shop, OAT, and GT Road bypass. High sharing intent — will post on LinkedIn and WhatsApp alumni groups.

---

## 5. Scope

### 5.1 In Scope — v1.0

- Character creation: name, branch selection (CSE/ECE/IT/ME/CE/CH/EE/BT), hoodie colour.
- 2D campus map with all major landmarks: MBH, IT Block, Computer Centre, Central Library, Shopping Complex, Amul Shop, Mega Mess, OAT, GT Road Bypass.
- Keyboard (WASD/Arrow), mouse-click pathing, and on-screen joystick controls.
- Stat system: CGPA, Attendance %, Coding Skill %, Energy %, Money, Happiness %.
- Landmark interactions: sleep, self-study, gaming, bunking, eating, coding, cultural events.
- Academic quiz mechanics tied to year of study (Year 1–4 question pools).
- Random event log ("NITJ College Chronicles") with 20+ authentic events.
- NPC dialogue from Dr. Sharma (HOD), Arun (Placement Lead), Guard Sukhdev Singh.
- Placement drive mechanics: eligibility cutoffs, company tiers (mass recruiter → dream), pass-chance algorithm.
- Day/night cycle with ambient visual changes on the canvas.
- End-of-4-year summary screen with shareable outcome card.

### 5.2 Out of Scope — v1.0

- Multiplayer or real-time co-op.
- Live Gemini AI NPC conversations (scaffolded but not activated in v1).
- Mobile app (native iOS/Android) — web-responsive only.
- User accounts or persistent cloud saves.
- Modding / custom campus creation.

---

## 6. Functional Requirements

### FR-1: Character Creation

- System shall display a character creation screen before gameplay.
- Player must enter a name (1–20 characters, alphanumeric + spaces).
- Player must select a branch from: CSE, ECE, IT, ME, CE, CH, EE, BT.
- Each branch shall display its unique starting stats and perk description.
- Player may choose a hoodie colour from a palette of at least 8 options.

### FR-2: Campus Navigation

- Canvas shall render a bird's-eye view of NITJ campus at minimum 800×600 px.
- Player avatar shall move via WASD/Arrow keys at a configurable speed.
- Mouse click on empty ground shall move player to clicked coordinates via pathfinding.
- On-screen joystick shall be available for mobile/touch devices.
- Collision detection shall prevent traversal of buildings, walls, and water bodies.
- Proximity to a landmark (within 50px) shall trigger an interaction prompt.

### FR-3: Stat Management

- Stats tracked per in-game day: CGPA (0.0–10.0), Attendance (0–100%), Coding Skill (0–100%), Energy (0–100%), Money (₹), Happiness (0–100%).
- Each activity at a landmark shall modify one or more stats by defined delta values.
- CGPA below 5.0 shall trigger a "probation" warning event.
- Attendance below 75% shall block exam eligibility, triggering a detention event.
- Energy reaching 0% shall force the player to sleep, consuming one in-game day.

### FR-4: Academic System

- Year-appropriate quiz questions shall be shown for "attend class" and "self-study" activities.
- Correct answer: +0.2 CGPA (capped at 10.0), +10% coding skill.
- Wrong answer: −0.1 CGPA, no change to other stats.
- Quiz pool shall contain ≥ 10 questions per year tier.

### FR-5: Placement System

- Placement mode unlocks in Year 4.
- Company list shall display: name, package (LPA), role, CGPA cutoff, coding skill cutoff.
- Pass/fail shall be computed by a probabilistic algorithm factoring CGPA and coding skill vs. cutoffs.
- Players shall be able to apply to multiple companies in sequence.
- Final result (placed / not placed, package) shall display on the end-game summary screen.

### FR-6: Random Events

- One random event shall trigger per 3–5 in-game days.
- Events shall be drawn from a pool of ≥ 20 pre-written authentic NITJ scenarios.
- Events may have positive, negative, or neutral stat impacts.
- Event text shall be appended to the "NITJ College Chronicles" game log in the sidebar.

### FR-7: NPC Interactions

- **Dr. Sharma (HOD):** triggered near IT Block; provides academic advice and CGPA warnings.
- **Arun (Placement Lead):** triggered near Computer Centre in Year 4; gives placement tips.
- **Guard Sukhdev Singh:** triggered near hostel gate after 11 PM in-game; triggers hostel-raid event.
- Each NPC shall have ≥ 5 distinct dialogue lines rotating randomly.

---

## 7. Non-Functional Requirements

| ID | Category | Requirement | Target |
|---|---|---|---|
| NFR-1 | Performance | Initial page load time | < 3s on 4G |
| NFR-2 | Performance | Canvas frame rate | ≥ 30 FPS on mid-range laptop |
| NFR-3 | Responsiveness | Mobile browser playability | Functional on 375px wide viewport |
| NFR-4 | Compatibility | Browser support | Chrome, Firefox, Safari — last 2 versions |
| NFR-5 | Accessibility | Keyboard-only playable | All actions reachable via keyboard |
| NFR-6 | Reliability | JS crash rate | < 1% of sessions |
| NFR-7 | Bundle Size | Total JS bundle (gzipped) | < 500 KB |
| NFR-8 | Maintainability | TypeScript strict mode | Zero `any` types in core logic |

---

## 8. Technical Architecture

### 8.1 Current Stack

- **React 19 + TypeScript + Vite 6** — component-based UI and game loop.
- **HTML5 Canvas API** — 2D rendering of campus map, avatar, NPCs, and lighting effects.
- **Tailwind CSS v4** — utility-first styling for UI panels (sidebar, modals, HUD).
- **Lucide React** — iconography for the game HUD and sidebar.
- **@google/genai SDK** (scaffolded) — future Gemini AI NPC conversations.

### 8.2 Recommended Additions for v1.0

- **Vite PWA plugin** — offline caching and "Add to Home Screen" on mobile.
- **Zustand or useReducer** — centralised, testable game state management to replace prop drilling.
- **html2canvas** — for generating and downloading the end-game shareable outcome card.
- **Vitest** — unit tests for stat delta calculations and placement algorithm.

### 8.3 AI Integration Roadmap (Post v1.0)

- Activate the Gemini API integration for live NPC dialogue generation.
- Each NPC will receive a system prompt encoding their persona, knowledge, and constraints.
- Context passed per turn: player's current stats, year, location, and recent event log.
- Fallback to static dialogue if API key is absent or rate limit is reached.

---

## 9. UX & Design Principles

### 9.1 Core Design Values

- **Authenticity over polish** — the game should feel like NITJ, with real place names, real slang, and real campus dynamics. Approximate pixel art is acceptable if it reads correctly.
- **Casual entry, deep replay** — new players should be playing within 60 seconds. The 4-year arc provides depth for returning players.
- **Share-worthy moments** — the game must produce at least two natural screenshot moments: a mid-game crisis (low attendance + low CGPA) and the placement outcome screen.

### 9.2 UI Layout

- **Centre:** full-width canvas (campus map).
- **Right sidebar** (collapsible on mobile): stats HUD, contextual activity panel, NPC dialogue, Chronicles log.
- **Top bar:** in-game date, semester, year, and current location label.
- **Modal overlays:** character creation, quiz questions, placement results.

---

## 10. Milestones & Timeline

| Milestone | Deliverable | Owner | Target |
|---|---|---|---|
| M1 — Foundation | Campus map renders; movement + collisions functional | Frontend Dev | Week 2 |
| M2 — Stat Core | All stats live; landmark interactions wired up | Frontend Dev | Week 4 |
| M3 — Academic Loop | Quiz system + random events + Chronicles log | Content + Dev | Week 6 |
| M4 — Placement Loop | Year-4 placement companies + outcome screen | Dev | Week 8 |
| M5 — Polish | NPC dialogue, day/night, mobile joystick, share card | Dev + Design | Week 10 |
| M6 — Launch | Deploy to Vercel/Netlify; share with NITJ community | All | Week 12 |

---

## 11. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Canvas performance drops on low-end devices | Medium | High | Implement a low-quality rendering mode; cap NPC count on mobile |
| Content feels inauthentic to current students | Medium | High | Playtest with 5 current NITJ students before M5 |
| Gemini API costs exceed budget post-launch | Low | Medium | Gate AI NPCs behind an opt-in toggle; keep static fallback always live |
| Player drops off before Year 4 placement arc | High | Medium | Add a "fast forward semester" button; surface placement teaser in Year 2 |
| Copyright/IP concern from NIT administration | Low | Low | Add disclaimer: "Fan-made simulation. Not affiliated with NIT Jalandhar." |

---

## 12. Open Questions

- Should the game support saving progress in `localStorage` so a 4-year run can be continued across sessions?
- Do we want an optional "hard mode" where CGPA and attendance penalties are stricter?
- Should branch choice affect the campus map (e.g., ECE students spawn near the ECE block)?
- Should we add a leaderboard for top CGPA + placement package combos to drive social competition?
- What is the content moderation approach for player-entered names?

---

## 13. Appendix

### A — Branch Starting Stats

| Branch | CGPA | Coding Skill | Energy | Happiness | Perk |
|---|---|---|---|---|---|
| CSE | 7.0 | 60% | 80% | 70% | +20% coding skill gain |
| ECE | 7.2 | 45% | 75% | 72% | +10% CGPA on hardware quizzes |
| IT | 6.8 | 55% | 80% | 68% | +15% coding skill gain |
| ME | 7.5 | 30% | 70% | 75% | +15% energy from mess food |
| CE | 7.3 | 25% | 72% | 70% | Lower money costs on campus |
| CH | 7.8 | 20% | 68% | 80% | Starts with highest base CGPA |
| EE | 7.0 | 40% | 74% | 71% | Bonus from library study sessions |
| BT | 8.0 | 15% | 65% | 85% | Highest starting CGPA + happiness |

### B — Landmark Activity Summary

| Landmark | Activities | Key Stat Deltas | Notes |
|---|---|---|---|
| MBH / MGH (Hostel) | Sleep, Self-study, LAN Gaming | +Energy, +CGPA (study), −Energy (gaming) | Sukhdev Singh NPC triggers at night |
| IT Block | Attend Class, Bunk Class | +Attendance, +CGPA vs. nothing gained | Dr. Sharma NPC on attendance warning |
| Computer Centre | Code Practice, Back-bench Code | +Coding Skill (both), +Attendance (attend) | Arun NPC in Year 4 |
| Central Library | Exam Prep, Placement Prep | +CGPA, +Coding Skill | Bonus in Year 4 for placement prep |
| Amul Shop / Shopping Complex | Chai + Patty, Shopping | +Happiness, +Energy / −Money | Core social recharge stop |
| Mega Mess | Breakfast, Dinner, Special Dinner | +Energy / high cost on special dinner | Random "bad food" event possible |
| OAT | Cultural Event | +Happiness, minor −Energy | Boosts morale before exams |
| GT Road Bypass | Cinema, Haveli Visit | +Happiness / −Money, −time | Risk of "missed deadline" event |

---

*Fan-made simulation. Not affiliated with Dr. B R Ambedkar National Institute of Technology, Jalandhar.*
