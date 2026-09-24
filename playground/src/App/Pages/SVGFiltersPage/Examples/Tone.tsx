import { createSignal } from "solid-js";

import { SVGFilterDefsFactory, access } from "@thewaver/ss-components";

import { SVGFilterKnobs } from "../../../Knobs/SVGFilters.const";
import { PageExampleKnobs } from "../../../PageComponents/ExampleKnobs/ExampleKnobs";
import { PageProp } from "../../../PageComponents/Prop/Prop";
import { PageNumberField } from "../../../StyledComponents/Field/Field";
import { PageFilterStage } from "../../../StyledComponents/SVGFiltersContent/SVGFiltersContent";
import type { SVGFiltersExampleProps } from "../SVGFiltersPage.types";

const FILTER_ID = "svgFiltersTone";

type Props = SVGFiltersExampleProps;

export const ToneExample = (props: Props) => {
    const [getBrightness, setBrightness] = createSignal(SVGFilterKnobs.Tone.STARTING_BRIGHTNESS);
    const [getContrast, setContrast] = createSignal(SVGFilterKnobs.Tone.STARTING_CONTRAST);
    const [getInversion, setInversion] = createSignal(SVGFilterKnobs.Tone.STARTING_INVERSION);

    return (
        <>
            <PageFilterStage
                filterId={FILTER_ID}
                label={"tone"}
                renderDefs={() =>
                    new SVGFilterDefsFactory(FILTER_ID)
                        .addBrightnessFilter({ amount: getBrightness() })
                        .addContrastFilter({ amount: getContrast() })
                        .addInversionFilter({ amount: getInversion() })
                        .computeFilterPrimitives({
                            method: access(props.method),
                            elementSize: access(props.elementSize),
                        })
                }
            />

            <PageExampleKnobs>
                <PageProp
                    key={"brightness"}
                    label={"Brightness"}
                    hint={"How much lighter or darker the picture is. 1 leaves it alone."}
                >
                    <PageNumberField
                        value={getBrightness}
                        min={() => SVGFilterKnobs.Tone.MIN_AMOUNT}
                        max={() => SVGFilterKnobs.Tone.MAX_AMOUNT}
                        step={() => SVGFilterKnobs.Tone.AMOUNT_STEP}
                        ariaLabel={"Brightness"}
                        onInput={setBrightness}
                    />
                </PageProp>

                <PageProp
                    key={"contrast"}
                    label={"Contrast"}
                    hint={"How far the lights and darks are pushed apart. 1 leaves it alone."}
                >
                    <PageNumberField
                        value={getContrast}
                        min={() => SVGFilterKnobs.Tone.MIN_AMOUNT}
                        max={() => SVGFilterKnobs.Tone.MAX_AMOUNT}
                        step={() => SVGFilterKnobs.Tone.AMOUNT_STEP}
                        ariaLabel={"Contrast"}
                        onInput={setContrast}
                    />
                </PageProp>

                <PageProp
                    key={"inversion"}
                    label={"Inversion"}
                    hint={"How far the colors are flipped to their opposites. 0 leaves them alone, 1 fully inverts."}
                >
                    <PageNumberField
                        value={getInversion}
                        min={() => SVGFilterKnobs.Tone.MIN_INVERSION}
                        max={() => SVGFilterKnobs.Tone.MAX_INVERSION}
                        step={() => SVGFilterKnobs.Tone.INVERSION_STEP}
                        ariaLabel={"Inversion"}
                        onInput={setInversion}
                    />
                </PageProp>
            </PageExampleKnobs>
        </>
    );
};
