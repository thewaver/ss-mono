import type { Signal } from "solid-js";

import type { AccessorProps, SVGFilterMethod, SortableItem } from "@thewaver/ss-components-solid";
import type { SVGFiltersStep } from "@thewaver/ss-playground/App/Pages/SVGFiltersPage/SVGFilterSteps.types";
import type { Size2d } from "@thewaver/ss-utils";

export type SVGFiltersExampleProps = AccessorProps<{
    method: SVGFilterMethod;
    elementSize: Size2d | undefined;
}>;

export type SVGFiltersStackExampleProps = SVGFiltersExampleProps & {
    appliedSignal: Signal<SortableItem<SVGFiltersStep>[]>;
    unusedSignal: Signal<SortableItem<SVGFiltersStep>[]>;
};
