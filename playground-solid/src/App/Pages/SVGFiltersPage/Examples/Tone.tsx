import { SVGFilterDefsFactory, access } from "@thewaver/ss-components-solid";

import { PageFilterStage } from "../../../StyledComponents/SVGFiltersContent/SVGFiltersContent";
import type { SVGFiltersToneExampleProps } from "../SVGFiltersPage.types";

const FILTER_ID = "svgFiltersTone";

type Props = SVGFiltersToneExampleProps;

export const ToneExample = (props: Props) => {
    return (
        <PageFilterStage
            filterId={FILTER_ID}
            label={"tone"}
            renderDefs={() =>
                new SVGFilterDefsFactory(FILTER_ID)
                    .addBrightnessFilter({ amount: access(props.brightness) })
                    .addContrastFilter({ amount: access(props.contrast) })
                    .addInversionFilter({ amount: access(props.inversion) })
                    .computeFilterPrimitives({
                        method: access(props.method),
                        elementSize: access(props.elementSize),
                    })
            }
        />
    );
};
