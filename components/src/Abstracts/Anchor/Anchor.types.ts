export type AnchorHPlacement = "left_in" | "left_out" | "right_in" | "right_out" | "center";

export type AnchorVPlacement = "top_in" | "top_out" | "bottom_in" | "bottom_out" | "center";

export type AnchorPlacement = {
    x: AnchorHPlacement;
    y: AnchorVPlacement;
};

export type AnchorBandKind = "before" | "after" | "over";

export type AnchorBand = {
    start: number;
    end: number;
};
