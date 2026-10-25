<script lang="ts">
    import { Label, Radio, RadioGroup } from "@thewaver/ss-components-svelte";
    import type { PlanValue } from "@thewaver/ss-playground/App/Pages/LabelPage/LabelPage.types";

    import PageLabelCaption from "../../../StyledComponents/LabelCaption/LabelCaption.svelte";
    import PageRadioContent from "../../../StyledComponents/RadioContent/RadioContent.svelte";

    const GAP = 20;

    const PLAN_OPTIONS: { value: PlanValue; label: string }[] = [
        { value: "free", label: "Free" },
        { value: "pro", label: "Pro" },
    ];

    let value = $state<PlanValue>("free");
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
