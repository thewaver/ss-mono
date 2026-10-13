<script lang="ts">
    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import NestedExample from "./Examples/Nested.svelte";
    import SectionsExample from "./Examples/Sections.svelte";
    import { EXAMPLE_NAMES, EXAMPLES_ROOT } from "@thewaver/ss-playground/App/Pages/FormSectionPage/FormSectionPage.const";

    let email = $state("");
    let password = $state("");
    let confirm = $state("");

    let street = $state("");
    let card = $state("");

    let outcome = $state("not submitted");
    let nestedOutcome = $state("not submitted");

    const examples: ExampleDefs[] = [
        {
            key: "sections",
            name: EXAMPLE_NAMES.sections,
            readout: () =>
                `outcome: ${outcome} — each field reports to its own section, and the form hears one answer per section rather than one per field`,
            component: sectionsExample,
            path: `${EXAMPLES_ROOT}/Sections.svelte`,
        },
        {
            key: "nested",
            name: EXAMPLE_NAMES.nested,
            readout: () =>
                `outcome: ${nestedOutcome} — the payment section answers to the delivery section, which answers to the form, so the verdict travels up two levels rather than one`,
            component: nestedExample,
            path: `${EXAMPLES_ROOT}/Nested.svelte`,
        },
    ];
</script>

{#snippet sectionsExample()}
    <SectionsExample
        bind:email
        bind:password
        bind:confirm
        onSubmit={() => {
            outcome = `submitted as ${email}`;
        }}
        onReset={() => {
            outcome = "not submitted";
        }}
    />
{/snippet}

{#snippet nestedExample()}
    <NestedExample
        bind:street
        bind:card
        onSubmit={() => {
            nestedOutcome = "submitted";
        }}
    />
{/snippet}

<PageExamples items={examples} />
