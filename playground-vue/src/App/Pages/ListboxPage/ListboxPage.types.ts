export type ListboxExampleProps = {
    "value": string | undefined;
    "onUpdate:value"?: (value: string | undefined) => void;
};

export type MultiListboxExampleProps = {
    "values": string[];
    "onUpdate:values"?: (values: string[]) => void;
};
