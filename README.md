# Classic Cut Rajkot

Responsive website for Classic Cut Salon in Arya Nagar, Rajkot, built with React, TypeScript, Vite and Tailwind CSS.

## Run locally

```sh
npm install --legacy-peer-deps
npm run dev
```

Open http://localhost:3000. The legacy peer dependency option is needed for the existing Vite/esbuild version combination.

## Checks and production build

```sh
npm run lint
npm run build
npm run preview
```

The production output is written to `dist/`.

## Features

- Responsive service cards with 3D character illustrations
- Product browsing, shopping bag and WhatsApp order confirmation
- Salon introduction, team showcase and interactive hairstyle gallery
- Customer reviews, location illustration and Google Maps directions
- Light and dark themes

Business details and catalogue data are in `src/data/barbershopData.ts`. Components are in `src/components/`, and public images are in `public/assets/`.

Keep local environment files out of Git. `.env.example` documents the optional configuration.
