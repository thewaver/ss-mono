import { useState } from "react";

import { TreeKnobs } from "@thewaver/ss-playground/App/Knobs/Trees.const";
import { EXAMPLES_ROOT, EXAMPLE_NAMES } from "@thewaver/ss-playground/App/Pages/TreePage/TreePage.const";

import { PageExampleKnobs } from "../../PageComponents/ExampleKnobs/ExampleKnobs";
import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageSelectField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { FilesExample } from "./Examples/Files";
import { LazyExample } from "./Examples/Lazy";
import { LeaningExample } from "./Examples/Leaning";
import { LinkComponentExample } from "./Examples/LinkComponent";
import { LinksExample } from "./Examples/Links";
import { OutsideExample } from "./Examples/Outside";
import { RadialExample } from "./Examples/Radial";
import { RecordValuesExample } from "./Examples/RecordValues";
import { RightToLeftExample } from "./Examples/RightToLeft";
import { VirtualizedExample } from "./Examples/Virtualized";
import type { Asset, TreeExampleProps } from "./TreePage.types";
import {
    FILES_WITH_DISABLED,
    FILES_WITH_REACHABLE,
    RANK_ROOTS,
    STRESS_BRANCH_COUNT,
    STRESS_LEAF_COUNT,
    createStressFiles,
} from "./TreePageReact.const";

const LeaningExampleWrapper = (props: TreeExampleProps) => {
    const [falloff, setFalloff] = useState(TreeKnobs.STARTING_FALLOFF);

    return (
        <>
            <LeaningExample {...props} falloff={falloff} />

            <PageExampleKnobs>
                <PageProp
                    itemKey={"falloff"}
                    label={"Falloff"}
                    hint={
                        "How the lean fades with distance from the pointer: smoothly, in a straight line, or sharply, so only the nearest items move."
                    }
                >
                    <PageSelectField
                        value={falloff}
                        values={TreeKnobs.FALLOFFS}
                        ariaLabel={"Falloff"}
                        onChange={(next) => setFalloff(next)}
                    />
                </PageProp>
            </PageExampleKnobs>
        </>
    );
};

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

    const leaningState = useState<string | undefined>();
    const leaningExpandedState = useState<string[]>(["src"]);

    const radialState = useState<string | undefined>();
    const radialExpandedState = useState<string[]>(RANK_ROOTS);

    const recordState = useState<Asset | undefined>();
    const recordExpandedState = useState<Asset[]>([]);

    const examples = [
        {
            key: "default",
            name: EXAMPLE_NAMES.default,
            readout: () =>
                `value: ${defaultState[0] ?? "undefined"} | expanded: ${JSON.stringify(defaultExpandedState[0])} — right opens a branch, left closes it or climbs to the parent`,
            component: () => <FilesExample value={defaultState} expanded={defaultExpandedState} />,
            path: `${EXAMPLES_ROOT}/Files.tsx`,
        },
        {
            key: "collapsed",
            name: EXAMPLE_NAMES.collapsed,
            readout: () =>
                `value: ${collapsedState[0] ?? "undefined"} | expanded: ${JSON.stringify(collapsedExpandedState[0])} — asterisk opens every branch at the level focus is on`,
            component: () => <FilesExample value={collapsedState} expanded={collapsedExpandedState} />,
            path: `${EXAMPLES_ROOT}/Files.tsx`,
        },
        {
            key: "rightToLeft",
            name: EXAMPLE_NAMES.rightToLeft,
            readout: () =>
                `value: ${rightToLeftState[0] ?? "undefined"} | expanded: ${JSON.stringify(rightToLeftExpandedState[0])} — the box around the tree sets dir="rtl", so left opens a branch and right closes it or climbs to the parent`,
            component: () => <RightToLeftExample value={rightToLeftState} expanded={rightToLeftExpandedState} />,
            path: `${EXAMPLES_ROOT}/RightToLeft.tsx`,
        },
        {
            key: "unheld",
            name: EXAMPLE_NAMES.unheld,
            readout: () =>
                "no signals passed — the tree keeps the selection and the open branches itself; a picked node is still marked selected and is still the tree's one tab stop",
            component: () => <FilesExample />,
            path: `${EXAMPLES_ROOT}/Files.tsx`,
        },
        {
            key: "disabled",
            name: EXAMPLE_NAMES.disabled,
            readout: () =>
                `value: ${disabledState[0] ?? "undefined"} — arrows skip index.ts and Lib, while what is inside Lib stays reachable`,
            component: () => (
                <FilesExample value={disabledState} expanded={disabledExpandedState} nodes={FILES_WITH_DISABLED} />
            ),
            path: `${EXAMPLES_ROOT}/Files.tsx`,
        },
        {
            key: "reachable",
            name: EXAMPLE_NAMES.reachable,
            readout: () =>
                `value: ${reachableState[0] ?? "undefined"} — arrows stop on node_modules, hover explains why, and nothing opens it`,
            component: () => (
                <FilesExample value={reachableState} expanded={reachableExpandedState} nodes={FILES_WITH_REACHABLE} />
            ),
            path: `${EXAMPLES_ROOT}/Files.tsx`,
        },
        {
            key: "outside",
            name: EXAMPLE_NAMES.outside,
            readout: () =>
                `expanded: ${JSON.stringify(outsideExpandedState[0])} — press the button, then focus a row inside Lib before the delay elapses; focus must land on Lib rather than on the page body`,
            component: () => <OutsideExample value={outsideState} expanded={outsideExpandedState} />,
            path: `${EXAMPLES_ROOT}/Outside.tsx`,
        },
        {
            key: "links",
            name: EXAMPLE_NAMES.links,
            readout: () =>
                `value: ${linkState[0] ?? "undefined"} — every leaf carries an href, so each one is an anchor and the branches stay plain`,
            component: () => <LinksExample value={linkState} expanded={linkExpandedState} />,
            path: `${EXAMPLES_ROOT}/Links.tsx`,
        },
        {
            key: "linkComponent",
            name: EXAMPLE_NAMES.linkComponent,
            readout: () =>
                `value: ${customLinkState[0] ?? "undefined"} — the same nodes rendered by a consumer's own link component`,
            component: () => <LinkComponentExample value={customLinkState} expanded={customLinkExpandedState} />,
            path: `${EXAMPLES_ROOT}/LinkComponent.tsx`,
        },
        {
            key: "lazy",
            name: EXAMPLE_NAMES.lazy,
            readout: () =>
                `expanded: ${JSON.stringify(lazyExpandedState[0])} — packages and docs say they have children before they have them`,
            component: () => <LazyExample value={lazyState} expanded={lazyExpandedState} />,
            path: `${EXAMPLES_ROOT}/Lazy.tsx`,
        },
        {
            key: "virtualized",
            name: EXAMPLE_NAMES.virtualized,
            readout: () =>
                `${(STRESS_BRANCH_COUNT * (STRESS_LEAF_COUNT + 1)).toLocaleString("en-GB")} rows when everything is open — expanded: ${stressExpandedState[0].length} branches, value: ${stressState[0] ?? "undefined"}`,
            component: () => (
                <VirtualizedExample nodes={stressFiles} value={stressState} expanded={stressExpandedState} />
            ),
            path: `${EXAMPLES_ROOT}/Virtualized.tsx`,
        },
        {
            key: "leaning",
            name: EXAMPLE_NAMES.leaning,
            readout: () =>
                `selected: ${leaningState[0] ?? "nothing"} — a column layout with a proximity effect: each node shifts and brightens by how near the pointer is, and the painter keeps the selected one lit, since an effect is not told which node is current`,
            component: () => <LeaningExampleWrapper value={leaningState} expanded={leaningExpandedState} />,
            path: `${EXAMPLES_ROOT}/Leaning.tsx`,
        },
        {
            key: "radial",
            span: 2,
            name: EXAMPLE_NAMES.radial,
            readout: () =>
                `value: ${radialState[0] ?? "undefined"} — the layout is told which node each node hangs from, so children share the slice their parent was given, and every rank sits a ring further out whoever it hangs from`,
            component: () => <RadialExample value={radialState} expanded={radialExpandedState} />,
            path: `${EXAMPLES_ROOT}/Radial.tsx`,
        },
        {
            key: "recordValues",
            name: EXAMPLE_NAMES.recordValues,
            readout: () =>
                `value: ${recordState[0]?.name ?? "undefined"} | expanded: ${recordExpandedState[0].length} branch(es) — the value is the record itself, not a name`,
            component: () => <RecordValuesExample value={recordState} expanded={recordExpandedState} />,
            path: `${EXAMPLES_ROOT}/RecordValues.tsx`,
        },
    ];

    return <PageExamples items={examples} />;
};
