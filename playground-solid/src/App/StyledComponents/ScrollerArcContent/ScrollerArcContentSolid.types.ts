import type { AccessorValues, ScrollerBarRefs } from "@thewaver/ss-components-solid";
import type { BaseScrollerArcContentValues } from "@thewaver/ss-playground/App/StyledComponents/ScrollerArcContent/ScrollerArcContent.types";

export type ScrollerArcContentProps = AccessorValues<BaseScrollerArcContentValues> & {
    refs: ScrollerBarRefs;
};
