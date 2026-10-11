import { SVGFilterDefsFactory } from "@thewaver/ss-components-react";

import { PageFilterStage } from "../../../StyledComponents/SVGFiltersContent/SVGFiltersContent";
import type { SVGFiltersTurbulenceExampleProps } from "../SVGFiltersPage.types";

const FILTER_ID = "svgFiltersTurbulence";

type Props = SVGFiltersTurbulenceExampleProps;

export const TurbulenceExample = (props: Props) => {
    return (
        <PageFilterStage
            filterId={FILTER_ID}
            label={"bend"}
            renderDefs={() =>
                new SVGFilterDefsFactory(FILTER_ID)
                    .addTurbulenceFilter({
                        baseFrequency: props.baseFrequency,
                        scale: props.scale,
                        type: props.type,
                        numOctaves: props.numOctaves,
                        seed: props.seed,
                        xChannelSelector: props.xChannelSelector,
                        yChannelSelector: props.yChannelSelector,
                    })
                    .computeFilterPrimitives({
                        method: props.method,
                        elementSize: props.elementSize,
                    })
            }
        />
    );
};
