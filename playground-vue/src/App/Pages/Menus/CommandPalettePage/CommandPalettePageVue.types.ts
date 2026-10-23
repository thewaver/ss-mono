import type { VNodeChild } from "vue";

export type CommandPaletteExampleProps = {
    "visibility": boolean;
    "onUpdate:visibility"?: (isVisible: boolean) => void;
    "query": string;
    "onUpdate:query"?: (query: string) => void;
    "onActivate": (value: string) => void;
};

export type CommandPaletteBareLetterExampleProps = CommandPaletteExampleProps & {
    "isShortcutOn": boolean;
    "onUpdate:isShortcutOn"?: (isShortcutOn: boolean) => void;
    "text": string;
    "onUpdate:text"?: (text: string) => void;
};

export type CommandPalettePanelProps = {
    renderField: () => VNodeChild;
    renderOptions: () => VNodeChild;
    visibilityTarget: 0 | 1;
    transitionDurationMs: number;
    isEmpty: boolean;
};
