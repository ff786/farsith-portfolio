# Farsith Fawzer — Premium Developer Portfolio

Next.js + TypeScript portfolio concept with cinematic motion, responsive layouts, a lightweight interactive avatar stage, project case-study sections, accessibility support and SEO metadata.

## Run

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Notes

- The supplied character turnaround/reference sheet has been cropped into reusable avatar states under `public/avatar/`.
- The hero currently uses a lightweight image-based avatar stage rather than a GLB/FBX character model. This keeps the supplied asset faithful and avoids inventing a 3D model that was not provided.
- The scene is designed so a production GLB character can be dropped into `src/components/` later without changing the page architecture.
- Project links are intentionally omitted where no URL was supplied.
- Replace `https://example.com` in `src/app/layout.tsx` with the final canonical domain before deployment.
