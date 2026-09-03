import type { Signal } from "solid-js";

import type { AccessorProps, SVGFilterMethod, SortableItem } from "@thewaver/ss-components";
import type { Size2d } from "@thewaver/ss-utils";

export type SVGFiltersExampleProps = AccessorProps<{
    method: SVGFilterMethod;
    elementSize: Size2d | undefined;
}>;

export type SVGFiltersStepId = "turbulence" | "gaussianBlur" | "dropShadow" | "saturation";

export type SVGFiltersStep = {
    id: SVGFiltersStepId;
    name: string;
};

export type SVGFiltersStackExampleProps = SVGFiltersExampleProps & {
    appliedSignal: Signal<SortableItem<SVGFiltersStep>[]>;
    unusedSignal: Signal<SortableItem<SVGFiltersStep>[]>;
};
