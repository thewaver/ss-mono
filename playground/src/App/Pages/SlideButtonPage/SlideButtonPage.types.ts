import type { AccessorProps } from "@thewaver/ss-components";

export type SlideButtonExampleProps = {
    onActivate: () => void;
};

export type SlideButtonHeldExampleProps = AccessorProps<{
    isArmed: boolean;
    onActivate: () => void;
    onReset: () => void;
}>;

export type SlideButtonErroredExampleProps = AccessorProps<{
    hasError: boolean;
    onActivate: () => void;
}>;
