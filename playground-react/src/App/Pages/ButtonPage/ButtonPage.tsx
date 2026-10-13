import { useState } from "react";

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
    const [clicks, setClicks] = useState(0);
    const [toggleOn, setToggleOn] = useState(false);
    const [disabledClicks, setDisabledClicks] = useState(0);
    const [reachableClicks, setReachableClicks] = useState(0);
    const [hasError, setHasError] = useState(true);
    const [saves, setSaves] = useState(0);
    const [copies, setCopies] = useState(0);

    const examples = [
        {
            key: "default",
            name: EXAMPLE_NAMES.default,
            readout: () => `clicks: ${clicks}`,
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
            key: "disabled",
            name: EXAMPLE_NAMES.disabled,
            readout: () => `clicks: ${disabledClicks}`,
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
            readout: () => `clicks: ${reachableClicks}`,
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
            readout: () => `hasError: ${hasError}`,
            component: () => (
                <ErroredExample
                    hasError={hasError}
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
    ];

    return <PageExamples items={examples} />;
};
