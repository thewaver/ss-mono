<script lang="ts">
    import { untrack } from "svelte";

    import { watchChange } from "@thewaver/ss-components-svelte";
    import { InfiniteCorridorKnobs } from "@thewaver/ss-playground/App/Knobs/InfiniteCorridors.const";
    import { FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/InfiniteCorridorPage/InfiniteCorridorPage.const";

    import PageExampleKnobs from "../../PageComponents/ExampleKnobs/PageExampleKnobs.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import ClockExample from "./Examples/Clock.svelte";
    import type { InfiniteCorridorExampleProps } from "./InfiniteCorridorPageSvelte.types";

    let { startingLapMs, ...props }: InfiniteCorridorExampleProps & { startingLapMs: number } = $props();

    let lapMs = $state(untrack(() => startingLapMs));

    watchChange(
        () => startingLapMs,
        (next) => {
            lapMs = next;
        },
    );
</script>

<ClockExample {...props} {lapMs} />

<PageExampleKnobs>
    <PageProp
        itemKey={"lapMs"}
        controls={"Sets how fast the example clock advances InfiniteCorridorProps.progress"}
        label={"Lap (ms)"}
        hint={"How long the clock takes to walk the whole corridor once, past every room and back to the first."}
    >
        <PageNumberField
            value={lapMs}
            resetValue={startingLapMs}
            min={InfiniteCorridorKnobs.MIN_LAP_MS}
            max={InfiniteCorridorKnobs.MAX_LAP_MS}
            step={InfiniteCorridorKnobs.LAP_STEP_MS}
            width={FIELD_WIDTH}
            ariaLabel={"Lap duration in milliseconds"}
            onInput={(value) => {
                lapMs = value;
            }}
        />
    </PageProp>
</PageExampleKnobs>
