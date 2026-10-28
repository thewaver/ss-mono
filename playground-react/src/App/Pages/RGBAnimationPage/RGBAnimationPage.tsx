import { useState } from "react";

import { RGB_ANIMATION_DEFAULTS } from "@thewaver/ss-components-react";
import { RGBAnimationKnobs } from "@thewaver/ss-playground/App/Knobs/RGBAnimations.const";
import {
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
    FIELD_WIDTH,
    HEADLINE_SOURCE,
    SOURCE_KEYS,
    SOURCE_LABELS,
    SOURCE_WIDTHS,
} from "@thewaver/ss-playground/App/Pages/RGBAnimationPage/RGBAnimationPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/RGBAnimationPage/RGBAnimationPage.css";
import type { RGBAnimationSourceKey } from "@thewaver/ss-playground/App/Pages/RGBAnimationPage/RGBAnimationPage.types";
import knightProfile from "@thewaver/ss-playground/App/knight_profile.webp";

import { PageExampleKnobs } from "../../PageComponents/ExampleKnobs/ExampleKnobs";
import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageNumberField, PageSelectField } from "../../PageComponents/Field/Field";
import { PageMeasureBox } from "../../PageComponents/MeasureBox/MeasureBox";
import { PagePlaybackScrubber } from "../../PageComponents/PlaybackScrubber/PlaybackScrubber";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { AnaglyphExample } from "./Examples/Anaglyph";
import { EchoExample } from "./Examples/Echo";
import { FocusPullExample } from "./Examples/FocusPull";
import { GlitchExample } from "./Examples/Glitch";
import { HueSwapExample } from "./Examples/HueSwap";
import { OrbitExample } from "./Examples/Orbit";
import { SwellExample } from "./Examples/Swell";
import { TiltExample } from "./Examples/Tilt";
import { TwistExample } from "./Examples/Twist";
import type { RGBAnimationExampleProps } from "./RGBAnimationPageReact.types";

const SOURCES: Record<RGBAnimationSourceKey, string> = { knight: knightProfile, text: HEADLINE_SOURCE };

type WrapperProps = RGBAnimationExampleProps & { boxWidth: number };

const GlitchExampleWrapper = ({ boxWidth, ...props }: WrapperProps) => {
    const [glitchOpts, setGlitchOpts] = useState({ ...RGBAnimationKnobs.STARTING_GLITCH_OPTS });

    return (
        <>
            <div className={styles.stack}>
                <PageMeasureBox width={boxWidth}>
                    <GlitchExample {...props} glitchOpts={glitchOpts} />
                </PageMeasureBox>

                <PagePlaybackScrubber
                    id={"glitch"}
                    ariaLabel={"Position in the pass"}
                    playback={props.playback}
                    progress={props.progress}
                />
            </div>

            <PageExampleKnobs>
                <PageProp
                    itemKey={"glitchCount"}
                    label={"Glitches per pass"}
                    hint={
                        "How many tears follow each other in the middle of a pass. Each one shifts every channel its own way."
                    }
                    controls={"Sets the example's glitch count, read by its RGBAnimationProps.computeChannelAnimation"}
                >
                    <PageNumberField
                        value={glitchOpts.count}
                        min={RGBAnimationKnobs.MIN_GLITCH_COUNT}
                        max={RGBAnimationKnobs.MAX_GLITCH_COUNT}
                        step={RGBAnimationKnobs.GLITCH_COUNT_STEP}
                        width={FIELD_WIDTH}
                        ariaLabel={"Glitches per pass"}
                        onInput={(value) => setGlitchOpts((opts) => ({ ...opts, count: value }))}
                    />
                </PageProp>

                <PageProp
                    itemKey={"shiftPercent"}
                    label={"Shift (%)"}
                    hint={"The furthest a channel moves in a tear, as a share of the picture's size."}
                    controls={"Sets the example's shift, read by its RGBAnimationProps.computeChannelAnimation"}
                >
                    <PageNumberField
                        value={glitchOpts.shiftPercent}
                        min={RGBAnimationKnobs.MIN_SHIFT_PERCENT}
                        max={RGBAnimationKnobs.MAX_SHIFT_PERCENT}
                        step={RGBAnimationKnobs.SHIFT_PERCENT_STEP}
                        width={FIELD_WIDTH}
                        ariaLabel={"Shift in percent"}
                        onInput={(value) => setGlitchOpts((opts) => ({ ...opts, shiftPercent: value }))}
                    />
                </PageProp>
            </PageExampleKnobs>
        </>
    );
};

const SwellExampleWrapper = ({ boxWidth, ...props }: WrapperProps) => {
    const [scalePercent, setScalePercent] = useState(RGBAnimationKnobs.STARTING_SCALE_PERCENT);

    return (
        <>
            <div className={styles.stack}>
                <PageMeasureBox width={boxWidth}>
                    <SwellExample {...props} scalePercent={scalePercent} />
                </PageMeasureBox>

                <PagePlaybackScrubber
                    id={"swell"}
                    ariaLabel={"Position in the pass"}
                    playback={props.playback}
                    progress={props.progress}
                />
            </div>

            <PageExampleKnobs>
                <PageProp
                    itemKey={"scalePercent"}
                    label={"Scale (%)"}
                    hint={"How far red grows and blue shrinks at the top of the swell. Green stays put."}
                    controls={"Sets the example's scale, read by its RGBAnimationProps.computeChannelAnimation"}
                >
                    <PageNumberField
                        value={scalePercent}
                        min={RGBAnimationKnobs.MIN_SCALE_PERCENT}
                        max={RGBAnimationKnobs.MAX_SCALE_PERCENT}
                        step={RGBAnimationKnobs.SCALE_PERCENT_STEP}
                        width={FIELD_WIDTH}
                        ariaLabel={"Scale in percent"}
                        onInput={setScalePercent}
                    />
                </PageProp>
            </PageExampleKnobs>
        </>
    );
};

const OrbitExampleWrapper = ({ boxWidth, ...props }: WrapperProps) => {
    const [radiusPercent, setRadiusPercent] = useState(RGBAnimationKnobs.STARTING_ORBIT_RADIUS_PERCENT);

    return (
        <>
            <div className={styles.stack}>
                <PageMeasureBox width={boxWidth}>
                    <OrbitExample {...props} radiusPercent={radiusPercent} />
                </PageMeasureBox>

                <PagePlaybackScrubber
                    id={"orbit"}
                    ariaLabel={"Position in the pass"}
                    playback={props.playback}
                    progress={props.progress}
                />
            </div>

            <PageExampleKnobs>
                <PageProp
                    itemKey={"radiusPercent"}
                    label={"Radius (%)"}
                    hint={
                        "How far the channels circle from their resting place at the widest point of the pass, as a share of the picture's size."
                    }
                    controls={"Sets the example's radius, read by its RGBAnimationProps.computeChannelAnimation"}
                >
                    <PageNumberField
                        value={radiusPercent}
                        min={RGBAnimationKnobs.MIN_ORBIT_RADIUS_PERCENT}
                        max={RGBAnimationKnobs.MAX_ORBIT_RADIUS_PERCENT}
                        step={RGBAnimationKnobs.ORBIT_RADIUS_STEP_PERCENT}
                        width={FIELD_WIDTH}
                        ariaLabel={"Position in the pass"}
                        onInput={setRadiusPercent}
                    />
                </PageProp>
            </PageExampleKnobs>
        </>
    );
};

const TwistExampleWrapper = ({ boxWidth, ...props }: WrapperProps) => {
    const [maxDegrees, setMaxDegrees] = useState(RGBAnimationKnobs.STARTING_TWIST_DEGREES);

    return (
        <>
            <div className={styles.stack}>
                <PageMeasureBox width={boxWidth}>
                    <TwistExample {...props} maxDegrees={maxDegrees} />
                </PageMeasureBox>

                <PagePlaybackScrubber
                    id={"twist"}
                    ariaLabel={"Position in the pass"}
                    playback={props.playback}
                    progress={props.progress}
                />
            </div>

            <PageExampleKnobs>
                <PageProp
                    itemKey={"maxDegrees"}
                    label={"Angle (°)"}
                    hint={
                        "How far red and blue turn, in opposite directions, at the middle of the pass. Green stays put."
                    }
                    controls={"Sets the example's angle, read by its RGBAnimationProps.computeChannelAnimation"}
                >
                    <PageNumberField
                        value={maxDegrees}
                        min={RGBAnimationKnobs.MIN_TWIST_DEGREES}
                        max={RGBAnimationKnobs.MAX_TWIST_DEGREES}
                        step={RGBAnimationKnobs.TWIST_STEP_DEGREES}
                        width={FIELD_WIDTH}
                        ariaLabel={"Position in the pass"}
                        onInput={setMaxDegrees}
                    />
                </PageProp>
            </PageExampleKnobs>
        </>
    );
};

const TiltExampleWrapper = ({ boxWidth, ...props }: WrapperProps) => {
    const [maxDegrees, setMaxDegrees] = useState(RGBAnimationKnobs.STARTING_TILT_DEGREES);

    return (
        <>
            <div className={styles.stack}>
                <PageMeasureBox width={boxWidth}>
                    <TiltExample {...props} maxDegrees={maxDegrees} />
                </PageMeasureBox>

                <PagePlaybackScrubber
                    id={"tilt"}
                    ariaLabel={"Position in the pass"}
                    playback={props.playback}
                    progress={props.progress}
                />
            </div>

            <PageExampleKnobs>
                <PageProp
                    itemKey={"maxDegrees"}
                    label={"Angle (°)"}
                    hint={"How far red and blue swing in depth, in opposite directions. Green stays put."}
                    controls={"Sets the example's angle, read by its RGBAnimationProps.computeChannelAnimation"}
                >
                    <PageNumberField
                        value={maxDegrees}
                        min={RGBAnimationKnobs.MIN_TILT_DEGREES}
                        max={RGBAnimationKnobs.MAX_TILT_DEGREES}
                        step={RGBAnimationKnobs.TILT_STEP_DEGREES}
                        width={FIELD_WIDTH}
                        ariaLabel={"Position in the pass"}
                        onInput={setMaxDegrees}
                    />
                </PageProp>
            </PageExampleKnobs>
        </>
    );
};

const AnaglyphExampleWrapper = ({ boxWidth, ...props }: WrapperProps) => {
    const [separationPercent, setSeparationPercent] = useState(RGBAnimationKnobs.STARTING_ANAGLYPH_SEPARATION_PERCENT);

    return (
        <>
            <div className={styles.stack}>
                <PageMeasureBox width={boxWidth}>
                    <AnaglyphExample {...props} separationPercent={separationPercent} />
                </PageMeasureBox>

                <PagePlaybackScrubber
                    id={"anaglyph"}
                    ariaLabel={"Position in the pass"}
                    playback={props.playback}
                    progress={props.progress}
                />
            </div>

            <PageExampleKnobs>
                <PageProp
                    itemKey={"separationPercent"}
                    label={"Separation (%)"}
                    hint={
                        "How far red moves left and blue moves right at the middle of the pass, as a share of the picture's width. Green stays put."
                    }
                    controls={"Sets the example's separation, read by its RGBAnimationProps.computeChannelAnimation"}
                >
                    <PageNumberField
                        value={separationPercent}
                        min={RGBAnimationKnobs.MIN_ANAGLYPH_SEPARATION_PERCENT}
                        max={RGBAnimationKnobs.MAX_ANAGLYPH_SEPARATION_PERCENT}
                        step={RGBAnimationKnobs.ANAGLYPH_SEPARATION_STEP_PERCENT}
                        width={FIELD_WIDTH}
                        ariaLabel={"Position in the pass"}
                        onInput={setSeparationPercent}
                    />
                </PageProp>
            </PageExampleKnobs>
        </>
    );
};

const EchoExampleWrapper = ({ boxWidth, ...props }: WrapperProps) => {
    const [distancePercent, setDistancePercent] = useState(RGBAnimationKnobs.STARTING_ECHO_DISTANCE_PERCENT);

    return (
        <>
            <div className={styles.stack}>
                <PageMeasureBox width={boxWidth}>
                    <EchoExample {...props} distancePercent={distancePercent} />
                </PageMeasureBox>

                <PagePlaybackScrubber
                    id={"echo"}
                    ariaLabel={"Position in the pass"}
                    playback={props.playback}
                    progress={props.progress}
                />
            </div>

            <PageExampleKnobs>
                <PageProp
                    itemKey={"distancePercent"}
                    label={"Distance (%)"}
                    hint={
                        "How far the picture drifts along its figure-eight, as a share of its size. Green and blue follow a little later than red."
                    }
                    controls={
                        "Sets the example's distance, read by its RGBAnimationProps.computeRootAnimation and computeChannelAnimation"
                    }
                >
                    <PageNumberField
                        value={distancePercent}
                        min={RGBAnimationKnobs.MIN_ECHO_DISTANCE_PERCENT}
                        max={RGBAnimationKnobs.MAX_ECHO_DISTANCE_PERCENT}
                        step={RGBAnimationKnobs.ECHO_DISTANCE_STEP_PERCENT}
                        width={FIELD_WIDTH}
                        ariaLabel={"Position in the pass"}
                        onInput={setDistancePercent}
                    />
                </PageProp>
            </PageExampleKnobs>
        </>
    );
};

const HueSwapExampleWrapper = ({ boxWidth, ...props }: WrapperProps) => {
    const [turns, setTurns] = useState(RGBAnimationKnobs.STARTING_HUE_TURNS);

    return (
        <>
            <div className={styles.stack}>
                <PageMeasureBox width={boxWidth}>
                    <HueSwapExample {...props} turns={turns} />
                </PageMeasureBox>

                <PagePlaybackScrubber
                    id={"hueSwap"}
                    ariaLabel={"Position in the pass"}
                    playback={props.playback}
                    progress={props.progress}
                />
            </div>

            <PageExampleKnobs>
                <PageProp
                    itemKey={"turns"}
                    label={"Turns"}
                    hint={
                        "How many times the two turning channels go round the color wheel, in opposite directions, over one pass. The third stays put, a different one each pass."
                    }
                    controls={"Sets the example's turns, read by its RGBAnimationProps.computeChannelAnimation"}
                >
                    <PageNumberField
                        value={turns}
                        min={RGBAnimationKnobs.MIN_HUE_TURNS}
                        max={RGBAnimationKnobs.MAX_HUE_TURNS}
                        step={RGBAnimationKnobs.HUE_TURNS_STEP}
                        width={FIELD_WIDTH}
                        ariaLabel={"Position in the pass"}
                        onInput={setTurns}
                    />
                </PageProp>
            </PageExampleKnobs>
        </>
    );
};

const FocusPullExampleWrapper = ({ boxWidth, ...props }: WrapperProps) => {
    const [maxBlurPx, setMaxBlurPx] = useState(RGBAnimationKnobs.STARTING_FOCUS_BLUR_PX);

    return (
        <>
            <div className={styles.stack}>
                <PageMeasureBox width={boxWidth}>
                    <FocusPullExample {...props} maxBlurPx={maxBlurPx} />
                </PageMeasureBox>

                <PagePlaybackScrubber
                    id={"focusPull"}
                    ariaLabel={"Position in the pass"}
                    playback={props.playback}
                    progress={props.progress}
                />
            </div>

            <PageExampleKnobs>
                <PageProp
                    itemKey={"maxBlurPx"}
                    label={"Blur (px)"}
                    hint={"How soft each channel goes at the worst of its turn out of focus."}
                    controls={"Sets the example's blur, read by its RGBAnimationProps.computeChannelAnimation"}
                >
                    <PageNumberField
                        value={maxBlurPx}
                        min={RGBAnimationKnobs.MIN_FOCUS_BLUR_PX}
                        max={RGBAnimationKnobs.MAX_FOCUS_BLUR_PX}
                        step={RGBAnimationKnobs.FOCUS_BLUR_STEP_PX}
                        width={FIELD_WIDTH}
                        ariaLabel={"Position in the pass"}
                        onInput={setMaxBlurPx}
                    />
                </PageProp>
            </PageExampleKnobs>
        </>
    );
};

export const RGBAnimationPage = () => {
    const glitchPlayback = useState(true);
    const glitchProgress = useState(0);
    const swellPlayback = useState(true);
    const swellProgress = useState(0);
    const orbitPlayback = useState(true);
    const orbitProgress = useState(0);
    const twistPlayback = useState(true);
    const twistProgress = useState(0);
    const tiltPlayback = useState(true);
    const tiltProgress = useState(0);
    const anaglyphPlayback = useState(true);
    const anaglyphProgress = useState(0);
    const echoPlayback = useState(true);
    const echoProgress = useState(0);
    const hueSwapPlayback = useState(true);
    const hueSwapProgress = useState(0);
    const focusPullPlayback = useState(true);
    const focusPullProgress = useState(0);

    const [animationDurationMs, setAnimationDurationMs] = useState(RGB_ANIMATION_DEFAULTS.animationDurationMs);
    const [animationIterationDelayMs, setAnimationIterationDelayMs] = useState(
        RGB_ANIMATION_DEFAULTS.animationIterationDelayMs,
    );
    const [sourceKey, setSourceKey] = useState(RGBAnimationKnobs.STARTING_SOURCE);
    const [colorMixingChoice, setColorMixingChoice] = useState<(typeof RGBAnimationKnobs.COLOR_MIXING_CHOICES)[number]>(
        RGBAnimationKnobs.FROM_COLOR_SCHEME,
    );

    const colorMixing = colorMixingChoice === RGBAnimationKnobs.FROM_COLOR_SCHEME ? undefined : colorMixingChoice;

    const commonProps = {
        colorMixing,
        animationDurationMs,
        animationIterationDelayMs,
        src: SOURCES[sourceKey],
        ariaLabel: SOURCE_LABELS[sourceKey],
    };

    const boxWidth = SOURCE_WIDTHS[sourceKey];

    const examples = [
        {
            key: "glitch",
            name: EXAMPLE_NAMES.glitch,
            readout: () =>
                "a cluster of tears mid-pass, each moving every channel its own way, then a rest — ScanlineAnimation's Glitch, by channel instead of by line",
            component: () => (
                <GlitchExampleWrapper
                    {...commonProps}
                    boxWidth={boxWidth}
                    playback={glitchPlayback}
                    progress={glitchProgress}
                />
            ),
            path: `${EXAMPLES_ROOT}/Glitch.tsx`,
        },
        {
            key: "swell",
            name: EXAMPLE_NAMES.swell,
            readout: () => "red grows and blue shrinks about the middle, one slow swell per pass",
            component: () => (
                <SwellExampleWrapper
                    {...commonProps}
                    boxWidth={boxWidth}
                    playback={swellPlayback}
                    progress={swellProgress}
                />
            ),
            path: `${EXAMPLES_ROOT}/Swell.tsx`,
        },
        {
            key: "orbit",
            name: EXAMPLE_NAMES.orbit,
            readout: () =>
                "the three channels circle their resting place a third of a turn apart, swinging out and back over the pass, so a rainbow fringe turns around every edge",
            component: () => (
                <OrbitExampleWrapper
                    {...commonProps}
                    boxWidth={boxWidth}
                    playback={orbitPlayback}
                    progress={orbitProgress}
                />
            ),
            path: `${EXAMPLES_ROOT}/Orbit.tsx`,
        },
        {
            key: "twist",
            name: EXAMPLE_NAMES.twist,
            readout: () =>
                "red turns one way and blue the other about the center, then back, so the fringes are thin in the middle and widest at the corners",
            component: () => (
                <TwistExampleWrapper
                    {...commonProps}
                    boxWidth={boxWidth}
                    playback={twistPlayback}
                    progress={twistProgress}
                />
            ),
            path: `${EXAMPLES_ROOT}/Twist.tsx`,
        },
        {
            key: "tilt",
            name: EXAMPLE_NAMES.tilt,
            readout: () =>
                "red and blue swing in depth in opposite directions, one way and then the other, so every edge splits into three like a card tilting under a light",
            component: () => (
                <TiltExampleWrapper
                    {...commonProps}
                    boxWidth={boxWidth}
                    playback={tiltPlayback}
                    progress={tiltProgress}
                />
            ),
            path: `${EXAMPLES_ROOT}/Tilt.tsx`,
        },
        {
            key: "anaglyph",
            name: EXAMPLE_NAMES.anaglyph,
            readout: () =>
                "red slides left and blue right while green holds, then they close up again, the red-and-cyan look of old 3D glasses",
            component: () => (
                <AnaglyphExampleWrapper
                    {...commonProps}
                    boxWidth={boxWidth}
                    playback={anaglyphPlayback}
                    progress={anaglyphProgress}
                />
            ),
            path: `${EXAMPLES_ROOT}/Anaglyph.tsx`,
        },
        {
            key: "echo",
            name: EXAMPLE_NAMES.echo,
            readout: () =>
                "the whole picture drifts along a small figure-eight while green and then blue trail behind red, leaving a colored wake that catches up when the picture stops",
            component: () => (
                <EchoExampleWrapper
                    {...commonProps}
                    boxWidth={boxWidth}
                    playback={echoPlayback}
                    progress={echoProgress}
                />
            ),
            path: `${EXAMPLES_ROOT}/Echo.tsx`,
        },
        {
            key: "hueSwap",
            name: EXAMPLE_NAMES.hueSwap,
            readout: () =>
                "each pass holds one channel still — red, then green, then blue — and turns the other two round the color wheel in opposite directions until they land back where they began; the passes differ in strength, since a turned green stays bright while a turned red or blue dims",
            component: () => (
                <HueSwapExampleWrapper
                    {...commonProps}
                    boxWidth={boxWidth}
                    playback={hueSwapPlayback}
                    progress={hueSwapProgress}
                />
            ),
            path: `${EXAMPLES_ROOT}/HueSwap.tsx`,
        },
        {
            key: "focusPull",
            name: EXAMPLE_NAMES.focusPull,
            readout: () =>
                "each channel blurs and sharpens in turn, overlapping the next, like a lens hunting for focus with a colored halo",
            component: () => (
                <FocusPullExampleWrapper
                    {...commonProps}
                    boxWidth={boxWidth}
                    playback={focusPullPlayback}
                    progress={focusPullProgress}
                />
            ),
            path: `${EXAMPLES_ROOT}/FocusPull.tsx`,
        },
    ];

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp
                    itemKey={"source"}
                    label={"Source"}
                    hint={"The picture the channels are split from: the knight photograph, or a line of SVG text."}
                    controls={"Picks the example picture sent to RGBAnimationProps.src"}
                >
                    <PageSelectField
                        value={sourceKey}
                        values={SOURCE_KEYS}
                        ariaLabel={"Source"}
                        onChange={(key) => setSourceKey(key)}
                    />
                </PageProp>

                <PageProp
                    itemKey={"animationDurationMs"}
                    label={"Animation duration (ms)"}
                    hint={"How long one pass takes."}
                    controls={"Sets RGBAnimationProps.animationDurationMs"}
                >
                    <PageNumberField
                        value={animationDurationMs}
                        min={RGBAnimationKnobs.MIN_DURATION_MS}
                        max={RGBAnimationKnobs.MAX_DURATION_MS}
                        step={RGBAnimationKnobs.DURATION_STEP_MS}
                        width={FIELD_WIDTH}
                        ariaLabel={"Animation duration"}
                        onInput={setAnimationDurationMs}
                    />
                </PageProp>

                <PageProp
                    itemKey={"animationIterationDelayMs"}
                    label={"Iteration delay (ms)"}
                    hint={"How long the picture waits between one pass and the next."}
                    controls={"Sets RGBAnimationProps.animationIterationDelayMs"}
                >
                    <PageNumberField
                        value={animationIterationDelayMs}
                        min={RGBAnimationKnobs.MIN_ITERATION_DELAY_MS}
                        max={RGBAnimationKnobs.MAX_ITERATION_DELAY_MS}
                        step={RGBAnimationKnobs.DURATION_STEP_MS}
                        width={FIELD_WIDTH}
                        ariaLabel={"Iteration delay"}
                        onInput={setAnimationIterationDelayMs}
                    />
                </PageProp>

                <PageProp
                    itemKey={"colorMixing"}
                    label={"Color mixing"}
                    hint={
                        "How the channels are put back together. Additive fringes are red, green and blue and read on a dark ground; subtractive ones are cyan, magenta and yellow and read on a light one. Left out, it follows the page's color-scheme at the start of each pass."
                    }
                    controls={"Sets RGBAnimationProps.colorMixing, with the color-scheme choice sent as undefined"}
                >
                    <PageSelectField
                        value={colorMixingChoice}
                        values={RGBAnimationKnobs.COLOR_MIXING_CHOICES}
                        ariaLabel={"Color mixing"}
                        onChange={setColorMixingChoice}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={examples} layout={"flow"} />
        </>
    );
};
