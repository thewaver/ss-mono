<script lang="ts">
    import { Label, Radio, RadioGroup } from "@thewaver/ss-components-svelte";

    import PageLabelCaption from "../../../StyledComponents/LabelCaption/LabelCaption.svelte";
    import PageRadioContent from "../../../StyledComponents/RadioContent/RadioContent.svelte";
    import type { LabelRadioExampleProps, PlanValue } from "../LabelPage.types";

    const GAP = 20;

    const PLAN_OPTIONS: { value: PlanValue; label: string }[] = [
        { value: "free", label: "Free" },
        { value: "pro", label: "Pro" },
    ];

    type Props = LabelRadioExampleProps;

    let { value = $bindable() }: Props = $props();
</script>

<RadioGroup bind:value ariaLabel={"Plan"} gap={GAP}>
    {#each PLAN_OPTIONS as option (option.value)}
        <Label>
            <Radio value={option.value}>
                {#snippet renderContent(flags)}
                    <PageRadioContent {flags} />
                {/snippet}
            </Radio>

            <PageLabelCaption>{option.label}</PageLabelCaption>
        </Label>
    {/each}
</RadioGroup>
