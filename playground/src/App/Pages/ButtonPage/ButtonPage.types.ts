export type BaseButtonExampleCbs = {
    onClick: () => void;
};

export type BaseButtonExampleProps = BaseButtonExampleCbs;

export type BaseButtonPressedExampleValues = {
    isPressed: boolean;
};

export type BaseButtonPressedExampleProps = BaseButtonExampleProps & BaseButtonPressedExampleValues;

export type BaseButtonErroredExampleValues = {
    hasError: boolean;
};

export type BaseButtonErroredExampleProps = BaseButtonExampleProps & BaseButtonErroredExampleValues;

export type ButtonCopyExampleProps = {
    text: string;
    onCopy: () => void;
};
