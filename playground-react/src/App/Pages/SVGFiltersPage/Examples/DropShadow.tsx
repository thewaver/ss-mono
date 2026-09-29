import { useState } from "react";

import { SVGFilterDefsFactory } from "@thewaver/ss-components-react";
import { SVGFilterKnobs } from "@thewaver/ss-playground/App/Knobs/SVGFilters.const";

import { PageExampleKnobs } from "../../../PageComponents/ExampleKnobs/ExampleKnobs";
import { PageColorField, PageNumberField } from "../../../PageComponents/Field/Field";
import { PageProp } from "../../../PageComponents/Prop/Prop";
import { PageFilterStage } from "../../../StyledComponents/SVGFiltersContent/SVGFiltersContent";
import type { SVGFiltersExampleProps } from "../SVGFiltersPage.types";

const FILTER_ID = "svgFiltersDropShadow";

type Props = SVGFiltersExampleProps;

export const DropShadowExample = (props: Props) => {
    const [dx, setDx] = useState(SVGFilterKnobs.DropShadow.STARTING_DX);
    const [dy, setDy] = useState(SVGFilterKnobs.DropShadow.STARTING_DY);
    const [stdDeviation, setStdDeviation] = useState(SVGFilterKnobs.DropShadow.STARTING_DEVIATION);
    const [floodColor, setFloodColor] = useState(SVGFilterKnobs.DropShadow.STARTING_COLOR);
    const [floodOpacity, setFloodOpacity] = useState(SVGFilterKnobs.DropShadow.STARTING_OPACITY);

    return (
        <>
            <PageFilterStage
                filterId={FILTER_ID}
                label={"shadow"}
                renderDefs={() =>
                    new SVGFilterDefsFactory(FILTER_ID)
                        .addDropShadowFilter({
                            dx,
                            dy,
                            stdDeviation,
                            floodColor,
                            floodOpacity,
                        })
                        .computeFilterPrimitives({
                            method: props.method,
                            elementSize: props.elementSize,
                        })
                }
            />

            <PageExampleKnobs>
                <PageProp
                    itemKey={"dx"}
                    label={"Offset x"}
                    hint={"How far the shadow is thrown sideways from the shape casting it."}
                >
                    <PageNumberField
                        value={dx}
                        min={SVGFilterKnobs.DropShadow.MIN_OFFSET}
                        max={SVGFilterKnobs.DropShadow.MAX_OFFSET}
                        ariaLabel={"Offset x"}
                        onInput={setDx}
                    />
                </PageProp>

                <PageProp
                    itemKey={"dy"}
                    label={"Offset y"}
                    hint={"How far the shadow is thrown up or down from the shape casting it."}
                >
                    <PageNumberField
                        value={dy}
                        min={SVGFilterKnobs.DropShadow.MIN_OFFSET}
                        max={SVGFilterKnobs.DropShadow.MAX_OFFSET}
                        ariaLabel={"Offset y"}
                        onInput={setDy}
                    />
                </PageProp>

                <PageProp
                    itemKey={"shadowStdDeviation"}
                    label={"Std deviation"}
                    hint={"How soft the shadow's edge is. 0 gives a hard copy of the shape."}
                >
                    <PageNumberField
                        value={stdDeviation}
                        min={SVGFilterKnobs.DropShadow.MIN_DEVIATION}
                        max={SVGFilterKnobs.DropShadow.MAX_DEVIATION}
                        step={SVGFilterKnobs.DropShadow.DEVIATION_STEP}
                        ariaLabel={"Shadow standard deviation"}
                        onInput={setStdDeviation}
                    />
                </PageProp>

                <PageProp itemKey={"floodColor"} label={"Flood color"} hint={"The color the shadow is painted in."}>
                    <PageColorField value={floodColor} ariaLabel={"Flood color"} onInput={setFloodColor} />
                </PageProp>

                <PageProp
                    itemKey={"floodOpacity"}
                    label={"Flood opacity"}
                    hint={"How solid the shadow is. 0 hides it entirely."}
                >
                    <PageNumberField
                        value={floodOpacity}
                        min={SVGFilterKnobs.DropShadow.MIN_OPACITY}
                        max={SVGFilterKnobs.DropShadow.MAX_OPACITY}
                        step={SVGFilterKnobs.DropShadow.OPACITY_STEP}
                        ariaLabel={"Flood opacity"}
                        onInput={setFloodOpacity}
                    />
                </PageProp>
            </PageExampleKnobs>
        </>
    );
};
