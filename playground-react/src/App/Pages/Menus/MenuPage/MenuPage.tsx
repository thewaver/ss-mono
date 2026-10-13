import { useState } from "react";

import { EXAMPLES_ROOT, EXAMPLE_NAMES } from "@thewaver/ss-playground/App/Pages/Menus/MenuPage/MenuPage.const";

import { PageExamples } from "../../../PageComponents/Examples/Examples";
import { CascaderExample } from "./Examples/Cascader";
import { ContextAreaExample } from "./Examples/ContextArea";
import { DefaultExample } from "./Examples/Default";
import { DisabledExample } from "./Examples/Disabled";
import { DrivenExample } from "./Examples/Driven";
import { GlideExample } from "./Examples/Glide";
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
} from "./MenuPageReact.const";
import type { Action } from "./MenuPageReact.types";

export const MenuPage = () => {
    const [lastAction, setLastAction] = useState(NOTHING_RUN);
    const [lastDisabledAction, setLastDisabledAction] = useState(NOTHING_RUN);
    const [lastReachableAction, setLastReachableAction] = useState(NOTHING_RUN);
    const [lastNestedAction, setLastNestedAction] = useState(NOTHING_RUN);
    const [lastRightToLeftAction, setLastRightToLeftAction] = useState(NOTHING_RUN);
    const [lastFlippedAction, setLastFlippedAction] = useState(NOTHING_RUN);
    const [lastLayerAction, setLastLayerAction] = useState(NOTHING_RUN);
    const [lastDrivenAction, setLastDrivenAction] = useState(NOTHING_RUN);
    const [lastContextAction, setLastContextAction] = useState(NOTHING_RUN);
    const [lastGlideAction, setLastGlideAction] = useState(NOTHING_RUN);

    const [zoomPercent, setZoomPercent] = useState(ZOOM_RESET_PERCENT);

    const cascaderPathState = useState<string[]>([]);

    const applyZoom = (action: Action) => {
        const step = ZOOM_STEPS[action.name];

        setZoomPercent((prev) => (step === undefined ? ZOOM_RESET_PERCENT : Math.max(prev + step, ZOOM_STEP_PERCENT)));
    };

    const drivenVisibility = useState(false);
    const viewState = useState(VIEW_DEFAULTS);
    const [lastViewAction, setLastViewAction] = useState(NOTHING_RUN);

    const examples = [
        {
            key: "default",
            name: EXAMPLE_NAMES.default,
            readout: () => `${lastAction} — activating an item closes the menu`,
            component: () => <DefaultExample onActivate={(action) => setLastAction(action.name)} />,
            path: `${EXAMPLES_ROOT}/Default.tsx`,
        },
        {
            key: "glide",
            name: EXAMPLE_NAMES.glide,
            readout: () =>
                `${lastGlideAction} — the items paint no highlight of their own; one marker glides to whichever item the pointer or the arrows are on`,
            component: () => <GlideExample onActivate={(action) => setLastGlideAction(action.name)} />,
            path: `${EXAMPLES_ROOT}/Glide.tsx`,
        },
        {
            key: "driven",
            name: EXAMPLE_NAMES.driven,
            readout: () =>
                `${lastDrivenAction} — the menu is ${drivenVisibility[0] ? "open" : "closed"}, and it is anchored to the toggle rather than to its own trigger`,
            component: () => (
                <DrivenExample
                    visibility={drivenVisibility}
                    onActivate={(action) => setLastDrivenAction(action.name)}
                />
            ),
            path: `${EXAMPLES_ROOT}/Driven.tsx`,
        },
        {
            key: "context",
            name: EXAMPLE_NAMES.context,
            readout: () =>
                `${lastContextAction} — the menu opens where the pointer was, and there is no trigger button anywhere`,
            component: () => <ContextAreaExample onActivate={(action) => setLastContextAction(action.name)} />,
            path: `${EXAMPLES_ROOT}/ContextArea.tsx`,
        },
        {
            key: "staysOpen",
            name: EXAMPLE_NAMES.staysOpen,
            readout: () =>
                `zoom: ${zoomPercent}% — Zoom in and Zoom out leave the menu open so they can be pressed again, and Reset zoom closes it`,
            component: () => <DefaultExample items={ZOOM_ACTIONS} caption={"Zoom"} onActivate={applyZoom} />,
            path: `${EXAMPLES_ROOT}/Default.tsx`,
        },
        {
            key: "disabledItems",
            name: EXAMPLE_NAMES.disabledItems,
            readout: () => `${lastDisabledAction} — arrows skip Paste and Duplicate`,
            component: () => (
                <DefaultExample
                    items={ACTIONS_WITH_DISABLED}
                    onActivate={(action) => setLastDisabledAction(action.name)}
                />
            ),
            path: `${EXAMPLES_ROOT}/Default.tsx`,
        },
        {
            key: "disabledItemsReachable",
            name: EXAMPLE_NAMES.disabledItemsReachable,
            readout: () => `${lastReachableAction} — arrows stop on Paste, hover explains why`,
            component: () => (
                <DefaultExample
                    items={ACTIONS_WITH_REACHABLE}
                    onActivate={(action) => setLastReachableAction(action.name)}
                />
            ),
            path: `${EXAMPLES_ROOT}/Default.tsx`,
        },
        {
            key: "submenus",
            name: EXAMPLE_NAMES.submenus,
            readout: () => `${lastNestedAction} — ArrowRight steps in, ArrowLeft steps back out`,
            component: () => <SubmenusExample onActivate={(action) => setLastNestedAction(action.name)} />,
            path: `${EXAMPLES_ROOT}/Submenus.tsx`,
        },
        {
            key: "cascader",
            name: EXAMPLE_NAMES.cascader,
            readout: () =>
                `path: [${cascaderPathState[0].join(", ")}] — the trigger shows the path picked so far, and only a leaf writes it; a branch just opens the next level`,
            component: () => <CascaderExample path={cascaderPathState} />,
            path: `${EXAMPLES_ROOT}/Cascader.tsx`,
        },
        {
            key: "rightToLeft",
            name: EXAMPLE_NAMES.rightToLeft,
            readout: () =>
                `${lastRightToLeftAction} — the box around the trigger sets dir="rtl", so a submenu opens on the left, ArrowLeft steps in and ArrowRight steps back out`,
            component: () => <RightToLeftExample onActivate={(action) => setLastRightToLeftAction(action.name)} />,
            path: `${EXAMPLES_ROOT}/RightToLeft.tsx`,
        },
        {
            key: "placedAbove",
            name: EXAMPLE_NAMES.placedAbove,
            readout: () => `${lastFlippedAction} — the surface flips its own transform`,
            component: () => <PlacedAboveExample onActivate={(action) => setLastFlippedAction(action.name)} />,
            path: `${EXAMPLES_ROOT}/PlacedAbove.tsx`,
        },
        {
            key: "scrollingList",
            name: EXAMPLE_NAMES.scrollingList,
            readout: () => `${lastLayerAction} — Home and End reach both ends`,
            component: () => (
                <DefaultExample
                    items={LAYERS}
                    caption={"Layers"}
                    onActivate={(action) => setLastLayerAction(action.name)}
                />
            ),
            path: `${EXAMPLES_ROOT}/Default.tsx`,
        },
        {
            key: "stateful",
            name: EXAMPLE_NAMES.stateful,
            readout: () => `${lastViewAction} — ticked: [${viewState[0].map((action) => action.name).join(", ")}]`,
            component: () => (
                <StatefulExample checked={viewState} onActivate={(action) => setLastViewAction(`ran ${action.name}`)} />
            ),
            path: `${EXAMPLES_ROOT}/Stateful.tsx`,
        },
        {
            key: "disabled",
            name: EXAMPLE_NAMES.disabled,
            readout: () => "the trigger neither opens nor takes focus",
            component: () => <DisabledExample />,
            path: `${EXAMPLES_ROOT}/Disabled.tsx`,
        },
        {
            key: "reachable",
            name: EXAMPLE_NAMES.reachable,
            readout: () => "focusable so the tooltip can be read, but the menu must not open",
            component: () => <ReachableExample />,
            path: `${EXAMPLES_ROOT}/Reachable.tsx`,
        },
    ];

    return <PageExamples items={examples} />;
};
