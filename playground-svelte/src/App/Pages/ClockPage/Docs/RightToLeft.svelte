<script lang="ts">
    import { Clock } from "@thewaver/ss-components-svelte";
    import { LOCALE } from "@thewaver/ss-playground/App/Pages/DatePickerPage/DatePickerPage.const";
    import type { TimeValue } from "@thewaver/ss-utils";

    import PageClockColumn from "../../../StyledComponents/ClockContent/PageClockColumn.svelte";
    import PageClockFrame from "../../../StyledComponents/ClockContent/PageClockFrame.svelte";
    import PageClockOption from "../../../StyledComponents/ClockContent/PageClockOption.svelte";
    import PageClockUnit from "../../../StyledComponents/ClockContent/PageClockUnit.svelte";
    import { TIME_RIGHT_LEFT_BOX_LABEL } from "@thewaver/ss-playground/App/Pages/ClockPage/ClockPage.const";

    let value = $state.raw<TimeValue | undefined>({ hour: 9, minute: 30 });
</script>

<div dir={"rtl"}>
    <PageClockFrame>
        <Clock
            bind:value
            locale={LOCALE}
            ariaLabel={TIME_RIGHT_LEFT_BOX_LABEL}
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
</div>
