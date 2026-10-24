import { createMemo, createSignal } from "solid-js";

import { COPY_TEXT, EXAMPLES_ROOT, EXAMPLE_NAMES } from "@thewaver/ss-playground/App/Pages/ButtonPage/ButtonPage.const";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { CopyExample } from "./Examples/Copy";
import { CounterExample } from "./Examples/Counter";
import { DecoratedExample } from "./Examples/Decorated";
import { PendingExample } from "./Examples/Pending";

export const ButtonPage = () => {
    const [getToggleOn, setToggleOn] = createSignal(false);
    const [getCount, setCount] = createSignal(0);
    const [getSaves, setSaves] = createSignal(0);
    const [getCopies, setCopies] = createSignal(0);

    const getExamples = createMemo(() => [
        {
            key: "decorated",
            name: EXAMPLE_NAMES.decorated,
            readout: () => `pressed: ${getToggleOn()}`,
            component: () => (
                <DecoratedExample
                    isPressed={getToggleOn}
                    onClick={() => {
                        setToggleOn((prev) => !prev);
                    }}
                />
            ),
            path: `${EXAMPLES_ROOT}/Decorated.tsx`,
        },
        {
            key: "pending",
            name: EXAMPLE_NAMES.pending,
            readout: () =>
                `saves: ${getSaves()} — the handler answers with a promise that takes a second, and presses that land before it settles are ignored`,
            component: () => (
                <PendingExample
                    onClick={() => {
                        setSaves((prev) => prev + 1);
                    }}
                />
            ),
            path: `${EXAMPLES_ROOT}/Pending.tsx`,
        },
        {
            key: "copy",
            name: EXAMPLE_NAMES.copy,
            readout: () =>
                `copies: ${getCopies()} — the handler answers with the clipboard's own promise, so the button is pending while it writes, then says Copied for two seconds and announces it`,
            component: () => (
                <CopyExample
                    text={COPY_TEXT}
                    onCopy={() => {
                        setCopies((prev) => prev + 1);
                    }}
                />
            ),
            path: `${EXAMPLES_ROOT}/Copy.tsx`,
        },
        {
            key: "counter",
            name: EXAMPLE_NAMES.counter,
            readout: () => `count: ${getCount()}`,
            component: () => (
                <CounterExample
                    count={getCount}
                    onStep={(step) => {
                        setCount((prev) => prev + step);
                    }}
                />
            ),
            path: `${EXAMPLES_ROOT}/Counter.tsx`,
        },
    ]);

    return <PageExamples items={getExamples} />;
};
