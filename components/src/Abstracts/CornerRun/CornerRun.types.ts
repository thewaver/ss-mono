export type CornerRunDirection = "column" | "column-reverse" | "row" | "row-reverse";

export type CornerRunEdge = "leading" | "trailing";

export type CornerRunProperty =
    "borderStartStartRadius" | "borderStartEndRadius" | "borderEndStartRadius" | "borderEndEndRadius";

export type CornerRunCorners = Partial<Record<CornerRunProperty, "inherit" | 0>>;
