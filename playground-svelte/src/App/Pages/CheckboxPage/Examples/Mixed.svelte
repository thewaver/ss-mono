<script lang="ts">
    import type { AnchorPlacement, BinarySwitchFlags, InteractionFlags } from "@thewaver/ss-components-svelte";
    import { Checkbox } from "@thewaver/ss-components-svelte";

    import PageControlRow from "../../../PageComponents/ControlRow/PageControlRow.svelte";
    import PageControlRowLabel from "../../../PageComponents/ControlRow/PageControlRowLabel.svelte";
    import PageCheckboxContent from "../../../StyledComponents/CheckboxContent/CheckboxContent.svelte";
    import PageTooltipContent from "../../../StyledComponents/TooltipContent/TooltipContent.svelte";
    import type { CheckboxMixedExampleProps } from "../CheckboxPage.types";

    type Props = CheckboxMixedExampleProps;

    let { all = $bindable(), firstChild = $bindable(), secondChild = $bindable(), ...props }: Props = $props();
</script>

<PageControlRow>
    <Checkbox
        bind:checked={all}
        isMixed={props.isMixed}
        id={"selectAll"}
        ariaLabel={"Select all"}
        tooltipDefs={{
            placement: { x: "center", y: "top-out" },
            offset: { x: 0, y: 10 },
            renderContent: tooltip,
        }}
        onChange={(isChecked) => {
            firstChild = isChecked;
            secondChild = isChecked;
        }}
    >
        {#snippet renderContent(flags)}
            <PageCheckboxContent {flags} />
        {/snippet}
    </Checkbox>

    <PageControlRowLabel>controls</PageControlRowLabel>

    <Checkbox bind:checked={firstChild} id={"firstChild"} ariaLabel={"First child"}>
        {#snippet renderContent(flags)}
            <PageCheckboxContent {flags} />
        {/snippet}
    </Checkbox>

    <Checkbox bind:checked={secondChild} ariaLabel={"Second child"}>
        {#snippet renderContent(flags)}
            <PageCheckboxContent {flags} />
        {/snippet}
    </Checkbox>
</PageControlRow>

{#snippet tooltip(
    visibilityTarget: 0 | 1,
    transitionDurationMs: number,
    _placement: AnchorPlacement,
    flags: InteractionFlags<BinarySwitchFlags>,
)}
    <PageTooltipContent {visibilityTarget} {transitionDurationMs}>
        {`Summarizes the two boxes on the right. It reads mixed whenever they disagree, and clicking it sets both. checkedState: ${String(flags.checkedState)}.`}
    </PageTooltipContent>
{/snippet}
