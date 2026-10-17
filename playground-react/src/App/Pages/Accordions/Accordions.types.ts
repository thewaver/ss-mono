export type AccordionExampleProps = {
    expanded?: readonly [string[], (expanded: string[]) => void];
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
    expanded?: readonly [boolean, (isExpanded: boolean) => void];
    transitionDurationMs: number;
};
