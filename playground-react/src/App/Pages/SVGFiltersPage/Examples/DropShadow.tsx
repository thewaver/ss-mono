import { SVGFilterDefsFactory } from "@thewaver/ss-components-react";

import { PageFilterStage } from "../../../StyledComponents/SVGFiltersContent/SVGFiltersContent";
import type { SVGFiltersDropShadowExampleProps } from "../SVGFiltersPage.types";

const FILTER_ID = "svgFiltersDropShadow";

type Props = SVGFiltersDropShadowExampleProps;

export const DropShadowExample = (props: Props) => {
    return (
        <PageFilterStage
            filterId={FILTER_ID}
            label={"shadow"}
            renderDefs={() =>
                new SVGFilterDefsFactory(FILTER_ID)
                    .addDropShadowFilter({
                        dx: props.dx,
                        dy: props.dy,
                        stdDeviation: props.stdDeviation,
                        floodColor: props.floodColor,
                        floodOpacity: props.floodOpacity,
                    })
                    .computeFilterPrimitives({
                        method: props.method,
                        elementSize: props.elementSize,
                    })
            }
        />
    );
};
