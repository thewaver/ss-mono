import { createMemo, createSignal } from "solid-js";

import type { WheelMenuItem } from "@thewaver/ss-components";

import { PageExamples } from "../../../PageComponents/Examples/Examples";
import { WheelExample } from "./Examples/Wheel";
import type { WheelAction } from "./WheelMenuPage.types";

const EXAMPLES_ROOT = "/src/App/Pages/Menus/WheelMenuPage/Examples";
const HALF_TURN_DEGREES = 180;

const NOTHING_RUN = "nothing run yet";

const ACTIONS: WheelMenuItem<WheelAction>[] = [
    { value: { name: "Cut", shortcut: "Ctrl+X" } },
    { value: { name: "Copy", shortcut: "Ctrl+C" } },
    { value: { name: "Paste", shortcut: "Ctrl+V" } },
    { value: { name: "Duplicate" } },
    { value: { name: "Delete", shortcut: "Del" } },
];

const NESTED_ACTIONS: WheelMenuItem<WheelAction>[] = [
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

const WEIGHTED_ACTIONS: WheelMenuItem<WheelAction>[] = [
    { value: { name: "Confirm" }, arcDegrees: 180 },
    { value: { name: "Cancel" } },
    { value: { name: "Later" } },
    { value: { name: "Help" } },
];

export const WheelMenuPage = () => {
    const [getLastAction, setLastAction] = createSignal(NOTHING_RUN);
    const [getLastHalfAction, setLastHalfAction] = createSignal(NOTHING_RUN);
    const [getLastNestedAction, setLastNestedAction] = createSignal(NOTHING_RUN);
    const [getLastHalfNestedAction, setLastHalfNestedAction] = createSignal(NOTHING_RUN);
    const [getLastTunedAction, setLastTunedAction] = createSignal(NOTHING_RUN);
    const [getLastWeightedAction, setLastWeightedAction] = createSignal(NOTHING_RUN);

    const getExamples = createMemo(() => [
        {
            key: "wheel",
            name: "Whole wheel",
            readout: () =>
                `${getLastAction()} — the items are wedges of a hollow wheel, picked by the direction they lie in, with an ✕ in the hole that closes it`,
            component: () => (
                <WheelExample caption={"Wheel"} items={ACTIONS} onActivate={(action) => setLastAction(action.name)} />
            ),
            path: `${EXAMPLES_ROOT}/Wheel.tsx`,
        },
        {
            key: "half",
            name: "Half wheel",
            readout: () =>
                `${getLastHalfAction()} — the same component over half a turn, on a wider hole because half a turn leaves each wedge half the room`,
            component: () => (
                <WheelExample
                    caption={"Half"}
                    items={ACTIONS}
                    spreadDegrees={() => HALF_TURN_DEGREES}
                    onActivate={(action) => setLastHalfAction(action.name)}
                />
            ),
            path: `${EXAMPLES_ROOT}/Wheel.tsx`,
        },
        {
            key: "concentric",
            name: "Concentric bands",
            readout: () =>
                `${getLastNestedAction()} — a submenu is a band round the same centre, aimed at the wedge that opened it and only as wide as its own items need`,
            component: () => (
                <WheelExample
                    caption={"Wheel"}
                    items={NESTED_ACTIONS}
                    onActivate={(action) => setLastNestedAction(action.name)}
                />
            ),
            path: `${EXAMPLES_ROOT}/Wheel.tsx`,
        },
        {
            key: "concentricHalves",
            name: "Concentric halves",
            readout: () =>
                `${getLastHalfNestedAction()} — the same nesting on half a wheel, shifted to stay in the upper half`,
            component: () => (
                <WheelExample
                    caption={"Half"}
                    items={NESTED_ACTIONS}
                    spreadDegrees={() => HALF_TURN_DEGREES}
                    onActivate={(action) => setLastHalfNestedAction(action.name)}
                />
            ),
            path: `${EXAMPLES_ROOT}/Wheel.tsx`,
        },
        {
            key: "weighted",
            name: "A wedge that asks for room",
            readout: () =>
                `${getLastWeightedAction()} — Confirm asks for half the turn and the other three share what is left`,
            component: () => (
                <WheelExample
                    caption={"Wheel"}
                    items={WEIGHTED_ACTIONS}
                    onActivate={(action) => setLastWeightedAction(action.name)}
                />
            ),
            path: `${EXAMPLES_ROOT}/Wheel.tsx`,
        },
        {
            key: "tuned",
            name: "Tuned",
            readout: () =>
                `${getLastTunedAction()} — the same wheel with a fatter band and wider gaps between the wedges`,
            component: () => (
                <WheelExample
                    caption={"Wheel"}
                    items={ACTIONS}
                    layoutDefs={{ bandWidthPx: 120, wedgeGapDegrees: 10 }}
                    onActivate={(action) => setLastTunedAction(action.name)}
                />
            ),
            path: `${EXAMPLES_ROOT}/Wheel.tsx`,
        },
    ]);

    return <PageExamples items={getExamples} />;
};
