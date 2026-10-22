---
paths:
    - "**/vite.config.*"
---

# Conventions: build config

Rules for the Vite config and what it imports.

### A file the Vite config imports holds plain data, and imports workspace packages as types only

`vite.config.ts` is loaded and run before Vite has set anything up, so the path aliases the config itself defines
do not exist yet while it loads. A runtime import there of a sibling package in the same workspace resolves the
ordinary way, to that package's built output — which is usually ignored by version control and absent on a fresh
clone or a deploy server — rather than to the source the alias would have pointed at. The build then works on the
machine that happened to build the package first and fails everywhere else.

**So anything the config imports holds plain data, and imports a workspace package only with `import type`**, which
is erased before the file runs. Code that needs the package at run time lives in a file Vite compiles itself,
where the aliases are in place.
