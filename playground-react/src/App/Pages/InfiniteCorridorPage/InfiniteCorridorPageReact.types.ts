import type { InfiniteCorridorLayoutRule } from "@thewaver/ss-components-react";
import type { BaseInfiniteCorridorExampleValues } from "@thewaver/ss-playground/App/Pages/InfiniteCorridorPage/InfiniteCorridorPage.types";

export type InfiniteCorridorExampleProps = BaseInfiniteCorridorExampleValues & {
    layout: InfiniteCorridorLayoutRule;
};
