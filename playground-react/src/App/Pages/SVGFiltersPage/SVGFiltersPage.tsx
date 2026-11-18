import { useState } from "react";

import { SVGFilterDefs } from "@thewaver/ss-components-react";
import type { SVGDisplacementChannel, SVGFilterMethod, SortableItem } from "@thewaver/ss-components-react";
import { SVGFilterKnobs } from "@thewaver/ss-playground/App/Knobs/SVGFilters.const";
import { APPLIED_STEPS } from "@thewaver/ss-playground/App/Pages/SVGFiltersPage/SVGFilterSteps.const";
import type { SVGFiltersStep } from "@thewaver/ss-playground/App/Pages/SVGFiltersPage/SVGFilterSteps.types";
import { EXAMPLES_ROOT, EXAMPLE_NAMES } from "@thewaver/ss-playground/App/Pages/SVGFiltersPage/SVGFiltersPage.const";
import { SUBJECT_SIZE } from "@thewaver/ss-playground/App/StyledComponents/SVGFiltersContent/SVGFiltersContent.css";

import { PageExampleKnobs } from "../../PageComponents/ExampleKnobs/ExampleKnobs";
import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageCheckField, PageColorField, PageNumberField, PageSelectField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { BlurExample } from "./Examples/Blur";
import { DropShadowExample } from "./Examples/DropShadow";
import { HueExample } from "./Examples/Hue";
import { PixelateExample } from "./Examples/Pixelate";
import { StackExample } from "./Examples/Stack";
import { ToneExample } from "./Examples/Tone";
import { TurbulenceExample } from "./Examples/Turbulence";
import type { SVGFiltersExampleProps } from "./SVGFiltersPage.types";

const names = (items: SortableItem<SVGFiltersStep>[]) => items.map((item) => item.value.name).join(" → ") || "nothing";

const BlurExampleWrapper = (props: SVGFiltersExampleProps) => {
    const [stdDeviation, setStdDeviation] = useState(SVGFilterKnobs.Blur.STARTING_DEVIATION);

    return (
        <>
            <BlurExample {...props} stdDeviation={stdDeviation} />

            <PageExampleKnobs>
                <PageProp itemKey={"stdDeviation"} {...SVGFilterKnobs.STD_DEVIATION_TEXT}>
                    <PageNumberField
                        value={stdDeviation}
                        min={SVGFilterKnobs.Blur.MIN_DEVIATION}
                        max={SVGFilterKnobs.Blur.MAX_DEVIATION}
                        step={SVGFilterKnobs.Blur.DEVIATION_STEP}
                        ariaLabel={"Standard deviation"}
                        onInput={setStdDeviation}
                    />
                </PageProp>
            </PageExampleKnobs>
        </>
    );
};

const DropShadowExampleWrapper = (props: SVGFiltersExampleProps) => {
    const [dx, setDx] = useState(SVGFilterKnobs.DropShadow.STARTING_DX);
    const [dy, setDy] = useState(SVGFilterKnobs.DropShadow.STARTING_DY);
    const [stdDeviation, setStdDeviation] = useState(SVGFilterKnobs.DropShadow.STARTING_DEVIATION);
    const [floodColor, setFloodColor] = useState(SVGFilterKnobs.DropShadow.STARTING_COLOR);
    const [floodOpacity, setFloodOpacity] = useState(SVGFilterKnobs.DropShadow.STARTING_OPACITY);

    return (
        <>
            <DropShadowExample
                {...props}
                dx={dx}
                dy={dy}
                stdDeviation={stdDeviation}
                floodColor={floodColor}
                floodOpacity={floodOpacity}
            />

            <PageExampleKnobs>
                <PageProp itemKey={"dx"} {...SVGFilterKnobs.DX_TEXT}>
                    <PageNumberField
                        value={dx}
                        min={SVGFilterKnobs.DropShadow.MIN_OFFSET}
                        max={SVGFilterKnobs.DropShadow.MAX_OFFSET}
                        ariaLabel={"Offset x"}
                        onInput={setDx}
                    />
                </PageProp>

                <PageProp itemKey={"dy"} {...SVGFilterKnobs.DY_TEXT}>
                    <PageNumberField
                        value={dy}
                        min={SVGFilterKnobs.DropShadow.MIN_OFFSET}
                        max={SVGFilterKnobs.DropShadow.MAX_OFFSET}
                        ariaLabel={"Offset y"}
                        onInput={setDy}
                    />
                </PageProp>

                <PageProp itemKey={"shadowStdDeviation"} {...SVGFilterKnobs.SHADOW_STD_DEVIATION_TEXT}>
                    <PageNumberField
                        value={stdDeviation}
                        min={SVGFilterKnobs.DropShadow.MIN_DEVIATION}
                        max={SVGFilterKnobs.DropShadow.MAX_DEVIATION}
                        step={SVGFilterKnobs.DropShadow.DEVIATION_STEP}
                        ariaLabel={"Shadow standard deviation"}
                        onInput={setStdDeviation}
                    />
                </PageProp>

                <PageProp itemKey={"floodColor"} {...SVGFilterKnobs.FLOOD_COLOR_TEXT}>
                    <PageColorField value={floodColor} ariaLabel={"Flood color"} onInput={setFloodColor} />
                </PageProp>

                <PageProp itemKey={"floodOpacity"} {...SVGFilterKnobs.FLOOD_OPACITY_TEXT}>
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

const TurbulenceExampleWrapper = (props: SVGFiltersExampleProps) => {
    const [frequencyX, setFrequencyX] = useState(SVGFilterKnobs.Turbulence.STARTING_FREQUENCY_X);
    const [frequencyY, setFrequencyY] = useState(SVGFilterKnobs.Turbulence.STARTING_FREQUENCY_Y);
    const [scale, setScale] = useState(SVGFilterKnobs.Turbulence.STARTING_SCALE);
    const [type, setType] = useState(SVGFilterKnobs.Turbulence.STARTING_TYPE);
    const [octaves, setOctaves] = useState(SVGFilterKnobs.Turbulence.STARTING_OCTAVES);
    const [seed, setSeed] = useState(SVGFilterKnobs.Turbulence.STARTING_SEED);
    const [xChannel, setXChannel] = useState<SVGDisplacementChannel>(SVGFilterKnobs.Turbulence.STARTING_X_CHANNEL);
    const [yChannel, setYChannel] = useState<SVGDisplacementChannel>(SVGFilterKnobs.Turbulence.STARTING_Y_CHANNEL);

    return (
        <>
            <TurbulenceExample
                {...props}
                baseFrequency={{ x: frequencyX, y: frequencyY }}
                scale={scale}
                type={type}
                numOctaves={octaves}
                seed={seed}
                xChannelSelector={xChannel}
                yChannelSelector={yChannel}
            />

            <PageExampleKnobs>
                <PageProp itemKey={"type"} {...SVGFilterKnobs.TYPE_TEXT}>
                    <PageSelectField
                        value={type}
                        values={SVGFilterDefs.TURBULENCE_TYPES}
                        ariaLabel={"Type"}
                        onChange={setType}
                    />
                </PageProp>

                <PageProp itemKey={"baseFrequencyX"} {...SVGFilterKnobs.BASE_FREQUENCY_X_TEXT}>
                    <PageNumberField
                        value={frequencyX}
                        min={SVGFilterKnobs.Turbulence.MIN_FREQUENCY}
                        max={SVGFilterKnobs.Turbulence.MAX_FREQUENCY}
                        step={SVGFilterKnobs.Turbulence.FREQUENCY_STEP}
                        ariaLabel={"Base frequency x"}
                        onInput={setFrequencyX}
                    />
                </PageProp>

                <PageProp itemKey={"baseFrequencyY"} {...SVGFilterKnobs.BASE_FREQUENCY_Y_TEXT}>
                    <PageNumberField
                        value={frequencyY}
                        min={SVGFilterKnobs.Turbulence.MIN_FREQUENCY}
                        max={SVGFilterKnobs.Turbulence.MAX_FREQUENCY}
                        step={SVGFilterKnobs.Turbulence.FREQUENCY_STEP}
                        ariaLabel={"Base frequency y"}
                        onInput={setFrequencyY}
                    />
                </PageProp>

                <PageProp itemKey={"scale"} {...SVGFilterKnobs.SCALE_TEXT}>
                    <PageNumberField
                        value={scale}
                        min={SVGFilterKnobs.Turbulence.MIN_SCALE}
                        max={SVGFilterKnobs.Turbulence.MAX_SCALE}
                        ariaLabel={"Scale"}
                        onInput={setScale}
                    />
                </PageProp>

                <PageProp itemKey={"numOctaves"} {...SVGFilterKnobs.NUM_OCTAVES_TEXT}>
                    <PageNumberField
                        value={octaves}
                        min={SVGFilterKnobs.Turbulence.MIN_OCTAVES}
                        max={SVGFilterKnobs.Turbulence.MAX_OCTAVES}
                        ariaLabel={"Octaves"}
                        onInput={setOctaves}
                    />
                </PageProp>

                <PageProp itemKey={"seed"} {...SVGFilterKnobs.SEED_TEXT}>
                    <PageNumberField
                        value={seed}
                        min={SVGFilterKnobs.Turbulence.MIN_SEED}
                        max={SVGFilterKnobs.Turbulence.MAX_SEED}
                        ariaLabel={"Seed"}
                        onInput={setSeed}
                    />
                </PageProp>

                <PageProp itemKey={"xChannelSelector"} {...SVGFilterKnobs.X_CHANNEL_SELECTOR_TEXT}>
                    <PageSelectField
                        value={xChannel}
                        values={SVGFilterDefs.DISPLACEMENT_CHANNELS}
                        ariaLabel={"X channel"}
                        onChange={setXChannel}
                    />
                </PageProp>

                <PageProp itemKey={"yChannelSelector"} {...SVGFilterKnobs.Y_CHANNEL_SELECTOR_TEXT}>
                    <PageSelectField
                        value={yChannel}
                        values={SVGFilterDefs.DISPLACEMENT_CHANNELS}
                        ariaLabel={"Y channel"}
                        onChange={setYChannel}
                    />
                </PageProp>
            </PageExampleKnobs>
        </>
    );
};

const HueExampleWrapper = (props: SVGFiltersExampleProps) => {
    const [deg, setDeg] = useState(SVGFilterKnobs.Hue.STARTING_DEG);
    const [saturation, setSaturation] = useState(SVGFilterKnobs.Hue.STARTING_SATURATION);
    const [red, setRed] = useState(SVGFilterKnobs.Hue.STARTING_CHANNEL);
    const [green, setGreen] = useState(SVGFilterKnobs.Hue.STARTING_CHANNEL);
    const [blue, setBlue] = useState(SVGFilterKnobs.Hue.STARTING_CHANNEL);

    return (
        <>
            <HueExample {...props} deg={deg} saturation={saturation} r={red} g={green} b={blue} />

            <PageExampleKnobs>
                <PageProp itemKey={"deg"} {...SVGFilterKnobs.DEG_TEXT}>
                    <PageNumberField
                        value={deg}
                        min={SVGFilterKnobs.Hue.MIN_DEG}
                        max={SVGFilterKnobs.Hue.MAX_DEG}
                        step={SVGFilterKnobs.Hue.DEG_STEP}
                        ariaLabel={"Hue rotation"}
                        onInput={setDeg}
                    />
                </PageProp>

                <PageProp itemKey={"saturation"} {...SVGFilterKnobs.SATURATION_TEXT}>
                    <PageNumberField
                        value={saturation}
                        min={SVGFilterKnobs.Hue.MIN_AMOUNT}
                        max={SVGFilterKnobs.Hue.MAX_AMOUNT}
                        step={SVGFilterKnobs.Hue.AMOUNT_STEP}
                        ariaLabel={"Saturation"}
                        onInput={setSaturation}
                    />
                </PageProp>

                <PageProp itemKey={"red"} {...SVGFilterKnobs.RED_TEXT}>
                    <PageNumberField
                        value={red}
                        min={SVGFilterKnobs.Hue.MIN_CHANNEL}
                        max={SVGFilterKnobs.Hue.MAX_CHANNEL}
                        step={SVGFilterKnobs.Hue.CHANNEL_STEP}
                        ariaLabel={"Red"}
                        onInput={setRed}
                    />
                </PageProp>

                <PageProp itemKey={"green"} {...SVGFilterKnobs.GREEN_TEXT}>
                    <PageNumberField
                        value={green}
                        min={SVGFilterKnobs.Hue.MIN_CHANNEL}
                        max={SVGFilterKnobs.Hue.MAX_CHANNEL}
                        step={SVGFilterKnobs.Hue.CHANNEL_STEP}
                        ariaLabel={"Green"}
                        onInput={setGreen}
                    />
                </PageProp>

                <PageProp itemKey={"blue"} {...SVGFilterKnobs.BLUE_TEXT}>
                    <PageNumberField
                        value={blue}
                        min={SVGFilterKnobs.Hue.MIN_CHANNEL}
                        max={SVGFilterKnobs.Hue.MAX_CHANNEL}
                        step={SVGFilterKnobs.Hue.CHANNEL_STEP}
                        ariaLabel={"Blue"}
                        onInput={setBlue}
                    />
                </PageProp>
            </PageExampleKnobs>
        </>
    );
};

const ToneExampleWrapper = (props: SVGFiltersExampleProps) => {
    const [brightness, setBrightness] = useState(SVGFilterKnobs.Tone.STARTING_BRIGHTNESS);
    const [contrast, setContrast] = useState(SVGFilterKnobs.Tone.STARTING_CONTRAST);
    const [inversion, setInversion] = useState(SVGFilterKnobs.Tone.STARTING_INVERSION);

    return (
        <>
            <ToneExample {...props} brightness={brightness} contrast={contrast} inversion={inversion} />

            <PageExampleKnobs>
                <PageProp itemKey={"brightness"} {...SVGFilterKnobs.BRIGHTNESS_TEXT}>
                    <PageNumberField
                        value={brightness}
                        min={SVGFilterKnobs.Tone.MIN_AMOUNT}
                        max={SVGFilterKnobs.Tone.MAX_AMOUNT}
                        step={SVGFilterKnobs.Tone.AMOUNT_STEP}
                        ariaLabel={"Brightness"}
                        onInput={setBrightness}
                    />
                </PageProp>

                <PageProp itemKey={"contrast"} {...SVGFilterKnobs.CONTRAST_TEXT}>
                    <PageNumberField
                        value={contrast}
                        min={SVGFilterKnobs.Tone.MIN_AMOUNT}
                        max={SVGFilterKnobs.Tone.MAX_AMOUNT}
                        step={SVGFilterKnobs.Tone.AMOUNT_STEP}
                        ariaLabel={"Contrast"}
                        onInput={setContrast}
                    />
                </PageProp>

                <PageProp itemKey={"inversion"} {...SVGFilterKnobs.INVERSION_TEXT}>
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

const PixelateExampleWrapper = (props: SVGFiltersExampleProps) => {
    const [size, setSize] = useState(SVGFilterKnobs.Pixelate.STARTING_SIZE);

    return (
        <>
            <PixelateExample {...props} size={size} />

            <PageExampleKnobs>
                <PageProp itemKey={"pixelSize"} {...SVGFilterKnobs.PIXEL_SIZE_TEXT}>
                    <PageNumberField
                        value={size}
                        min={SVGFilterKnobs.Pixelate.MIN_SIZE}
                        max={SVGFilterKnobs.Pixelate.MAX_SIZE}
                        step={SVGFilterKnobs.Pixelate.SIZE_STEP}
                        ariaLabel={"Square size in pixels"}
                        onInput={setSize}
                    />
                </PageProp>
            </PageExampleKnobs>
        </>
    );
};

export const SVGFiltersPage = () => {
    const [method, setMethod] = useState<SVGFilterMethod>(SVGFilterKnobs.STARTING_METHOD);
    const [isSizedFromElement, setIsSizedFromElement] = useState(SVGFilterKnobs.STARTING_IS_SIZED_FROM_ELEMENT);

    const appliedState = useState<SortableItem<SVGFiltersStep>[]>(APPLIED_STEPS);
    const unusedState = useState<SortableItem<SVGFiltersStep>[]>([]);

    const elementSize = isSizedFromElement ? SUBJECT_SIZE : undefined;

    const commonProps: SVGFiltersExampleProps = {
        method,
        elementSize,
    };

    const examples = [
        {
            key: "blur",
            name: EXAMPLE_NAMES.blur,
            component: () => <BlurExampleWrapper {...commonProps} />,
            path: `${EXAMPLES_ROOT}/Blur.tsx`,
        },
        {
            key: "dropShadow",
            name: EXAMPLE_NAMES.dropShadow,
            component: () => <DropShadowExampleWrapper {...commonProps} />,
            path: `${EXAMPLES_ROOT}/DropShadow.tsx`,
        },
        {
            key: "turbulence",
            name: EXAMPLE_NAMES.turbulence,
            component: () => <TurbulenceExampleWrapper {...commonProps} />,
            path: `${EXAMPLES_ROOT}/Turbulence.tsx`,
        },
        {
            key: "hue",
            name: EXAMPLE_NAMES.hue,
            component: () => <HueExampleWrapper {...commonProps} />,
            path: `${EXAMPLES_ROOT}/Hue.tsx`,
        },
        {
            key: "tone",
            name: EXAMPLE_NAMES.tone,
            component: () => <ToneExampleWrapper {...commonProps} />,
            path: `${EXAMPLES_ROOT}/Tone.tsx`,
        },
        {
            key: "pixelate",
            name: EXAMPLE_NAMES.pixelate,
            component: () => <PixelateExampleWrapper {...commonProps} />,
            path: `${EXAMPLES_ROOT}/Pixelate.tsx`,
        },
        {
            key: "stack",
            name: EXAMPLE_NAMES.stack,
            readout: () =>
                method === "chain"
                    ? `${names(appliedState[0])} — chained, so each one is handed what the one before it produced and the order is the effect`
                    : `${names(appliedState[0])} — isolated, so every one reads the original and the order only decides what sits on top`,
            component: () => <StackExample {...commonProps} applied={appliedState} unused={unusedState} />,
            path: `${EXAMPLES_ROOT}/Stack.tsx`,
        },
    ];

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp itemKey={"method"} {...SVGFilterKnobs.METHOD_TEXT}>
                    <PageSelectField
                        value={method}
                        values={SVGFilterDefs.METHODS}
                        ariaLabel={"Method"}
                        onChange={setMethod}
                    />
                </PageProp>

                <PageProp itemKey={"elementSize"} {...SVGFilterKnobs.ELEMENT_SIZE_TEXT}>
                    <PageCheckField
                        value={isSizedFromElement}
                        ariaLabel={"Region sized from the element"}
                        onChange={setIsSizedFromElement}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={examples} />
        </>
    );
};
