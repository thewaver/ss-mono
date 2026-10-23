import type {
    AccessorProps,
    MaybeAccessor,
    ScrollerAxis,
    ScrollerStep,
    ScrollerStepper,
} from "@thewaver/ss-components-solid";

export type ScrollerButtonProps = AccessorProps<{
    step: ScrollerStep;
    axis?: ScrollerAxis;
}> & {
    stepper: MaybeAccessor<ScrollerStepper>;
};
