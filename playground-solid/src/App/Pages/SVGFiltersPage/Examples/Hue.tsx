import { SVGFilterDefsFactory, access } from "@thewaver/ss-components-solid";

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
                    .addHueRotationFilter({ deg: access(props.deg) })
                    .addSaturationFilter({ amount: access(props.saturation) })
                    .addColorChannelFilter({ r: access(props.r), g: access(props.g), b: access(props.b) })
                    .computeFilterPrimitives({
                        method: access(props.method),
                        elementSize: access(props.elementSize),
                    })
            }
        />
    );
};
