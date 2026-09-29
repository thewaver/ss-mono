<script lang="ts">
    import { Radio, RadioGroup } from "@thewaver/ss-components-svelte";

    import PageRadioContent from "../../../StyledComponents/RadioContent/RadioContent.svelte";
    import { RADIO_GROUP_GAP, SIZE_OPTIONS } from "../RadioPage.const";
    import type { RadioOptionalExampleProps } from "../RadioPage.types";

    type Props = RadioOptionalExampleProps;

    let { value = $bindable() }: Props = $props();

    const hasError = $derived(value === undefined);
</script>

<RadioGroup bind:value ariaLabel={"Required size"} gap={RADIO_GROUP_GAP} {hasError}>
    {#each SIZE_OPTIONS as option (option.value)}
        <Radio value={option.value} ariaLabel={option.label} {hasError}>
            {#snippet renderContent(flags)}
                <PageRadioContent {flags}>{option.label}</PageRadioContent>
            {/snippet}
        </Radio>
    {/each}
</RadioGroup>
