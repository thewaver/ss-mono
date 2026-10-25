export type BaseToolbarExampleValues = {
    gap: number;
};

export type BaseToolbarExampleCbs = {
    onActivate: (value: string) => void;
};

export type BaseToolbarExampleProps = BaseToolbarExampleValues & BaseToolbarExampleCbs;

export type BaseToolbarBasicDocsExampleValues = {
    barWidth: number;
    gap: number;
};

export type BaseToolbarBasicDocsExampleCbs = {
    onBarWidthChange: (width: number) => void;
};

export type BaseToolbarTooltipDocsExampleValues = {
    isDisabled: boolean;
    isReachableWhenDisabled: boolean;
};
