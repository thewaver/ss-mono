export type CommandPaletteExampleProps = {
    visibility: boolean;
    query: string;
    onActivate: (value: string) => void;
};

export type CommandPaletteBareLetterExampleProps = CommandPaletteExampleProps & {
    isShortcutOn: boolean;
    text: string;
};
