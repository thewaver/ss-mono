<script lang="ts">
    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import DefaultExample from "./Examples/Default.svelte";
    import SelectAllExample from "./Examples/SelectAll.svelte";
    import {
    EXAMPLE_NAMES,
    EXAMPLES_ROOT,
} from "@thewaver/ss-playground/App/Pages/CheckboxGroupPage/CheckboxGroupPage.const";

    const describe = (values: string[]) => (values.length > 0 ? values.join(", ") : "none");

    let defaultValue = $state.raw<string[]>(["cheese"]);
    let selectAllValue = $state.raw<string[]>(["cheese", "olives"]);

    const examples: ExampleDefs[] = [
        {
            key: "default",
            name: EXAMPLE_NAMES.default,
            readout: () => `value: ${describe(defaultValue)} — one list, and each box is its own tab stop`,
            component: defaultExample,
            path: `${EXAMPLES_ROOT}/Default.svelte`,
        },
        {
            key: "selectAll",
            name: EXAMPLE_NAMES.selectAll,
            readout: () =>
                `value: ${describe(selectAllValue)} — the top box reads mixed while the toppings disagree, and pressing it ticks or clears every one still on sale`,
            component: selectAllExample,
            path: `${EXAMPLES_ROOT}/SelectAll.svelte`,
        },
    ];
</script>

{#snippet defaultExample()}
    <DefaultExample bind:value={defaultValue} />
{/snippet}

{#snippet selectAllExample()}
    <SelectAllExample bind:value={selectAllValue} />
{/snippet}

<PageExamples items={examples} />
