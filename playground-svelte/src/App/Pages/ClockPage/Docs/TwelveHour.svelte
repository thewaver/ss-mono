<script lang="ts">
    import { Clock } from "@thewaver/ss-components-svelte";
    import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
    import { LOCALE } from "@thewaver/ss-playground/App/Pages/DatePickerPage/DatePickerPage.const";
    import { TimeUtils } from "@thewaver/ss-utils";
    import type { TimeValue } from "@thewaver/ss-utils";

    import PageClockColumn from "../../../StyledComponents/ClockContent/PageClockColumn.svelte";
    import PageClockFrame from "../../../StyledComponents/ClockContent/PageClockFrame.svelte";
    import PageClockOption from "../../../StyledComponents/ClockContent/PageClockOption.svelte";
    import PageClockUnit from "../../../StyledComponents/ClockContent/PageClockUnit.svelte";
    import type { ClockTwelveHourDocsExampleProps } from "../ClockPageSvelte.types";

    type Props = ClockTwelveHourDocsExampleProps;

    let props: Props = $props();

    let value = $state.raw<TimeValue | undefined>({ hour: 14, minute: 30 });

    const valueText = $derived(value ? TimeUtils.toIso(value) : "nothing");
</script>

<PageClockFrame>
    <Clock
        bind:value
        locale={LOCALE}
        isTwelveHour={props.isTwelveHour}
        ariaLabel={"Call time"}
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

<div class={exampleStyles.exampleReadout} data-readout>{`Value: ${valueText}`}</div>
