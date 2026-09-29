export type SpotlightHintExampleProps = {
    visibility: readonly [boolean, (isVisible: boolean) => void];
    index: number;
    onIndexChange: (index: number) => void;
};

export type SpotlightPromptExampleProps = {
    visibility: readonly [boolean, (isVisible: boolean) => void];
    onBuy: () => void;
};

export type SpotlightGuideExampleProps = {
    visibility: readonly [boolean, (isVisible: boolean) => void];
    step: number;
    onStepChange: (step: number) => void;
    onStart: () => void;
    onEnd: (reason: string) => void;
};
