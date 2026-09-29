<script lang="ts">
    import {
        type AnchorPlacement,
        type BinarySwitchFlags,
        type InteractionFlags,
        Toggle,
    } from "@thewaver/ss-components-svelte";

    import PageControlRow from "../../../PageComponents/ControlRow/PageControlRow.svelte";
    import PageControlRowLabel from "../../../PageComponents/ControlRow/PageControlRowLabel.svelte";
    import PageToggleContent from "../../../StyledComponents/ToggleContent/ToggleContent.svelte";
    import PageTooltipContent from "../../../StyledComponents/TooltipContent/TooltipContent.svelte";
    import type { ToggleMixedExampleProps } from "../TogglePage.types";

    type Props = ToggleMixedExampleProps;

    let { all = $bindable(), firstChild = $bindable(), secondChild = $bindable(), ...props }: Props = $props();
</script>

<PageControlRow>
    <Toggle
        bind:checked={all}
        isMixed={props.isMixed}
        id={"allSettings"}
        ariaLabel={"All settings"}
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
            <PageToggleContent {flags} />
        {/snippet}
    </Toggle>

    <PageControlRowLabel>controls</PageControlRowLabel>

    <Toggle bind:checked={firstChild} id={"firstSetting"} ariaLabel={"First setting"}>
        {#snippet renderContent(flags)}
            <PageToggleContent {flags} />
        {/snippet}
    </Toggle>

    <Toggle bind:checked={secondChild} ariaLabel={"Second setting"}>
        {#snippet renderContent(flags)}
            <PageToggleContent {flags} />
        {/snippet}
    </Toggle>
</PageControlRow>

{#snippet tooltip(
    visibilityTarget: 0 | 1,
    transitionDurationMs: number,
    _placement: AnchorPlacement,
    flags: InteractionFlags<BinarySwitchFlags>,
)}
    <PageTooltipContent {visibilityTarget} {transitionDurationMs}>
        {`Mixed while the two toggles on the right disagree, and clicking it sets both. A switch cannot announce "mixed", so this control drops role="switch" and reads as a mixed checkbox exactly while mixed. checkedState: ${String(flags.checkedState)}.`}
    </PageTooltipContent>
{/snippet}
