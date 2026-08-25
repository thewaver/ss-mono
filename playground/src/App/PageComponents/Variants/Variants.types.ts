import type { JSX } from "solid-js";

import type { AccessorProps } from "@thewaver/ss-components";

export type VariantDefs = {
    key: string;
    name: string;
    readout?: () => string;
    component: () => JSX.Element;
};

export type VariantsProps = AccessorProps<{
    items: VariantDefs[];
}>;
