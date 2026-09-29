import type { Signal } from "solid-js";

import type { AccessorProps } from "@thewaver/ss-components-solid";

export type SpotlightHintExampleProps = AccessorProps<{
    visibility: Signal<boolean>;
    index: number;
    onIndexChange: (index: number) => void;
}>;

export type SpotlightPromptExampleProps = {
    visibility: Signal<boolean>;
    onBuy: () => void;
};

export type SpotlightGuideExampleProps = AccessorProps<{
    visibility: Signal<boolean>;
    step: number;
    onStepChange: (step: number) => void;
    onStart: () => void;
    onEnd: (reason: string) => void;
}>;
