import type { ComponentPublicInstance } from "vue";

import type { BaseScrollerBarContentProps } from "@thewaver/ss-playground/App/StyledComponents/ScrollerBarContent/ScrollerBarContent.types";

export type ScrollerBarContentProps = BaseScrollerBarContentProps & {
    setTrackRef: (target: Element | ComponentPublicInstance | null) => void;
    setThumbRef: (target: Element | ComponentPublicInstance | null) => void;
};
