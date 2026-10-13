export type BaseToolbarExampleValues = {
    gap: number;
};

export type BaseToolbarExampleCbs = {
    onActivate: (value: string) => void;
};

export type BaseToolbarExampleProps = BaseToolbarExampleValues & BaseToolbarExampleCbs;
