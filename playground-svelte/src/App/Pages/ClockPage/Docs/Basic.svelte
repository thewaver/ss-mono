<script lang="ts">
    import { Clock } from "@thewaver/ss-components-svelte";
    import { LOCALE } from "@thewaver/ss-playground/App/Pages/DatePickerPage/DatePickerPage.const";
    import type { TimeValue } from "@thewaver/ss-utils";

    import PageClockColumn from "../../../StyledComponents/ClockContent/PageClockColumn.svelte";
    import PageClockFrame from "../../../StyledComponents/ClockContent/PageClockFrame.svelte";
    import PageClockOption from "../../../StyledComponents/ClockContent/PageClockOption.svelte";
    import PageClockUnit from "../../../StyledComponents/ClockContent/PageClockUnit.svelte";
    import type { ClockBasicDocsExampleProps } from "../ClockPageSvelte.types";

    type Props = ClockBasicDocsExampleProps;

    let props: Props = $props();

    let value = $state.raw<TimeValue | undefined>({ hour: 9, minute: 30 });
</script>

<PageClockFrame>
    <Clock
        bind:value
        locale={LOCALE}
        isDisabled={props.isDisabled}
        ariaLabel={"Appointment time"}
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
