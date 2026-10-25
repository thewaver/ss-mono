import type { AccessorProps, ScrollerAxis, ScrollerController, ScrollerStep } from "@thewaver/ss-components-solid";

export type ScrollerButtonProps = AccessorProps<{
    controller: ScrollerController | undefined;
    step: ScrollerStep;
    axis?: ScrollerAxis;
    id?: string;
}>;
