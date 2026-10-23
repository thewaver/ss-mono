import type { ComponentPublicInstance } from "vue";

import type { BaseScrollerArcContentProps } from "@thewaver/ss-playground/App/StyledComponents/ScrollerArcContent/ScrollerArcContent.types";

export type ScrollerArcContentProps = BaseScrollerArcContentProps & {
    setTrackRef: (target: Element | ComponentPublicInstance | null) => void;
    setThumbRef: (target: Element | ComponentPublicInstance | null) => void;
};
