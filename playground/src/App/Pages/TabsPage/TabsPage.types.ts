import type { TabsOrientation } from "@thewaver/ss-components";

export type BaseTabsExampleValues = {
    selectedValue: string | undefined;
    hasAutoActivation?: boolean;
};

export type BaseTabsExampleCbs = {
    onSelectionChange: (value: string) => void;
};

export type BaseTabsExampleProps = BaseTabsExampleValues & BaseTabsExampleCbs;

export type BaseTabsBasicDocsExampleValues = {
    orientation: TabsOrientation;
    isDisabled: boolean;
};

export type BaseTabsAutomaticDocsExampleValues = {
    hasAutoActivation: boolean;
};

export type BaseTabsDisabledTabDocsExampleValues = {
    isReachableWhenDisabled: boolean;
};

export type BaseTabsLinksDocsExampleValues = {
    hasLinkComponent: boolean;
};
