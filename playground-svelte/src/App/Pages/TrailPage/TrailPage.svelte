<script lang="ts">
    import { MediaQueryMonitorSvelteUtils, TRAIL_DEFAULTS } from "@thewaver/ss-components-svelte";
    import { TrailKnobs } from "@thewaver/ss-playground/App/Knobs/Trails.const";

    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import PageCheckField from "../../PageComponents/Field/PageCheckField.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.svelte";
    import CircuitExample from "./Examples/Circuit.svelte";
    import ConvoyExample from "./Examples/Convoy.svelte";
    import ScrollExample from "./Examples/Scroll.svelte";
    import TimelineExample from "./Examples/Timeline.svelte";
    import type { TrailExampleProps } from "./TrailPage.types";

    const EXAMPLES_ROOT = "/src/App/Pages/TrailPage/Examples";

    const PERCENT = 100;
    const HALF_WAY = 0.5;

    let durationMs = $state(TRAIL_DEFAULTS.durationMs);
    let isLooping = $state(TrailKnobs.STARTING_IS_LOOPING);
    let isTurning = $state(TrailKnobs.STARTING_IS_TURNING);

    const getPrefersReducedMotion = MediaQueryMonitorSvelteUtils.createReducedMotion();

    let circuitProgress = $state(0);
    let circuitPlaying = $state(!getPrefersReducedMotion());
    let timelineProgress = $state(HALF_WAY);
    let timelinePlaying = $state(false);
    let convoyProgress = $state(0);
    let convoyPlaying = $state(!getPrefersReducedMotion());
    let scrollProgress = $state(0);

    const getPercent = (progress: number) => `${Math.round(progress * PERCENT)}%`;

    const commonProps: Omit<TrailExampleProps, "progress" | "playback"> = $derived({
        durationMs,
        isLooping,
        isTurning,
    });

    const examples: ExampleDefs[] = [
        {
            key: "circuit",
            name: "Circuit",
            readout: () =>
                `${getPercent(circuitProgress)} round the loop, ${circuitPlaying ? "running" : "stopped"} — the playback signal starts and stops it, and the controller sends it back to the start`,
            component: circuitExample,
            path: `${EXAMPLES_ROOT}/Circuit.svelte`,
        },
        {
            key: "timeline",
            name: "Timeline",
            readout: () =>
                `${getPercent(timelineProgress)} along the path — nothing is running, the slider is what puts the marker there`,
            component: timelineExample,
            path: `${EXAMPLES_ROOT}/Timeline.svelte`,
        },
        {
            key: "convoy",
            name: "Convoy",
            readout: () =>
                `${getPercent(convoyProgress)} of the run, ${convoyPlaying ? "running" : "stopped"} — four travelers on one clock, each a share of the path behind the one in front; with looping off they wait at the start and the run ends when the last one arrives`,
            component: convoyExample,
            path: `${EXAMPLES_ROOT}/Convoy.svelte`,
        },
        {
            key: "scroll",
            name: "Driven by scrolling",
            readout: () =>
                getPrefersReducedMotion()
                    ? "reduced motion is on, so the marker stays at the start instead of following the scroll"
                    : `${getPercent(scrollProgress)} of the way through the box — nothing is running, scrolling the box is what moves the marker`,
            component: scrollExample,
            path: `${EXAMPLES_ROOT}/Scroll.svelte`,
        },
    ];
</script>

{#snippet circuitExample()}
    <CircuitExample {...commonProps} bind:progress={circuitProgress} bind:playback={circuitPlaying} />
{/snippet}

{#snippet timelineExample()}
    <TimelineExample {...commonProps} bind:progress={timelineProgress} bind:playback={timelinePlaying} />
{/snippet}

{#snippet convoyExample()}
    <ConvoyExample {...commonProps} bind:progress={convoyProgress} bind:playback={convoyPlaying} />
{/snippet}

{#snippet scrollExample()}
    <ScrollExample
        {...commonProps}
        isFollowing={!getPrefersReducedMotion()}
        onProgressChange={(progress) => {
            scrollProgress = progress;
        }}
    />
{/snippet}

<PagePropsPanel scope={"global"}>
    <PageProp
        itemKey={"durationMs"}
        label={"Lap duration (ms)"}
        hint={"How long the traveler takes to walk the path once, end to end."}
    >
        <PageNumberField
            value={durationMs}
            min={TrailKnobs.MIN_DURATION_MS}
            max={TrailKnobs.MAX_DURATION_MS}
            step={TrailKnobs.DURATION_STEP_MS}
            ariaLabel={"Lap duration in milliseconds"}
            onInput={(value) => {
                durationMs = value;
            }}
        />
    </PageProp>

    <PageProp
        itemKey={"isLooping"}
        label={"Loops"}
        hint={"Sends the traveler round again as soon as it reaches the end, instead of stopping there."}
    >
        <PageCheckField
            value={isLooping}
            ariaLabel={"Loops"}
            onChange={(value) => {
                isLooping = value;
            }}
        />
    </PageProp>

    <PageProp
        itemKey={"isTurning"}
        label={"Faces along the path"}
        hint={"Turns the traveler to point the way it is going, instead of leaving it upright the whole way round."}
    >
        <PageCheckField
            value={isTurning}
            ariaLabel={"Faces along the path"}
            onChange={(value) => {
                isTurning = value;
            }}
        />
    </PageProp>
</PagePropsPanel>

<PageExamples items={examples} layout={"flow"} />
