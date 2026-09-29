import type { AccessorProps, MaybeAccessor, ScrollerStep, ScrollerStepper } from "@thewaver/ss-components-solid";

export type ScrollerButtonProps = AccessorProps<{
    step: ScrollerStep;
}> & {
    stepper: MaybeAccessor<ScrollerStepper>;
};
