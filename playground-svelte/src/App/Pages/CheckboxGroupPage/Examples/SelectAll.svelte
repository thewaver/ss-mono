<script lang="ts">
    import type { CheckboxGroupController } from "@thewaver/ss-components-svelte";
    import { Checkbox, CheckboxGroup, Label } from "@thewaver/ss-components-svelte";
    import {
        GROUP_GAP,
        TOPPINGS_WITH_SOLD_OUT,
    } from "@thewaver/ss-playground/App/Pages/CheckboxGroupPage/CheckboxGroupPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/CheckboxGroupPage/CheckboxGroupPage.css";

    import PageCheckboxContent from "../../../StyledComponents/CheckboxContent/CheckboxContent.svelte";
    import PageLabelCaption from "../../../StyledComponents/LabelCaption/LabelCaption.svelte";
    import type { CheckboxGroupExampleProps } from "../CheckboxGroupPage.types";

    type Props = CheckboxGroupExampleProps;

    let { value = $bindable() }: Props = $props();

    let group = $state.raw<CheckboxGroupController>();

    const parentState = $derived(group?.getCheckedState() ?? false);
</script>

<div class={styles.column}>
    <Label>
        <Checkbox
            id={"allToppings"}
            bind:checked={
                () => parentState === true,
                (isChecked) => {
                    group?.setIsEveryChecked(isChecked);
                }
            }
            isMixed={parentState === "mixed"}
        >
            {#snippet renderContent(flags)}
                <PageCheckboxContent {flags} />
            {/snippet}
        </Checkbox>

        <PageLabelCaption>All toppings</PageLabelCaption>
    </Label>

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
                <Label>
                    <Checkbox value={topping.value} isDisabled={topping.isSoldOut ?? false}>
                        {#snippet renderContent(flags)}
                            <PageCheckboxContent {flags} />
                        {/snippet}
                    </Checkbox>

                    <PageLabelCaption>{topping.label}</PageLabelCaption>
                </Label>
            {/each}
        </CheckboxGroup>
    </div>
</div>
