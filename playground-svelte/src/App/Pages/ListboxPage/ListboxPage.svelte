<script lang="ts">
    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import CountriesExample from "./Examples/Countries.svelte";
    import GroupedExample from "./Examples/Grouped.svelte";
    import SizesExample from "./Examples/Sizes.svelte";

    const EXAMPLES_ROOT = "/src/App/Pages/ListboxPage/Examples";

    let single = $state<string | undefined>("Portugal");
    let multiple = $state.raw<string[]>(["Denmark"]);
    let size = $state<string | undefined>();

    const examples: ExampleDefs[] = [
        {
            key: "single",
            name: "One value",
            readout: () =>
                `value: ${single ?? "undefined"} — one tab stop; the arrows move focus between options and stop on Denmark and Finland, which hover explains`,
            component: singleExample,
            path: `${EXAMPLES_ROOT}/Countries.svelte`,
        },
        {
            key: "multiple",
            name: "Several values, in groups",
            readout: () =>
                `values: [${multiple.join(", ")}] — Enter or Space picks and drops, the arrows skip Finland and cross groups`,
            component: multipleExample,
            path: `${EXAMPLES_ROOT}/Grouped.svelte`,
        },
        {
            key: "horizontalRightToLeft",
            name: "Horizontal, right to left",
            readout: () =>
                `value: ${size ?? "undefined"} — the left arrow moves forward in a right-to-left page, and L is skipped`,
            component: sizesExample,
            path: `${EXAMPLES_ROOT}/Sizes.svelte`,
        },
    ];
</script>

{#snippet singleExample()}
    <CountriesExample bind:value={single} />
{/snippet}

{#snippet multipleExample()}
    <GroupedExample bind:values={multiple} />
{/snippet}

{#snippet sizesExample()}
    <SizesExample bind:value={size} />
{/snippet}

<PageExamples items={examples} />
