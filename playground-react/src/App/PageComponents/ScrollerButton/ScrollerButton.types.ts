import type { ScrollerAxis, ScrollerController, ScrollerStep } from "@thewaver/ss-components-react";

export type ScrollerButtonProps = {
    controller: ScrollerController | undefined;
    step: ScrollerStep;
    axis?: ScrollerAxis;
    id?: string;
};
