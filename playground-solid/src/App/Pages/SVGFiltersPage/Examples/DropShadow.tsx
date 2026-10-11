import { SVGFilterDefsFactory, access } from "@thewaver/ss-components-solid";

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
                        dx: access(props.dx),
                        dy: access(props.dy),
                        stdDeviation: access(props.stdDeviation),
                        floodColor: access(props.floodColor),
                        floodOpacity: access(props.floodOpacity),
                    })
                    .computeFilterPrimitives({
                        method: access(props.method),
                        elementSize: access(props.elementSize),
                    })
            }
        />
    );
};
