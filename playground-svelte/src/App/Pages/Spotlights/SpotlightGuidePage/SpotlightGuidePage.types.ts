export type SpotlightTourExampleProps = {
    guide: boolean;
    prompt: boolean;
    step: number;
    resumeStep: number | undefined;
    basketCount: number;
    onStepChange: (step: number) => void;
    onStart: () => void;
    onEnd: (reason: string) => void;
    onAdd: () => void;
};
