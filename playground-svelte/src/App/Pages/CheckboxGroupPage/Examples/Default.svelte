<script lang="ts">
    import { Checkbox, CheckboxGroup, Label } from "@thewaver/ss-components-svelte";
    import { GROUP_GAP, TOPPINGS } from "@thewaver/ss-playground/App/Pages/CheckboxGroupPage/CheckboxGroupPage.const";

    import PageCheckboxContent from "../../../StyledComponents/CheckboxContent/CheckboxContent.svelte";
    import PageLabelCaption from "../../../StyledComponents/LabelCaption/LabelCaption.svelte";
    import type { CheckboxGroupExampleProps } from "../CheckboxGroupPage.types";

    type Props = CheckboxGroupExampleProps;

    let { value = $bindable() }: Props = $props();
</script>

<CheckboxGroup bind:value ariaLabel={"Toppings"} orientation={"vertical"} gap={GROUP_GAP}>
    {#each TOPPINGS as topping (topping.value)}
        <Label>
            <Checkbox value={topping.value}>
                {#snippet renderContent(flags)}
                    <PageCheckboxContent {flags} />
                {/snippet}
            </Checkbox>

            <PageLabelCaption>{topping.label}</PageLabelCaption>
        </Label>
    {/each}
</CheckboxGroup>
