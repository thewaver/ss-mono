import { SVGFilterDefsFactory } from "@thewaver/ss-components-react";

import { PageFilterStage } from "../../../StyledComponents/SVGFiltersContent/SVGFiltersContent";
import type { SVGFiltersPixelateExampleProps } from "../SVGFiltersPage.types";

const FILTER_ID = "svgFiltersPixelate";

type Props = SVGFiltersPixelateExampleProps;

export const PixelateExample = (props: Props) => {
    return (
        <PageFilterStage
            filterId={FILTER_ID}
            label={"pixelate"}
            renderDefs={() =>
                new SVGFilterDefsFactory(FILTER_ID).addPixelateFilter({ size: props.size }).computeFilterPrimitives({
                    method: props.method,
                    elementSize: props.elementSize,
                })
            }
        />
    );
};
