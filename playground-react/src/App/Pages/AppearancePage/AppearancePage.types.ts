import type {
    PlaygroundSkin,
    PlaygroundTheme,
} from "@thewaver/ss-playground/App/PageComponents/NavSettings/NavSettings.types";

export type SkinRowProps = {
    skin: PlaygroundSkin;
    label: string;
};

export type ThemeRowProps = {
    theme: PlaygroundTheme;
    label: string;
};

export type SkinSamplesProps = {
    skin: PlaygroundSkin;
};

export type SkinSampleColumnProps = {
    name: string;
    isWide?: boolean;
};

export type SkinStateGridProps = {
    isFitted?: boolean;
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
