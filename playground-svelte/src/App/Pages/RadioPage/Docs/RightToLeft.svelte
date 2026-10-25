<script lang="ts">
    import { Radio, RadioGroup } from "@thewaver/ss-components-svelte";
    import { RADIO_GROUP_GAP, SIZE_OPTIONS } from "@thewaver/ss-playground/App/Pages/RadioPage/RadioPage.const";
    import type { SizeValue } from "@thewaver/ss-playground/App/Pages/RadioPage/RadioPage.types";

    import PageRadioContent from "../../../StyledComponents/RadioContent/RadioContent.svelte";

    let value = $state<SizeValue>();
</script>

<div dir={"rtl"}>
    <RadioGroup bind:value ariaLabel={"Size"} gap={RADIO_GROUP_GAP}>
        {#each SIZE_OPTIONS as option (option.value)}
            <Radio value={option.value} ariaLabel={option.label}>
                {#snippet renderContent(flags)}
                    <PageRadioContent {flags}>{option.label}</PageRadioContent>
                {/snippet}
            </Radio>
        {/each}
    </RadioGroup>
</div>
