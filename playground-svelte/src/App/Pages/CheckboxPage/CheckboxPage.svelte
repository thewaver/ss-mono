<script lang="ts">
    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import DecoratedExample from "./Examples/Decorated.svelte";
    import DefaultExample from "./Examples/Default.svelte";
    import DisabledExample from "./Examples/Disabled.svelte";
    import ErroredExample from "./Examples/Errored.svelte";
    import MixedExample from "./Examples/Mixed.svelte";
    import ReachableExample from "./Examples/Reachable.svelte";
    import RefusedWriteExample from "./Examples/RefusedWrite.svelte";

    const EXAMPLES_ROOT = "/src/App/Pages/CheckboxPage/Examples";

    let defaultChecked = $state(false);
    let decoratedChecked = $state(true);
    let disabledChecked = $state(true);
    let reachableChecked = $state(true);
    let erroredChecked = $state(false);

    let allChecked = $state(false);
    let firstChildChecked = $state(true);
    let secondChildChecked = $state(false);

    let emailChecked = $state(true);
    let smsChecked = $state(false);

    const isAllMixed = $derived.by(() => firstChildChecked !== secondChildChecked);

    $effect(() => {
        allChecked = firstChildChecked && secondChildChecked;
    });

    const examples: ExampleDefs[] = [
        {
            key: "default",
            name: "Default",
            readout: () => `checked: ${defaultChecked}`,
            component: defaultExample,
            path: `${EXAMPLES_ROOT}/Default.svelte`,
        },
        {
            key: "decorated",
            name: "Decorated",
            readout: () => `checked: ${decoratedChecked}`,
            component: decoratedExample,
            path: `${EXAMPLES_ROOT}/Decorated.svelte`,
        },
        {
            key: "mixed",
            name: "Mixed",
            readout: () =>
                `mixed: ${isAllMixed} | all: ${allChecked} | children: ${firstChildChecked}, ${secondChildChecked}`,
            component: mixedExample,
            path: `${EXAMPLES_ROOT}/Mixed.svelte`,
        },
        {
            key: "refusedWrite",
            name: "Refused write",
            readout: () =>
                `email: ${emailChecked} | sms: ${smsChecked} — whichever is the last one on refuses to go off`,
            component: refusedWriteExample,
            path: `${EXAMPLES_ROOT}/RefusedWrite.svelte`,
        },
        {
            key: "disabled",
            name: "Disabled",
            readout: () => `checked: ${disabledChecked}`,
            component: disabledExample,
            path: `${EXAMPLES_ROOT}/Disabled.svelte`,
        },
        {
            key: "reachable",
            name: "Disabled + reachable",
            readout: () => `checked: ${reachableChecked}`,
            component: reachableExample,
            path: `${EXAMPLES_ROOT}/Reachable.svelte`,
        },
        {
            key: "errored",
            name: "Error",
            readout: () => `checked: ${erroredChecked}`,
            component: erroredExample,
            path: `${EXAMPLES_ROOT}/Errored.svelte`,
        },
    ];
</script>

{#snippet defaultExample()}
    <DefaultExample bind:checked={defaultChecked} />
{/snippet}

{#snippet decoratedExample()}
    <DecoratedExample bind:checked={decoratedChecked} />
{/snippet}

{#snippet mixedExample()}
    <MixedExample
        bind:all={allChecked}
        bind:firstChild={firstChildChecked}
        bind:secondChild={secondChildChecked}
        isMixed={isAllMixed}
    />
{/snippet}

{#snippet refusedWriteExample()}
    <RefusedWriteExample bind:email={emailChecked} bind:sms={smsChecked} />
{/snippet}

{#snippet disabledExample()}
    <DisabledExample bind:checked={disabledChecked} />
{/snippet}

{#snippet reachableExample()}
    <ReachableExample bind:checked={reachableChecked} />
{/snippet}

{#snippet erroredExample()}
    <ErroredExample bind:checked={erroredChecked} />
{/snippet}

<PageExamples items={examples} />
