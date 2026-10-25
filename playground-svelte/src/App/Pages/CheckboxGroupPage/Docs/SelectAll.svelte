<script lang="ts">
    import type { CheckboxGroupController } from "@thewaver/ss-components-svelte";
    import { Checkbox, CheckboxGroup } from "@thewaver/ss-components-svelte";
    import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
    import {
        GROUP_GAP,
        TOPPINGS_WITH_SOLD_OUT,
    } from "@thewaver/ss-playground/App/Pages/CheckboxGroupPage/CheckboxGroupPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/CheckboxGroupPage/CheckboxGroupPage.css";

    import PageCheckboxContent from "../../../StyledComponents/CheckboxContent/CheckboxContent.svelte";

    let value = $state.raw<string[]>(["cheese", "olives"]);
    let group = $state.raw<CheckboxGroupController>();

    const parentState = $derived(group?.getCheckedState() ?? false);
</script>

<div class={styles.column}>
    <Checkbox
        id={"allToppings"}
        bind:checked={
            () => parentState === true,
            (isChecked) => {
                group?.setIsEveryChecked(isChecked);
            }
        }
        isMixed={parentState === "mixed"}
        ariaLabel={"All toppings"}
    >
        {#snippet renderContent(flags)}
            <PageCheckboxContent {flags}>All toppings</PageCheckboxContent>
        {/snippet}
    </Checkbox>

    <div class={styles.members}>
        <CheckboxGroup
            bind:value
            ariaLabel={"Toppings"}
            orientation={"vertical"}
            gap={GROUP_GAP}
            onMount={(controller) => {
                group = controller;
            }}
        >
            {#each TOPPINGS_WITH_SOLD_OUT as topping (topping.value)}
                <Checkbox value={topping.value} isDisabled={topping.isSoldOut ?? false} ariaLabel={topping.label}>
                    {#snippet renderContent(flags)}
                        <PageCheckboxContent {flags}>{topping.label}</PageCheckboxContent>
                    {/snippet}
                </Checkbox>
            {/each}
        </CheckboxGroup>
    </div>
</div>

<div class={exampleStyles.exampleReadout} data-readout>
    {`Value: ${value.length > 0 ? value.join(", ") : "none"}`}
</div>
