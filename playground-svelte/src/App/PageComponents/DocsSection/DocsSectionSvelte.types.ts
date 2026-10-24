import type { Snippet } from "svelte";

import type { BasePageDocsSectionProps } from "@thewaver/ss-playground/App/PageComponents/DocsSection/DocsSection.types";

export type PageDocsSectionProps = BasePageDocsSectionProps & {
    children?: Snippet;
};
