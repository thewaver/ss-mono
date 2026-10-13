import { createMemo, createSignal } from "solid-js";

import { COPY_TEXT, EXAMPLES_ROOT, EXAMPLE_NAMES } from "@thewaver/ss-playground/App/Pages/ButtonPage/ButtonPage.const";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { CopyExample } from "./Examples/Copy";
import { DecoratedExample } from "./Examples/Decorated";
import { DefaultExample } from "./Examples/Default";
import { DisabledExample } from "./Examples/Disabled";
import { ErroredExample } from "./Examples/Errored";
import { PendingExample } from "./Examples/Pending";
import { ReachableExample } from "./Examples/Reachable";

export const ButtonPage = () => {
    const [getClicks, setClicks] = createSignal(0);
    const [getToggleOn, setToggleOn] = createSignal(false);
    const [getDisabledClicks, setDisabledClicks] = createSignal(0);
    const [getReachableClicks, setReachableClicks] = createSignal(0);
    const [getHasError, setHasError] = createSignal(true);
    const [getSaves, setSaves] = createSignal(0);
    const [getCopies, setCopies] = createSignal(0);

    const getExamples = createMemo(() => [
        {
            key: "default",
            name: EXAMPLE_NAMES.default,
            readout: () => `clicks: ${getClicks()}`,
            component: () => (
                <DefaultExample
                    onClick={() => {
                        setClicks((prev) => prev + 1);
                    }}
                />
            ),
            path: `${EXAMPLES_ROOT}/Default.tsx`,
        },
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
            key: "disabled",
            name: EXAMPLE_NAMES.disabled,
            readout: () => `clicks: ${getDisabledClicks()}`,
            component: () => (
                <DisabledExample
                    onClick={() => {
                        setDisabledClicks((prev) => prev + 1);
                    }}
                />
            ),
            path: `${EXAMPLES_ROOT}/Disabled.tsx`,
        },
        {
            key: "reachable",
            name: EXAMPLE_NAMES.reachable,
            readout: () => `clicks: ${getReachableClicks()}`,
            component: () => (
                <ReachableExample
                    onClick={() => {
                        setReachableClicks((prev) => prev + 1);
                    }}
                />
            ),
            path: `${EXAMPLES_ROOT}/Reachable.tsx`,
        },
        {
            key: "errored",
            name: EXAMPLE_NAMES.errored,
            readout: () => `hasError: ${getHasError()}`,
            component: () => (
                <ErroredExample
                    hasError={getHasError}
                    onClick={() => {
                        setHasError((prev) => !prev);
                    }}
                />
            ),
            path: `${EXAMPLES_ROOT}/Errored.tsx`,
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
    ]);

    return <PageExamples items={getExamples} />;
};
