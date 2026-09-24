import { createSignal } from "solid-js";

import { SVGFilterDefsFactory, access } from "@thewaver/ss-components";

import { SVGFilterKnobs } from "../../../Knobs/SVGFilters.const";
import { PageProp } from "../../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../../PageComponents/PropsPanel/PropsPanel";
import { PageNumberField } from "../../../StyledComponents/Field/Field";
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

            <PagePropsPanel scope={"local"}>
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
            </PagePropsPanel>
        </>
    );
};
