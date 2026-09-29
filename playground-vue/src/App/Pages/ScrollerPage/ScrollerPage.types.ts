import type { Tab } from "@thewaver/ss-components-vue";

export type ScrollerExampleProps = {
    labels: string[];
};

export type ScrollerTabbedExampleProps = {
    tabs: Tab<string>[];
    selectedValue: string;
    onSelectionChange: (value: string) => void;
};
