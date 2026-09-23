import type { Signal } from "solid-js";

import type { AccessorProps } from "@thewaver/ss-components";

export type TourStep = {
    title: string;
    text: string;
    isWaitingForUser?: boolean;
};

export type SpotlightTourExampleProps = AccessorProps<{
    guideSignal: Signal<boolean>;
    promptSignal: Signal<boolean>;
    step: number;
    resumeStep: number | undefined;
    basketCount: number;
    onStepChange: (step: number) => void;
    onStart: () => void;
    onEnd: (reason: string) => void;
    onAdd: () => void;
}>;
