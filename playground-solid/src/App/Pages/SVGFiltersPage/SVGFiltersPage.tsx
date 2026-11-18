import { createMemo, createSignal } from "solid-js";

import { SVGFilterDefs } from "@thewaver/ss-components-solid";
import type { SVGDisplacementChannel, SVGFilterMethod, SortableItem } from "@thewaver/ss-components-solid";
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
    const [getStdDeviation, setStdDeviation] = createSignal(SVGFilterKnobs.Blur.STARTING_DEVIATION);

    return (
        <>
            <BlurExample {...props} stdDeviation={getStdDeviation} />

            <PageExampleKnobs>
                <PageProp key={"stdDeviation"} {...SVGFilterKnobs.STD_DEVIATION_TEXT}>
                    <PageNumberField
                        value={getStdDeviation}
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
    const [getDx, setDx] = createSignal(SVGFilterKnobs.DropShadow.STARTING_DX);
    const [getDy, setDy] = createSignal(SVGFilterKnobs.DropShadow.STARTING_DY);
    const [getStdDeviation, setStdDeviation] = createSignal(SVGFilterKnobs.DropShadow.STARTING_DEVIATION);
    const [getFloodColor, setFloodColor] = createSignal(SVGFilterKnobs.DropShadow.STARTING_COLOR);
    const [getFloodOpacity, setFloodOpacity] = createSignal(SVGFilterKnobs.DropShadow.STARTING_OPACITY);

    return (
        <>
            <DropShadowExample
                {...props}
                dx={getDx}
                dy={getDy}
                stdDeviation={getStdDeviation}
                floodColor={getFloodColor}
                floodOpacity={getFloodOpacity}
            />

            <PageExampleKnobs>
                <PageProp key={"dx"} {...SVGFilterKnobs.DX_TEXT}>
                    <PageNumberField
                        value={getDx}
                        min={SVGFilterKnobs.DropShadow.MIN_OFFSET}
                        max={SVGFilterKnobs.DropShadow.MAX_OFFSET}
                        ariaLabel={"Offset x"}
                        onInput={setDx}
                    />
                </PageProp>

                <PageProp key={"dy"} {...SVGFilterKnobs.DY_TEXT}>
                    <PageNumberField
                        value={getDy}
                        min={SVGFilterKnobs.DropShadow.MIN_OFFSET}
                        max={SVGFilterKnobs.DropShadow.MAX_OFFSET}
                        ariaLabel={"Offset y"}
                        onInput={setDy}
                    />
                </PageProp>

                <PageProp key={"shadowStdDeviation"} {...SVGFilterKnobs.SHADOW_STD_DEVIATION_TEXT}>
                    <PageNumberField
                        value={getStdDeviation}
                        min={SVGFilterKnobs.DropShadow.MIN_DEVIATION}
                        max={SVGFilterKnobs.DropShadow.MAX_DEVIATION}
                        step={SVGFilterKnobs.DropShadow.DEVIATION_STEP}
                        ariaLabel={"Shadow standard deviation"}
                        onInput={setStdDeviation}
                    />
                </PageProp>

                <PageProp key={"floodColor"} {...SVGFilterKnobs.FLOOD_COLOR_TEXT}>
                    <PageColorField value={getFloodColor} ariaLabel={"Flood color"} onInput={setFloodColor} />
                </PageProp>

                <PageProp key={"floodOpacity"} {...SVGFilterKnobs.FLOOD_OPACITY_TEXT}>
                    <PageNumberField
                        value={getFloodOpacity}
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
    const [getFrequencyX, setFrequencyX] = createSignal(SVGFilterKnobs.Turbulence.STARTING_FREQUENCY_X);
    const [getFrequencyY, setFrequencyY] = createSignal(SVGFilterKnobs.Turbulence.STARTING_FREQUENCY_Y);
    const [getScale, setScale] = createSignal(SVGFilterKnobs.Turbulence.STARTING_SCALE);
    const [getType, setType] = createSignal(SVGFilterKnobs.Turbulence.STARTING_TYPE);
    const [getOctaves, setOctaves] = createSignal(SVGFilterKnobs.Turbulence.STARTING_OCTAVES);
    const [getSeed, setSeed] = createSignal(SVGFilterKnobs.Turbulence.STARTING_SEED);
    const [getXChannel, setXChannel] = createSignal<SVGDisplacementChannel>(
        SVGFilterKnobs.Turbulence.STARTING_X_CHANNEL,
    );
    const [getYChannel, setYChannel] = createSignal<SVGDisplacementChannel>(
        SVGFilterKnobs.Turbulence.STARTING_Y_CHANNEL,
    );

    const getBaseFrequency = () => ({ x: getFrequencyX(), y: getFrequencyY() });

    return (
        <>
            <TurbulenceExample
                {...props}
                baseFrequency={getBaseFrequency}
                scale={getScale}
                type={getType}
                numOctaves={getOctaves}
                seed={getSeed}
                xChannelSelector={getXChannel}
                yChannelSelector={getYChannel}
            />

            <PageExampleKnobs>
                <PageProp key={"type"} {...SVGFilterKnobs.TYPE_TEXT}>
                    <PageSelectField
                        value={getType}
                        values={SVGFilterDefs.TURBULENCE_TYPES}
                        ariaLabel={"Type"}
                        onChange={(type) => setType(() => type)}
                    />
                </PageProp>

                <PageProp key={"baseFrequencyX"} {...SVGFilterKnobs.BASE_FREQUENCY_X_TEXT}>
                    <PageNumberField
                        value={getFrequencyX}
                        min={SVGFilterKnobs.Turbulence.MIN_FREQUENCY}
                        max={SVGFilterKnobs.Turbulence.MAX_FREQUENCY}
                        step={SVGFilterKnobs.Turbulence.FREQUENCY_STEP}
                        ariaLabel={"Base frequency x"}
                        onInput={setFrequencyX}
                    />
                </PageProp>

                <PageProp key={"baseFrequencyY"} {...SVGFilterKnobs.BASE_FREQUENCY_Y_TEXT}>
                    <PageNumberField
                        value={getFrequencyY}
                        min={SVGFilterKnobs.Turbulence.MIN_FREQUENCY}
                        max={SVGFilterKnobs.Turbulence.MAX_FREQUENCY}
                        step={SVGFilterKnobs.Turbulence.FREQUENCY_STEP}
                        ariaLabel={"Base frequency y"}
                        onInput={setFrequencyY}
                    />
                </PageProp>

                <PageProp key={"scale"} {...SVGFilterKnobs.SCALE_TEXT}>
                    <PageNumberField
                        value={getScale}
                        min={SVGFilterKnobs.Turbulence.MIN_SCALE}
                        max={SVGFilterKnobs.Turbulence.MAX_SCALE}
                        ariaLabel={"Scale"}
                        onInput={setScale}
                    />
                </PageProp>

                <PageProp key={"numOctaves"} {...SVGFilterKnobs.NUM_OCTAVES_TEXT}>
                    <PageNumberField
                        value={getOctaves}
                        min={SVGFilterKnobs.Turbulence.MIN_OCTAVES}
                        max={SVGFilterKnobs.Turbulence.MAX_OCTAVES}
                        ariaLabel={"Octaves"}
                        onInput={setOctaves}
                    />
                </PageProp>

                <PageProp key={"seed"} {...SVGFilterKnobs.SEED_TEXT}>
                    <PageNumberField
                        value={getSeed}
                        min={SVGFilterKnobs.Turbulence.MIN_SEED}
                        max={SVGFilterKnobs.Turbulence.MAX_SEED}
                        ariaLabel={"Seed"}
                        onInput={setSeed}
                    />
                </PageProp>

                <PageProp key={"xChannelSelector"} {...SVGFilterKnobs.X_CHANNEL_SELECTOR_TEXT}>
                    <PageSelectField
                        value={getXChannel}
                        values={SVGFilterDefs.DISPLACEMENT_CHANNELS}
                        ariaLabel={"X channel"}
                        onChange={(channel) => setXChannel(() => channel)}
                    />
                </PageProp>

                <PageProp key={"yChannelSelector"} {...SVGFilterKnobs.Y_CHANNEL_SELECTOR_TEXT}>
                    <PageSelectField
                        value={getYChannel}
                        values={SVGFilterDefs.DISPLACEMENT_CHANNELS}
                        ariaLabel={"Y channel"}
                        onChange={(channel) => setYChannel(() => channel)}
                    />
                </PageProp>
            </PageExampleKnobs>
        </>
    );
};

const HueExampleWrapper = (props: SVGFiltersExampleProps) => {
    const [getDeg, setDeg] = createSignal(SVGFilterKnobs.Hue.STARTING_DEG);
    const [getSaturation, setSaturation] = createSignal(SVGFilterKnobs.Hue.STARTING_SATURATION);
    const [getRed, setRed] = createSignal(SVGFilterKnobs.Hue.STARTING_CHANNEL);
    const [getGreen, setGreen] = createSignal(SVGFilterKnobs.Hue.STARTING_CHANNEL);
    const [getBlue, setBlue] = createSignal(SVGFilterKnobs.Hue.STARTING_CHANNEL);

    return (
        <>
            <HueExample {...props} deg={getDeg} saturation={getSaturation} r={getRed} g={getGreen} b={getBlue} />

            <PageExampleKnobs>
                <PageProp key={"deg"} {...SVGFilterKnobs.DEG_TEXT}>
                    <PageNumberField
                        value={getDeg}
                        min={SVGFilterKnobs.Hue.MIN_DEG}
                        max={SVGFilterKnobs.Hue.MAX_DEG}
                        step={SVGFilterKnobs.Hue.DEG_STEP}
                        ariaLabel={"Hue rotation"}
                        onInput={setDeg}
                    />
                </PageProp>

                <PageProp key={"saturation"} {...SVGFilterKnobs.SATURATION_TEXT}>
                    <PageNumberField
                        value={getSaturation}
                        min={SVGFilterKnobs.Hue.MIN_AMOUNT}
                        max={SVGFilterKnobs.Hue.MAX_AMOUNT}
                        step={SVGFilterKnobs.Hue.AMOUNT_STEP}
                        ariaLabel={"Saturation"}
                        onInput={setSaturation}
                    />
                </PageProp>

                <PageProp key={"red"} {...SVGFilterKnobs.RED_TEXT}>
                    <PageNumberField
                        value={getRed}
                        min={SVGFilterKnobs.Hue.MIN_CHANNEL}
                        max={SVGFilterKnobs.Hue.MAX_CHANNEL}
                        step={SVGFilterKnobs.Hue.CHANNEL_STEP}
                        ariaLabel={"Red"}
                        onInput={setRed}
                    />
                </PageProp>

                <PageProp key={"green"} {...SVGFilterKnobs.GREEN_TEXT}>
                    <PageNumberField
                        value={getGreen}
                        min={SVGFilterKnobs.Hue.MIN_CHANNEL}
                        max={SVGFilterKnobs.Hue.MAX_CHANNEL}
                        step={SVGFilterKnobs.Hue.CHANNEL_STEP}
                        ariaLabel={"Green"}
                        onInput={setGreen}
                    />
                </PageProp>

                <PageProp key={"blue"} {...SVGFilterKnobs.BLUE_TEXT}>
                    <PageNumberField
                        value={getBlue}
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
    const [getBrightness, setBrightness] = createSignal(SVGFilterKnobs.Tone.STARTING_BRIGHTNESS);
    const [getContrast, setContrast] = createSignal(SVGFilterKnobs.Tone.STARTING_CONTRAST);
    const [getInversion, setInversion] = createSignal(SVGFilterKnobs.Tone.STARTING_INVERSION);

    return (
        <>
            <ToneExample {...props} brightness={getBrightness} contrast={getContrast} inversion={getInversion} />

            <PageExampleKnobs>
                <PageProp key={"brightness"} {...SVGFilterKnobs.BRIGHTNESS_TEXT}>
                    <PageNumberField
                        value={getBrightness}
                        min={SVGFilterKnobs.Tone.MIN_AMOUNT}
                        max={SVGFilterKnobs.Tone.MAX_AMOUNT}
                        step={SVGFilterKnobs.Tone.AMOUNT_STEP}
                        ariaLabel={"Brightness"}
                        onInput={setBrightness}
                    />
                </PageProp>

                <PageProp key={"contrast"} {...SVGFilterKnobs.CONTRAST_TEXT}>
                    <PageNumberField
                        value={getContrast}
                        min={SVGFilterKnobs.Tone.MIN_AMOUNT}
                        max={SVGFilterKnobs.Tone.MAX_AMOUNT}
                        step={SVGFilterKnobs.Tone.AMOUNT_STEP}
                        ariaLabel={"Contrast"}
                        onInput={setContrast}
                    />
                </PageProp>

                <PageProp key={"inversion"} {...SVGFilterKnobs.INVERSION_TEXT}>
                    <PageNumberField
                        value={getInversion}
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
    const [getSize, setSize] = createSignal(SVGFilterKnobs.Pixelate.STARTING_SIZE);

    return (
        <>
            <PixelateExample {...props} size={getSize} />

            <PageExampleKnobs>
                <PageProp key={"pixelSize"} {...SVGFilterKnobs.PIXEL_SIZE_TEXT}>
                    <PageNumberField
                        value={getSize}
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
    const [getMethod, setMethod] = createSignal<SVGFilterMethod>(SVGFilterKnobs.STARTING_METHOD);
    const [getIsSizedFromElement, setIsSizedFromElement] = createSignal(SVGFilterKnobs.STARTING_IS_SIZED_FROM_ELEMENT);

    const appliedSignal = createSignal<SortableItem<SVGFiltersStep>[]>(APPLIED_STEPS);
    const unusedSignal = createSignal<SortableItem<SVGFiltersStep>[]>([]);

    const getElementSize = () => (getIsSizedFromElement() ? SUBJECT_SIZE : undefined);

    const getExamples = createMemo(() => {
        const commonProps: SVGFiltersExampleProps = {
            method: getMethod,
            elementSize: getElementSize,
        };

        return [
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
                    getMethod() === "chain"
                        ? `${names(appliedSignal[0]())} — chained, so each one is handed what the one before it produced and the order is the effect`
                        : `${names(appliedSignal[0]())} — isolated, so every one reads the original and the order only decides what sits on top`,
                component: () => <StackExample {...commonProps} applied={appliedSignal} unused={unusedSignal} />,
                path: `${EXAMPLES_ROOT}/Stack.tsx`,
            },
        ];
    });

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp key={"method"} {...SVGFilterKnobs.METHOD_TEXT}>
                    <PageSelectField
                        value={getMethod}
                        values={SVGFilterDefs.METHODS}
                        ariaLabel={"Method"}
                        onChange={(method) => setMethod(() => method)}
                    />
                </PageProp>

                <PageProp key={"elementSize"} {...SVGFilterKnobs.ELEMENT_SIZE_TEXT}>
                    <PageCheckField
                        value={getIsSizedFromElement}
                        ariaLabel={"Region sized from the element"}
                        onChange={setIsSizedFromElement}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={getExamples} />
        </>
    );
};
