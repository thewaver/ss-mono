export type MultiSelectClearableExampleProps = {
    "values": string[];
    "onUpdate:values"?: (values: string[]) => void;
    "onSelectionChange": (values: string[]) => void;
};
