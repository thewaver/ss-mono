export type SpotlightTourExampleProps = {
    "guide": boolean;
    "onUpdate:guide"?: (isVisible: boolean) => void;
    "prompt": boolean;
    "onUpdate:prompt"?: (isVisible: boolean) => void;
    "step": number;
    "resumeStep": number | undefined;
    "basketCount": number;
    "onStepChange": (step: number) => void;
    "onStart": () => void;
    "onEnd": (reason: string) => void;
    "onAdd": () => void;
};
