import type { SVGFilterMethod, SortableItem } from "@thewaver/ss-components-react";
import type { SVGFiltersStep } from "@thewaver/ss-playground/App/Pages/SVGFiltersPage/SVGFilterSteps.types";
import type { Size2d } from "@thewaver/ss-utils";

export type SVGFiltersExampleProps = {
    method: SVGFilterMethod;
    elementSize: Size2d | undefined;
};

export type SVGFiltersStackExampleProps = SVGFiltersExampleProps & {
    applied: readonly [SortableItem<SVGFiltersStep>[], (items: SortableItem<SVGFiltersStep>[]) => void];
    unused: readonly [SortableItem<SVGFiltersStep>[], (items: SortableItem<SVGFiltersStep>[]) => void];
};
