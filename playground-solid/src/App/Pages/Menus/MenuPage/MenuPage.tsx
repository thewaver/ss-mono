import { createMemo, createSignal } from "solid-js";

import { EXAMPLES_ROOT, EXAMPLE_NAMES } from "@thewaver/ss-playground/App/Pages/Menus/MenuPage/MenuPage.const";

import { PageExamples } from "../../../PageComponents/Examples/Examples";
import { CascaderExample } from "./Examples/Cascader";
import { ContextAreaExample } from "./Examples/ContextArea";
import { ContextRightToLeftExample } from "./Examples/ContextRightToLeft";
import { DefaultExample } from "./Examples/Default";
import { DisabledExample } from "./Examples/Disabled";
import { DrivenExample } from "./Examples/Driven";
import { GlideExample } from "./Examples/Glide";
import { PlacedAboveExample } from "./Examples/PlacedAbove";
import { ReachableExample } from "./Examples/Reachable";
import { RightToLeftExample } from "./Examples/RightToLeft";
import { RightToLeftPlacedExample } from "./Examples/RightToLeftPlaced";
import { SectionsExample } from "./Examples/Sections";
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
} from "./MenuPageSolid.const";
import type { Action } from "./MenuPageSolid.types";

export const MenuPage = () => {
    const [getLastAction, setLastAction] = createSignal(NOTHING_RUN);
    const [getLastDisabledAction, setLastDisabledAction] = createSignal(NOTHING_RUN);
    const [getLastReachableAction, setLastReachableAction] = createSignal(NOTHING_RUN);
    const [getLastNestedAction, setLastNestedAction] = createSignal(NOTHING_RUN);
    const [getLastRightToLeftAction, setLastRightToLeftAction] = createSignal(NOTHING_RUN);
    const [getLastPlacedRightToLeftAction, setLastPlacedRightToLeftAction] = createSignal(NOTHING_RUN);
    const [getLastContextRightToLeftAction, setLastContextRightToLeftAction] = createSignal(NOTHING_RUN);
    const [getLastFlippedAction, setLastFlippedAction] = createSignal(NOTHING_RUN);
    const [getLastLayerAction, setLastLayerAction] = createSignal(NOTHING_RUN);
    const [getLastDrivenAction, setLastDrivenAction] = createSignal(NOTHING_RUN);
    const [getLastContextAction, setLastContextAction] = createSignal(NOTHING_RUN);
    const [getLastGlideAction, setLastGlideAction] = createSignal(NOTHING_RUN);

    const [getZoomPercent, setZoomPercent] = createSignal(ZOOM_RESET_PERCENT);

    const cascaderPathSignal = createSignal<string[]>([]);

    const applyZoom = (action: Action) => {
        const step = ZOOM_STEPS[action.name];

        setZoomPercent((prev) => (step === undefined ? ZOOM_RESET_PERCENT : Math.max(prev + step, ZOOM_STEP_PERCENT)));
    };

    const drivenVisibility = createSignal(false);
    const viewSignal = createSignal(VIEW_DEFAULTS);
    const sectionsSignal = createSignal(VIEW_DEFAULTS);
    const [getLastSectionsAction, setLastSectionsAction] = createSignal(NOTHING_RUN);
    const [getLastViewAction, setLastViewAction] = createSignal(NOTHING_RUN);

    const getExamples = createMemo(() => [
        {
            key: "default",
            name: EXAMPLE_NAMES.default,
            readout: () => `${getLastAction()} — activating an item closes the menu`,
            component: () => <DefaultExample onActivate={(action) => setLastAction(action.name)} />,
            path: `${EXAMPLES_ROOT}/Default.tsx`,
        },
        {
            key: "glide",
            name: EXAMPLE_NAMES.glide,
            readout: () =>
                `${getLastGlideAction()} — the items paint no highlight of their own; one marker glides to whichever item the pointer or the arrows are on`,
            component: () => <GlideExample onActivate={(action) => setLastGlideAction(action.name)} />,
            path: `${EXAMPLES_ROOT}/Glide.tsx`,
        },
        {
            key: "driven",
            name: EXAMPLE_NAMES.driven,
            readout: () =>
                `${getLastDrivenAction()} — the menu is ${drivenVisibility[0]() ? "open" : "closed"}, and it is anchored to the toggle rather than to its own trigger`,
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
                `${getLastContextAction()} — the menu opens where the pointer was, and there is no trigger button anywhere`,
            component: () => <ContextAreaExample onActivate={(action) => setLastContextAction(action.name)} />,
            path: `${EXAMPLES_ROOT}/ContextArea.tsx`,
        },
        {
            key: "contextRightToLeft",
            name: EXAMPLE_NAMES.contextRightToLeft,
            readout: () =>
                `${getLastContextRightToLeftAction()} — the box around the region sets dir="rtl", so the menu spreads to the left of the pointer and its submenus open on the left`,
            component: () => (
                <ContextRightToLeftExample onActivate={(action) => setLastContextRightToLeftAction(action.name)} />
            ),
            path: `${EXAMPLES_ROOT}/ContextRightToLeft.tsx`,
        },
        {
            key: "staysOpen",
            name: EXAMPLE_NAMES.staysOpen,
            readout: () =>
                `zoom: ${getZoomPercent()}% — Zoom in and Zoom out leave the menu open so they can be pressed again, and Reset zoom closes it`,
            component: () => <DefaultExample items={ZOOM_ACTIONS} caption={"Zoom"} onActivate={applyZoom} />,
            path: `${EXAMPLES_ROOT}/Default.tsx`,
        },
        {
            key: "disabledItems",
            name: EXAMPLE_NAMES.disabledItems,
            readout: () => `${getLastDisabledAction()} — arrows skip Paste and Duplicate`,
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
            readout: () => `${getLastReachableAction()} — arrows stop on Paste, hover explains why`,
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
            readout: () => `${getLastNestedAction()} — ArrowRight steps in, ArrowLeft steps back out`,
            component: () => <SubmenusExample onActivate={(action) => setLastNestedAction(action.name)} />,
            path: `${EXAMPLES_ROOT}/Submenus.tsx`,
        },
        {
            key: "cascader",
            name: EXAMPLE_NAMES.cascader,
            readout: () =>
                `path: [${cascaderPathSignal[0]().join(", ")}] — the trigger shows the path picked so far, and only a leaf writes it; a branch just opens the next level`,
            component: () => <CascaderExample path={cascaderPathSignal} />,
            path: `${EXAMPLES_ROOT}/Cascader.tsx`,
        },
        {
            key: "rightToLeft",
            name: EXAMPLE_NAMES.rightToLeft,
            readout: () =>
                `${getLastRightToLeftAction()} — the box around the trigger sets dir="rtl", so a submenu opens on the left, ArrowLeft steps in and ArrowRight steps back out`,
            component: () => <RightToLeftExample onActivate={(action) => setLastRightToLeftAction(action.name)} />,
            path: `${EXAMPLES_ROOT}/RightToLeft.tsx`,
        },
        {
            key: "rightToLeftPlaced",
            name: EXAMPLE_NAMES.rightToLeftPlaced,
            readout: () =>
                `${getLastPlacedRightToLeftAction()} — the box around the trigger sets dir="rtl", but the menu names the right as its submenu side, so its submenus open on the right and ArrowRight opens them`,
            component: () => (
                <RightToLeftPlacedExample onActivate={(action) => setLastPlacedRightToLeftAction(action.name)} />
            ),
            path: `${EXAMPLES_ROOT}/RightToLeftPlaced.tsx`,
        },
        {
            key: "placedAbove",
            name: EXAMPLE_NAMES.placedAbove,
            readout: () => `${getLastFlippedAction()} — the surface flips its own transform`,
            component: () => <PlacedAboveExample onActivate={(action) => setLastFlippedAction(action.name)} />,
            path: `${EXAMPLES_ROOT}/PlacedAbove.tsx`,
        },
        {
            key: "scrollingList",
            name: EXAMPLE_NAMES.scrollingList,
            readout: () => `${getLastLayerAction()} — Home and End reach both ends`,
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
            readout: () =>
                `${getLastViewAction()} — ticked: [${viewSignal[0]()
                    .map((action) => action.name)
                    .join(", ")}]`,
            component: () => (
                <StatefulExample
                    checked={viewSignal}
                    onActivate={(action) => setLastViewAction(`ran ${action.name}`)}
                />
            ),
            path: `${EXAMPLES_ROOT}/Stateful.tsx`,
        },
        {
            key: "sections",
            name: EXAMPLE_NAMES.sections,
            readout: () =>
                `${getLastSectionsAction()} — ticked: [${sectionsSignal[0]()
                    .map((action) => action.name)
                    .join(
                        ", ",
                    )}]; each group is named, the arrows walk straight through the headings, and the radio choice stays inside its own group`,
            component: () => (
                <SectionsExample
                    checked={sectionsSignal}
                    onActivate={(action) => setLastSectionsAction(`ran ${action.name}`)}
                />
            ),
            path: `${EXAMPLES_ROOT}/Sections.tsx`,
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
    ]);

    return <PageExamples items={getExamples} />;
};
