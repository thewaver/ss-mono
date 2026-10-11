import { SVGFilterDefsFactory, access } from "@thewaver/ss-components-solid";

import { PageFilterStage } from "../../../StyledComponents/SVGFiltersContent/SVGFiltersContent";
import type { SVGFiltersBlurExampleProps } from "../SVGFiltersPage.types";

const FILTER_ID = "svgFiltersBlur";

type Props = SVGFiltersBlurExampleProps;

export const BlurExample = (props: Props) => {
    return (
        <PageFilterStage
            filterId={FILTER_ID}
            label={"blur"}
            renderDefs={() =>
                new SVGFilterDefsFactory(FILTER_ID)
                    .addGaussianBlurFilter({ stdDeviation: access(props.stdDeviation) })
                    .computeFilterPrimitives({
                        method: access(props.method),
                        elementSize: access(props.elementSize),
                    })
            }
        />
    );
};
