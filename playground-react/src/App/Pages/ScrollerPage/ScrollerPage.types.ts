import type { Tab } from "@thewaver/ss-components-react";

export type ScrollerExampleProps = {
    labels: string[];
};

export type ScrollerTabbedExampleProps = {
    tabs: Tab<string>[];
    selectedValue: string;
    onSelectionChange: (value: string) => void;
};
