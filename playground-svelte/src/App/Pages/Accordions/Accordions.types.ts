export type AccordionExampleProps = {
    expanded?: string[];
};

export type AccordionDeferredExampleProps = AccordionExampleProps & {
    onBuild: (value: string) => void;
};

export type AccordionGrowingExampleProps = AccordionExampleProps & {
    extraLines: number;
    onAddLine: () => void;
};

export type AccordionSinglePanelExampleProps = {
    expanded?: boolean;
};
