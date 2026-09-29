import type { Signal } from "solid-js";

import type { AccessorProps } from "@thewaver/ss-components-solid";

export type AccordionExampleProps = AccessorProps<{
    expanded?: Signal<string[]>;
}>;

export type AccordionDeferredExampleProps = AccordionExampleProps & {
    onBuild: (value: string) => void;
};

export type AccordionGrowingExampleProps = AccordionExampleProps &
    AccessorProps<{
        extraLines: number;
        onAddLine: () => void;
    }>;

export type AccordionSinglePanelExampleProps = AccessorProps<{
    expanded?: Signal<boolean>;
}>;
