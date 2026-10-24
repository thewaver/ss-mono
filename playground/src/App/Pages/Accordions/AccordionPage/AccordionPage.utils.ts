import type { AccordionPolicy } from "./AccordionPage.types";

export namespace AccordionPageUtils {
    export const getIsSingleExpand = (policy: AccordionPolicy) => policy !== "many";

    export const getIsExpandRequired = (policy: AccordionPolicy) => policy === "single_required";
}
