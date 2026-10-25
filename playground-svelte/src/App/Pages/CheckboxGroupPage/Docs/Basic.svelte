<script lang="ts">
    import { Checkbox, CheckboxGroup } from "@thewaver/ss-components-svelte";
    import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
    import { GROUP_GAP, TOPPINGS } from "@thewaver/ss-playground/App/Pages/CheckboxGroupPage/CheckboxGroupPage.const";

    import PageCheckboxContent from "../../../StyledComponents/CheckboxContent/CheckboxContent.svelte";

    let value = $state.raw<string[]>(["cheese"]);
</script>

<CheckboxGroup bind:value ariaLabel={"Toppings"} orientation={"vertical"} gap={GROUP_GAP}>
    {#each TOPPINGS as topping (topping.value)}
        <Checkbox value={topping.value} ariaLabel={topping.label}>
            {#snippet renderContent(flags)}
                <PageCheckboxContent {flags}>{topping.label}</PageCheckboxContent>
            {/snippet}
        </Checkbox>
    {/each}
</CheckboxGroup>

<div class={exampleStyles.exampleReadout} data-readout>
    {`Value: ${value.length > 0 ? value.join(", ") : "none"}`}
</div>
