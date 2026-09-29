import type { SVGFilterMethod, SortableItem } from "@thewaver/ss-components-svelte";
import type { SVGFiltersStep } from "@thewaver/ss-playground/App/Pages/SVGFiltersPage/SVGFilterSteps.types";
import type { Size2d } from "@thewaver/ss-utils";

export type SVGFiltersExampleProps = {
    method: SVGFilterMethod;
    elementSize: Size2d | undefined;
};

export type SVGFiltersStackExampleProps = SVGFiltersExampleProps & {
    applied: SortableItem<SVGFiltersStep>[];
    unused: SortableItem<SVGFiltersStep>[];
};
