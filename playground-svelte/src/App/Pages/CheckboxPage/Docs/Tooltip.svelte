<script lang="ts">
    import type { ShapeArrowAim } from "@thewaver/ss-utils";
    import { Checkbox } from "@thewaver/ss-components-svelte";

    import PageCheckboxContent from "../../../StyledComponents/CheckboxContent/CheckboxContent.svelte";
    import PageTooltipContent from "../../../StyledComponents/TooltipContent/TooltipContent.svelte";
    import type { CheckboxTooltipDocsExampleProps } from "../CheckboxPageSvelte.types";
    import { CHECKBOX_TOOLTIP_LABEL } from "@thewaver/ss-playground/App/Pages/CheckboxPage/CheckboxPage.const";

    type Props = CheckboxTooltipDocsExampleProps;

    let props: Props = $props();

    let checked = $state(true);
</script>

<Checkbox
    bind:checked
    ariaLabel={CHECKBOX_TOOLTIP_LABEL}
    isDisabled={props.isDisabled}
    isReachableWhenDisabled={props.isReachableWhenDisabled}
    tooltipDefs={{
        placement: { x: "center", y: "top_out" },
        offset: { x: 0, y: 10 },
        hoverShowDelayMs: 0,
        renderContent: tooltip,
    }}
>
    {#snippet renderContent(flags)}
        <PageCheckboxContent {flags}>{CHECKBOX_TOOLTIP_LABEL}</PageCheckboxContent>
    {/snippet}
</Checkbox>

{#snippet tooltip(visibilityTarget: 0 | 1, transitionDurationMs: number, _placement: unknown, _flags: unknown, arrowAim: ShapeArrowAim | undefined)}
    <PageTooltipContent {visibilityTarget} {transitionDurationMs} {arrowAim}>A tooltip on a checkbox.</PageTooltipContent>
{/snippet}
