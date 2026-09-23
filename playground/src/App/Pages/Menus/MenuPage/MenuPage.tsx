import { createMemo, createSignal } from "solid-js";

import { PageExamples } from "../../../PageComponents/Examples/Examples";
import { CascaderExample } from "./Examples/Cascader";
import { ContextAreaExample } from "./Examples/ContextArea";
import { DefaultExample } from "./Examples/Default";
import { DisabledExample } from "./Examples/Disabled";
import { DrivenExample } from "./Examples/Driven";
import { PlacedAboveExample } from "./Examples/PlacedAbove";
import { ReachableExample } from "./Examples/Reachable";
import { RightToLeftExample } from "./Examples/RightToLeft";
import { StatefulExample } from "./Examples/Stateful";
import { SubmenusExample } from "./Examples/Submenus";
import {
    ACTIONS_WITH_DISABLED,
    ACTIONS_WITH_REACHABLE,
    LAYERS,
    NOTHING_RUN,
    VIEW_DEFAULTS,
    ZOOM_ACTIONS,
    ZOOM_RESET_PERCENT,
    ZOOM_STEPS,
    ZOOM_STEP_PERCENT,
} from "./MenuPage.const";
import type { Action } from "./MenuPage.types";

const EXAMPLES_ROOT = "/src/App/Pages/Menus/MenuPage/Examples";

export const MenuPage = () => {
    const [getLastAction, setLastAction] = createSignal(NOTHING_RUN);
    const [getLastDisabledAction, setLastDisabledAction] = createSignal(NOTHING_RUN);
    const [getLastReachableAction, setLastReachableAction] = createSignal(NOTHING_RUN);
    const [getLastNestedAction, setLastNestedAction] = createSignal(NOTHING_RUN);
    const [getLastRightToLeftAction, setLastRightToLeftAction] = createSignal(NOTHING_RUN);
    const [getLastFlippedAction, setLastFlippedAction] = createSignal(NOTHING_RUN);
    const [getLastLayerAction, setLastLayerAction] = createSignal(NOTHING_RUN);
    const [getLastDrivenAction, setLastDrivenAction] = createSignal(NOTHING_RUN);
    const [getLastContextAction, setLastContextAction] = createSignal(NOTHING_RUN);

    const [getZoomPercent, setZoomPercent] = createSignal(ZOOM_RESET_PERCENT);

    const cascaderPathSignal = createSignal<string[]>([]);

    const applyZoom = (action: Action) => {
        const step = ZOOM_STEPS[action.name];

        setZoomPercent((prev) => (step === undefined ? ZOOM_RESET_PERCENT : Math.max(prev + step, ZOOM_STEP_PERCENT)));
    };

    const drivenVisibility = createSignal(false);
    const viewSignal = createSignal(VIEW_DEFAULTS);
    const [getLastViewAction, setLastViewAction] = createSignal(NOTHING_RUN);

    const getExamples = createMemo(() => [
        {
            key: "driven",
            name: "Driven from outside",
            readout: () =>
                `${getLastDrivenAction()} — the menu is ${drivenVisibility[0]() ? "open" : "closed"}, and it is anchored to the toggle rather than to its own trigger`,
            component: () => (
                <DrivenExample
                    visibilitySignal={drivenVisibility}
                    onActivate={(action) => setLastDrivenAction(action.name)}
                />
            ),
            path: `${EXAMPLES_ROOT}/Driven.tsx`,
        },
        {
            key: "context",
            name: "Opened by a right-click",
            readout: () =>
                `${getLastContextAction()} — the menu opens where the pointer was, and there is no trigger button anywhere`,
            component: () => <ContextAreaExample onActivate={(action) => setLastContextAction(action.name)} />,
            path: `${EXAMPLES_ROOT}/ContextArea.tsx`,
        },
        {
            key: "default",
            name: "Default",
            readout: () => `${getLastAction()} — activating an item closes the menu`,
            component: () => <DefaultExample onActivate={(action) => setLastAction(action.name)} />,
            path: `${EXAMPLES_ROOT}/Default.tsx`,
        },
        {
            key: "staysOpen",
            name: "Commands worth repeating",
            readout: () =>
                `zoom: ${getZoomPercent()}% — Zoom in and Zoom out leave the menu open so they can be pressed again, and Reset zoom closes it`,
            component: () => <DefaultExample items={() => ZOOM_ACTIONS} caption={"Zoom"} onActivate={applyZoom} />,
            path: `${EXAMPLES_ROOT}/Default.tsx`,
        },
        {
            key: "disabledItems",
            name: "Disabled items",
            readout: () => `${getLastDisabledAction()} — arrows skip Paste and Duplicate`,
            component: () => (
                <DefaultExample
                    items={() => ACTIONS_WITH_DISABLED}
                    onActivate={(action) => setLastDisabledAction(action.name)}
                />
            ),
            path: `${EXAMPLES_ROOT}/Default.tsx`,
        },
        {
            key: "disabledItemsReachable",
            name: "Disabled items + reachable",
            readout: () => `${getLastReachableAction()} — arrows stop on Paste, hover explains why`,
            component: () => (
                <DefaultExample
                    items={() => ACTIONS_WITH_REACHABLE}
                    onActivate={(action) => setLastReachableAction(action.name)}
                />
            ),
            path: `${EXAMPLES_ROOT}/Default.tsx`,
        },
        {
            key: "submenus",
            name: "Submenus",
            readout: () => `${getLastNestedAction()} — ArrowRight steps in, ArrowLeft steps back out`,
            component: () => <SubmenusExample onActivate={(action) => setLastNestedAction(action.name)} />,
            path: `${EXAMPLES_ROOT}/Submenus.tsx`,
        },
        {
            key: "cascader",
            name: "Cascader",
            readout: () =>
                `path: [${cascaderPathSignal[0]().join(", ")}] — the trigger shows the path picked so far, and only a leaf writes it; a branch just opens the next level`,
            component: () => <CascaderExample pathSignal={cascaderPathSignal} />,
            path: `${EXAMPLES_ROOT}/Cascader.tsx`,
        },
        {
            key: "rightToLeft",
            name: "Submenus in a right-to-left box",
            readout: () =>
                `${getLastRightToLeftAction()} — the box around the trigger sets dir="rtl", so a submenu opens on the left, ArrowLeft steps in and ArrowRight steps back out`,
            component: () => <RightToLeftExample onActivate={(action) => setLastRightToLeftAction(action.name)} />,
            path: `${EXAMPLES_ROOT}/RightToLeft.tsx`,
        },
        {
            key: "placedAbove",
            name: "Placed above",
            readout: () => `${getLastFlippedAction()} — the surface flips its own transform`,
            component: () => <PlacedAboveExample onActivate={(action) => setLastFlippedAction(action.name)} />,
            path: `${EXAMPLES_ROOT}/PlacedAbove.tsx`,
        },
        {
            key: "scrollingList",
            name: "Scrolling list",
            readout: () => `${getLastLayerAction()} — Home and End reach both ends`,
            component: () => (
                <DefaultExample
                    items={() => LAYERS}
                    caption={"Layers"}
                    onActivate={(action) => setLastLayerAction(action.name)}
                />
            ),
            path: `${EXAMPLES_ROOT}/Default.tsx`,
        },
        {
            key: "stateful",
            name: "Rows that hold a state",
            readout: () =>
                `${getLastViewAction()} — ticked: [${viewSignal[0]()
                    .map((action) => action.name)
                    .join(", ")}]`,
            component: () => (
                <StatefulExample
                    checkedSignal={viewSignal}
                    onActivate={(action) => setLastViewAction(`ran ${action.name}`)}
                />
            ),
            path: `${EXAMPLES_ROOT}/Stateful.tsx`,
        },
        {
            key: "disabled",
            name: "Disabled",
            readout: () => "the trigger neither opens nor takes focus",
            component: () => <DisabledExample />,
            path: `${EXAMPLES_ROOT}/Disabled.tsx`,
        },
        {
            key: "reachable",
            name: "Disabled + reachable",
            readout: () => "focusable so the tooltip can be read, but the menu must not open",
            component: () => <ReachableExample />,
            path: `${EXAMPLES_ROOT}/Reachable.tsx`,
        },
    ]);

    return <PageExamples items={getExamples} />;
};
