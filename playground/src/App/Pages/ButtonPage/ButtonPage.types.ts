export type BaseButtonExampleCbs = {
    onClick: () => void;
};

export type BaseButtonExampleProps = BaseButtonExampleCbs;

export type BaseButtonPressedExampleValues = {
    isPressed: boolean;
};

export type BaseButtonPressedExampleProps = BaseButtonExampleProps & BaseButtonPressedExampleValues;

export type BaseButtonCounterExampleValues = {
    count: number;
};

export type BaseButtonCounterExampleCbs = {
    onStep: (step: number) => void;
};

export type BaseButtonCounterExampleProps = BaseButtonCounterExampleValues & BaseButtonCounterExampleCbs;

export type BaseButtonDocsExampleValues = {
    isDisabled: boolean;
    hasError: boolean;
    isPressed: boolean;
};

export type BaseButtonTooltipDocsExampleValues = {
    isDisabled: boolean;
    isReachableWhenDisabled: boolean;
};

export type ButtonCopyExampleProps = {
    text: string;
    onCopy: () => void;
};
