export type CurrencyInputExampleProps = {
    "locale": string;
    "decimals": number;
    "hasSign": boolean;
    "groupSizes": number[] | undefined;
    "value": number | undefined;
    "onUpdate:value"?: (value: number | undefined) => void;
};
