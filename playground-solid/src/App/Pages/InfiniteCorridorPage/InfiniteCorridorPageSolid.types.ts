import type { AccessorValues, InfiniteCorridorLayoutRule } from "@thewaver/ss-components-solid";
import type {
    BaseInfiniteCorridorClockExampleValues,
    BaseInfiniteCorridorExampleValues,
    BaseInfiniteCorridorScrolledExampleValues,
} from "@thewaver/ss-playground/App/Pages/InfiniteCorridorPage/InfiniteCorridorPage.types";

type LayoutProps = {
    toLayout: (spinDegrees: number) => InfiniteCorridorLayoutRule;
};

export type InfiniteCorridorExampleProps = AccessorValues<BaseInfiniteCorridorExampleValues> & LayoutProps;

export type InfiniteCorridorScrolledExampleProps = AccessorValues<BaseInfiniteCorridorScrolledExampleValues> &
    LayoutProps;

export type InfiniteCorridorClockExampleProps = AccessorValues<BaseInfiniteCorridorClockExampleValues> & LayoutProps;
