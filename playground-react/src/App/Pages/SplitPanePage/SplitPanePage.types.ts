export type SplitPaneExampleProps = {
    gutterSize: number;
    isDisabled: boolean;
    ratios: readonly [number[], (ratios: number[]) => void];
};
