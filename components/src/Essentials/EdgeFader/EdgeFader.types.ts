export type EdgeFaderEdge = "top" | "right" | "bottom" | "left";

export type EdgeFaderMetrics = {
    remaining: Record<EdgeFaderEdge, number>;
    gutterWidth: number;
    gutterHeight: number;
};

export type EdgeFaderMaskStyle = {
    maskImage: string;
    maskSize: string;
    maskPosition: string;
    maskComposite: string;
};
