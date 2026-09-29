export type SpotlightTourExampleProps = {
    guide: readonly [boolean, (isVisible: boolean) => void];
    prompt: readonly [boolean, (isVisible: boolean) => void];
    step: number;
    resumeStep: number | undefined;
    basketCount: number;
    onStepChange: (step: number) => void;
    onStart: () => void;
    onEnd: (reason: string) => void;
    onAdd: () => void;
};
