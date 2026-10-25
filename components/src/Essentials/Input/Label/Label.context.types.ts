export type LabelContextType = {
    getIsLabeled: () => boolean;
    getLabelId: () => string | undefined;
    setControlId: (id: string | undefined) => void;
    getCaptionId: () => string | undefined;
    setCaptionId: (id: string | undefined) => void;
};
