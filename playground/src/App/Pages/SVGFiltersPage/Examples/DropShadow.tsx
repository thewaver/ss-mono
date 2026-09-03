import { createSignal } from "solid-js";

import { SVGFilterDefsFactory, access } from "@thewaver/ss-components";

import { PageProp } from "../../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../../PageComponents/PropsPanel/PropsPanel";
import { PageColorField, PageNumberField } from "../../../StyledComponents/Field/Field";
import { PageFilterStage } from "../../../StyledComponents/SVGFiltersContent/SVGFiltersContent";
import type { SVGFiltersExampleProps } from "../SVGFiltersPage.types";

const FILTER_ID = "svgFiltersDropShadow";
const MIN_OFFSET = -30;
const MAX_OFFSET = 30;
const MIN_DEVIATION = 0;
const MAX_DEVIATION = 12;
const DEVIATION_STEP = 0.5;
const MIN_OPACITY = 0;
const MAX_OPACITY = 1;
const OPACITY_STEP = 0.05;
const STARTING_DX = 8;
const STARTING_DY = 8;
const STARTING_DEVIATION = 4;
const STARTING_OPACITY = 0.6;
const STARTING_COLOR = "#000000";

type Props = SVGFiltersExampleProps;

export const DropShadowExample = (props: Props) => {
    const [getDx, setDx] = createSignal(STARTING_DX);
    const [getDy, setDy] = createSignal(STARTING_DY);
    const [getStdDeviation, setStdDeviation] = createSignal(STARTING_DEVIATION);
    const [getFloodColor, setFloodColor] = createSignal(STARTING_COLOR);
    const [getFloodOpacity, setFloodOpacity] = createSignal(STARTING_OPACITY);

    return (
        <>
            <PageFilterStage
                filterId={FILTER_ID}
                label={"shadow"}
                renderDefs={() =>
                    new SVGFilterDefsFactory(FILTER_ID)
                        .addDropShadowFilter({
                            dx: getDx(),
                            dy: getDy(),
                            stdDeviation: getStdDeviation(),
                            floodColor: getFloodColor(),
                            floodOpacity: getFloodOpacity(),
                        })
                        .computeFilterPrimitives({
                            method: access(props.method),
                            elementSize: access(props.elementSize),
                        })
                }
            />

            <PagePropsPanel scope={"local"}>
                <PageProp key={"dx"} label={"Offset x"}>
                    <PageNumberField
                        value={getDx}
                        min={() => MIN_OFFSET}
                        max={() => MAX_OFFSET}
                        ariaLabel={"Offset x"}
                        onInput={setDx}
                    />
                </PageProp>

                <PageProp key={"dy"} label={"Offset y"}>
                    <PageNumberField
                        value={getDy}
                        min={() => MIN_OFFSET}
                        max={() => MAX_OFFSET}
                        ariaLabel={"Offset y"}
                        onInput={setDy}
                    />
                </PageProp>

                <PageProp key={"shadowStdDeviation"} label={"Std deviation"}>
                    <PageNumberField
                        value={getStdDeviation}
                        min={() => MIN_DEVIATION}
                        max={() => MAX_DEVIATION}
                        step={() => DEVIATION_STEP}
                        ariaLabel={"Shadow standard deviation"}
                        onInput={setStdDeviation}
                    />
                </PageProp>

                <PageProp key={"floodColor"} label={"Flood colour"}>
                    <PageColorField value={getFloodColor} ariaLabel={"Flood colour"} onInput={setFloodColor} />
                </PageProp>

                <PageProp key={"floodOpacity"} label={"Flood opacity"}>
                    <PageNumberField
                        value={getFloodOpacity}
                        min={() => MIN_OPACITY}
                        max={() => MAX_OPACITY}
                        step={() => OPACITY_STEP}
                        ariaLabel={"Flood opacity"}
                        onInput={setFloodOpacity}
                    />
                </PageProp>
            </PagePropsPanel>
        </>
    );
};
