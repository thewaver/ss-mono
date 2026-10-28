import type { InfiniteCorridorLayoutRule } from "@thewaver/ss-components-react";
import type {
    BaseInfiniteCorridorClockExampleValues,
    BaseInfiniteCorridorExampleValues,
    BaseInfiniteCorridorScrolledExampleValues,
} from "@thewaver/ss-playground/App/Pages/InfiniteCorridorPage/InfiniteCorridorPage.types";

type LayoutProps = {
    toLayout: (spinDegrees: number) => InfiniteCorridorLayoutRule;
};

export type InfiniteCorridorExampleProps = BaseInfiniteCorridorExampleValues & LayoutProps;

export type InfiniteCorridorScrolledExampleProps = BaseInfiniteCorridorScrolledExampleValues & LayoutProps;

export type InfiniteCorridorClockExampleProps = BaseInfiniteCorridorClockExampleValues & LayoutProps;
