export type ToolbarExampleProps = {
    gap: number;
    onActivate: (value: string) => void;
};

export type ToolbarPressedExampleProps = ToolbarExampleProps & {
    pressedValues: string[];
};
