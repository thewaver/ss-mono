import type { CornerRunCorners, CornerRunDirection, CornerRunEdge, CornerRunProperty } from "./CornerRun.types";

const EDGE_CORNERS: Record<CornerRunDirection, Record<CornerRunEdge, CornerRunProperty[]>> = {
    "column": {
        leading: ["borderStartStartRadius", "borderStartEndRadius"],
        trailing: ["borderEndStartRadius", "borderEndEndRadius"],
    },
    "column-reverse": {
        leading: ["borderEndStartRadius", "borderEndEndRadius"],
        trailing: ["borderStartStartRadius", "borderStartEndRadius"],
    },
    "row": {
        leading: ["borderStartStartRadius", "borderEndStartRadius"],
        trailing: ["borderStartEndRadius", "borderEndEndRadius"],
    },
    "row-reverse": {
        leading: ["borderStartEndRadius", "borderEndEndRadius"],
        trailing: ["borderStartStartRadius", "borderEndStartRadius"],
    },
};

export namespace CornerRunUtils {
    /**
     * The two corners on one edge of a run of items laid out by flex, as a style rule setting both to one value.
     *
     * A run is a row or column of items a component renders inside a box the consumer rounds. The first item in
     * markup sits on the `leading` edge and the last on the `trailing` one, whichever way `direction` lays them out,
     * so `column-reverse` puts the leading edge at the bottom. The corners are logical, so a row in a right-to-left
     * page flips with the layout and needs no rule of its own.
     *
     * Hand the first item the leading corners as `"inherit"` and the last the trailing ones, over a base rule
     * setting every corner of every item to `0`: an item that is both first and last then inherits all four, and
     * an item in the middle none, so a painter inside it writing `border-radius: inherit` takes exactly the box's
     * corners it touches. Setting an edge to `0` squares the side where two parts meet.
     *
     * @param direction The run's `flex-direction`.
     * @param edge Which end of the run.
     * @param value `"inherit"` to pass the box's corners on, `0` to square them.
     * @returns A style rule naming only the two corners on that edge.
     */
    export const computeEdge = (
        direction: CornerRunDirection,
        edge: CornerRunEdge,
        value: "inherit" | 0,
    ): CornerRunCorners => Object.fromEntries(EDGE_CORNERS[direction][edge].map((property) => [property, value]));
}
