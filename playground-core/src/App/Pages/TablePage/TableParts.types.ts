export type Part = {
    sku: string;
    name: string;
    category: string;
    stock: number;
    pricePence: number;
};

export type PartColumnDefs = {
    isResizable?: boolean;
    isReorderable?: boolean;
};
