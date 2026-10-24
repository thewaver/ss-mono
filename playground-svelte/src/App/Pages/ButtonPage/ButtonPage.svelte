<script lang="ts">
    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import CopyExample from "./Examples/Copy.svelte";
    import CounterExample from "./Examples/Counter.svelte";
    import DecoratedExample from "./Examples/Decorated.svelte";
    import PendingExample from "./Examples/Pending.svelte";
    import { COPY_TEXT, EXAMPLE_NAMES, EXAMPLES_ROOT } from "@thewaver/ss-playground/App/Pages/ButtonPage/ButtonPage.const";

    let toggleOn = $state(false);
    let count = $state(0);
    let saves = $state(0);
    let copies = $state(0);

    const examples: ExampleDefs[] = [
        {
            key: "decorated",
            name: EXAMPLE_NAMES.decorated,
            readout: () => `pressed: ${toggleOn}`,
            component: decoratedExample,
            path: `${EXAMPLES_ROOT}/Decorated.svelte`,
        },
        {
            key: "pending",
            name: EXAMPLE_NAMES.pending,
            readout: () =>
                `saves: ${saves} — the handler answers with a promise that takes a second, and presses that land before it settles are ignored`,
            component: pendingExample,
            path: `${EXAMPLES_ROOT}/Pending.svelte`,
        },
        {
            key: "copy",
            name: EXAMPLE_NAMES.copy,
            readout: () =>
                `copies: ${copies} — the handler answers with the clipboard's own promise, so the button is pending while it writes, then says Copied for two seconds and announces it`,
            component: copyExample,
            path: `${EXAMPLES_ROOT}/Copy.svelte`,
        },
        {
            key: "counter",
            name: EXAMPLE_NAMES.counter,
            readout: () => `count: ${count}`,
            component: counterExample,
            path: `${EXAMPLES_ROOT}/Counter.svelte`,
        },
    ];
</script>

{#snippet decoratedExample()}
    <DecoratedExample
        isPressed={toggleOn}
        onClick={() => {
            toggleOn = !toggleOn;
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

{#snippet counterExample()}
    <CounterExample
        {count}
        onStep={(step) => {
            count += step;
        }}
    />
{/snippet}

<PageExamples items={examples} />
