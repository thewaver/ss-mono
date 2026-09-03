import { createSignal } from "solid-js";

import { SVGFilterDefsFactory, access } from "@thewaver/ss-components";

import { PageProp } from "../../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../../PageComponents/PropsPanel/PropsPanel";
import { PageNumberField } from "../../../StyledComponents/Field/Field";
import { PageFilterStage } from "../../../StyledComponents/SVGFiltersContent/SVGFiltersContent";
import type { SVGFiltersExampleProps } from "../SVGFiltersPage.types";

const FILTER_ID = "svgFiltersBlur";
const MIN_DEVIATION = 0;
const MAX_DEVIATION = 12;
const DEVIATION_STEP = 0.5;
const STARTING_DEVIATION = 3;

type Props = SVGFiltersExampleProps;

export const BlurExample = (props: Props) => {
    const [getStdDeviation, setStdDeviation] = createSignal(STARTING_DEVIATION);

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
                <PageProp key={"stdDeviation"} label={"Std deviation"}>
                    <PageNumberField
                        value={getStdDeviation}
                        min={() => MIN_DEVIATION}
                        max={() => MAX_DEVIATION}
                        step={() => DEVIATION_STEP}
                        ariaLabel={"Standard deviation"}
                        onInput={setStdDeviation}
                    />
                </PageProp>
            </PagePropsPanel>
        </>
    );
};
