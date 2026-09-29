import type { SvelteMarkup } from "@thewaver/ss-components-svelte";

export type PageFilterStageProps = {
    filterId: string;
    label: string;
    renderDefs: () => SvelteMarkup;
};
