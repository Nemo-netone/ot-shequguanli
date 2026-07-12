# Original Frontend Restore - 2026-07-12

## Production

- Stable URL: `https://ot-shequguanli.pages.dev`
- Cloudflare Pages project: `ot-shequguanli`
- Published directory: `original-site/`
- Original artifact: `springboot224bf(2)/springboot224bf/src/main/resources/admin/admin/dist`
- Compatibility API: `original-site/_worker.js`
- Supabase schema: `ot_shequguanli`

## Restore Scope

- Restored the original Vue 2 and Element UI administration interface for the 雅居社区网站 project.
- Preserved the original login screen, navigation, dashboard, owner, housing, visitor, facility, parking, and system modules.
- Added same-origin compatibility routes under `/springboot224bf/*` while retaining `/api/*` portfolio verification routes.
- Kept `site/` as a historical fallback. Production publishes `original-site/`.

## Verified Core

- Administrator login: `abo / abo`
- Owner list: `/springboot224bf/yezhuxinxi/page`
- Owner create/update/delete: `/springboot224bf/yezhuxinxi/save`, `/update`, `/delete`
- Health and isolated schema: `/health`
- Browser checks: original login, authenticated dashboard, desktop screenshot, and mobile screenshot.

## Boundary

Core login, lists, and CRUD persist through the existing Supabase compatibility store. File upload, payment, mapping, and production-grade identity verification remain outside the public portfolio demo.