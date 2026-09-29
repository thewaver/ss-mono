export type SpotlightHintExampleProps = {
    visibility: boolean;
    index: number;
    onIndexChange: (index: number) => void;
};

export type SpotlightPromptExampleProps = {
    visibility: boolean;
    onBuy: () => void;
};

export type SpotlightGuideExampleProps = {
    visibility: boolean;
    step: number;
    onStepChange: (step: number) => void;
    onStart: () => void;
    onEnd: (reason: string) => void;
};
