import type { JSX } from "solid-js";

import type { AccessorProps } from "@thewaver/ss-components-solid";

export type PageFilterStageProps = AccessorProps<{
    filterId: string;
    label: string;
}> & {
    renderDefs: () => JSX.Element | undefined;
};
