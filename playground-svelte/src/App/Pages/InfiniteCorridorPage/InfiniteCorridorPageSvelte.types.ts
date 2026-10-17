import type { InfiniteCorridorLayoutRule } from "@thewaver/ss-components-svelte";
import type { BaseInfiniteCorridorExampleValues } from "@thewaver/ss-playground/App/Pages/InfiniteCorridorPage/InfiniteCorridorPage.types";

export type InfiniteCorridorExampleProps = BaseInfiniteCorridorExampleValues & {
    toLayout: (spinDegrees: number) => InfiniteCorridorLayoutRule;
};
