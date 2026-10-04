export type FlipbookExampleProps = {
    "transitionDurationMs": number;
    "index": number;
    "onUpdate:index"?: (index: number) => void;
};
