import { createMemo, createSignal } from "solid-js";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { CopyExample } from "./Examples/Copy";
import { DecoratedExample } from "./Examples/Decorated";
import { DefaultExample } from "./Examples/Default";
import { DisabledExample } from "./Examples/Disabled";
import { ErroredExample } from "./Examples/Errored";
import { PendingExample } from "./Examples/Pending";
import { ReachableExample } from "./Examples/Reachable";

const COPY_TEXT = "npm install @thewaver/ss-components";
const EXAMPLES_ROOT = "/src/App/Pages/ButtonPage/Examples";

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
            name: "Default",
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
            name: "Decorated",
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
            name: "Disabled",
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
            name: "Disabled + reachable",
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
            name: "Error",
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
            name: "Pending",
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
            name: "Copy to the clipboard",
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
