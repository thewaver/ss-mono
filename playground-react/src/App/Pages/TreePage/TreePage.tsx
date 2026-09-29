import { useState } from "react";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { FilesExample } from "./Examples/Files";
import { LazyExample } from "./Examples/Lazy";
import { LinkComponentExample } from "./Examples/LinkComponent";
import { LinksExample } from "./Examples/Links";
import { OutsideExample } from "./Examples/Outside";
import { RadialExample } from "./Examples/Radial";
import { RecordValuesExample } from "./Examples/RecordValues";
import { RightToLeftExample } from "./Examples/RightToLeft";
import { VirtualizedExample } from "./Examples/Virtualized";
import {
    FILES_WITH_DISABLED,
    FILES_WITH_REACHABLE,
    RANK_ROOTS,
    STRESS_BRANCH_COUNT,
    STRESS_LEAF_COUNT,
    createStressFiles,
} from "./TreePage.const";
import type { Asset } from "./TreePage.types";

const EXAMPLES_ROOT = "/src/App/Pages/TreePage/Examples";

export const TreePage = () => {
    const defaultState = useState<string | undefined>();
    const defaultExpandedState = useState<string[]>(["src"]);

    const collapsedState = useState<string | undefined>();
    const collapsedExpandedState = useState<string[]>([]);

    const rightToLeftState = useState<string | undefined>();
    const rightToLeftExpandedState = useState<string[]>([]);

    const disabledState = useState<string | undefined>();
    const disabledExpandedState = useState<string[]>(["src", "Lib"]);

    const reachableState = useState<string | undefined>();
    const reachableExpandedState = useState<string[]>(["src"]);

    const outsideState = useState<string | undefined>();
    const outsideExpandedState = useState<string[]>(["src", "Lib"]);

    const linkState = useState<string | undefined>();
    const linkExpandedState = useState<string[]>(["Guides"]);

    const customLinkState = useState<string | undefined>();
    const customLinkExpandedState = useState<string[]>(["Guides"]);

    const lazyState = useState<string | undefined>();
    const lazyExpandedState = useState<string[]>([]);

    const stressState = useState<string | undefined>();
    const stressExpandedState = useState<string[]>(["package-1", "package-2", "package-3"]);
    const [stressFiles] = useState(createStressFiles);

    const radialState = useState<string | undefined>();
    const radialExpandedState = useState<string[]>(RANK_ROOTS);

    const recordState = useState<Asset | undefined>();
    const recordExpandedState = useState<Asset[]>([]);

    const examples = [
        {
            key: "default",
            name: "Default",
            readout: () =>
                `value: ${defaultState[0] ?? "undefined"} | expanded: ${JSON.stringify(defaultExpandedState[0])} — right opens a branch, left closes it or climbs to the parent`,
            component: () => <FilesExample value={defaultState} expanded={defaultExpandedState} />,
            path: `${EXAMPLES_ROOT}/Files.tsx`,
        },
        {
            key: "collapsed",
            name: "Everything collapsed",
            readout: () =>
                `value: ${collapsedState[0] ?? "undefined"} | expanded: ${JSON.stringify(collapsedExpandedState[0])} — asterisk opens every branch at the level focus is on`,
            component: () => <FilesExample value={collapsedState} expanded={collapsedExpandedState} />,
            path: `${EXAMPLES_ROOT}/Files.tsx`,
        },
        {
            key: "rightToLeft",
            name: "In a right-to-left box",
            readout: () =>
                `value: ${rightToLeftState[0] ?? "undefined"} | expanded: ${JSON.stringify(rightToLeftExpandedState[0])} — the box around the tree sets dir="rtl", so left opens a branch and right closes it or climbs to the parent`,
            component: () => <RightToLeftExample value={rightToLeftState} expanded={rightToLeftExpandedState} />,
            path: `${EXAMPLES_ROOT}/RightToLeft.tsx`,
        },
        {
            key: "unheld",
            name: "Nobody holding the state",
            readout: () =>
                "no signals passed — the tree keeps the selection and the open branches itself; a picked node is still marked selected and is still the tree's one tab stop",
            component: () => <FilesExample />,
            path: `${EXAMPLES_ROOT}/Files.tsx`,
        },
        {
            key: "disabled",
            name: "Disabled nodes",
            readout: () =>
                `value: ${disabledState[0] ?? "undefined"} — arrows skip index.ts and Lib, while what is inside Lib stays reachable`,
            component: () => (
                <FilesExample value={disabledState} expanded={disabledExpandedState} nodes={FILES_WITH_DISABLED} />
            ),
            path: `${EXAMPLES_ROOT}/Files.tsx`,
        },
        {
            key: "reachable",
            name: "Disabled nodes + reachable",
            readout: () =>
                `value: ${reachableState[0] ?? "undefined"} — arrows stop on node_modules, hover explains why, and nothing opens it`,
            component: () => (
                <FilesExample value={reachableState} expanded={reachableExpandedState} nodes={FILES_WITH_REACHABLE} />
            ),
            path: `${EXAMPLES_ROOT}/Files.tsx`,
        },
        {
            key: "outside",
            name: "Collapsed from outside",
            readout: () =>
                `expanded: ${JSON.stringify(outsideExpandedState[0])} — press the button, then focus a row inside Lib before the delay elapses; focus must land on Lib rather than on the page body`,
            component: () => <OutsideExample value={outsideState} expanded={outsideExpandedState} />,
            path: `${EXAMPLES_ROOT}/Outside.tsx`,
        },
        {
            key: "links",
            name: "Nodes that are links",
            readout: () =>
                `value: ${linkState[0] ?? "undefined"} — every leaf carries an href, so each one is an anchor and the branches stay plain`,
            component: () => <LinksExample value={linkState} expanded={linkExpandedState} />,
            path: `${EXAMPLES_ROOT}/Links.tsx`,
        },
        {
            key: "linkComponent",
            name: "Links through a component",
            readout: () =>
                `value: ${customLinkState[0] ?? "undefined"} — the same nodes rendered by a consumer's own link component`,
            component: () => <LinkComponentExample value={customLinkState} expanded={customLinkExpandedState} />,
            path: `${EXAMPLES_ROOT}/LinkComponent.tsx`,
        },
        {
            key: "lazy",
            name: "Branches that arrive later",
            readout: () =>
                `expanded: ${JSON.stringify(lazyExpandedState[0])} — packages and docs say they have children before they have them`,
            component: () => <LazyExample value={lazyState} expanded={lazyExpandedState} />,
            path: `${EXAMPLES_ROOT}/Lazy.tsx`,
        },
        {
            key: "virtualized",
            name: "Virtualized",
            readout: () =>
                `${(STRESS_BRANCH_COUNT * (STRESS_LEAF_COUNT + 1)).toLocaleString("en-GB")} rows when everything is open — expanded: ${stressExpandedState[0].length} branches, value: ${stressState[0] ?? "undefined"}`,
            component: () => (
                <VirtualizedExample nodes={stressFiles} value={stressState} expanded={stressExpandedState} />
            ),
            path: `${EXAMPLES_ROOT}/Virtualized.tsx`,
        },
        {
            key: "radial",
            span: 2,
            name: "A tree drawn outward",
            readout: () =>
                `value: ${radialState[0] ?? "undefined"} — the layout is told which node each node hangs from, so children share the slice their parent was given, and every rank sits a ring further out whoever it hangs from`,
            component: () => <RadialExample value={radialState} expanded={radialExpandedState} />,
            path: `${EXAMPLES_ROOT}/Radial.tsx`,
        },
        {
            key: "recordValues",
            name: "Record values",
            readout: () =>
                `value: ${recordState[0]?.name ?? "undefined"} | expanded: ${recordExpandedState[0].length} branch(es) — the value is the record itself, not a name`,
            component: () => <RecordValuesExample value={recordState} expanded={recordExpandedState} />,
            path: `${EXAMPLES_ROOT}/RecordValues.tsx`,
        },
    ];

    return <PageExamples items={examples} />;
};
