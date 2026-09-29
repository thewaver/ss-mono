import type { Signal } from "solid-js";

import type { AccessorProps } from "@thewaver/ss-components-solid";

export type SpotlightTourExampleProps = AccessorProps<{
    guide: Signal<boolean>;
    prompt: Signal<boolean>;
    step: number;
    resumeStep: number | undefined;
    basketCount: number;
    onStepChange: (step: number) => void;
    onStart: () => void;
    onEnd: (reason: string) => void;
    onAdd: () => void;
}>;
