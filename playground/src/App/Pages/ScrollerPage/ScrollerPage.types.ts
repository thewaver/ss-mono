import type { ScrollerOverflow, Tab } from "@thewaver/ss-components";

export type BaseScrollerExampleValues = {
    labels: string[];
    overlapCount?: number;
    overflowX?: ScrollerOverflow;
    overflowY?: ScrollerOverflow;
    isAutoHiding?: boolean;
    hideDelayMs?: number;
    isBarOverlaid?: boolean;
};

export type BaseScrollerExampleProps = BaseScrollerExampleValues;

export type BaseScrollerTabbedExampleValues = {
    tabs: Tab<string>[];
    selectedValue: string;
};

export type BaseScrollerTabbedExampleCbs = {
    onSelectionChange: (value: string) => void;
};

export type BaseScrollerTabbedExampleProps = BaseScrollerTabbedExampleValues & BaseScrollerTabbedExampleCbs;
