import { createSignal } from "solid-js";

import { SVGFilterDefsFactory, access } from "@thewaver/ss-components";

import { SVGFilterKnobs } from "../../../Knobs/SVGFilters.const";
import { PageExampleKnobs } from "../../../PageComponents/ExampleKnobs/ExampleKnobs";
import { PageNumberField } from "../../../PageComponents/Field/Field";
import { PageProp } from "../../../PageComponents/Prop/Prop";
import { PageFilterStage } from "../../../StyledComponents/SVGFiltersContent/SVGFiltersContent";
import type { SVGFiltersExampleProps } from "../SVGFiltersPage.types";

const FILTER_ID = "svgFiltersBlur";

type Props = SVGFiltersExampleProps;

export const BlurExample = (props: Props) => {
    const [getStdDeviation, setStdDeviation] = createSignal(SVGFilterKnobs.Blur.STARTING_DEVIATION);

    return (
        <>
            <PageFilterStage
                filterId={FILTER_ID}
                label={"blur"}
                renderDefs={() =>
                    new SVGFilterDefsFactory(FILTER_ID)
                        .addGaussianBlurFilter({ stdDeviation: getStdDeviation() })
                        .computeFilterPrimitives({
                            method: access(props.method),
                            elementSize: access(props.elementSize),
                        })
                }
            />

            <PageExampleKnobs>
                <PageProp
                    key={"stdDeviation"}
                    label={"Std deviation"}
                    hint={"How far the blur reaches. 0 leaves the picture sharp."}
                >
                    <PageNumberField
                        value={getStdDeviation}
                        min={() => SVGFilterKnobs.Blur.MIN_DEVIATION}
                        max={() => SVGFilterKnobs.Blur.MAX_DEVIATION}
                        step={() => SVGFilterKnobs.Blur.DEVIATION_STEP}
                        ariaLabel={"Standard deviation"}
                        onInput={setStdDeviation}
                    />
                </PageProp>
            </PageExampleKnobs>
        </>
    );
};
