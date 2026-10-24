import { useState } from "react";

import { COPY_TEXT, EXAMPLES_ROOT, EXAMPLE_NAMES } from "@thewaver/ss-playground/App/Pages/ButtonPage/ButtonPage.const";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { CopyExample } from "./Examples/Copy";
import { CounterExample } from "./Examples/Counter";
import { DecoratedExample } from "./Examples/Decorated";
import { PendingExample } from "./Examples/Pending";

export const ButtonPage = () => {
    const [toggleOn, setToggleOn] = useState(false);
    const [count, setCount] = useState(0);
    const [saves, setSaves] = useState(0);
    const [copies, setCopies] = useState(0);

    const examples = [
        {
            key: "decorated",
            name: EXAMPLE_NAMES.decorated,
            readout: () => `pressed: ${toggleOn}`,
            component: () => (
                <DecoratedExample
                    isPressed={toggleOn}
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
                `saves: ${saves} — the handler answers with a promise that takes a second, and presses that land before it settles are ignored`,
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
                `copies: ${copies} — the handler answers with the clipboard's own promise, so the button is pending while it writes, then says Copied for two seconds and announces it`,
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
            readout: () => `count: ${count}`,
            component: () => (
                <CounterExample
                    count={count}
                    onStep={(step) => {
                        setCount((prev) => prev + step);
                    }}
                />
            ),
            path: `${EXAMPLES_ROOT}/Counter.tsx`,
        },
    ];

    return <PageExamples items={examples} />;
};
