import { useState } from "react";

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
            name: "Default",
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
            name: "Decorated",
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
            name: "Disabled",
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
            name: "Disabled + reachable",
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
            name: "Error",
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
            name: "Pending",
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
            name: "Copy to the clipboard",
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
