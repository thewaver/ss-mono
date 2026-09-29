export type SpotlightOverlayProps = {
    visibilityTarget: 0 | 1;
    transitionDurationMs: number;
    maskStyle: Record<string, string>;
};

export type SpotlightHighlightProps = {
    visibilityTarget: 0 | 1;
};

export type SpotlightHintExampleProps = {
    "visibility": boolean;
    "onUpdate:visibility"?: (isVisible: boolean) => void;
    "index": number;
    "onIndexChange": (index: number) => void;
};

export type SpotlightPromptExampleProps = {
    "visibility": boolean;
    "onUpdate:visibility"?: (isVisible: boolean) => void;
    "onBuy": () => void;
};

export type SpotlightGuideExampleProps = {
    "visibility": boolean;
    "onUpdate:visibility"?: (isVisible: boolean) => void;
    "step": number;
    "onStepChange": (step: number) => void;
    "onStart": () => void;
    "onEnd": (reason: string) => void;
};
