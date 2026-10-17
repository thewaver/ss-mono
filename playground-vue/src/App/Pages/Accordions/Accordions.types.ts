export type AccordionExampleProps = {
    "expanded"?: string[];
    "onUpdate:expanded"?: (expanded: string[]) => void;
    "gap": number;
    "transitionDurationMs": number;
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
    "expanded"?: boolean;
    "onUpdate:expanded"?: (isExpanded: boolean) => void;
    "transitionDurationMs": number;
};
