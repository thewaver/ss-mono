<script lang="ts">
    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import DefaultExample from "./Examples/Default.svelte";
    import DestructiveConfirmationExample from "./Examples/DestructiveConfirmation.svelte";
    import LayeredExample from "./Examples/Layered.svelte";
    import TextOnlyExample from "./Examples/TextOnly.svelte";

    const EXAMPLES_ROOT = "/src/App/Pages/ModalPage/Examples";

    let modalVisibility = $state(false);
    let destructiveVisibility = $state(false);
    let layeredVisibility = $state(false);
    let layeredValue = $state<string | undefined>();
    let textOnlyVisibility = $state(false);

    let outcome = $state("nothing decided yet");

    const examples: ExampleDefs[] = [
        {
            key: "default",
            name: "Default",
            readout: () => `open: ${modalVisibility} — Escape and an overlay click both dismiss it`,
            component: defaultExample,
            path: `${EXAMPLES_ROOT}/Default.svelte`,
        },
        {
            key: "destructiveConfirmation",
            name: "Destructive confirmation",
            readout: () =>
                `open: ${destructiveVisibility} | outcome: ${outcome} — the alertdialog role, a required focus target, and neither overlay nor Escape dismissal`,
            component: destructiveConfirmationExample,
            path: `${EXAMPLES_ROOT}/DestructiveConfirmation.svelte`,
        },
        {
            key: "layered",
            name: "A popup inside it",
            readout: () =>
                `open: ${layeredVisibility} | country: ${layeredValue ?? "undefined"} — Escape closes the innermost layer only`,
            component: layeredExample,
            path: `${EXAMPLES_ROOT}/Layered.svelte`,
        },
        {
            key: "textOnly",
            name: "Nothing focusable inside",
            readout: () => `open: ${textOnlyVisibility} — with nothing to focus inside, the dialog takes focus itself`,
            component: textOnlyExample,
            path: `${EXAMPLES_ROOT}/TextOnly.svelte`,
        },
    ];
</script>

{#snippet defaultExample()}
    <DefaultExample bind:visibility={modalVisibility} />
{/snippet}

{#snippet destructiveConfirmationExample()}
    <DestructiveConfirmationExample
        bind:visibility={destructiveVisibility}
        onDecide={(next) => {
            outcome = next;
        }}
    />
{/snippet}

{#snippet layeredExample()}
    <LayeredExample bind:visibility={layeredVisibility} bind:value={layeredValue} />
{/snippet}

{#snippet textOnlyExample()}
    <TextOnlyExample bind:visibility={textOnlyVisibility} />
{/snippet}

<PageExamples items={examples} />
