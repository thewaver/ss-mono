import type { SVGFilterMethod, SortableItem } from "@thewaver/ss-components-vue";
import type { SVGFiltersStep } from "@thewaver/ss-playground/App/Pages/SVGFiltersPage/SVGFilterSteps.types";
import type { Size2d } from "@thewaver/ss-utils";

export type SVGFiltersExampleProps = {
    method: SVGFilterMethod;
    elementSize?: Size2d;
};

export type SVGFiltersStackExampleProps = SVGFiltersExampleProps & {
    "applied": SortableItem<SVGFiltersStep>[];
    "onUpdate:applied"?: (items: SortableItem<SVGFiltersStep>[]) => void;
    "unused": SortableItem<SVGFiltersStep>[];
    "onUpdate:unused"?: (items: SortableItem<SVGFiltersStep>[]) => void;
};
