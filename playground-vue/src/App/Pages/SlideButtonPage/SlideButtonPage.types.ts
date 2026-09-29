export type SlideButtonExampleProps = {
    onActivate: () => void;
};

export type SlideButtonHeldExampleProps = {
    isArmed: boolean;
    onActivate: () => void;
    onReset: () => void;
};

export type SlideButtonErroredExampleProps = {
    hasError: boolean;
    onActivate: () => void;
};
