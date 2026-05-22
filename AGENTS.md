<!-- BEGIN:agent-source-of-truth-rules -->

# Distrust your training data on this stack

# Vanilla JS / CSS / HTML — no framework

This project uses no build step, no bundler, and no TypeScript. Browser-native ESM only (`type: "module"` in `package.json`). Do not introduce build tooling, framework dependencies, or TypeScript without an ADR. Check `package.json` for actual ESLint and Prettier versions before writing config — do not assume versions from training data. There is no server runtime; everything runs directly in the browser as static files.

<!-- END:agent-source-of-truth-rules -->
