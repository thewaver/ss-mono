import type { Snippet } from "svelte";

import type { BaseShadowCasterProps } from "@thewaver/ss-components";

export type ShadowCasterProps = BaseShadowCasterProps & {
    /** The content the effect is applied to. */
    children?: Snippet;
};
