import type { PlaygroundLook } from "@thewaver/ss-playground/App/PageComponents/NavSettings/NavSettings.types";

export type LookRowProps = {
    look: PlaygroundLook;
    label: string;
};

export type LookSamplesProps = {
    look: PlaygroundLook;
};

export type LookSampleColumnProps = {
    name: string;
    isWide?: boolean;
};

export type LookStateGridProps = {
    isFitted?: boolean;
};

export type LookStateProps = {
    state: string;
    isPressed?: boolean;
    isChecked?: boolean;
    isMixed?: boolean;
    isReadOnly?: boolean;
    isDisabled?: boolean;
    hasError?: boolean;
};
