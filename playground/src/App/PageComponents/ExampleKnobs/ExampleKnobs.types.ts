import type { JSX } from "solid-js";

import type { AccessorProps } from "@thewaver/ss-components";

export type PageExampleKnobsButtonProps = AccessorProps<{
    exampleKey: string;
    exampleName: string;
}> & {
    renderKnobs: () => JSX.Element;
};
