export type LabelContextType = {
    getIsLabeled: () => boolean;
    getLabelId: () => string | undefined;
    setControlId: (id: string | undefined) => void;
};
