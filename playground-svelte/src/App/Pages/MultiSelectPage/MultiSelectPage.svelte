<script lang="ts">
    import { SelectUtils } from "@thewaver/ss-components-svelte";

    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import { GROUPED_COUNTRIES } from "../SelectPage/SelectPage.const.svelte";
    import MultiSelectClearableExample from "./Examples/MultiSelectClearable.svelte";
    import MultiSelectCountriesExample from "./Examples/MultiSelectCountries.svelte";
    import MultiSelectGroupedExample from "./Examples/MultiSelectGrouped.svelte";

    const EXAMPLES_ROOT = "/src/App/Pages/MultiSelectPage/Examples";

    let countries = $state.raw<string[]>(["Denmark"]);
    let grouped = $state.raw<string[]>([]);
    let query = $state("");
    let clearable = $state.raw<string[]>(["Belgium", "Sweden"]);
    let clearableChange = $state("none yet");

    const filteredGroups = $derived.by(() => {
        const needle = query.toLocaleLowerCase();

        if (!needle) return GROUPED_COUNTRIES;

        return GROUPED_COUNTRIES.map((item) =>
            SelectUtils.getIsGroup(item)
                ? {
                      ...item,
                      options: item.options.filter((option) => option.value.toLocaleLowerCase().includes(needle)),
                  }
                : item,
        ).filter((item) =>
            SelectUtils.getIsGroup(item) ? item.options.length > 0 : item.value.toLocaleLowerCase().includes(needle),
        );
    });

    const examples: ExampleDefs[] = [
        {
            key: "multiSelect",
            name: "Many at once",
            readout: () => `values: [${countries.join(", ")}] — picking keeps the list open`,
            component: multiSelectExample,
            path: `${EXAMPLES_ROOT}/MultiSelectCountries.svelte`,
        },
        {
            key: "multiSelectGrouped",
            name: "Grouped, with a query",
            readout: () => `values: [${grouped.join(", ")}] | query: "${query}" — the page drops groups it has emptied`,
            component: multiSelectGroupedExample,
            path: `${EXAMPLES_ROOT}/MultiSelectGrouped.svelte`,
        },
        {
            key: "multiSelectClearable",
            name: "Clearable",
            readout: () =>
                `values: [${clearable.join(", ")}] | last change: ${clearableChange} — the clear control empties every pick at once`,
            component: multiSelectClearableExample,
            path: `${EXAMPLES_ROOT}/MultiSelectClearable.svelte`,
        },
    ];
</script>

{#snippet multiSelectExample()}
    <MultiSelectCountriesExample bind:values={countries} />
{/snippet}

{#snippet multiSelectGroupedExample()}
    <MultiSelectGroupedExample bind:values={grouped} bind:query options={filteredGroups} />
{/snippet}

{#snippet multiSelectClearableExample()}
    <MultiSelectClearableExample
        bind:values={clearable}
        onSelectionChange={(values) => {
            clearableChange = `[${values.join(", ")}]`;
        }}
    />
{/snippet}

<PageExamples items={examples} />
