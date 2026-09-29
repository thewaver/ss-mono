<script lang="ts">
    import { Corners, Radio, RadioGroup } from "@thewaver/ss-components-svelte";

    import PageRadioContent from "../../../StyledComponents/RadioContent/RadioContent.svelte";
    import { RADIO_GROUP_GAP, SIZE_OPTIONS } from "../RadioPage.const";
    import type { RadioExampleProps } from "../RadioPage.types";

    const CORNER_LENGTH = { width: 8, height: 8 };
    const STROKE_THICKNESS = 2;

    type Props = RadioExampleProps;

    let { value = $bindable() }: Props = $props();
</script>

<RadioGroup bind:value ariaLabel={"Decorated size"} gap={RADIO_GROUP_GAP}>
    {#each SIZE_OPTIONS as option (option.value)}
        <Radio value={option.value} ariaLabel={option.label}>
            {#snippet renderContent(flags)}
                <PageRadioContent {flags}>{option.label}</PageRadioContent>
            {/snippet}

            {#snippet renderDecoration(flags)}
                <Corners
                    color={flags.checkedState === true ? "yellow" : "transparent"}
                    cornerLength={CORNER_LENGTH}
                    strokeThickness={STROKE_THICKNESS}
                />
            {/snippet}
        </Radio>
    {/each}
</RadioGroup>
