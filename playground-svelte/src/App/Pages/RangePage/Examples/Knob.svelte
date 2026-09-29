<script lang="ts">
    import { Range, RangeUtils } from "@thewaver/ss-components-svelte";

    import PageRangeKnob from "../../../StyledComponents/RangeKnob/RangeKnob.svelte";
    import type { RangeExampleProps } from "../RangePage.types";

    const MIN = 0;
    const MAX = 100;
    const START_ANGLE = 135;
    const SWEEP_ANGLE = 270;
    const KNOB_TRAVEL = { min: MIN, max: MAX, startAngle: START_ANGLE, sweepAngle: SWEEP_ANGLE };

    type Props = RangeExampleProps;

    let { value = $bindable() }: Props = $props();
</script>

<Range
    bind:value
    min={MIN}
    max={MAX}
    ariaLabel={"Gain"}
    computeValueAtPoint={(point, rect) => RangeUtils.computeAngularValue(point, rect, KNOB_TRAVEL)}
>
    {#snippet renderContent(renderProps)}
        <PageRangeKnob {renderProps} startAngle={START_ANGLE} sweepAngle={SWEEP_ANGLE} />
    {/snippet}
</Range>
