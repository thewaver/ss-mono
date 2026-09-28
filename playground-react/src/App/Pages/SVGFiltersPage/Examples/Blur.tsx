import { useState } from "react";

import { SVGFilterDefsFactory } from "@thewaver/ss-components-react";
import { SVGFilterKnobs } from "@thewaver/ss-playground/App/Knobs/SVGFilters.const";

import { PageExampleKnobs } from "../../../PageComponents/ExampleKnobs/ExampleKnobs";
import { PageNumberField } from "../../../PageComponents/Field/Field";
import { PageProp } from "../../../PageComponents/Prop/Prop";
import { PageFilterStage } from "../../../StyledComponents/SVGFiltersContent/SVGFiltersContent";
import type { SVGFiltersExampleProps } from "../SVGFiltersPage.types";

const FILTER_ID = "svgFiltersBlur";

type Props = SVGFiltersExampleProps;

export const BlurExample = (props: Props) => {
    const [stdDeviation, setStdDeviation] = useState(SVGFilterKnobs.Blur.STARTING_DEVIATION);

    return (
        <>
            <PageFilterStage
                filterId={FILTER_ID}
                label={"blur"}
                renderDefs={() =>
                    new SVGFilterDefsFactory(FILTER_ID)
                        .addGaussianBlurFilter({ stdDeviation })
                        .computeFilterPrimitives({
                            method: props.method,
                            elementSize: props.elementSize,
                        })
                }
            />

            <PageExampleKnobs>
                <PageProp
                    itemKey={"stdDeviation"}
                    label={"Std deviation"}
                    hint={"How far the blur reaches. 0 leaves the picture sharp."}
                >
                    <PageNumberField
                        value={stdDeviation}
                        min={SVGFilterKnobs.Blur.MIN_DEVIATION}
                        max={SVGFilterKnobs.Blur.MAX_DEVIATION}
                        step={SVGFilterKnobs.Blur.DEVIATION_STEP}
                        ariaLabel={"Standard deviation"}
                        onInput={setStdDeviation}
                    />
                </PageProp>
            </PageExampleKnobs>
        </>
    );
};
