export type AccordionExampleProps = {
    "expanded"?: string[];
    "onUpdate:expanded"?: (expanded: string[]) => void;
};

export type AccordionDeferredExampleProps = AccordionExampleProps & {
    onBuild: (value: string) => void;
};

export type AccordionGrowingExampleProps = AccordionExampleProps & {
    extraLines: number;
    onAddLine: () => void;
};

export type AccordionSinglePanelExampleProps = {
    "expanded"?: boolean;
    "onUpdate:expanded"?: (isExpanded: boolean) => void;
};
