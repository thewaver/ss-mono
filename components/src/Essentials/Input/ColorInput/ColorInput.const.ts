import type { AnchorPlacement } from "../../../Abstracts/Anchor/Anchor.types";
import type { NavigatorDirection } from "../../../Abstracts/Navigator/Navigator.types";

export const COLOR_INPUT_DEFAULTS = {
    placement: {
        ltr: { x: "left_in", y: "bottom_out" },
        rtl: { x: "right_in", y: "bottom_out" },
    } as Record<NavigatorDirection, AnchorPlacement>,
    computeValueText: (value: string) => value,
};
