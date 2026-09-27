export type CurrencyInputExampleProps = {
    locale: string;
    decimals: number;
    hasSign: boolean;
    groupSizes: number[] | undefined;
    valueState: readonly [number | undefined, (value: number | undefined) => void];
};
