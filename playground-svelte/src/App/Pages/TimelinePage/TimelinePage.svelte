<script lang="ts">
    import { Button } from "@thewaver/ss-components-svelte";
    import { TimelineKnobs } from "@thewaver/ss-playground/App/Knobs/Timelines.const";
    import type { Clip } from "@thewaver/ss-playground/App/Pages/TimelinePage/TimelineItems.types";
    import {
        DAY,
        REEL,
        TRIM_CLIPS,
        formatClock,
        formatStopwatch,
    } from "@thewaver/ss-playground/App/Pages/TimelinePage/TimelinePage.const";

    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import PageCheckField from "../../PageComponents/Field/PageCheckField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.svelte";
    import PageButtonContent from "../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import MeetingsExample from "./Examples/Meetings.svelte";
    import TracksExample from "./Examples/Tracks.svelte";
    import TrimExample from "./Examples/Trim.svelte";
    import type { TimelineExampleProps } from "./TimelinePage.types";

    const EXAMPLES_ROOT = "/src/App/Pages/TimelinePage/Examples";

    let isPannable = $state(TimelineKnobs.STARTING_IS_PANNABLE);
    let isZoomable = $state(TimelineKnobs.STARTING_IS_ZOOMABLE);
    let isDisabled = $state(TimelineKnobs.STARTING_IS_DISABLED);
    let picked = $state("nothing yet");

    let day = $state.raw(DAY);
    let reel = $state.raw(REEL);
    let trimReel = $state.raw(REEL);
    let trimClips = $state.raw(TRIM_CLIPS);
    let trimmed = $state.raw<Clip>();

    const reset = () => {
        day = DAY;
        reel = REEL;
        trimReel = REEL;
        trimClips = TRIM_CLIPS;
        trimmed = undefined;
        picked = "nothing yet";
    };

    const trimReadout = $derived(
        trimmed === undefined
            ? "nothing trimmed yet"
            : `${trimmed.name} now runs ${formatStopwatch(trimmed.from)} to ${formatStopwatch(trimmed.to)}`,
    );

    const commonProps: Omit<TimelineExampleProps, "view"> = $derived({
        isPannable,
        isZoomable,
        isDisabled,
        onPick: (name: string) => {
            picked = name;
        },
    });

    const examples: ExampleDefs[] = [
        {
            key: "meetings",
            name: "A day of meetings",
            readout: () =>
                `showing ${formatClock(day.start)} to ${formatClock(day.end)} — the lanes are the component's own answer to what overlaps, and it takes the gestures itself: the wheel zooms where the pointer is, a drag moves the window, and a press that never travels still picks the meeting under it. The red line is a marker at the time on this computer's clock, and it is only drawn while that time is inside the day shown`,
            component: meetingsExample,
            path: `${EXAMPLES_ROOT}/Meetings.svelte`,
        },
        {
            key: "tracks",
            name: "Three tracks",
            readout: () =>
                `showing ${formatStopwatch(reel.start)} to ${formatStopwatch(reel.end)} — here the page says which lane each clip belongs to, and the buttons are the route for anyone who cannot drag or pinch. The orange line is a marker the page moves while it plays`,
            component: tracksExample,
            path: `${EXAMPLES_ROOT}/Tracks.svelte`,
        },
        {
            key: "trim",
            name: "Trimming clips",
            readout: () =>
                `${trimReadout} — drag either end of a clip, or press an end and then press where it should go; from the keyboard, Enter takes hold of a clip's end, Home and End switch ends, the arrows move it a second at a time, Enter drops it and Escape puts it back`,
            component: trimExample,
            path: `${EXAMPLES_ROOT}/Trim.svelte`,
        },
    ];
</script>

{#snippet meetingsExample()}
    <MeetingsExample {...commonProps} bind:view={day} />
{/snippet}

{#snippet tracksExample()}
    <TracksExample {...commonProps} bind:view={reel} />
{/snippet}

{#snippet trimExample()}
    <TrimExample
        {...commonProps}
        bind:view={trimReel}
        bind:clips={trimClips}
        onTrim={(clip) => {
            trimmed = clip;
        }}
    />
{/snippet}

<PagePropsPanel scope={"global"}>
    <PageProp
        itemKey={"isPannable"}
        label={"Drag to move"}
        hint={"Lets the timeline be dragged sideways to move through it."}
    >
        <PageCheckField
            value={isPannable}
            ariaLabel={"Drag to move"}
            onChange={(value) => {
                isPannable = value;
            }}
        />
    </PageProp>

    <PageProp
        itemKey={"isZoomable"}
        label={"Wheel and pinch to zoom"}
        hint={"Lets the wheel and a pinch change how much of the timeline is in view."}
    >
        <PageCheckField
            value={isZoomable}
            ariaLabel={"Wheel and pinch to zoom"}
            onChange={(value) => {
                isZoomable = value;
            }}
        />
    </PageProp>

    <PageProp
        itemKey={"isDisabled"}
        label={"Disabled"}
        hint={"Turns the timeline off, so it neither pans, zooms nor picks."}
    >
        <PageCheckField
            value={isDisabled}
            ariaLabel={"Disabled"}
            onChange={(value) => {
                isDisabled = value;
            }}
        />
    </PageProp>

    <PageProp
        itemKey={"picked"}
        label={`Picked: ${picked}`}
        hint={"Puts the examples back to the item they started on, and clears whatever has been picked since."}
    >
        <Button
            onClick={async () => {
                reset();
            }}
        >
            {#snippet renderContent(flags)}
                <PageButtonContent {flags}>Reset</PageButtonContent>
            {/snippet}
        </Button>
    </PageProp>
</PagePropsPanel>

<PageExamples items={examples} minColumnWidth={520} />
