<script lang="ts">
    import { Radio, RadioGroup } from "@thewaver/ss-components-svelte";
    import { RADIO_GROUP_GAP, SIZE_OPTIONS } from "@thewaver/ss-playground/App/Pages/RadioPage/RadioPage.const";
    import type { SizeValue } from "@thewaver/ss-playground/App/Pages/RadioPage/RadioPage.types";

    import PageRadioContent from "../../../StyledComponents/RadioContent/RadioContent.svelte";
    import PageTooltipContent from "../../../StyledComponents/TooltipContent/TooltipContent.svelte";
    import type { RadioDisabledOptionDocsExampleProps } from "../RadioPageSvelte.types";

    const DISABLED_VALUE: SizeValue = "medium";

    type Props = RadioDisabledOptionDocsExampleProps;

    let props: Props = $props();

    let value = $state<SizeValue>("small");
</script>

<RadioGroup bind:value ariaLabel={"Size"} gap={RADIO_GROUP_GAP}>
    {#each SIZE_OPTIONS as option (option.value)}
        <Radio
            value={option.value}
            ariaLabel={option.label}
            isDisabled={option.value === DISABLED_VALUE}
            isReachableWhenDisabled={props.isReachableWhenDisabled}
            tooltipDefs={option.value === DISABLED_VALUE
                ? {
                      placement: { x: "center", y: "top_out" },
                      offset: { x: 0, y: 10 },
                      renderContent: tooltip,
                  }
                : undefined}
        >
            {#snippet renderContent(flags)}
                <PageRadioContent {flags}>{option.label}</PageRadioContent>
            {/snippet}
        </Radio>
    {/each}
</RadioGroup>

{#snippet tooltip(visibilityTarget: 0 | 1, transitionDurationMs: number)}
    <PageTooltipContent {visibilityTarget} {transitionDurationMs}>Out of stock in this size.</PageTooltipContent>
{/snippet}
