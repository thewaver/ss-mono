import type { AnchorPlacement } from "../../../Abstracts/Anchor/Anchor.types";
import type { NavigatorDirection } from "../../../Abstracts/Navigator/Navigator.types";

export const TIME_PICKER_DEFAULTS = {
    placement: {
        ltr: { x: "left_in", y: "bottom_out" },
        rtl: { x: "right_in", y: "bottom_out" },
    } as Record<NavigatorDirection, AnchorPlacement>,
};
