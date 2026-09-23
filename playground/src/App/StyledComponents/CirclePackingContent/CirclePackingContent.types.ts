import type { AccessorProps, CirclePackingCircleState } from "@thewaver/ss-components";

export type PageCirclePackingCircleProps = AccessorProps<{
    state: CirclePackingCircleState;
    title: string;
}>;

export type PageCirclePackingLabelProps = AccessorProps<{
    state: CirclePackingCircleState;
    name: string;
}>;
