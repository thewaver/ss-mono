import { useState } from "react";

import { SVGFilterDefs } from "@thewaver/ss-components-react";
import type { SVGDisplacementChannel, SVGFilterMethod, SortableItem } from "@thewaver/ss-components-react";
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
    const [stdDeviation, setStdDeviation] = useState(SVGFilterKnobs.Blur.STARTING_DEVIATION);

    return (
        <>
            <BlurExample {...props} stdDeviation={stdDeviation} />

            <PageExampleKnobs>
                <PageProp
                    itemKey={"stdDeviation"}
                    label={"Std deviation"}
                    hint={"How far the blur reaches. 0 leaves the picture sharp."}
                >
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
                <PageProp
                    itemKey={"type"}
                    label={"Type"}
                    hint={
                        "Which noise is generated: fractal noise is soft and cloudy, turbulence is sharper and more veined."
                    }
                >
                    <PageSelectField
                        value={type}
                        values={SVGFilterDefs.TURBULENCE_TYPES}
                        ariaLabel={"Type"}
                        onChange={setType}
                    />
                </PageProp>

                <PageProp
                    itemKey={"baseFrequencyX"}
                    label={"Base frequency x"}
                    hint={"How fine the noise is across. Higher numbers make a tighter grain."}
                >
                    <PageNumberField
                        value={frequencyX}
                        min={SVGFilterKnobs.Turbulence.MIN_FREQUENCY}
                        max={SVGFilterKnobs.Turbulence.MAX_FREQUENCY}
                        step={SVGFilterKnobs.Turbulence.FREQUENCY_STEP}
                        ariaLabel={"Base frequency x"}
                        onInput={setFrequencyX}
                    />
                </PageProp>

                <PageProp
                    itemKey={"baseFrequencyY"}
                    label={"Base frequency y"}
                    hint={"How fine the noise is down. Set it apart from the across value to stretch the grain."}
                >
                    <PageNumberField
                        value={frequencyY}
                        min={SVGFilterKnobs.Turbulence.MIN_FREQUENCY}
                        max={SVGFilterKnobs.Turbulence.MAX_FREQUENCY}
                        step={SVGFilterKnobs.Turbulence.FREQUENCY_STEP}
                        ariaLabel={"Base frequency y"}
                        onInput={setFrequencyY}
                    />
                </PageProp>

                <PageProp
                    itemKey={"scale"}
                    label={"Scale"}
                    hint={"How far the noise pushes the picture about. 0 leaves the picture where it was."}
                >
                    <PageNumberField
                        value={scale}
                        min={SVGFilterKnobs.Turbulence.MIN_SCALE}
                        max={SVGFilterKnobs.Turbulence.MAX_SCALE}
                        ariaLabel={"Scale"}
                        onInput={setScale}
                    />
                </PageProp>

                <PageProp
                    itemKey={"numOctaves"}
                    label={"Octaves"}
                    hint={"How many layers of noise are piled up. More layers add fine detail and cost more to draw."}
                >
                    <PageNumberField
                        value={octaves}
                        min={SVGFilterKnobs.Turbulence.MIN_OCTAVES}
                        max={SVGFilterKnobs.Turbulence.MAX_OCTAVES}
                        ariaLabel={"Octaves"}
                        onInput={setOctaves}
                    />
                </PageProp>

                <PageProp
                    itemKey={"seed"}
                    label={"Seed"}
                    hint={
                        "The number the random noise is grown from. Change it for a different pattern at the same settings."
                    }
                >
                    <PageNumberField
                        value={seed}
                        min={SVGFilterKnobs.Turbulence.MIN_SEED}
                        max={SVGFilterKnobs.Turbulence.MAX_SEED}
                        ariaLabel={"Seed"}
                        onInput={setSeed}
                    />
                </PageProp>

                <PageProp
                    itemKey={"xChannelSelector"}
                    label={"X channel"}
                    hint={"Which channel of the noise decides how far each point moves sideways."}
                >
                    <PageSelectField
                        value={xChannel}
                        values={SVGFilterDefs.DISPLACEMENT_CHANNELS}
                        ariaLabel={"X channel"}
                        onChange={setXChannel}
                    />
                </PageProp>

                <PageProp
                    itemKey={"yChannelSelector"}
                    label={"Y channel"}
                    hint={"Which channel of the noise decides how far each point moves up or down."}
                >
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
                <PageProp
                    itemKey={"deg"}
                    label={"Hue rotation"}
                    hint={"How far every color is turned round the color wheel."}
                >
                    <PageNumberField
                        value={deg}
                        min={SVGFilterKnobs.Hue.MIN_DEG}
                        max={SVGFilterKnobs.Hue.MAX_DEG}
                        step={SVGFilterKnobs.Hue.DEG_STEP}
                        ariaLabel={"Hue rotation"}
                        onInput={setDeg}
                    />
                </PageProp>

                <PageProp
                    itemKey={"saturation"}
                    label={"Saturation"}
                    hint={"How colorful the result is. 0 takes it to gray, above 1 pushes the colors harder."}
                >
                    <PageNumberField
                        value={saturation}
                        min={SVGFilterKnobs.Hue.MIN_AMOUNT}
                        max={SVGFilterKnobs.Hue.MAX_AMOUNT}
                        step={SVGFilterKnobs.Hue.AMOUNT_STEP}
                        ariaLabel={"Saturation"}
                        onInput={setSaturation}
                    />
                </PageProp>

                <PageProp
                    itemKey={"red"}
                    label={"Red"}
                    hint={
                        "How much the red channel is scaled on its own, after the hue and saturation have been applied."
                    }
                >
                    <PageNumberField
                        value={red}
                        min={SVGFilterKnobs.Hue.MIN_CHANNEL}
                        max={SVGFilterKnobs.Hue.MAX_CHANNEL}
                        step={SVGFilterKnobs.Hue.CHANNEL_STEP}
                        ariaLabel={"Red"}
                        onInput={setRed}
                    />
                </PageProp>

                <PageProp
                    itemKey={"green"}
                    label={"Green"}
                    hint={
                        "How much the green channel is scaled on its own, after the hue and saturation have been applied."
                    }
                >
                    <PageNumberField
                        value={green}
                        min={SVGFilterKnobs.Hue.MIN_CHANNEL}
                        max={SVGFilterKnobs.Hue.MAX_CHANNEL}
                        step={SVGFilterKnobs.Hue.CHANNEL_STEP}
                        ariaLabel={"Green"}
                        onInput={setGreen}
                    />
                </PageProp>

                <PageProp
                    itemKey={"blue"}
                    label={"Blue"}
                    hint={
                        "How much the blue channel is scaled on its own, after the hue and saturation have been applied."
                    }
                >
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

const PixelateExampleWrapper = (props: SVGFiltersExampleProps) => {
    const [size, setSize] = useState(SVGFilterKnobs.Pixelate.STARTING_SIZE);

    return (
        <>
            <PixelateExample {...props} size={size} />

            <PageExampleKnobs>
                <PageProp
                    itemKey={"pixelSize"}
                    label={"Square size (px)"}
                    hint={
                        "How wide each square is. Each takes the color at its own middle; 1 leaves the picture alone."
                    }
                >
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
                <PageProp
                    itemKey={"method"}
                    label={"Method"}
                    hint={
                        "Whether each step is fed the result of the one before it, or each works from the original and the results are combined."
                    }
                >
                    <PageSelectField
                        value={method}
                        values={SVGFilterDefs.METHODS}
                        ariaLabel={"Method"}
                        onChange={setMethod}
                    />
                </PageProp>

                <PageProp
                    itemKey={"elementSize"}
                    label={"Region sized from the element"}
                    hint={
                        "Sizes the area the filter is allowed to paint in from the element itself, rather than from a fixed region."
                    }
                >
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
