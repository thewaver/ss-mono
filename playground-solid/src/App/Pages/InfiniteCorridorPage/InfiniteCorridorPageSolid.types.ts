import type { AccessorValues, InfiniteCorridorLayoutRule } from "@thewaver/ss-components-solid";
import type { BaseInfiniteCorridorExampleValues } from "@thewaver/ss-playground/App/Pages/InfiniteCorridorPage/InfiniteCorridorPage.types";

export type InfiniteCorridorExampleProps = AccessorValues<BaseInfiniteCorridorExampleValues> & {
    toLayout: (spinDegrees: number) => InfiniteCorridorLayoutRule;
};
