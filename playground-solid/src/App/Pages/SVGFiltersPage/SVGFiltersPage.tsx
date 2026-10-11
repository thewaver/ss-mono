import { createMemo, createSignal } from "solid-js";

import { SVGFilterDefs } from "@thewaver/ss-components-solid";
import type { SVGDisplacementChannel, SVGFilterMethod, SortableItem } from "@thewaver/ss-components-solid";
import { SVGFilterKnobs } from "@thewaver/ss-playground/App/Knobs/SVGFilters.const";
import { APPLIED_STEPS } from "@thewaver/ss-playground/App/Pages/SVGFiltersPage/SVGFilterSteps.const";
import type { SVGFiltersStep } from "@thewaver/ss-playground/App/Pages/SVGFiltersPage/SVGFilterSteps.types";
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

const EXAMPLES_ROOT = "/src/App/Pages/SVGFiltersPage/Examples";

const names = (items: SortableItem<SVGFiltersStep>[]) => items.map((item) => item.value.name).join(" → ") || "nothing";

const BlurExampleWrapper = (props: SVGFiltersExampleProps) => {
    const [getStdDeviation, setStdDeviation] = createSignal(SVGFilterKnobs.Blur.STARTING_DEVIATION);

    return (
        <>
            <BlurExample {...props} stdDeviation={getStdDeviation} />

            <PageExampleKnobs>
                <PageProp
                    key={"stdDeviation"}
                    label={"Std deviation"}
                    hint={"How far the blur reaches. 0 leaves the picture sharp."}
                >
                    <PageNumberField
                        value={getStdDeviation}
                        min={() => SVGFilterKnobs.Blur.MIN_DEVIATION}
                        max={() => SVGFilterKnobs.Blur.MAX_DEVIATION}
                        step={() => SVGFilterKnobs.Blur.DEVIATION_STEP}
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
                <PageProp
                    key={"type"}
                    label={"Type"}
                    hint={
                        "Which noise is generated: fractal noise is soft and cloudy, turbulence is sharper and more veined."
                    }
                >
                    <PageSelectField
                        value={getType}
                        values={() => SVGFilterDefs.TURBULENCE_TYPES}
                        ariaLabel={"Type"}
                        onChange={(type) => setType(() => type)}
                    />
                </PageProp>

                <PageProp
                    key={"baseFrequencyX"}
                    label={"Base frequency x"}
                    hint={"How fine the noise is across. Higher numbers make a tighter grain."}
                >
                    <PageNumberField
                        value={getFrequencyX}
                        min={() => SVGFilterKnobs.Turbulence.MIN_FREQUENCY}
                        max={() => SVGFilterKnobs.Turbulence.MAX_FREQUENCY}
                        step={() => SVGFilterKnobs.Turbulence.FREQUENCY_STEP}
                        ariaLabel={"Base frequency x"}
                        onInput={setFrequencyX}
                    />
                </PageProp>

                <PageProp
                    key={"baseFrequencyY"}
                    label={"Base frequency y"}
                    hint={"How fine the noise is down. Set it apart from the across value to stretch the grain."}
                >
                    <PageNumberField
                        value={getFrequencyY}
                        min={() => SVGFilterKnobs.Turbulence.MIN_FREQUENCY}
                        max={() => SVGFilterKnobs.Turbulence.MAX_FREQUENCY}
                        step={() => SVGFilterKnobs.Turbulence.FREQUENCY_STEP}
                        ariaLabel={"Base frequency y"}
                        onInput={setFrequencyY}
                    />
                </PageProp>

                <PageProp
                    key={"scale"}
                    label={"Scale"}
                    hint={"How far the noise pushes the picture about. 0 leaves the picture where it was."}
                >
                    <PageNumberField
                        value={getScale}
                        min={() => SVGFilterKnobs.Turbulence.MIN_SCALE}
                        max={() => SVGFilterKnobs.Turbulence.MAX_SCALE}
                        ariaLabel={"Scale"}
                        onInput={setScale}
                    />
                </PageProp>

                <PageProp
                    key={"numOctaves"}
                    label={"Octaves"}
                    hint={"How many layers of noise are piled up. More layers add fine detail and cost more to draw."}
                >
                    <PageNumberField
                        value={getOctaves}
                        min={() => SVGFilterKnobs.Turbulence.MIN_OCTAVES}
                        max={() => SVGFilterKnobs.Turbulence.MAX_OCTAVES}
                        ariaLabel={"Octaves"}
                        onInput={setOctaves}
                    />
                </PageProp>

                <PageProp
                    key={"seed"}
                    label={"Seed"}
                    hint={
                        "The number the random noise is grown from. Change it for a different pattern at the same settings."
                    }
                >
                    <PageNumberField
                        value={getSeed}
                        min={() => SVGFilterKnobs.Turbulence.MIN_SEED}
                        max={() => SVGFilterKnobs.Turbulence.MAX_SEED}
                        ariaLabel={"Seed"}
                        onInput={setSeed}
                    />
                </PageProp>

                <PageProp
                    key={"xChannelSelector"}
                    label={"X channel"}
                    hint={"Which channel of the noise decides how far each point moves sideways."}
                >
                    <PageSelectField
                        value={getXChannel}
                        values={() => SVGFilterDefs.DISPLACEMENT_CHANNELS}
                        ariaLabel={"X channel"}
                        onChange={(channel) => setXChannel(() => channel)}
                    />
                </PageProp>

                <PageProp
                    key={"yChannelSelector"}
                    label={"Y channel"}
                    hint={"Which channel of the noise decides how far each point moves up or down."}
                >
                    <PageSelectField
                        value={getYChannel}
                        values={() => SVGFilterDefs.DISPLACEMENT_CHANNELS}
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

const ToneExampleWrapper = (props: SVGFiltersExampleProps) => {
    const [getBrightness, setBrightness] = createSignal(SVGFilterKnobs.Tone.STARTING_BRIGHTNESS);
    const [getContrast, setContrast] = createSignal(SVGFilterKnobs.Tone.STARTING_CONTRAST);
    const [getInversion, setInversion] = createSignal(SVGFilterKnobs.Tone.STARTING_INVERSION);

    return (
        <>
            <ToneExample {...props} brightness={getBrightness} contrast={getContrast} inversion={getInversion} />

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

const PixelateExampleWrapper = (props: SVGFiltersExampleProps) => {
    const [getSize, setSize] = createSignal(SVGFilterKnobs.Pixelate.STARTING_SIZE);

    return (
        <>
            <PixelateExample {...props} size={getSize} />

            <PageExampleKnobs>
                <PageProp
                    key={"pixelSize"}
                    label={"Square size (px)"}
                    hint={
                        "How wide each square is. Each takes the color at its own middle; 1 leaves the picture alone."
                    }
                >
                    <PageNumberField
                        value={getSize}
                        min={() => SVGFilterKnobs.Pixelate.MIN_SIZE}
                        max={() => SVGFilterKnobs.Pixelate.MAX_SIZE}
                        step={() => SVGFilterKnobs.Pixelate.SIZE_STEP}
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
                name: "Blur",
                component: () => <BlurExampleWrapper {...commonProps} />,
                path: `${EXAMPLES_ROOT}/Blur.tsx`,
            },
            {
                key: "dropShadow",
                name: "Drop shadow",
                component: () => <DropShadowExampleWrapper {...commonProps} />,
                path: `${EXAMPLES_ROOT}/DropShadow.tsx`,
            },
            {
                key: "turbulence",
                name: "Turbulence",
                component: () => <TurbulenceExampleWrapper {...commonProps} />,
                path: `${EXAMPLES_ROOT}/Turbulence.tsx`,
            },
            {
                key: "hue",
                name: "Hue",
                component: () => <HueExampleWrapper {...commonProps} />,
                path: `${EXAMPLES_ROOT}/Hue.tsx`,
            },
            {
                key: "tone",
                name: "Tone",
                component: () => <ToneExampleWrapper {...commonProps} />,
                path: `${EXAMPLES_ROOT}/Tone.tsx`,
            },
            {
                key: "pixelate",
                name: "Pixelate",
                component: () => <PixelateExampleWrapper {...commonProps} />,
                path: `${EXAMPLES_ROOT}/Pixelate.tsx`,
            },
            {
                key: "stack",
                name: "Four at once",
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
                <PageProp
                    key={"method"}
                    label={"Method"}
                    hint={
                        "Whether each step is fed the result of the one before it, or each works from the original and the results are combined."
                    }
                >
                    <PageSelectField
                        value={getMethod}
                        values={() => SVGFilterDefs.METHODS}
                        ariaLabel={"Method"}
                        onChange={(method) => setMethod(() => method)}
                    />
                </PageProp>

                <PageProp
                    key={"elementSize"}
                    label={"Region sized from the element"}
                    hint={
                        "Sizes the area the filter is allowed to paint in from the element itself, rather than from a fixed region."
                    }
                >
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
