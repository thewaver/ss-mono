import { SVGFilterDefsFactory } from "@thewaver/ss-components-react";

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
                    .addGaussianBlurFilter({ stdDeviation: props.stdDeviation })
                    .computeFilterPrimitives({
                        method: props.method,
                        elementSize: props.elementSize,
                    })
            }
        />
    );
};
