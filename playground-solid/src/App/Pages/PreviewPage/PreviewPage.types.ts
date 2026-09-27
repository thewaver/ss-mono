import type { Signal } from "solid-js";

import type { AccessorProps } from "@thewaver/ss-components-solid";

export type PreviewExampleProps = AccessorProps<{
    expandedSignal?: Signal<boolean>;
    collapsedHeight: number;
    isScrolledIntoViewOnCollapse?: boolean;
    paragraphs: string[];
}>;
