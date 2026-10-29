<script lang="ts">
    import {
        SliceAnimationWeights,
        SCANLINE_ANIMATION_DEFAULTS,
        SCANLINE_ANIMATION_ORIENTATIONS,
    } from "@thewaver/ss-components-svelte";
    import type { ScanlineAnimationOrientation } from "@thewaver/ss-components-svelte";
    import { ScanlineAnimationKnobs } from "@thewaver/ss-playground/App/Knobs/ScanlineAnimations.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/ScanLineAnimationPage/ScanlineAnimationPage.css";
    import knight from "@thewaver/ss-playground/App/knight.webp";

    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import PageFileField from "../../PageComponents/Field/PageFileField.svelte";
    import PageGroupedSelectField from "../../PageComponents/Field/PageGroupedSelectField.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageSelectField from "../../PageComponents/Field/PageSelectField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.svelte";
    import BrightnessExampleWrapper from "./BrightnessExampleWrapper.svelte";
    import DropoutExampleWrapper from "./DropoutExampleWrapper.svelte";
    import GlitchExampleWrapper from "./GlitchExampleWrapper.svelte";
    import GrayscaleExampleWrapper from "./GrayscaleExampleWrapper.svelte";
    import HueExampleWrapper from "./HueExampleWrapper.svelte";
    import InterlaceExampleWrapper from "./InterlaceExampleWrapper.svelte";
    import RollExampleWrapper from "./RollExampleWrapper.svelte";
    import type { ScanlineAnimationExampleProps } from "./ScanlineAnimationPage.types";
    import SkewExampleWrapper from "./SkewExampleWrapper.svelte";
    import SnakeExampleWrapper from "./SnakeExampleWrapper.svelte";
    import SplitExampleWrapper from "./SplitExampleWrapper.svelte";
    import StressTestWrapper from "./StressTestWrapper.svelte";
    import SurgeExampleWrapper from "./SurgeExampleWrapper.svelte";
    import WaveExampleWrapper from "./WaveExampleWrapper.svelte";
    import {
    EXAMPLE_NAMES,
    EXAMPLES_ROOT,
} from "@thewaver/ss-playground/App/Pages/ScanLineAnimationPage/ScanLineAnimationPage.const";

    const extractOptionGroupWord = (key: string) => key.replace(/^_/, "").match(/^[a-z]+/)?.[0] ?? key;

    const groupOptions = <T extends string>(keys: readonly T[]) => {
        const result: Record<string, T[]> = {};

        for (const key of keys) {
            const group = extractOptionGroupWord(key);

            result[group] ??= [];
            result[group].push(key);
        }

        return Object.entries(result);
    };

    const GROUPPED_WEIGHTS = groupOptions(SliceAnimationWeights.ORIGIN_FREE_WEIGHT_TYPES);

    let playback = $state(true);

    let src = $state(knight);
    let lineCount = $state(ScanlineAnimationKnobs.STARTING_LINE_COUNT);
    let orientation = $state<ScanlineAnimationOrientation>(SCANLINE_ANIMATION_DEFAULTS.orientation);
    let animationDurationMs = $state(ScanlineAnimationKnobs.STARTING_DURATION_MS);
    let animationIterationDelayMs = $state(ScanlineAnimationKnobs.STARTING_ITERATION_DELAY_MS);
    let weightType = $state<SliceAnimationWeights.OriginFreeWeightType>(ScanlineAnimationKnobs.STARTING_WEIGHT_TYPE);

    const handleFile = (file: File) => {
        src = URL.createObjectURL(file);
    };

    const commonProps: Omit<ScanlineAnimationExampleProps, "playback"> = $derived({
        src,
        lineCount,
        orientation,
        weightType,
        animationDurationMs,
        animationIterationDelayMs,
    });

    const examples: ExampleDefs[] = [
        {
            key: "glitch",
            name: EXAMPLE_NAMES.glitch,
            component: glitchExample,
            path: `${EXAMPLES_ROOT}/Glitch.svelte`,
        },
        {
            key: "surge",
            name: EXAMPLE_NAMES.surge,
            component: surgeExample,
            path: `${EXAMPLES_ROOT}/Surge.svelte`,
        },
        {
            key: "snake",
            name: EXAMPLE_NAMES.snake,
            component: snakeExample,
            path: `${EXAMPLES_ROOT}/Snake.svelte`,
        },
        {
            key: "split",
            name: EXAMPLE_NAMES.split,
            component: splitExample,
            path: `${EXAMPLES_ROOT}/Split.svelte`,
        },
        {
            key: "brightness",
            name: EXAMPLE_NAMES.brightness,
            component: brightnessExample,
            path: `${EXAMPLES_ROOT}/Brightness.svelte`,
        },
        {
            key: "grayscale",
            name: EXAMPLE_NAMES.grayscale,
            component: grayscaleExample,
            path: `${EXAMPLES_ROOT}/Grayscale.svelte`,
        },
        {
            key: "hue",
            name: EXAMPLE_NAMES.hue,
            component: hueExample,
            path: `${EXAMPLES_ROOT}/Hue.svelte`,
        },
        {
            key: "_wave",
            name: EXAMPLE_NAMES._wave,
            component: waveExample,
            path: `${EXAMPLES_ROOT}/_Wave.svelte`,
        },
        {
            key: "_roll",
            name: EXAMPLE_NAMES._roll,
            component: rollExample,
            path: `${EXAMPLES_ROOT}/_Roll.svelte`,
        },
        {
            key: "_dropout",
            name: EXAMPLE_NAMES._dropout,
            component: dropoutExample,
            path: `${EXAMPLES_ROOT}/_Dropout.svelte`,
        },
        {
            key: "_interlace",
            name: EXAMPLE_NAMES._interlace,
            component: interlaceExample,
            path: `${EXAMPLES_ROOT}/_Interlace.svelte`,
        },
        {
            key: "_skew",
            name: EXAMPLE_NAMES._skew,
            component: skewExample,
            path: `${EXAMPLES_ROOT}/_Skew.svelte`,
        },
        {
            key: "stressTest",
            name: EXAMPLE_NAMES.stressTest,
            component: stressTestExample,
        },
    ];
</script>

{#snippet glitchExample()}
    <GlitchExampleWrapper {...commonProps} isPagePlaying={playback} />
{/snippet}

{#snippet surgeExample()}
    <SurgeExampleWrapper {...commonProps} isPagePlaying={playback} />
{/snippet}

{#snippet snakeExample()}
    <SnakeExampleWrapper {...commonProps} isPagePlaying={playback} />
{/snippet}

{#snippet splitExample()}
    <SplitExampleWrapper {...commonProps} isPagePlaying={playback} />
{/snippet}

{#snippet brightnessExample()}
    <BrightnessExampleWrapper {...commonProps} isPagePlaying={playback} />
{/snippet}

{#snippet grayscaleExample()}
    <GrayscaleExampleWrapper {...commonProps} isPagePlaying={playback} />
{/snippet}

{#snippet hueExample()}
    <HueExampleWrapper {...commonProps} isPagePlaying={playback} />
{/snippet}

{#snippet waveExample()}
    <WaveExampleWrapper {...commonProps} isPagePlaying={playback} />
{/snippet}

{#snippet rollExample()}
    <RollExampleWrapper {...commonProps} isPagePlaying={playback} />
{/snippet}

{#snippet dropoutExample()}
    <DropoutExampleWrapper {...commonProps} isPagePlaying={playback} />
{/snippet}

{#snippet interlaceExample()}
    <InterlaceExampleWrapper {...commonProps} isPagePlaying={playback} />
{/snippet}

{#snippet skewExample()}
    <SkewExampleWrapper {...commonProps} isPagePlaying={playback} />
{/snippet}

{#snippet stressTestExample()}
    <StressTestWrapper {...commonProps} bind:playback />
{/snippet}

<div class={styles.root}>
    <PagePropsPanel scope={"global"}>
        <PageProp
            itemKey={"image"}
            controls={"Picks the example picture sent to ScanlineAnimationProps.src"}
            label={"Image"}
            hint={"Swaps in a picture of your own, so the sweep can be watched against something other than the sample."}
        >
            <PageFileField accept={"image/*"} ariaLabel={"Image"} onPick={handleFile} />
        </PageProp>

        <PageProp
            itemKey={"weightType"}
            controls={"Picks the example's weight function sent to ScanlineAnimationProps.computeSliceWeights"}
            label={"Weight"}
            hint={"How each line's turn is decided: its position, a wave, a random draw, and so on."}
        >
            <PageGroupedSelectField
                value={weightType}
                groups={GROUPPED_WEIGHTS}
                ariaLabel={"Weight"}
                onChange={(value) => {
                    weightType = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"lineCount"}
            controls={"Sets ScanlineAnimationProps.lineCount"}
            label={"Line count"}
            hint={"How many lines the picture is cut into. More lines is a finer sweep and more work per frame."}
        >
            <PageNumberField
                value={lineCount}
                min={ScanlineAnimationKnobs.MIN_LINE_COUNT}
                max={ScanlineAnimationKnobs.MAX_LINE_COUNT}
                step={ScanlineAnimationKnobs.LINE_COUNT_STEP}
                ariaLabel={"Line count"}
                onInput={(value) => {
                    lineCount = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"orientation"}
            controls={"Sets ScanlineAnimationProps.orientation"}
            label={"Orientation"}
            hint={"Which way the lines run: rows across the picture, or columns down it. The samples here were written for rows, so on columns they still push sideways and some read their place off the row."}
        >
            <PageSelectField
                value={orientation}
                values={SCANLINE_ANIMATION_ORIENTATIONS}
                ariaLabel={"Orientation"}
                onChange={(value) => {
                    orientation = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"animationDurationMs"}
            controls={"Sets ScanlineAnimationProps.animationDurationMs"}
            label={"Animation duration (ms)"}
            hint={"How long one sweep over the whole picture takes."}
        >
            <PageNumberField
                value={animationDurationMs}
                min={ScanlineAnimationKnobs.MIN_DURATION_MS}
                max={ScanlineAnimationKnobs.MAX_DURATION_MS}
                step={ScanlineAnimationKnobs.DURATION_STEP_MS}
                ariaLabel={"Animation duration"}
                onInput={(value) => {
                    animationDurationMs = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"animationIterationDelayMs"}
            controls={"Sets ScanlineAnimationProps.animationIterationDelayMs"}
            label={"Iteration delay (ms)"}
            hint={"How long the picture waits between one sweep and the next."}
        >
            <PageNumberField
                value={animationIterationDelayMs}
                min={ScanlineAnimationKnobs.MIN_ITERATION_DELAY_MS}
                max={ScanlineAnimationKnobs.MAX_DURATION_MS}
                step={ScanlineAnimationKnobs.DURATION_STEP_MS}
                ariaLabel={"Iteration delay"}
                onInput={(value) => {
                    animationIterationDelayMs = value;
                }}
            />
        </PageProp>
    </PagePropsPanel>

    <PageExamples items={examples} layout={"flow"} />
</div>
