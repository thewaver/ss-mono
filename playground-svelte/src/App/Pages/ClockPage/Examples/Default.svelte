<script lang="ts">
    import { Clock } from "@thewaver/ss-components-svelte";
    import type { ClockSteps } from "@thewaver/ss-components-svelte";
    import { LOCALE } from "@thewaver/ss-playground/App/Pages/DatePickerPage/DatePickerPage.const";
    import type { TimeValue } from "@thewaver/ss-utils";

    import PageClockColumn from "../../../StyledComponents/ClockContent/PageClockColumn.svelte";
    import PageClockFrame from "../../../StyledComponents/ClockContent/PageClockFrame.svelte";
    import PageClockOption from "../../../StyledComponents/ClockContent/PageClockOption.svelte";
    import PageClockUnit from "../../../StyledComponents/ClockContent/PageClockUnit.svelte";

    type Props = {
        value: TimeValue | undefined;
        ariaLabel: string;
        isTwelveHour?: boolean;
        hasSeconds?: boolean;
        steps?: ClockSteps;
        minValue?: TimeValue;
        maxValue?: TimeValue;
    };

    let { value = $bindable(), ...props }: Props = $props();
</script>

<PageClockFrame>
    <Clock
        bind:value
        locale={LOCALE}
        ariaLabel={props.ariaLabel}
        isTwelveHour={props.isTwelveHour}
        hasSeconds={props.hasSeconds}
        steps={props.steps}
        minValue={props.minValue}
        maxValue={props.maxValue}
    >
        {#snippet renderOption(_unused, renderProps)}
            <PageClockOption {renderProps} />
        {/snippet}

        {#snippet renderUnit(name)}
            <PageClockUnit>{name}</PageClockUnit>
        {/snippet}

        {#snippet renderColumn(renderOptions)}
            <PageClockColumn>{@render renderOptions()}</PageClockColumn>
        {/snippet}
    </Clock>
</PageClockFrame>
