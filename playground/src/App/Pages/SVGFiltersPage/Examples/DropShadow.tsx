import { createSignal } from "solid-js";

import { SVGFilterDefsFactory, access } from "@thewaver/ss-components";

import { SVGFilterKnobs } from "../../../Knobs/SVGFilters.const";
import { PageExampleKnobs } from "../../../PageComponents/ExampleKnobs/ExampleKnobs";
import { PageColorField, PageNumberField } from "../../../PageComponents/Field/Field";
import { PageProp } from "../../../PageComponents/Prop/Prop";
import { PageFilterStage } from "../../../StyledComponents/SVGFiltersContent/SVGFiltersContent";
import type { SVGFiltersExampleProps } from "../SVGFiltersPage.types";

const FILTER_ID = "svgFiltersDropShadow";

type Props = SVGFiltersExampleProps;

export const DropShadowExample = (props: Props) => {
    const [getDx, setDx] = createSignal(SVGFilterKnobs.DropShadow.STARTING_DX);
    const [getDy, setDy] = createSignal(SVGFilterKnobs.DropShadow.STARTING_DY);
    const [getStdDeviation, setStdDeviation] = createSignal(SVGFilterKnobs.DropShadow.STARTING_DEVIATION);
    const [getFloodColor, setFloodColor] = createSignal(SVGFilterKnobs.DropShadow.STARTING_COLOR);
    const [getFloodOpacity, setFloodOpacity] = createSignal(SVGFilterKnobs.DropShadow.STARTING_OPACITY);

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

            <PageExampleKnobs>
                <PageProp
                    key={"dx"}
                    label={"Offset x"}
                    hint={"How far the shadow is thrown sideways from the shape casting it."}
                >
                    <PageNumberField
                        value={getDx}
                        min={() => SVGFilterKnobs.DropShadow.MIN_OFFSET}
                        max={() => SVGFilterKnobs.DropShadow.MAX_OFFSET}
                        ariaLabel={"Offset x"}
                        onInput={setDx}
                    />
                </PageProp>

                <PageProp
                    key={"dy"}
                    label={"Offset y"}
                    hint={"How far the shadow is thrown up or down from the shape casting it."}
                >
                    <PageNumberField
                        value={getDy}
                        min={() => SVGFilterKnobs.DropShadow.MIN_OFFSET}
                        max={() => SVGFilterKnobs.DropShadow.MAX_OFFSET}
                        ariaLabel={"Offset y"}
                        onInput={setDy}
                    />
                </PageProp>

                <PageProp
                    key={"shadowStdDeviation"}
                    label={"Std deviation"}
                    hint={"How soft the shadow's edge is. 0 gives a hard copy of the shape."}
                >
                    <PageNumberField
                        value={getStdDeviation}
                        min={() => SVGFilterKnobs.DropShadow.MIN_DEVIATION}
                        max={() => SVGFilterKnobs.DropShadow.MAX_DEVIATION}
                        step={() => SVGFilterKnobs.DropShadow.DEVIATION_STEP}
                        ariaLabel={"Shadow standard deviation"}
                        onInput={setStdDeviation}
                    />
                </PageProp>

                <PageProp key={"floodColor"} label={"Flood color"} hint={"The color the shadow is painted in."}>
                    <PageColorField value={getFloodColor} ariaLabel={"Flood color"} onInput={setFloodColor} />
                </PageProp>

                <PageProp
                    key={"floodOpacity"}
                    label={"Flood opacity"}
                    hint={"How solid the shadow is. 0 hides it entirely."}
                >
                    <PageNumberField
                        value={getFloodOpacity}
                        min={() => SVGFilterKnobs.DropShadow.MIN_OPACITY}
                        max={() => SVGFilterKnobs.DropShadow.MAX_OPACITY}
                        step={() => SVGFilterKnobs.DropShadow.OPACITY_STEP}
                        ariaLabel={"Flood opacity"}
                        onInput={setFloodOpacity}
                    />
                </PageProp>
            </PageExampleKnobs>
        </>
    );
};
