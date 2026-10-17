import { createMemo, createSignal } from "solid-js";

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
} from "./TreePageSolid.const";

const LeaningExampleWrapper = (props: TreeExampleProps) => {
    const [getFalloff, setFalloff] = createSignal(TreeKnobs.STARTING_FALLOFF);

    return (
        <>
            <LeaningExample {...props} falloff={getFalloff} />

            <PageExampleKnobs>
                <PageProp
                    key={"falloff"}
                    label={"Falloff"}
                    hint={
                        "How the lean fades with distance from the pointer: smoothly, in a straight line, or sharply, so only the nearest items move."
                    }
                >
                    <PageSelectField
                        value={getFalloff}
                        values={TreeKnobs.FALLOFFS}
                        ariaLabel={"Falloff"}
                        onChange={(falloff) => setFalloff(() => falloff)}
                    />
                </PageProp>
            </PageExampleKnobs>
        </>
    );
};

export const TreePage = () => {
    const defaultSignal = createSignal<string | undefined>();
    const defaultExpandedSignal = createSignal<string[]>(["src"]);

    const collapsedSignal = createSignal<string | undefined>();
    const collapsedExpandedSignal = createSignal<string[]>([]);

    const rightToLeftSignal = createSignal<string | undefined>();
    const rightToLeftExpandedSignal = createSignal<string[]>([]);

    const disabledSignal = createSignal<string | undefined>();
    const disabledExpandedSignal = createSignal<string[]>(["src", "Lib"]);

    const reachableSignal = createSignal<string | undefined>();
    const reachableExpandedSignal = createSignal<string[]>(["src"]);

    const outsideSignal = createSignal<string | undefined>();
    const outsideExpandedSignal = createSignal<string[]>(["src", "Lib"]);

    const linkSignal = createSignal<string | undefined>();
    const linkExpandedSignal = createSignal<string[]>(["Guides"]);

    const customLinkSignal = createSignal<string | undefined>();
    const customLinkExpandedSignal = createSignal<string[]>(["Guides"]);

    const lazySignal = createSignal<string | undefined>();
    const lazyExpandedSignal = createSignal<string[]>([]);

    const stressSignal = createSignal<string | undefined>();
    const stressExpandedSignal = createSignal<string[]>(["package-1", "package-2", "package-3"]);
    const stressFiles = createStressFiles();

    const leaningSignal = createSignal<string | undefined>();
    const leaningExpandedSignal = createSignal<string[]>(["src"]);

    const radialSignal = createSignal<string | undefined>();
    const radialExpandedSignal = createSignal<string[]>(RANK_ROOTS);

    const recordSignal = createSignal<Asset | undefined>();
    const recordExpandedSignal = createSignal<Asset[]>([]);

    const getExamples = createMemo(() => [
        {
            key: "default",
            name: EXAMPLE_NAMES.default,
            readout: () =>
                `value: ${defaultSignal[0]() ?? "undefined"} | expanded: ${JSON.stringify(defaultExpandedSignal[0]())} — right opens a branch, left closes it or climbs to the parent`,
            component: () => <FilesExample value={defaultSignal} expanded={defaultExpandedSignal} />,
            path: `${EXAMPLES_ROOT}/Files.tsx`,
        },
        {
            key: "collapsed",
            name: EXAMPLE_NAMES.collapsed,
            readout: () =>
                `value: ${collapsedSignal[0]() ?? "undefined"} | expanded: ${JSON.stringify(collapsedExpandedSignal[0]())} — asterisk opens every branch at the level focus is on`,
            component: () => <FilesExample value={collapsedSignal} expanded={collapsedExpandedSignal} />,
            path: `${EXAMPLES_ROOT}/Files.tsx`,
        },
        {
            key: "rightToLeft",
            name: EXAMPLE_NAMES.rightToLeft,
            readout: () =>
                `value: ${rightToLeftSignal[0]() ?? "undefined"} | expanded: ${JSON.stringify(rightToLeftExpandedSignal[0]())} — the box around the tree sets dir="rtl", so left opens a branch and right closes it or climbs to the parent`,
            component: () => <RightToLeftExample value={rightToLeftSignal} expanded={rightToLeftExpandedSignal} />,
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
                `value: ${disabledSignal[0]() ?? "undefined"} — arrows skip index.ts and Lib, while what is inside Lib stays reachable`,
            component: () => (
                <FilesExample value={disabledSignal} expanded={disabledExpandedSignal} nodes={FILES_WITH_DISABLED} />
            ),
            path: `${EXAMPLES_ROOT}/Files.tsx`,
        },
        {
            key: "reachable",
            name: EXAMPLE_NAMES.reachable,
            readout: () =>
                `value: ${reachableSignal[0]() ?? "undefined"} — arrows stop on node_modules, hover explains why, and nothing opens it`,
            component: () => (
                <FilesExample value={reachableSignal} expanded={reachableExpandedSignal} nodes={FILES_WITH_REACHABLE} />
            ),
            path: `${EXAMPLES_ROOT}/Files.tsx`,
        },
        {
            key: "outside",
            name: EXAMPLE_NAMES.outside,
            readout: () =>
                `expanded: ${JSON.stringify(outsideExpandedSignal[0]())} — press the button, then focus a row inside Lib before the delay elapses; focus must land on Lib rather than on the page body`,
            component: () => <OutsideExample value={outsideSignal} expanded={outsideExpandedSignal} />,
            path: `${EXAMPLES_ROOT}/Outside.tsx`,
        },
        {
            key: "links",
            name: EXAMPLE_NAMES.links,
            readout: () =>
                `value: ${linkSignal[0]() ?? "undefined"} — every leaf carries an href, so each one is an anchor and the branches stay plain`,
            component: () => <LinksExample value={linkSignal} expanded={linkExpandedSignal} />,
            path: `${EXAMPLES_ROOT}/Links.tsx`,
        },
        {
            key: "linkComponent",
            name: EXAMPLE_NAMES.linkComponent,
            readout: () =>
                `value: ${customLinkSignal[0]() ?? "undefined"} — the same nodes rendered by a consumer's own link component`,
            component: () => <LinkComponentExample value={customLinkSignal} expanded={customLinkExpandedSignal} />,
            path: `${EXAMPLES_ROOT}/LinkComponent.tsx`,
        },
        {
            key: "lazy",
            name: EXAMPLE_NAMES.lazy,
            readout: () =>
                `expanded: ${JSON.stringify(lazyExpandedSignal[0]())} — packages and docs say they have children before they have them`,
            component: () => <LazyExample value={lazySignal} expanded={lazyExpandedSignal} />,
            path: `${EXAMPLES_ROOT}/Lazy.tsx`,
        },
        {
            key: "virtualized",
            name: EXAMPLE_NAMES.virtualized,
            readout: () =>
                `${(STRESS_BRANCH_COUNT * (STRESS_LEAF_COUNT + 1)).toLocaleString("en-GB")} rows when everything is open — expanded: ${stressExpandedSignal[0]().length} branches, value: ${stressSignal[0]() ?? "undefined"}`,
            component: () => (
                <VirtualizedExample nodes={() => stressFiles} value={stressSignal} expanded={stressExpandedSignal} />
            ),
            path: `${EXAMPLES_ROOT}/Virtualized.tsx`,
        },
        {
            key: "leaning",
            name: EXAMPLE_NAMES.leaning,
            readout: () =>
                `selected: ${leaningSignal[0]() ?? "nothing"} — a column layout with a proximity effect: each node shifts and brightens by how near the pointer is, and the painter keeps the selected one lit, since an effect is not told which node is current`,
            component: () => <LeaningExampleWrapper value={leaningSignal} expanded={leaningExpandedSignal} />,
            path: `${EXAMPLES_ROOT}/Leaning.tsx`,
        },
        {
            key: "radial",
            span: 2,
            name: EXAMPLE_NAMES.radial,
            readout: () =>
                `value: ${radialSignal[0]() ?? "undefined"} — the layout is told which node each node hangs from, so children share the slice their parent was given, and every rank sits a ring further out whoever it hangs from`,
            component: () => <RadialExample value={radialSignal} expanded={radialExpandedSignal} />,
            path: `${EXAMPLES_ROOT}/Radial.tsx`,
        },
        {
            key: "recordValues",
            name: EXAMPLE_NAMES.recordValues,
            readout: () =>
                `value: ${recordSignal[0]()?.name ?? "undefined"} | expanded: ${recordExpandedSignal[0]().length} branch(es) — the value is the record itself, not a name`,
            component: () => <RecordValuesExample value={recordSignal} expanded={recordExpandedSignal} />,
            path: `${EXAMPLES_ROOT}/RecordValues.tsx`,
        },
    ]);

    return <PageExamples items={getExamples} />;
};
