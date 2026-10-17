export type AccordionExampleProps = {
    expanded?: string[];
    gap: number;
    transitionDurationMs: number;
};

export type AccordionDeferredExampleProps = AccordionExampleProps & {
    onBuild: (value: string) => void;
};

export type AccordionGrowingExampleProps = AccordionExampleProps & {
    extraLines: number;
    onAddLine: () => void;
    onClearLines: () => void;
};

export type AccordionSinglePanelExampleProps = {
    expanded?: boolean;
    transitionDurationMs: number;
};
