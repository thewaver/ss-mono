import type { TabsOrientation } from "@thewaver/ss-components-solid";
import type { PlaygroundLook } from "@thewaver/ss-playground/App/PageComponents/NavSettings/NavSettings.types";

export type LookRowProps = {
    look: PlaygroundLook;
    label: string;
};

export type LookSamplesProps = {
    look: PlaygroundLook;
};

export type LookTabsSampleProps = {
    look: PlaygroundLook;
    orientation: TabsOrientation;
};

export type LookSampleColumnProps = {
    name: string;
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
