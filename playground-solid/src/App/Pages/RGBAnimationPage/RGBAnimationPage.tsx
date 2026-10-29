import { type Accessor, type Signal, createMemo, createSignal, splitProps } from "solid-js";
import { createStore } from "solid-js/store";

import {
    RGBAnimation,
    RGBAnimationKeyframes,
    RGB_ANIMATION_DEFAULTS,
    type SliceAnimationFn,
} from "@thewaver/ss-components-solid";
import { RGBAnimationKnobs } from "@thewaver/ss-playground/App/Knobs/RGBAnimations.const";
import {
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
    FIELD_WIDTH,
    HEADLINE_SOURCE,
    SOURCE_KEYS,
    SOURCE_LABELS,
    SOURCE_WIDTHS,
    STRESS_ITEMS,
    STRESS_ITEM_WIDTH,
} from "@thewaver/ss-playground/App/Pages/RGBAnimationPage/RGBAnimationPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/RGBAnimationPage/RGBAnimationPage.css";
import type { RGBAnimationSourceKey } from "@thewaver/ss-playground/App/Pages/RGBAnimationPage/RGBAnimationPage.types";
import knightProfile from "@thewaver/ss-playground/App/knight_profile.webp";
import type { CSSAnimationValues } from "@thewaver/ss-utils";

import { PageExampleKnobs } from "../../PageComponents/ExampleKnobs/ExampleKnobs";
import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageCheckField, PageNumberField, PageSelectField } from "../../PageComponents/Field/Field";
import { PageMeasureBox } from "../../PageComponents/MeasureBox/MeasureBox";
import { PagePlaybackScrubber } from "../../PageComponents/PlaybackScrubber/PlaybackScrubber";
import { PlaybackScrubberUtils } from "../../PageComponents/PlaybackScrubber/PlaybackScrubber.utils";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { StressTest } from "../../PageComponents/StressTest/StressTest";
import { AnaglyphExample } from "./Examples/Anaglyph";
import { EchoExample } from "./Examples/Echo";
import { FocusPullExample } from "./Examples/FocusPull";
import { GlitchExample } from "./Examples/Glitch";
import { HueSwapExample } from "./Examples/HueSwap";
import { OrbitExample } from "./Examples/Orbit";
import { SwellExample } from "./Examples/Swell";
import { TiltExample } from "./Examples/Tilt";
import { TwistExample } from "./Examples/Twist";
import type { RGBAnimationExampleProps } from "./RGBAnimationPageSolid.types";

const SOURCES: Record<RGBAnimationSourceKey, string> = { knight: knightProfile, text: HEADLINE_SOURCE };

type WrapperProps = RGBAnimationExampleProps & {
    playback: Signal<boolean>;
    boxWidth: Accessor<number>;
    isPagePlaying: Accessor<boolean>;
};

const STRESS_SAMPLES: (() => {
    animation: SliceAnimationFn;
    computeRootAnimation?: (timeline: number) => CSSAnimationValues;
})[] = [
    () => ({
        animation: RGBAnimationKeyframes.createSwell({ scalePercent: RGBAnimationKnobs.STARTING_SCALE_PERCENT }),
    }),
    () => ({
        animation: RGBAnimationKeyframes.createOrbit({
            radiusPercent: RGBAnimationKnobs.STARTING_ORBIT_RADIUS_PERCENT,
        }),
    }),
    () => ({
        animation: RGBAnimationKeyframes.createFocusPull({ maxBlurPx: RGBAnimationKnobs.STARTING_FOCUS_BLUR_PX }),
    }),
    () => ({ animation: RGBAnimationKeyframes.createTwist({ maxDegrees: RGBAnimationKnobs.STARTING_TWIST_DEGREES }) }),
    () => ({
        animation: RGBAnimationKeyframes.createHueSwap({ turns: RGBAnimationKnobs.STARTING_HUE_TURNS, anchor: "red" }),
    }),
    () => ({ animation: RGBAnimationKeyframes.createTilt({ maxDegrees: RGBAnimationKnobs.STARTING_TILT_DEGREES }) }),
    () => ({
        animation: RGBAnimationKeyframes.createAnaglyph({
            separationPercent: RGBAnimationKnobs.STARTING_ANAGLYPH_SEPARATION_PERCENT,
        }),
    }),
    () => {
        const opts = { distancePercent: RGBAnimationKnobs.STARTING_ECHO_DISTANCE_PERCENT };

        return {
            animation: RGBAnimationKeyframes.createEcho(opts),
            computeRootAnimation: (timeline) => ({
                translate: RGBAnimationKeyframes.computeEchoRootPath(timeline, opts),
            }),
        };
    },
];

const GlitchExampleWrapper = (props: WrapperProps) => {
    const [local, exampleProps] = splitProps(props, ["boxWidth", "isPagePlaying"]);

    const [glitchOpts, setGlitchOpts] = createStore({ ...RGBAnimationKnobs.STARTING_GLITCH_OPTS });

    return (
        <>
            <div class={styles.stack}>
                <PageMeasureBox width={local.boxWidth}>
                    <GlitchExample
                        {...exampleProps}
                        playback={PlaybackScrubberUtils.gate(props.playback, local.isPagePlaying)}
                        glitchOpts={() => ({ ...glitchOpts })}
                    />
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
                    key={"glitchCount"}
                    label={"Glitches per pass"}
                    hint={
                        "How many tears follow each other in the middle of a pass. Each one shifts every channel its own way."
                    }
                    controls={"Sets the example's glitch count, read by its RGBAnimationProps.computeSliceAnimation"}
                >
                    <PageNumberField
                        value={() => glitchOpts.count}
                        min={RGBAnimationKnobs.MIN_GLITCH_COUNT}
                        max={RGBAnimationKnobs.MAX_GLITCH_COUNT}
                        step={RGBAnimationKnobs.GLITCH_COUNT_STEP}
                        width={FIELD_WIDTH}
                        ariaLabel={"Glitches per pass"}
                        onInput={(value) => setGlitchOpts("count", value)}
                    />
                </PageProp>

                <PageProp
                    key={"shiftPercent"}
                    label={"Shift (%)"}
                    hint={"The furthest a channel moves in a tear, as a share of the picture's size."}
                    controls={"Sets the example's shift, read by its RGBAnimationProps.computeSliceAnimation"}
                >
                    <PageNumberField
                        value={() => glitchOpts.shiftPercent}
                        min={RGBAnimationKnobs.MIN_SHIFT_PERCENT}
                        max={RGBAnimationKnobs.MAX_SHIFT_PERCENT}
                        step={RGBAnimationKnobs.SHIFT_PERCENT_STEP}
                        width={FIELD_WIDTH}
                        ariaLabel={"Shift in percent"}
                        onInput={(value) => setGlitchOpts("shiftPercent", value)}
                    />
                </PageProp>
            </PageExampleKnobs>
        </>
    );
};

const SwellExampleWrapper = (props: WrapperProps) => {
    const [local, exampleProps] = splitProps(props, ["boxWidth", "isPagePlaying"]);

    const [getScalePercent, setScalePercent] = createSignal(RGBAnimationKnobs.STARTING_SCALE_PERCENT);

    return (
        <>
            <div class={styles.stack}>
                <PageMeasureBox width={local.boxWidth}>
                    <SwellExample
                        {...exampleProps}
                        playback={PlaybackScrubberUtils.gate(props.playback, local.isPagePlaying)}
                        scalePercent={getScalePercent}
                    />
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
                    key={"scalePercent"}
                    label={"Scale (%)"}
                    hint={"How far red grows and blue shrinks at the top of the swell. Green stays put."}
                    controls={"Sets the example's scale, read by its RGBAnimationProps.computeSliceAnimation"}
                >
                    <PageNumberField
                        value={getScalePercent}
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

const OrbitExampleWrapper = (props: WrapperProps) => {
    const [local, exampleProps] = splitProps(props, ["boxWidth", "isPagePlaying"]);
    const [getRadiusPercent, setRadiusPercent] = createSignal(RGBAnimationKnobs.STARTING_ORBIT_RADIUS_PERCENT);

    return (
        <>
            <div class={styles.stack}>
                <PageMeasureBox width={local.boxWidth}>
                    <OrbitExample
                        {...exampleProps}
                        playback={PlaybackScrubberUtils.gate(props.playback, local.isPagePlaying)}
                        radiusPercent={getRadiusPercent}
                    />
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
                    key={"radiusPercent"}
                    label={"Radius (%)"}
                    hint={
                        "How far the channels circle from their resting place at the widest point of the pass, as a share of the picture's size."
                    }
                    controls={"Sets the example's radius, read by its RGBAnimationProps.computeSliceAnimation"}
                >
                    <PageNumberField
                        value={getRadiusPercent}
                        min={RGBAnimationKnobs.MIN_ORBIT_RADIUS_PERCENT}
                        max={RGBAnimationKnobs.MAX_ORBIT_RADIUS_PERCENT}
                        step={RGBAnimationKnobs.ORBIT_RADIUS_STEP_PERCENT}
                        width={FIELD_WIDTH}
                        ariaLabel={"Radius in percent"}
                        onInput={setRadiusPercent}
                    />
                </PageProp>
            </PageExampleKnobs>
        </>
    );
};

const FocusPullExampleWrapper = (props: WrapperProps) => {
    const [local, exampleProps] = splitProps(props, ["boxWidth", "isPagePlaying"]);
    const [getMaxBlurPx, setMaxBlurPx] = createSignal(RGBAnimationKnobs.STARTING_FOCUS_BLUR_PX);

    return (
        <>
            <div class={styles.stack}>
                <PageMeasureBox width={local.boxWidth}>
                    <FocusPullExample
                        {...exampleProps}
                        playback={PlaybackScrubberUtils.gate(props.playback, local.isPagePlaying)}
                        maxBlurPx={getMaxBlurPx}
                    />
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
                    key={"maxBlurPx"}
                    label={"Blur (px)"}
                    hint={"How soft each channel goes at the worst of its turn out of focus."}
                    controls={"Sets the example's blur, read by its RGBAnimationProps.computeSliceAnimation"}
                >
                    <PageNumberField
                        value={getMaxBlurPx}
                        min={RGBAnimationKnobs.MIN_FOCUS_BLUR_PX}
                        max={RGBAnimationKnobs.MAX_FOCUS_BLUR_PX}
                        step={RGBAnimationKnobs.FOCUS_BLUR_STEP_PX}
                        width={FIELD_WIDTH}
                        ariaLabel={"Blur in pixels"}
                        onInput={setMaxBlurPx}
                    />
                </PageProp>
            </PageExampleKnobs>
        </>
    );
};

const TwistExampleWrapper = (props: WrapperProps) => {
    const [local, exampleProps] = splitProps(props, ["boxWidth", "isPagePlaying"]);
    const [getMaxDegrees, setMaxDegrees] = createSignal(RGBAnimationKnobs.STARTING_TWIST_DEGREES);

    return (
        <>
            <div class={styles.stack}>
                <PageMeasureBox width={local.boxWidth}>
                    <TwistExample
                        {...exampleProps}
                        playback={PlaybackScrubberUtils.gate(props.playback, local.isPagePlaying)}
                        maxDegrees={getMaxDegrees}
                    />
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
                    key={"maxDegrees"}
                    label={"Angle (°)"}
                    hint={
                        "How far red and blue turn, in opposite directions, at the middle of the pass. Green stays put."
                    }
                    controls={"Sets the example's angle, read by its RGBAnimationProps.computeSliceAnimation"}
                >
                    <PageNumberField
                        value={getMaxDegrees}
                        min={RGBAnimationKnobs.MIN_TWIST_DEGREES}
                        max={RGBAnimationKnobs.MAX_TWIST_DEGREES}
                        step={RGBAnimationKnobs.TWIST_STEP_DEGREES}
                        width={FIELD_WIDTH}
                        ariaLabel={"Angle in degrees"}
                        onInput={setMaxDegrees}
                    />
                </PageProp>
            </PageExampleKnobs>
        </>
    );
};

const HueSwapExampleWrapper = (props: WrapperProps) => {
    const [local, exampleProps] = splitProps(props, ["boxWidth", "isPagePlaying"]);
    const [getTurns, setTurns] = createSignal(RGBAnimationKnobs.STARTING_HUE_TURNS);

    return (
        <>
            <div class={styles.stack}>
                <PageMeasureBox width={local.boxWidth}>
                    <HueSwapExample
                        {...exampleProps}
                        playback={PlaybackScrubberUtils.gate(props.playback, local.isPagePlaying)}
                        turns={getTurns}
                    />
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
                    key={"turns"}
                    label={"Turns"}
                    hint={
                        "How many times the two turning channels go round the color wheel, in opposite directions, over one pass. The third stays put, a different one each pass."
                    }
                    controls={"Sets the example's turns, read by its RGBAnimationProps.computeSliceAnimation"}
                >
                    <PageNumberField
                        value={getTurns}
                        min={RGBAnimationKnobs.MIN_HUE_TURNS}
                        max={RGBAnimationKnobs.MAX_HUE_TURNS}
                        step={RGBAnimationKnobs.HUE_TURNS_STEP}
                        width={FIELD_WIDTH}
                        ariaLabel={"Turns per pass"}
                        onInput={setTurns}
                    />
                </PageProp>
            </PageExampleKnobs>
        </>
    );
};

const TiltExampleWrapper = (props: WrapperProps) => {
    const [local, exampleProps] = splitProps(props, ["boxWidth", "isPagePlaying"]);
    const [getMaxDegrees, setMaxDegrees] = createSignal(RGBAnimationKnobs.STARTING_TILT_DEGREES);

    return (
        <>
            <div class={styles.stack}>
                <PageMeasureBox width={local.boxWidth}>
                    <TiltExample
                        {...exampleProps}
                        playback={PlaybackScrubberUtils.gate(props.playback, local.isPagePlaying)}
                        maxDegrees={getMaxDegrees}
                    />
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
                    key={"maxDegrees"}
                    label={"Angle (°)"}
                    hint={"How far red and blue swing in depth, in opposite directions. Green stays put."}
                    controls={"Sets the example's angle, read by its RGBAnimationProps.computeSliceAnimation"}
                >
                    <PageNumberField
                        value={getMaxDegrees}
                        min={RGBAnimationKnobs.MIN_TILT_DEGREES}
                        max={RGBAnimationKnobs.MAX_TILT_DEGREES}
                        step={RGBAnimationKnobs.TILT_STEP_DEGREES}
                        width={FIELD_WIDTH}
                        ariaLabel={"Angle in degrees"}
                        onInput={setMaxDegrees}
                    />
                </PageProp>
            </PageExampleKnobs>
        </>
    );
};

const AnaglyphExampleWrapper = (props: WrapperProps) => {
    const [local, exampleProps] = splitProps(props, ["boxWidth", "isPagePlaying"]);
    const [getSeparationPercent, setSeparationPercent] = createSignal(
        RGBAnimationKnobs.STARTING_ANAGLYPH_SEPARATION_PERCENT,
    );

    return (
        <>
            <div class={styles.stack}>
                <PageMeasureBox width={local.boxWidth}>
                    <AnaglyphExample
                        {...exampleProps}
                        playback={PlaybackScrubberUtils.gate(props.playback, local.isPagePlaying)}
                        separationPercent={getSeparationPercent}
                    />
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
                    key={"separationPercent"}
                    label={"Separation (%)"}
                    hint={
                        "How far red moves left and blue moves right at the middle of the pass, as a share of the picture's width. Green stays put."
                    }
                    controls={"Sets the example's separation, read by its RGBAnimationProps.computeSliceAnimation"}
                >
                    <PageNumberField
                        value={getSeparationPercent}
                        min={RGBAnimationKnobs.MIN_ANAGLYPH_SEPARATION_PERCENT}
                        max={RGBAnimationKnobs.MAX_ANAGLYPH_SEPARATION_PERCENT}
                        step={RGBAnimationKnobs.ANAGLYPH_SEPARATION_STEP_PERCENT}
                        width={FIELD_WIDTH}
                        ariaLabel={"Separation in percent"}
                        onInput={setSeparationPercent}
                    />
                </PageProp>
            </PageExampleKnobs>
        </>
    );
};

const EchoExampleWrapper = (props: WrapperProps) => {
    const [local, exampleProps] = splitProps(props, ["boxWidth", "isPagePlaying"]);
    const [getDistancePercent, setDistancePercent] = createSignal(RGBAnimationKnobs.STARTING_ECHO_DISTANCE_PERCENT);

    return (
        <>
            <div class={styles.stack}>
                <PageMeasureBox width={local.boxWidth}>
                    <EchoExample
                        {...exampleProps}
                        playback={PlaybackScrubberUtils.gate(props.playback, local.isPagePlaying)}
                        distancePercent={getDistancePercent}
                    />
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
                    key={"distancePercent"}
                    label={"Distance (%)"}
                    hint={
                        "How far the picture drifts along its figure-eight, as a share of its size. Green and blue follow a little later than red."
                    }
                    controls={
                        "Sets the example's distance, read by its RGBAnimationProps.computeRootAnimation and computeSliceAnimation"
                    }
                >
                    <PageNumberField
                        value={getDistancePercent}
                        min={RGBAnimationKnobs.MIN_ECHO_DISTANCE_PERCENT}
                        max={RGBAnimationKnobs.MAX_ECHO_DISTANCE_PERCENT}
                        step={RGBAnimationKnobs.ECHO_DISTANCE_STEP_PERCENT}
                        width={FIELD_WIDTH}
                        ariaLabel={"Distance in percent"}
                        onInput={setDistancePercent}
                    />
                </PageProp>
            </PageExampleKnobs>
        </>
    );
};

const StressTestWrapper = (props: Omit<RGBAnimationExampleProps, "progress"> & { playback: Signal<boolean> }) => {
    const modalPlayback = createSignal(true);

    const [getIsOnGraphicsCard, setIsOnGraphicsCard] = createSignal(true);

    return (
        <>
            <PagePropsPanel scope={"local"} hasReset={false}>
                <PageProp
                    key={"onGraphicsCard"}
                    label={"On the graphics card"}
                    hint={
                        "Draws the stress test's channels in one canvas per item, with the keyframes worked out on the graphics card. Off, every channel is an element of its own."
                    }
                    controls={"Sets RGBAnimationProps.renderer in the stress test"}
                >
                    <PageCheckField
                        value={getIsOnGraphicsCard}
                        ariaLabel={"On the graphics card"}
                        onChange={setIsOnGraphicsCard}
                    />
                </PageProp>
            </PagePropsPanel>

            <StressTest
                configs={STRESS_ITEMS}
                onHideModal={() => {
                    props.playback[1](true);
                }}
                onShowModal={() => {
                    props.playback[1](false);
                }}
                renderLabel={(getConfigIndex) => `Render ${STRESS_ITEMS[getConfigIndex()].count} items`}
                renderItem={() => {
                    const sample = STRESS_SAMPLES[Math.floor(Math.random() * STRESS_SAMPLES.length)]();

                    return (
                        <PageMeasureBox width={STRESS_ITEM_WIDTH}>
                            <RGBAnimation
                                src={props.src}
                                colorMixing={props.colorMixing}
                                playback={modalPlayback}
                                animationDurationMs={props.animationDurationMs}
                                animationIterationDelayMs={props.animationIterationDelayMs}
                                renderer={() => (getIsOnGraphicsCard() ? "graphics_card" : "elements")}
                                computeRootAnimation={sample.computeRootAnimation}
                                computeSliceAnimation={sample.animation}
                            />
                        </PageMeasureBox>
                    );
                }}
            />
        </>
    );
};

export const RGBAnimationPage = () => {
    const playback = createSignal(true);
    const glitchPlayback = createSignal(true);
    const glitchProgress = createSignal(0);
    const swellPlayback = createSignal(true);
    const swellProgress = createSignal(0);
    const orbitPlayback = createSignal(true);
    const orbitProgress = createSignal(0);
    const focusPullPlayback = createSignal(true);
    const focusPullProgress = createSignal(0);
    const twistPlayback = createSignal(true);
    const twistProgress = createSignal(0);
    const hueSwapPlayback = createSignal(true);
    const hueSwapProgress = createSignal(0);
    const tiltPlayback = createSignal(true);
    const tiltProgress = createSignal(0);
    const anaglyphPlayback = createSignal(true);
    const anaglyphProgress = createSignal(0);
    const echoPlayback = createSignal(true);
    const echoProgress = createSignal(0);

    const [getAnimationDurationMs, setAnimationDurationMs] = createSignal(RGB_ANIMATION_DEFAULTS.animationDurationMs);
    const [getAnimationIterationDelayMs, setAnimationIterationDelayMs] = createSignal(
        RGB_ANIMATION_DEFAULTS.animationIterationDelayMs,
    );
    const [getSourceKey, setSourceKey] = createSignal(RGBAnimationKnobs.STARTING_SOURCE);
    const [getColorMixingChoice, setColorMixingChoice] = createSignal<
        (typeof RGBAnimationKnobs.COLOR_MIXING_CHOICES)[number]
    >(RGBAnimationKnobs.FROM_COLOR_SCHEME);

    const getColorMixing = () => {
        const choice = getColorMixingChoice();

        return choice === RGBAnimationKnobs.FROM_COLOR_SCHEME ? undefined : choice;
    };

    const getExamples = createMemo(() => {
        const commonProps = {
            colorMixing: getColorMixing,
            animationDurationMs: getAnimationDurationMs,
            animationIterationDelayMs: getAnimationIterationDelayMs,
            src: () => SOURCES[getSourceKey()],
            ariaLabel: () => SOURCE_LABELS[getSourceKey()],
        };

        const getBoxWidth = () => SOURCE_WIDTHS[getSourceKey()];

        return [
            {
                key: "glitch",
                name: EXAMPLE_NAMES.glitch,
                readout: () =>
                    "a cluster of tears mid-pass, each moving every channel its own way, then a rest — ScanlineAnimation's Glitch, by channel instead of by line",
                component: () => (
                    <GlitchExampleWrapper
                        {...commonProps}
                        boxWidth={getBoxWidth}
                        isPagePlaying={playback[0]}
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
                        boxWidth={getBoxWidth}
                        isPagePlaying={playback[0]}
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
                        boxWidth={getBoxWidth}
                        isPagePlaying={playback[0]}
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
                        boxWidth={getBoxWidth}
                        isPagePlaying={playback[0]}
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
                        boxWidth={getBoxWidth}
                        isPagePlaying={playback[0]}
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
                        boxWidth={getBoxWidth}
                        isPagePlaying={playback[0]}
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
                        boxWidth={getBoxWidth}
                        isPagePlaying={playback[0]}
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
                        boxWidth={getBoxWidth}
                        isPagePlaying={playback[0]}
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
                        boxWidth={getBoxWidth}
                        isPagePlaying={playback[0]}
                        playback={focusPullPlayback}
                        progress={focusPullProgress}
                    />
                ),
                path: `${EXAMPLES_ROOT}/FocusPull.tsx`,
            },
            {
                key: "stressTest",
                name: EXAMPLE_NAMES.stressTest,
                component: () => <StressTestWrapper {...commonProps} playback={playback} />,
            },
        ];
    });

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp
                    key={"source"}
                    label={"Source"}
                    hint={"The picture the channels are split from: the knight photograph, or a line of SVG text."}
                    controls={"Picks the example picture sent to RGBAnimationProps.src"}
                >
                    <PageSelectField
                        value={getSourceKey}
                        values={SOURCE_KEYS}
                        ariaLabel={"Source"}
                        onChange={(key) => setSourceKey(() => key)}
                    />
                </PageProp>

                <PageProp
                    key={"animationDurationMs"}
                    label={"Animation duration (ms)"}
                    hint={"How long one pass takes."}
                    controls={"Sets RGBAnimationProps.animationDurationMs"}
                >
                    <PageNumberField
                        value={getAnimationDurationMs}
                        min={RGBAnimationKnobs.MIN_DURATION_MS}
                        max={RGBAnimationKnobs.MAX_DURATION_MS}
                        step={RGBAnimationKnobs.DURATION_STEP_MS}
                        width={FIELD_WIDTH}
                        ariaLabel={"Animation duration"}
                        onInput={setAnimationDurationMs}
                    />
                </PageProp>

                <PageProp
                    key={"animationIterationDelayMs"}
                    label={"Iteration delay (ms)"}
                    hint={"How long the picture waits between one pass and the next."}
                    controls={"Sets RGBAnimationProps.animationIterationDelayMs"}
                >
                    <PageNumberField
                        value={getAnimationIterationDelayMs}
                        min={RGBAnimationKnobs.MIN_ITERATION_DELAY_MS}
                        max={RGBAnimationKnobs.MAX_ITERATION_DELAY_MS}
                        step={RGBAnimationKnobs.DURATION_STEP_MS}
                        width={FIELD_WIDTH}
                        ariaLabel={"Iteration delay"}
                        onInput={setAnimationIterationDelayMs}
                    />
                </PageProp>

                <PageProp
                    key={"colorMixing"}
                    label={"Color mixing"}
                    hint={
                        "How the channels are put back together. Additive fringes are red, green and blue and read on a dark ground; subtractive ones are cyan, magenta and yellow and read on a light one. Left out, it follows the page's color-scheme at the start of each pass."
                    }
                    controls={"Sets RGBAnimationProps.colorMixing, with the color-scheme choice sent as undefined"}
                >
                    <PageSelectField
                        value={getColorMixingChoice}
                        values={RGBAnimationKnobs.COLOR_MIXING_CHOICES}
                        ariaLabel={"Color mixing"}
                        onChange={setColorMixingChoice}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={getExamples} layout={"flow"} />
        </>
    );
};
