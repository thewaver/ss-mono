<script lang="ts">
    import { Radio, RadioGroup } from "@thewaver/ss-components-svelte";

    import PageRadioContent from "../../../StyledComponents/RadioContent/RadioContent.svelte";
    import { RADIO_GROUP_GAP, SIZE_OPTIONS } from "../RadioPage.const";
    import type { RadioExampleProps } from "../RadioPage.types";

    type Props = RadioExampleProps;

    let { value = $bindable() }: Props = $props();
</script>

<RadioGroup bind:value ariaLabel={"Disabled size"} gap={RADIO_GROUP_GAP}>
    {#each SIZE_OPTIONS as option (option.value)}
        <Radio value={option.value} ariaLabel={option.label} isDisabled={true}>
            {#snippet renderContent(flags)}
                <PageRadioContent {flags}>{option.label}</PageRadioContent>
            {/snippet}
        </Radio>
    {/each}
</RadioGroup>
