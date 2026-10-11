import { SVGFilterDefsFactory, access } from "@thewaver/ss-components-solid";

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
                        baseFrequency: access(props.baseFrequency),
                        scale: access(props.scale),
                        type: access(props.type),
                        numOctaves: access(props.numOctaves),
                        seed: access(props.seed),
                        xChannelSelector: access(props.xChannelSelector),
                        yChannelSelector: access(props.yChannelSelector),
                    })
                    .computeFilterPrimitives({
                        method: access(props.method),
                        elementSize: access(props.elementSize),
                    })
            }
        />
    );
};
