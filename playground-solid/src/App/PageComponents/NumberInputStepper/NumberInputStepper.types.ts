import type {
    AccessorProps,
    InteractionFlags,
    MaybeAccessor,
    NumberInputStepper,
    TextFieldFlags,
} from "@thewaver/ss-components-solid";

export type NumberInputStepperProps = AccessorProps<{
    flags: InteractionFlags<TextFieldFlags>;
}> & {
    stepper: MaybeAccessor<NumberInputStepper>;
};
