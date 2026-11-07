import type { TabsOrientation } from "@thewaver/ss-components-solid";
import type { PlaygroundSkin } from "@thewaver/ss-playground/App/PageComponents/NavSettings/NavSettings.types";

export type SkinRowProps = {
    skin: PlaygroundSkin;
    label: string;
};

export type SkinSamplesProps = {
    skin: PlaygroundSkin;
};

export type SkinTabsSampleProps = {
    skin: PlaygroundSkin;
    orientation: TabsOrientation;
};

export type SkinSampleColumnProps = {
    name: string;
};

export type SkinHoveredOptionProps = {
    isGliding?: boolean;
};

export type SkinStateProps = {
    state: string;
    isPressed?: boolean;
    isChecked?: boolean;
    isMixed?: boolean;
    isReadOnly?: boolean;
    isDisabled?: boolean;
    hasError?: boolean;
};
