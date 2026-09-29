export type CurrencyInputExampleProps = {
    locale: string;
    decimals: number;
    hasSign: boolean;
    groupSizes: number[] | undefined;
    value: readonly [number | undefined, (value: number | undefined) => void];
};
