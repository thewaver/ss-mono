<script lang="ts">
    import { Radio, RadioGroup } from "@thewaver/ss-components-svelte";
    import { SIZE_OPTIONS } from "@thewaver/ss-playground/App/Pages/RadioPage/RadioPage.const";
    import type { SizeValue } from "@thewaver/ss-playground/App/Pages/RadioPage/RadioPage.types";

    import PageRadioSegmentContent from "../../../StyledComponents/RadioSegmentContent/PageRadioSegmentContent.svelte";
    import PageRadioSegmentFloater from "../../../StyledComponents/RadioSegmentContent/PageRadioSegmentFloater.svelte";
    import PageRadioSegmentGroup from "../../../StyledComponents/RadioSegmentContent/PageRadioSegmentGroup.svelte";

    let value = $state<SizeValue>("medium");
</script>

<PageRadioSegmentGroup>
    <RadioGroup bind:value ariaLabel={"Size"} orientation={"horizontal"} gap={0}>
        {#snippet renderSelectionFloater(visibilityTarget, transitionDurationMs)}
            <PageRadioSegmentFloater {visibilityTarget} {transitionDurationMs} />
        {/snippet}

        {#each SIZE_OPTIONS as option (option.value)}
            <Radio value={option.value} ariaLabel={option.label}>
                {#snippet renderContent(flags)}
                    <PageRadioSegmentContent {flags}>{option.label}</PageRadioSegmentContent>
                {/snippet}
            </Radio>
        {/each}
    </RadioGroup>
</PageRadioSegmentGroup>
