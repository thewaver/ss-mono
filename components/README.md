# @thewaver/ss-components

The framework-free core of the ss-components libraries: the behavior, the styles and the types that the Solid, React,
Vue and Svelte components share. It draws nothing itself.

Install the package for your framework instead — it brings this one along and re-exports everything in it:

```
npm install @thewaver/ss-components-solid @thewaver/ss-utils solid-js
npm install @thewaver/ss-components-react @thewaver/ss-utils react react-dom
npm install @thewaver/ss-components-vue @thewaver/ss-utils vue
npm install @thewaver/ss-components-svelte @thewaver/ss-utils svelte
```

Whichever you install, import the stylesheet once:

```ts
import "@thewaver/ss-components/styles.css";
```

Live, editable examples and a full prop table for every component are at
**[ss-components.vercel.app](https://ss-components.vercel.app)**.

**Browser only: drawing these components on a server — Next.js, Nuxt, SvelteKit, SolidStart — is not tested.**
