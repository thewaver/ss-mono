export type BaseMorphTextExampleValues = {
    morphDurationMs: number;
    maxBlurPx: number;
};

export type BaseMorphTextExampleCbs = {
    onWordChange: (word: string) => void;
};

export type BaseMorphTextExampleProps = BaseMorphTextExampleValues & BaseMorphTextExampleCbs;
