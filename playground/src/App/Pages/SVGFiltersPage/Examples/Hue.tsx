import { createSignal } from "solid-js";

import { SVGFilterDefsFactory, access } from "@thewaver/ss-components";

import { PageProp } from "../../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../../PageComponents/PropsPanel/PropsPanel";
import { PageNumberField } from "../../../StyledComponents/Field/Field";
import { PageFilterStage } from "../../../StyledComponents/SVGFiltersContent/SVGFiltersContent";
import type { SVGFiltersExampleProps } from "../SVGFiltersPage.types";

const FILTER_ID = "svgFiltersHue";
const MIN_DEG = 0;
const MAX_DEG = 360;
const DEG_STEP = 5;
const MIN_AMOUNT = 0;
const MAX_AMOUNT = 3;
const AMOUNT_STEP = 0.05;
const MIN_CHANNEL = 0;
const MAX_CHANNEL = 2;
const CHANNEL_STEP = 0.05;

const STARTING_DEG = 90;
const STARTING_SATURATION = 1.6;
const STARTING_CHANNEL = 1;

type Props = SVGFiltersExampleProps;

export const HueExample = (props: Props) => {
    const [getDeg, setDeg] = createSignal(STARTING_DEG);
    const [getSaturation, setSaturation] = createSignal(STARTING_SATURATION);
    const [getRed, setRed] = createSignal(STARTING_CHANNEL);
    const [getGreen, setGreen] = createSignal(STARTING_CHANNEL);
    const [getBlue, setBlue] = createSignal(STARTING_CHANNEL);

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

            <PagePropsPanel scope={"local"}>
                <PageProp key={"deg"} label={"Hue rotation"}>
                    <PageNumberField
                        value={getDeg}
                        min={() => MIN_DEG}
                        max={() => MAX_DEG}
                        step={() => DEG_STEP}
                        ariaLabel={"Hue rotation"}
                        onInput={setDeg}
                    />
                </PageProp>

                <PageProp key={"saturation"} label={"Saturation"}>
                    <PageNumberField
                        value={getSaturation}
                        min={() => MIN_AMOUNT}
                        max={() => MAX_AMOUNT}
                        step={() => AMOUNT_STEP}
                        ariaLabel={"Saturation"}
                        onInput={setSaturation}
                    />
                </PageProp>

                <PageProp key={"red"} label={"Red"}>
                    <PageNumberField
                        value={getRed}
                        min={() => MIN_CHANNEL}
                        max={() => MAX_CHANNEL}
                        step={() => CHANNEL_STEP}
                        ariaLabel={"Red"}
                        onInput={setRed}
                    />
                </PageProp>

                <PageProp key={"green"} label={"Green"}>
                    <PageNumberField
                        value={getGreen}
                        min={() => MIN_CHANNEL}
                        max={() => MAX_CHANNEL}
                        step={() => CHANNEL_STEP}
                        ariaLabel={"Green"}
                        onInput={setGreen}
                    />
                </PageProp>

                <PageProp key={"blue"} label={"Blue"}>
                    <PageNumberField
                        value={getBlue}
                        min={() => MIN_CHANNEL}
                        max={() => MAX_CHANNEL}
                        step={() => CHANNEL_STEP}
                        ariaLabel={"Blue"}
                        onInput={setBlue}
                    />
                </PageProp>
            </PagePropsPanel>
        </>
    );
};
