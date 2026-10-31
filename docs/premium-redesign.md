# Portfolio Premium Redesign — Design Direction

This redesign is implemented **only in staging** until review and release approval.

## Visual direction
- Premium engineering editorial: dark ink/graphite surfaces with restrained emerald highlights.
- Fewer exaggerated neumorphic shadows, more quiet spacing, refined typography and thin separators.
- Keep the existing Once UI foundation, Manrope headings, Inter copy, MDX projects and current navigation.
- Primary audience: businesses looking for cloud, DevOps, secure web engineering and production delivery.
- Do not invent performance claims, client metrics, deployment status or testimonials.

## Key decisions
- Homepage hero foregrounds problems solved; primary action leads to real case studies.
- Portrait remains visible on small screens instead of being hidden.
- Use optimized Next.js image delivery, semantic landmarks, keyboard focus and reduced-motion support.
- No new runtime dependencies, tracking scripts, third-party design assets, or domain costs.
- Keep the existing two-branch workflow: `staging` for validation, `main` for approved releases.
- Hosting migration is **not part** of the visual-design commit; Cloudflare compatibility and preview verification remain separate.

## Review checklist
1. Validate `npm ci`, `npx tsc --noEmit`, `npm run build` in CI.
2. Visually inspect 360px, 390px, 768px, 1024px and desktop layouts.
3. Check project links, headings, contrast, mobile scroll and navigation focus.
4. Check images, OG tags and metadata.
5. Merge to `main` only after approval.
