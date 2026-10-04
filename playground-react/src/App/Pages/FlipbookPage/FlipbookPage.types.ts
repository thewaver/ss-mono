export type FlipbookExampleProps = {
    transitionDurationMs: number;
    index: readonly [number, (index: number) => void];
};
