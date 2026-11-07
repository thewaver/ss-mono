import type { Snippet } from "svelte";

import type { PlaygroundSkin } from "@thewaver/ss-playground/App/PageComponents/NavSettings/NavSettings.types";

export type SkinRowProps = {
    skin: PlaygroundSkin;
    label: string;
};

export type SkinSamplesProps = {
    skin: PlaygroundSkin;
};

export type SkinSampleColumnProps = {
    name: string;
    isWide?: boolean;
    children?: Snippet;
};

export type SkinListboxSampleProps = {
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

export type SkinBarCellProps = SkinStateProps & {
    children?: Snippet;
};
