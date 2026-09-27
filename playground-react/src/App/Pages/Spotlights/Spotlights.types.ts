export type SpotlightHintExampleProps = {
    visibilityState: readonly [boolean, (isVisible: boolean) => void];
    index: number;
    onIndexChange: (index: number) => void;
};

export type SpotlightPromptExampleProps = {
    visibilityState: readonly [boolean, (isVisible: boolean) => void];
    onBuy: () => void;
};

export type SpotlightGuideExampleProps = {
    visibilityState: readonly [boolean, (isVisible: boolean) => void];
    step: number;
    onStepChange: (step: number) => void;
    onStart: () => void;
    onEnd: (reason: string) => void;
};
