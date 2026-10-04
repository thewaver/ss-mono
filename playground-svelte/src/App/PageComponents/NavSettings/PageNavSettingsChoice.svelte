<script lang="ts" generics="T">
    import { Radio, RadioGroup } from "@thewaver/ss-components-svelte";

    import PageRadioSegmentContent from "../../StyledComponents/RadioSegmentContent/PageRadioSegmentContent.svelte";
    import PageRadioSegmentFloater from "../../StyledComponents/RadioSegmentContent/PageRadioSegmentFloater.svelte";
    import PageRadioSegmentGroup from "../../StyledComponents/RadioSegmentContent/PageRadioSegmentGroup.svelte";
    import type { PageNavSettingsChoiceProps } from "./NavSettings.types";

    let { value = $bindable(), ...props }: PageNavSettingsChoiceProps<T> = $props();
</script>

<PageRadioSegmentGroup>
    <RadioGroup bind:value ariaLabel={props.ariaLabel} orientation={"horizontal"} gap={0}>
        {#snippet renderSelectionFloater(visibilityTarget, transitionDurationMs)}
            <PageRadioSegmentFloater {visibilityTarget} {transitionDurationMs} />
        {/snippet}

        {#each props.options as option (option.label)}
            <Radio value={option.value} ariaLabel={option.label}>
                {#snippet renderContent(flags)}
                    <PageRadioSegmentContent {flags}>{option.label}</PageRadioSegmentContent>
                {/snippet}
            </Radio>
        {/each}
    </RadioGroup>
</PageRadioSegmentGroup>
