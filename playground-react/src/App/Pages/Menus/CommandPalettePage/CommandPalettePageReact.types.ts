export type CommandPaletteExampleProps = {
    visibility: readonly [boolean, (isOpen: boolean) => void];
    query: readonly [string, (query: string) => void];
    onActivate: (value: string) => void;
};

export type CommandPaletteBareLetterExampleProps = CommandPaletteExampleProps & {
    isShortcutOn: readonly [boolean, (isOn: boolean) => void];
    text: readonly [string, (text: string) => void];
};
