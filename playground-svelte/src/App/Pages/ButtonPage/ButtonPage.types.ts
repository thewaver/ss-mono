export type ButtonExampleProps = {
    onClick: () => void;
};

export type ButtonPressedExampleProps = ButtonExampleProps & {
    isPressed: boolean;
};

export type ButtonErroredExampleProps = ButtonExampleProps & {
    hasError: boolean;
};

export type ButtonCopyExampleProps = {
    text: string;
    onCopy: () => void;
};
