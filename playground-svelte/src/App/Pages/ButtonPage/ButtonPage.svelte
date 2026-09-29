<script lang="ts">
    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import CopyExample from "./Examples/Copy.svelte";
    import DecoratedExample from "./Examples/Decorated.svelte";
    import DefaultExample from "./Examples/Default.svelte";
    import DisabledExample from "./Examples/Disabled.svelte";
    import ErroredExample from "./Examples/Errored.svelte";
    import PendingExample from "./Examples/Pending.svelte";
    import ReachableExample from "./Examples/Reachable.svelte";

    const COPY_TEXT = "npm install @thewaver/ss-components";
    const EXAMPLES_ROOT = "/src/App/Pages/ButtonPage/Examples";

    let clicks = $state(0);
    let toggleOn = $state(false);
    let disabledClicks = $state(0);
    let reachableClicks = $state(0);
    let hasError = $state(true);
    let saves = $state(0);
    let copies = $state(0);

    const examples: ExampleDefs[] = [
        {
            key: "default",
            name: "Default",
            readout: () => `clicks: ${clicks}`,
            component: defaultExample,
            path: `${EXAMPLES_ROOT}/Default.svelte`,
        },
        {
            key: "decorated",
            name: "Decorated",
            readout: () => `pressed: ${toggleOn}`,
            component: decoratedExample,
            path: `${EXAMPLES_ROOT}/Decorated.svelte`,
        },
        {
            key: "disabled",
            name: "Disabled",
            readout: () => `clicks: ${disabledClicks}`,
            component: disabledExample,
            path: `${EXAMPLES_ROOT}/Disabled.svelte`,
        },
        {
            key: "reachable",
            name: "Disabled + reachable",
            readout: () => `clicks: ${reachableClicks}`,
            component: reachableExample,
            path: `${EXAMPLES_ROOT}/Reachable.svelte`,
        },
        {
            key: "errored",
            name: "Error",
            readout: () => `hasError: ${hasError}`,
            component: erroredExample,
            path: `${EXAMPLES_ROOT}/Errored.svelte`,
        },
        {
            key: "pending",
            name: "Pending",
            readout: () =>
                `saves: ${saves} — the handler answers with a promise that takes a second, and presses that land before it settles are ignored`,
            component: pendingExample,
            path: `${EXAMPLES_ROOT}/Pending.svelte`,
        },
        {
            key: "copy",
            name: "Copy to the clipboard",
            readout: () =>
                `copies: ${copies} — the handler answers with the clipboard's own promise, so the button is pending while it writes, then says Copied for two seconds and announces it`,
            component: copyExample,
            path: `${EXAMPLES_ROOT}/Copy.svelte`,
        },
    ];
</script>

{#snippet defaultExample()}
    <DefaultExample
        onClick={() => {
            clicks += 1;
        }}
    />
{/snippet}

{#snippet decoratedExample()}
    <DecoratedExample
        isPressed={toggleOn}
        onClick={() => {
            toggleOn = !toggleOn;
        }}
    />
{/snippet}

{#snippet disabledExample()}
    <DisabledExample
        onClick={() => {
            disabledClicks += 1;
        }}
    />
{/snippet}

{#snippet reachableExample()}
    <ReachableExample
        onClick={() => {
            reachableClicks += 1;
        }}
    />
{/snippet}

{#snippet erroredExample()}
    <ErroredExample
        {hasError}
        onClick={() => {
            hasError = !hasError;
        }}
    />
{/snippet}

{#snippet pendingExample()}
    <PendingExample
        onClick={() => {
            saves += 1;
        }}
    />
{/snippet}

{#snippet copyExample()}
    <CopyExample
        text={COPY_TEXT}
        onCopy={() => {
            copies += 1;
        }}
    />
{/snippet}

<PageExamples items={examples} />
