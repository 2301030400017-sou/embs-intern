# CareSignal

CareSignal is a patient-centric healthcare dashboard prototype focused on clear longitudinal visualizations, explainable insights, and safe wearable integration.

Badges: ![CI](https://github.com/2301030400017-sou/embs-intern/actions/workflows/ci.yml/badge.svg) [License: MIT]

## Features

- Longitudinal visualizations for blood pressure, glucose, heart rate, sleep, and activity
- Explainable insight cards with plain-language recommendations
- Wearable integration hooks for near real-time monitoring and alerts
- Responsive, accessible UI optimized for non-technical users and clinicians

## Tech stack

- React 18 + TypeScript
- Vite build tooling
- Hand-authored, responsive CSS design system (replaceable with Tailwind or Chakra)
- Simple, deterministic analytics that can be replaced by an ML/AI service

## Getting started

Prerequisites: Node.js 18+ and npm.

1. Install dependencies

```bash
npm install
```

2. Run the development server

```bash
npm run dev
```

3. Create a production build

```bash
npm run build
```

4. Preview the production build locally

```bash
npm run preview
```

## Project Structure

- `src/data` contains the sample longitudinal dataset.
- `src/lib` contains the analytics and insight generation logic.
- `src/components` contains reusable dashboard components.
- `src/styles.css` contains the visual system.

## Notes

This starter implements explainable analytics to keep insights transparent and auditable. The analytics are intentionally deterministic to make it easy to replace with an ML model or external decision support service when you integrate secure clinical data and validation workflows.

If you want, I can:

- Scaffold a minimal backend (Express/Next) with FHIR-compatible endpoints for clinical data.
- Add OAuth2 / OpenID Connect for secure patient authentication.
- Integrate a simple ML model or remote inference endpoint for advanced insights.