export type VariantDefs = {
    key: string;
    name: string;
    readout?: () => string;
};

export type VariantsProps = {
    items: VariantDefs[];
    minColumnWidth?: number;
};
