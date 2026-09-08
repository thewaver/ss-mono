import { createMemo, createSignal } from "solid-js";

import type { MenuItem } from "@thewaver/ss-components";

import { PageExamples } from "../../../PageComponents/Examples/Examples";
import { FanExample } from "./Examples/Fan";
import type { FanAction } from "./FanMenuPage.types";

const EXAMPLES_ROOT = "/src/App/Pages/Menus/FanMenuPage/Examples";

const NOTHING_RUN = "nothing run yet";

const ACTIONS: MenuItem<FanAction>[] = [
    { value: { name: "Cut", shortcut: "Ctrl+X" } },
    { value: { name: "Copy", shortcut: "Ctrl+C" } },
    { value: { name: "Paste", shortcut: "Ctrl+V" } },
    { value: { name: "Duplicate" } },
    { value: { name: "Delete", shortcut: "Del" } },
];

const NESTED_ACTIONS: MenuItem<FanAction>[] = [
    {
        value: { name: "New" },
        items: [
            { value: { name: "Project" } },
            {
                value: { name: "From template" },
                items: [{ value: { name: "Blank" } }, { value: { name: "Dashboard" } }, { value: { name: "Report" } }],
            },
            { value: { name: "Import" } },
        ],
    },
    { value: { name: "Open", shortcut: "Ctrl+O" } },
    {
        value: { name: "Share" },
        items: [{ value: { name: "Copy link", shortcut: "Ctrl+L" } }, { value: { name: "Email" } }],
    },
    { value: { name: "Delete", shortcut: "Del" } },
];

export const FanMenuPage = () => {
    const [getLastAction, setLastAction] = createSignal(NOTHING_RUN);
    const [getLastNestedAction, setLastNestedAction] = createSignal(NOTHING_RUN);

    const getExamples = createMemo(() => [
        {
            key: "default",
            name: "Default",
            readout: () =>
                `${getLastAction()} — a narrow arc opening sideways, the shape a combat menu uses: upright labels reading outward from the thing that opened them`,
            component: () => (
                <FanExample caption={"Fan"} items={ACTIONS} onActivate={(action) => setLastAction(action.name)} />
            ),
            path: `${EXAMPLES_ROOT}/Fan.tsx`,
        },
        {
            key: "submenus",
            name: "Submenus",
            readout: () =>
                `${getLastNestedAction()} — a level replaces the one before it rather than stacking beside it, and the row at the top is the item you came in through`,
            component: () => (
                <FanExample
                    caption={"Fan"}
                    items={NESTED_ACTIONS}
                    onActivate={(action) => setLastNestedAction(action.name)}
                />
            ),
            path: `${EXAMPLES_ROOT}/Fan.tsx`,
        },
    ]);

    return <PageExamples items={getExamples} />;
};
