<script lang="ts">
    import { RGB_ANIMATION_DEFAULTS } from "@thewaver/ss-components-svelte";
    import { RGBAnimationKnobs } from "@thewaver/ss-playground/App/Knobs/RGBAnimations.const";
    import {
        EXAMPLE_NAMES,
        EXAMPLES_ROOT,
        FIELD_WIDTH,
        HEADLINE_SOURCE,
        SOURCE_KEYS,
        SOURCE_LABELS,
        SOURCE_WIDTHS,
    } from "@thewaver/ss-playground/App/Pages/RGBAnimationPage/RGBAnimationPage.const";
    import type {
        BaseRGBAnimationExampleProps,
        RGBAnimationSourceKey,
    } from "@thewaver/ss-playground/App/Pages/RGBAnimationPage/RGBAnimationPage.types";
    import knightProfile from "@thewaver/ss-playground/App/knight_profile.webp";

    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageSelectField from "../../PageComponents/Field/PageSelectField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.svelte";
    import AnaglyphExampleWrapper from "./AnaglyphExampleWrapper.svelte";
    import EchoExampleWrapper from "./EchoExampleWrapper.svelte";
    import FocusPullExampleWrapper from "./FocusPullExampleWrapper.svelte";
    import GlitchExampleWrapper from "./GlitchExampleWrapper.svelte";
    import HueSwapExampleWrapper from "./HueSwapExampleWrapper.svelte";
    import OrbitExampleWrapper from "./OrbitExampleWrapper.svelte";
    import StressTestWrapper from "./StressTestWrapper.svelte";
    import SwellExampleWrapper from "./SwellExampleWrapper.svelte";
    import TiltExampleWrapper from "./TiltExampleWrapper.svelte";
    import TwistExampleWrapper from "./TwistExampleWrapper.svelte";

    const SOURCES: Record<RGBAnimationSourceKey, string> = { knight: knightProfile, text: HEADLINE_SOURCE };

    let playback = $state(true);
    let glitchPlayback = $state(true);
    let glitchProgress = $state(0);
    let swellPlayback = $state(true);
    let swellProgress = $state(0);
    let orbitPlayback = $state(true);
    let orbitProgress = $state(0);
    let twistPlayback = $state(true);
    let twistProgress = $state(0);
    let tiltPlayback = $state(true);
    let tiltProgress = $state(0);
    let anaglyphPlayback = $state(true);
    let anaglyphProgress = $state(0);
    let echoPlayback = $state(true);
    let echoProgress = $state(0);
    let hueSwapPlayback = $state(true);
    let hueSwapProgress = $state(0);
    let focusPullPlayback = $state(true);
    let focusPullProgress = $state(0);

    let animationDurationMs = $state(RGB_ANIMATION_DEFAULTS.animationDurationMs);
    let animationIterationDelayMs = $state(RGB_ANIMATION_DEFAULTS.animationIterationDelayMs);
    let sourceKey = $state<RGBAnimationSourceKey>(RGBAnimationKnobs.STARTING_SOURCE);
    let colorMixingChoice = $state<(typeof RGBAnimationKnobs.COLOR_MIXING_CHOICES)[number]>(
        RGBAnimationKnobs.FROM_COLOR_SCHEME,
    );

    const colorMixing = $derived(
        colorMixingChoice === RGBAnimationKnobs.FROM_COLOR_SCHEME ? undefined : colorMixingChoice,
    );

    const commonProps: BaseRGBAnimationExampleProps = $derived({
        colorMixing,
        animationDurationMs,
        animationIterationDelayMs,
        src: SOURCES[sourceKey],
        ariaLabel: SOURCE_LABELS[sourceKey],
    });

    const boxWidth = $derived(SOURCE_WIDTHS[sourceKey]);

    const examples: ExampleDefs[] = [
        {
            key: "glitch",
            name: EXAMPLE_NAMES.glitch,
            readout: () =>
                "a cluster of tears mid-pass, each moving every channel its own way, then a rest — ScanlineAnimation's Glitch, by channel instead of by line",
            component: glitchExample,
            path: `${EXAMPLES_ROOT}/Glitch.svelte`,
        },
        {
            key: "swell",
            name: EXAMPLE_NAMES.swell,
            readout: () =>
                "red grows and blue shrinks about the middle, one slow swell per pass",
            component: swellExample,
            path: `${EXAMPLES_ROOT}/Swell.svelte`,
        },
        {
            key: "orbit",
            name: EXAMPLE_NAMES.orbit,
            readout: () =>
                "the three channels circle their resting place a third of a turn apart, swinging out and back over the pass, so a rainbow fringe turns around every edge",
            component: orbitExample,
            path: `${EXAMPLES_ROOT}/Orbit.svelte`,
        },
        {
            key: "twist",
            name: EXAMPLE_NAMES.twist,
            readout: () =>
                "red turns one way and blue the other about the center, then back, so the fringes are thin in the middle and widest at the corners",
            component: twistExample,
            path: `${EXAMPLES_ROOT}/Twist.svelte`,
        },
        {
            key: "tilt",
            name: EXAMPLE_NAMES.tilt,
            readout: () =>
                "red and blue swing in depth in opposite directions, one way and then the other, so every edge splits into three like a card tilting under a light",
            component: tiltExample,
            path: `${EXAMPLES_ROOT}/Tilt.svelte`,
        },
        {
            key: "anaglyph",
            name: EXAMPLE_NAMES.anaglyph,
            readout: () =>
                "red slides left and blue right while green holds, then they close up again, the red-and-cyan look of old 3D glasses",
            component: anaglyphExample,
            path: `${EXAMPLES_ROOT}/Anaglyph.svelte`,
        },
        {
            key: "echo",
            name: EXAMPLE_NAMES.echo,
            readout: () =>
                "the whole picture drifts along a small figure-eight while green and then blue trail behind red, leaving a colored wake that catches up when the picture stops",
            component: echoExample,
            path: `${EXAMPLES_ROOT}/Echo.svelte`,
        },
        {
            key: "hueSwap",
            name: EXAMPLE_NAMES.hueSwap,
            readout: () =>
                "each pass holds one channel still — red, then green, then blue — and turns the other two round the color wheel in opposite directions until they land back where they began; the passes differ in strength, since a turned green stays bright while a turned red or blue dims",
            component: hueSwapExample,
            path: `${EXAMPLES_ROOT}/HueSwap.svelte`,
        },
        {
            key: "focusPull",
            name: EXAMPLE_NAMES.focusPull,
            readout: () =>
                "each channel blurs and sharpens in turn, overlapping the next, like a lens hunting for focus with a colored halo",
            component: focusPullExample,
            path: `${EXAMPLES_ROOT}/FocusPull.svelte`,
        },
        {
            key: "stressTest",
            name: EXAMPLE_NAMES.stressTest,
            component: stressTestExample,
        },
    ];
</script>

{#snippet glitchExample()}
    <GlitchExampleWrapper {...commonProps} {boxWidth} isPagePlaying={playback} bind:playback={glitchPlayback} bind:progress={glitchProgress} />
{/snippet}

{#snippet swellExample()}
    <SwellExampleWrapper {...commonProps} {boxWidth} isPagePlaying={playback} bind:playback={swellPlayback} bind:progress={swellProgress} />
{/snippet}

{#snippet orbitExample()}
    <OrbitExampleWrapper {...commonProps} {boxWidth} isPagePlaying={playback} bind:playback={orbitPlayback} bind:progress={orbitProgress} />
{/snippet}

{#snippet twistExample()}
    <TwistExampleWrapper {...commonProps} {boxWidth} isPagePlaying={playback} bind:playback={twistPlayback} bind:progress={twistProgress} />
{/snippet}

{#snippet tiltExample()}
    <TiltExampleWrapper {...commonProps} {boxWidth} isPagePlaying={playback} bind:playback={tiltPlayback} bind:progress={tiltProgress} />
{/snippet}

{#snippet anaglyphExample()}
    <AnaglyphExampleWrapper {...commonProps} {boxWidth} isPagePlaying={playback} bind:playback={anaglyphPlayback} bind:progress={anaglyphProgress} />
{/snippet}

{#snippet echoExample()}
    <EchoExampleWrapper {...commonProps} {boxWidth} isPagePlaying={playback} bind:playback={echoPlayback} bind:progress={echoProgress} />
{/snippet}

{#snippet hueSwapExample()}
    <HueSwapExampleWrapper {...commonProps} {boxWidth} isPagePlaying={playback} bind:playback={hueSwapPlayback} bind:progress={hueSwapProgress} />
{/snippet}

{#snippet focusPullExample()}
    <FocusPullExampleWrapper {...commonProps} {boxWidth} isPagePlaying={playback} bind:playback={focusPullPlayback} bind:progress={focusPullProgress} />
{/snippet}

{#snippet stressTestExample()}
    <StressTestWrapper {...commonProps} bind:playback />
{/snippet}

<PagePropsPanel scope={"global"}>
    <PageProp
        itemKey={"source"}
        controls={"Picks the example picture sent to RGBAnimationProps.src"}
        label={"Source"}
        hint={"The picture the channels are split from: the knight photograph, or a line of SVG text."}
    >
        <PageSelectField value={sourceKey} values={SOURCE_KEYS} ariaLabel={"Source"} onChange={(value) => (sourceKey = value)} />
    </PageProp>

    <PageProp
        itemKey={"animationDurationMs"}
        controls={"Sets RGBAnimationProps.animationDurationMs"}
        label={"Animation duration (ms)"}
        hint={"How long one pass takes."}
    >
        <PageNumberField
            value={animationDurationMs}
            min={RGBAnimationKnobs.MIN_DURATION_MS}
            max={RGBAnimationKnobs.MAX_DURATION_MS}
            step={RGBAnimationKnobs.DURATION_STEP_MS}
            width={FIELD_WIDTH}
            ariaLabel={"Animation duration"}
            onInput={(value) => (animationDurationMs = value)}
        />
    </PageProp>

    <PageProp
        itemKey={"animationIterationDelayMs"}
        controls={"Sets RGBAnimationProps.animationIterationDelayMs"}
        label={"Iteration delay (ms)"}
        hint={"How long the picture waits between one pass and the next."}
    >
        <PageNumberField
            value={animationIterationDelayMs}
            min={RGBAnimationKnobs.MIN_ITERATION_DELAY_MS}
            max={RGBAnimationKnobs.MAX_ITERATION_DELAY_MS}
            step={RGBAnimationKnobs.DURATION_STEP_MS}
            width={FIELD_WIDTH}
            ariaLabel={"Iteration delay"}
            onInput={(value) => (animationIterationDelayMs = value)}
        />
    </PageProp>

    <PageProp
        itemKey={"colorMixing"}
        controls={"Sets RGBAnimationProps.colorMixing, with the color-scheme choice sent as undefined"}
        label={"Color mixing"}
        hint={"How the channels are put back together. Additive fringes are red, green and blue and read on a dark ground; subtractive ones are cyan, magenta and yellow and read on a light one. Left out, it follows the page's color-scheme at the start of each pass."}
    >
        <PageSelectField
            value={colorMixingChoice}
            values={RGBAnimationKnobs.COLOR_MIXING_CHOICES}
            ariaLabel={"Color mixing"}
            onChange={(value) => (colorMixingChoice = value)}
        />
    </PageProp>
</PagePropsPanel>

<PageExamples items={examples} layout={"flow"} />
