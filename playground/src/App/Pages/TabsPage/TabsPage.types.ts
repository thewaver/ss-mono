export type BaseTabsExampleValues = {
    selectedValue: string | undefined;
    hasAutoActivation?: boolean;
};

export type BaseTabsExampleCbs = {
    onSelectionChange: (value: string) => void;
};

export type BaseTabsExampleProps = BaseTabsExampleValues & BaseTabsExampleCbs;
