import type { AccessorProps, Tab } from "@thewaver/ss-components";

export type ScrollerExampleProps = AccessorProps<{
    labels: string[];
}>;

export type ScrollerTabbedExampleProps = AccessorProps<{
    tabs: Tab<string>[];
    selectedValue: string;
}> & {
    onSelectionChange: (value: string) => void;
};
