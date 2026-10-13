import { useState } from "react";

import type { WheelMenuItem } from "@thewaver/ss-components-react";
import {
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
    HALF_TURN_DEGREES,
    NOTHING_RUN,
} from "@thewaver/ss-playground/App/Pages/Menus/WheelMenuPage/WheelMenuPage.const";

import { PageExamples } from "../../../PageComponents/Examples/Examples";
import { WheelExample } from "./Examples/Wheel";
import type { WheelAction } from "./WheelMenuPageReact.types";

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
    const [lastAction, setLastAction] = useState(NOTHING_RUN);
    const [lastHalfAction, setLastHalfAction] = useState(NOTHING_RUN);
    const [lastNestedAction, setLastNestedAction] = useState(NOTHING_RUN);
    const [lastHalfNestedAction, setLastHalfNestedAction] = useState(NOTHING_RUN);
    const [lastTunedAction, setLastTunedAction] = useState(NOTHING_RUN);
    const [lastWeightedAction, setLastWeightedAction] = useState(NOTHING_RUN);
    const [lastFlickedAction, setLastFlickedAction] = useState(NOTHING_RUN);

    const examples = [
        {
            key: "wheel",
            name: EXAMPLE_NAMES.wheel,
            readout: () =>
                `${lastAction} — the items are wedges of a hollow wheel, picked by the direction they lie in, with an ✕ in the hole that closes it`,
            component: () => (
                <WheelExample caption={"Wheel"} items={ACTIONS} onActivate={(action) => setLastAction(action.name)} />
            ),
            path: `${EXAMPLES_ROOT}/Wheel.tsx`,
        },
        {
            key: "half",
            name: EXAMPLE_NAMES.half,
            readout: () =>
                `${lastHalfAction} — the same component over half a turn, on a wider hole because half a turn leaves each wedge half the room`,
            component: () => (
                <WheelExample
                    caption={"Half"}
                    items={ACTIONS}
                    spreadDegrees={HALF_TURN_DEGREES}
                    onActivate={(action) => setLastHalfAction(action.name)}
                />
            ),
            path: `${EXAMPLES_ROOT}/Wheel.tsx`,
        },
        {
            key: "concentric",
            name: EXAMPLE_NAMES.concentric,
            readout: () =>
                `${lastNestedAction} — a submenu is a band round the same center, aimed at the wedge that opened it and only as wide as its own items need`,
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
            name: EXAMPLE_NAMES.concentricHalves,
            readout: () =>
                `${lastHalfNestedAction} — the same nesting on half a wheel, shifted to stay in the upper half`,
            component: () => (
                <WheelExample
                    caption={"Half"}
                    items={NESTED_ACTIONS}
                    spreadDegrees={HALF_TURN_DEGREES}
                    onActivate={(action) => setLastHalfNestedAction(action.name)}
                />
            ),
            path: `${EXAMPLES_ROOT}/Wheel.tsx`,
        },
        {
            key: "weighted",
            name: EXAMPLE_NAMES.weighted,
            readout: () =>
                `${lastWeightedAction} — Confirm asks for half the turn and the other three share what is left`,
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
            key: "flick",
            name: EXAMPLE_NAMES.flick,
            readout: () =>
                `${lastFlickedAction} — press and hold the button, move a short way toward a wedge and let go; coming back to the middle before letting go picks nothing, and a plain click leaves the wheel open to be clicked through instead`,
            component: () => (
                <WheelExample
                    caption={"Hold"}
                    items={ACTIONS}
                    opensOnHold={true}
                    onActivate={(action) => setLastFlickedAction(action.name)}
                />
            ),
            path: `${EXAMPLES_ROOT}/Wheel.tsx`,
        },
        {
            key: "tuned",
            name: EXAMPLE_NAMES.tuned,
            readout: () => `${lastTunedAction} — the same wheel with a fatter band and wider gaps between the wedges`,
            component: () => (
                <WheelExample
                    caption={"Wheel"}
                    items={ACTIONS}
                    holeRadius={64}
                    bandWidth={120}
                    layoutDefs={{ wedgeGapDegrees: 10 }}
                    onActivate={(action) => setLastTunedAction(action.name)}
                />
            ),
            path: `${EXAMPLES_ROOT}/Wheel.tsx`,
        },
    ];

    return <PageExamples items={examples} />;
};
