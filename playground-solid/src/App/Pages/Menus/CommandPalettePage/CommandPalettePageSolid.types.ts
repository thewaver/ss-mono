import type { Signal } from "solid-js";

export type CommandPaletteExampleProps = {
    visibility: Signal<boolean>;
    query: Signal<string>;
    onActivate: (value: string) => void;
};

export type CommandPaletteBareLetterExampleProps = CommandPaletteExampleProps & {
    isShortcutOn: Signal<boolean>;
    text: Signal<string>;
};
