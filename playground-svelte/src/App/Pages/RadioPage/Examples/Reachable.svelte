<script lang="ts">
    import { Radio, RadioGroup } from "@thewaver/ss-components-svelte";

    import PageRadioContent from "../../../StyledComponents/RadioContent/RadioContent.svelte";
    import PageTooltipContent from "../../../StyledComponents/TooltipContent/TooltipContent.svelte";
    import { RADIO_GROUP_GAP, SIZE_OPTIONS } from "../RadioPage.const";
    import type { RadioExampleProps } from "../RadioPage.types";

    const REACHABLE_VALUE = "medium";

    type Props = RadioExampleProps;

    let { value = $bindable() }: Props = $props();
</script>

<RadioGroup bind:value ariaLabel={"Partly disabled size"} gap={RADIO_GROUP_GAP}>
    {#each SIZE_OPTIONS as option (option.value)}
        <Radio
            value={option.value}
            ariaLabel={option.label}
            isDisabled={option.value === REACHABLE_VALUE}
            isReachableWhenDisabled={option.value === REACHABLE_VALUE}
            tooltipDefs={option.value === REACHABLE_VALUE
                ? {
                      placement: { x: "center", y: "top-out" },
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
    <PageTooltipContent {visibilityTarget} {transitionDurationMs}>
        Arrow keys still land here so this tooltip can be read, but they must not select it and clicking must leave the
        value alone.
    </PageTooltipContent>
{/snippet}
