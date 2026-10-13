export type SlideButtonExampleProps = {
    onActivate: () => void;
};

export type BaseSlideButtonHeldExampleValues = {
    isArmed: boolean;
};

export type BaseSlideButtonHeldExampleCbs = {
    onActivate: () => void;
    onReset: () => void;
};

export type BaseSlideButtonHeldExampleProps = BaseSlideButtonHeldExampleValues & BaseSlideButtonHeldExampleCbs;

export type BaseSlideButtonErroredExampleValues = {
    hasError: boolean;
};

export type BaseSlideButtonErroredExampleCbs = {
    onActivate: () => void;
};

export type BaseSlideButtonErroredExampleProps = BaseSlideButtonErroredExampleValues & BaseSlideButtonErroredExampleCbs;
