import type { ScrollerBarRefs } from "@thewaver/ss-components-react";
import type { BaseScrollerBarContentProps } from "@thewaver/ss-playground/App/StyledComponents/ScrollerBarContent/ScrollerBarContent.types";

export type ScrollerBarContentProps = BaseScrollerBarContentProps & {
    refs: ScrollerBarRefs;
};
