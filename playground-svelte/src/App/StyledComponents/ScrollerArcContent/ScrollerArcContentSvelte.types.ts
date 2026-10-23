import type { ScrollerBarRefs } from "@thewaver/ss-components-svelte";
import type { BaseScrollerArcContentProps } from "@thewaver/ss-playground/App/StyledComponents/ScrollerArcContent/ScrollerArcContent.types";

export type ScrollerArcContentProps = BaseScrollerArcContentProps & {
    refs: ScrollerBarRefs;
};
