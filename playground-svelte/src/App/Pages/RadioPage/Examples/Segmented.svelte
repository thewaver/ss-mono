<script lang="ts">
    import { Radio, RadioGroup } from "@thewaver/ss-components-svelte";

    import PageRadioSegmentContent from "../../../StyledComponents/RadioSegmentContent/PageRadioSegmentContent.svelte";
    import PageRadioSegmentFloater from "../../../StyledComponents/RadioSegmentContent/PageRadioSegmentFloater.svelte";
    import PageRadioSegmentGroup from "../../../StyledComponents/RadioSegmentContent/PageRadioSegmentGroup.svelte";
    import { SIZE_OPTIONS } from "../RadioPage.const";
    import type { RadioExampleProps } from "../RadioPage.types";

    type Props = RadioExampleProps;

    let { value = $bindable() }: Props = $props();
</script>

<PageRadioSegmentGroup>
    <RadioGroup bind:value ariaLabel={"Segmented size"} orientation={"horizontal"} gap={0}>
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
