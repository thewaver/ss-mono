import { SVGFilterDefsFactory } from "@thewaver/ss-components-react";

import { PageFilterStage } from "../../../StyledComponents/SVGFiltersContent/SVGFiltersContent";
import type { SVGFiltersHueExampleProps } from "../SVGFiltersPage.types";

const FILTER_ID = "svgFiltersHue";

type Props = SVGFiltersHueExampleProps;

export const HueExample = (props: Props) => {
    return (
        <PageFilterStage
            filterId={FILTER_ID}
            label={"hue"}
            renderDefs={() =>
                new SVGFilterDefsFactory(FILTER_ID)
                    .addHueRotationFilter({ deg: props.deg })
                    .addSaturationFilter({ amount: props.saturation })
                    .addColorChannelFilter({ r: props.r, g: props.g, b: props.b })
                    .computeFilterPrimitives({
                        method: props.method,
                        elementSize: props.elementSize,
                    })
            }
        />
    );
};
