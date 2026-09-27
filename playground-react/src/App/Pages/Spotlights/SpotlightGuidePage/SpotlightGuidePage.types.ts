export type SpotlightTourExampleProps = {
    guideState: readonly [boolean, (isVisible: boolean) => void];
    promptState: readonly [boolean, (isVisible: boolean) => void];
    step: number;
    resumeStep: number | undefined;
    basketCount: number;
    onStepChange: (step: number) => void;
    onStart: () => void;
    onEnd: (reason: string) => void;
    onAdd: () => void;
};
