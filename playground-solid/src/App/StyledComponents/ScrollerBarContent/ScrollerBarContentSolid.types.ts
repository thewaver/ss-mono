import type { AccessorValues, ScrollerBarRefs } from "@thewaver/ss-components-solid";
import type { BaseScrollerBarContentValues } from "@thewaver/ss-playground/App/StyledComponents/ScrollerBarContent/ScrollerBarContent.types";

export type ScrollerBarContentProps = AccessorValues<BaseScrollerBarContentValues> & {
    refs: ScrollerBarRefs;
};
