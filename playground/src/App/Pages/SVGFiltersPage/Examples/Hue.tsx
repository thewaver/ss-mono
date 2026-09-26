import { createSignal } from "solid-js";

import { SVGFilterDefsFactory, access } from "@thewaver/ss-components";

import { SVGFilterKnobs } from "../../../Knobs/SVGFilters.const";
import { PageExampleKnobs } from "../../../PageComponents/ExampleKnobs/ExampleKnobs";
import { PageNumberField } from "../../../PageComponents/Field/Field";
import { PageProp } from "../../../PageComponents/Prop/Prop";
import { PageFilterStage } from "../../../StyledComponents/SVGFiltersContent/SVGFiltersContent";
import type { SVGFiltersExampleProps } from "../SVGFiltersPage.types";

const FILTER_ID = "svgFiltersHue";

type Props = SVGFiltersExampleProps;

export const HueExample = (props: Props) => {
    const [getDeg, setDeg] = createSignal(SVGFilterKnobs.Hue.STARTING_DEG);
    const [getSaturation, setSaturation] = createSignal(SVGFilterKnobs.Hue.STARTING_SATURATION);
    const [getRed, setRed] = createSignal(SVGFilterKnobs.Hue.STARTING_CHANNEL);
    const [getGreen, setGreen] = createSignal(SVGFilterKnobs.Hue.STARTING_CHANNEL);
    const [getBlue, setBlue] = createSignal(SVGFilterKnobs.Hue.STARTING_CHANNEL);

    return (
        <>
            <PageFilterStage
                filterId={FILTER_ID}
                label={"hue"}
                renderDefs={() =>
                    new SVGFilterDefsFactory(FILTER_ID)
                        .addHueRotationFilter({ deg: getDeg() })
                        .addSaturationFilter({ amount: getSaturation() })
                        .addColorChannelFilter({ r: getRed(), g: getGreen(), b: getBlue() })
                        .computeFilterPrimitives({
                            method: access(props.method),
                            elementSize: access(props.elementSize),
                        })
                }
            />

            <PageExampleKnobs>
                <PageProp
                    key={"deg"}
                    label={"Hue rotation"}
                    hint={"How far every color is turned round the color wheel."}
                >
                    <PageNumberField
                        value={getDeg}
                        min={() => SVGFilterKnobs.Hue.MIN_DEG}
                        max={() => SVGFilterKnobs.Hue.MAX_DEG}
                        step={() => SVGFilterKnobs.Hue.DEG_STEP}
                        ariaLabel={"Hue rotation"}
                        onInput={setDeg}
                    />
                </PageProp>

                <PageProp
                    key={"saturation"}
                    label={"Saturation"}
                    hint={"How colorful the result is. 0 takes it to gray, above 1 pushes the colors harder."}
                >
                    <PageNumberField
                        value={getSaturation}
                        min={() => SVGFilterKnobs.Hue.MIN_AMOUNT}
                        max={() => SVGFilterKnobs.Hue.MAX_AMOUNT}
                        step={() => SVGFilterKnobs.Hue.AMOUNT_STEP}
                        ariaLabel={"Saturation"}
                        onInput={setSaturation}
                    />
                </PageProp>

                <PageProp
                    key={"red"}
                    label={"Red"}
                    hint={
                        "How much the red channel is scaled on its own, after the hue and saturation have been applied."
                    }
                >
                    <PageNumberField
                        value={getRed}
                        min={() => SVGFilterKnobs.Hue.MIN_CHANNEL}
                        max={() => SVGFilterKnobs.Hue.MAX_CHANNEL}
                        step={() => SVGFilterKnobs.Hue.CHANNEL_STEP}
                        ariaLabel={"Red"}
                        onInput={setRed}
                    />
                </PageProp>

                <PageProp
                    key={"green"}
                    label={"Green"}
                    hint={
                        "How much the green channel is scaled on its own, after the hue and saturation have been applied."
                    }
                >
                    <PageNumberField
                        value={getGreen}
                        min={() => SVGFilterKnobs.Hue.MIN_CHANNEL}
                        max={() => SVGFilterKnobs.Hue.MAX_CHANNEL}
                        step={() => SVGFilterKnobs.Hue.CHANNEL_STEP}
                        ariaLabel={"Green"}
                        onInput={setGreen}
                    />
                </PageProp>

                <PageProp
                    key={"blue"}
                    label={"Blue"}
                    hint={
                        "How much the blue channel is scaled on its own, after the hue and saturation have been applied."
                    }
                >
                    <PageNumberField
                        value={getBlue}
                        min={() => SVGFilterKnobs.Hue.MIN_CHANNEL}
                        max={() => SVGFilterKnobs.Hue.MAX_CHANNEL}
                        step={() => SVGFilterKnobs.Hue.CHANNEL_STEP}
                        ariaLabel={"Blue"}
                        onInput={setBlue}
                    />
                </PageProp>
            </PageExampleKnobs>
        </>
    );
};
