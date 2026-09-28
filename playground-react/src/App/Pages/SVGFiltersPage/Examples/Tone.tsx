import { useState } from "react";

import { SVGFilterDefsFactory } from "@thewaver/ss-components-react";
import { SVGFilterKnobs } from "@thewaver/ss-playground/App/Knobs/SVGFilters.const";

import { PageExampleKnobs } from "../../../PageComponents/ExampleKnobs/ExampleKnobs";
import { PageNumberField } from "../../../PageComponents/Field/Field";
import { PageProp } from "../../../PageComponents/Prop/Prop";
import { PageFilterStage } from "../../../StyledComponents/SVGFiltersContent/SVGFiltersContent";
import type { SVGFiltersExampleProps } from "../SVGFiltersPage.types";

const FILTER_ID = "svgFiltersTone";

type Props = SVGFiltersExampleProps;

export const ToneExample = (props: Props) => {
    const [brightness, setBrightness] = useState(SVGFilterKnobs.Tone.STARTING_BRIGHTNESS);
    const [contrast, setContrast] = useState(SVGFilterKnobs.Tone.STARTING_CONTRAST);
    const [inversion, setInversion] = useState(SVGFilterKnobs.Tone.STARTING_INVERSION);

    return (
        <>
            <PageFilterStage
                filterId={FILTER_ID}
                label={"tone"}
                renderDefs={() =>
                    new SVGFilterDefsFactory(FILTER_ID)
                        .addBrightnessFilter({ amount: brightness })
                        .addContrastFilter({ amount: contrast })
                        .addInversionFilter({ amount: inversion })
                        .computeFilterPrimitives({
                            method: props.method,
                            elementSize: props.elementSize,
                        })
                }
            />

            <PageExampleKnobs>
                <PageProp
                    itemKey={"brightness"}
                    label={"Brightness"}
                    hint={"How much lighter or darker the picture is. 1 leaves it alone."}
                >
                    <PageNumberField
                        value={brightness}
                        min={SVGFilterKnobs.Tone.MIN_AMOUNT}
                        max={SVGFilterKnobs.Tone.MAX_AMOUNT}
                        step={SVGFilterKnobs.Tone.AMOUNT_STEP}
                        ariaLabel={"Brightness"}
                        onInput={setBrightness}
                    />
                </PageProp>

                <PageProp
                    itemKey={"contrast"}
                    label={"Contrast"}
                    hint={"How far the lights and darks are pushed apart. 1 leaves it alone."}
                >
                    <PageNumberField
                        value={contrast}
                        min={SVGFilterKnobs.Tone.MIN_AMOUNT}
                        max={SVGFilterKnobs.Tone.MAX_AMOUNT}
                        step={SVGFilterKnobs.Tone.AMOUNT_STEP}
                        ariaLabel={"Contrast"}
                        onInput={setContrast}
                    />
                </PageProp>

                <PageProp
                    itemKey={"inversion"}
                    label={"Inversion"}
                    hint={"How far the colors are flipped to their opposites. 0 leaves them alone, 1 fully inverts."}
                >
                    <PageNumberField
                        value={inversion}
                        min={SVGFilterKnobs.Tone.MIN_INVERSION}
                        max={SVGFilterKnobs.Tone.MAX_INVERSION}
                        step={SVGFilterKnobs.Tone.INVERSION_STEP}
                        ariaLabel={"Inversion"}
                        onInput={setInversion}
                    />
                </PageProp>
            </PageExampleKnobs>
        </>
    );
};
