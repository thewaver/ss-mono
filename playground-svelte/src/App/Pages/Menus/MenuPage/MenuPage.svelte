<script lang="ts">
    import type { ExampleDefs } from "../../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../../PageComponents/Examples/PageExamples.svelte";
    import CascaderExample from "./Examples/Cascader.svelte";
    import ContextAreaExample from "./Examples/ContextArea.svelte";
    import DefaultExample from "./Examples/Default.svelte";
    import DisabledExample from "./Examples/Disabled.svelte";
    import DrivenExample from "./Examples/Driven.svelte";
    import GlideExample from "./Examples/Glide.svelte";
    import PlacedAboveExample from "./Examples/PlacedAbove.svelte";
    import ReachableExample from "./Examples/Reachable.svelte";
    import RightToLeftExample from "./Examples/RightToLeft.svelte";
    import StatefulExample from "./Examples/Stateful.svelte";
    import SubmenusExample from "./Examples/Submenus.svelte";
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
    } from "./MenuPage.const.svelte";
    import type { Action } from "./MenuPage.types";

    const EXAMPLES_ROOT = "/src/App/Pages/Menus/MenuPage/Examples";

    let lastAction = $state(NOTHING_RUN);
    let lastDisabledAction = $state(NOTHING_RUN);
    let lastReachableAction = $state(NOTHING_RUN);
    let lastNestedAction = $state(NOTHING_RUN);
    let lastRightToLeftAction = $state(NOTHING_RUN);
    let lastFlippedAction = $state(NOTHING_RUN);
    let lastLayerAction = $state(NOTHING_RUN);
    let lastDrivenAction = $state(NOTHING_RUN);
    let lastContextAction = $state(NOTHING_RUN);
    let lastGlideAction = $state(NOTHING_RUN);

    let zoomPercent = $state(ZOOM_RESET_PERCENT);

    let cascaderPath = $state.raw<string[]>([]);

    const applyZoom = (action: Action) => {
        const step = ZOOM_STEPS[action.name];

        zoomPercent = step === undefined ? ZOOM_RESET_PERCENT : Math.max(zoomPercent + step, ZOOM_STEP_PERCENT);
    };

    let drivenVisibility = $state(false);
    let viewChecked = $state.raw<Action[]>(VIEW_DEFAULTS);
    let lastViewAction = $state(NOTHING_RUN);

    const examples: ExampleDefs[] = [
        {
            key: "default",
            name: "Default",
            readout: () => `${lastAction} — activating an item closes the menu`,
            component: defaultExample,
            path: `${EXAMPLES_ROOT}/Default.svelte`,
        },
        {
            key: "glide",
            name: "A gliding highlight",
            readout: () =>
                `${lastGlideAction} — the items paint no highlight of their own; one marker glides to whichever item the pointer or the arrows are on`,
            component: glideExample,
            path: `${EXAMPLES_ROOT}/Glide.svelte`,
        },
        {
            key: "driven",
            name: "Driven from outside",
            readout: () =>
                `${lastDrivenAction} — the menu is ${drivenVisibility ? "open" : "closed"}, and it is anchored to the toggle rather than to its own trigger`,
            component: drivenExample,
            path: `${EXAMPLES_ROOT}/Driven.svelte`,
        },
        {
            key: "context",
            name: "Opened by a right-click",
            readout: () =>
                `${lastContextAction} — the menu opens where the pointer was, and there is no trigger button anywhere`,
            component: contextExample,
            path: `${EXAMPLES_ROOT}/ContextArea.svelte`,
        },
        {
            key: "staysOpen",
            name: "Commands worth repeating",
            readout: () =>
                `zoom: ${zoomPercent}% — Zoom in and Zoom out leave the menu open so they can be pressed again, and Reset zoom closes it`,
            component: staysOpenExample,
            path: `${EXAMPLES_ROOT}/Default.svelte`,
        },
        {
            key: "disabledItems",
            name: "Disabled items",
            readout: () => `${lastDisabledAction} — arrows skip Paste and Duplicate`,
            component: disabledItemsExample,
            path: `${EXAMPLES_ROOT}/Default.svelte`,
        },
        {
            key: "disabledItemsReachable",
            name: "Disabled items + reachable",
            readout: () => `${lastReachableAction} — arrows stop on Paste, hover explains why`,
            component: disabledItemsReachableExample,
            path: `${EXAMPLES_ROOT}/Default.svelte`,
        },
        {
            key: "submenus",
            name: "Submenus",
            readout: () => `${lastNestedAction} — ArrowRight steps in, ArrowLeft steps back out`,
            component: submenusExample,
            path: `${EXAMPLES_ROOT}/Submenus.svelte`,
        },
        {
            key: "cascader",
            name: "Cascader",
            readout: () =>
                `path: [${cascaderPath.join(", ")}] — the trigger shows the path picked so far, and only a leaf writes it; a branch just opens the next level`,
            component: cascaderExample,
            path: `${EXAMPLES_ROOT}/Cascader.svelte`,
        },
        {
            key: "rightToLeft",
            name: "Submenus in a right-to-left box",
            readout: () =>
                `${lastRightToLeftAction} — the box around the trigger sets dir="rtl", so a submenu opens on the left, ArrowLeft steps in and ArrowRight steps back out`,
            component: rightToLeftExample,
            path: `${EXAMPLES_ROOT}/RightToLeft.svelte`,
        },
        {
            key: "placedAbove",
            name: "Placed above",
            readout: () => `${lastFlippedAction} — the surface flips its own transform`,
            component: placedAboveExample,
            path: `${EXAMPLES_ROOT}/PlacedAbove.svelte`,
        },
        {
            key: "scrollingList",
            name: "Scrolling list",
            readout: () => `${lastLayerAction} — Home and End reach both ends`,
            component: scrollingListExample,
            path: `${EXAMPLES_ROOT}/Default.svelte`,
        },
        {
            key: "stateful",
            name: "Rows that hold a state",
            readout: () => `${lastViewAction} — ticked: [${viewChecked.map((action) => action.name).join(", ")}]`,
            component: statefulExample,
            path: `${EXAMPLES_ROOT}/Stateful.svelte`,
        },
        {
            key: "disabled",
            name: "Disabled",
            readout: () => "the trigger neither opens nor takes focus",
            component: disabledExample,
            path: `${EXAMPLES_ROOT}/Disabled.svelte`,
        },
        {
            key: "reachable",
            name: "Disabled + reachable",
            readout: () => "focusable so the tooltip can be read, but the menu must not open",
            component: reachableExample,
            path: `${EXAMPLES_ROOT}/Reachable.svelte`,
        },
    ];
</script>

{#snippet glideExample()}
    <GlideExample
        onActivate={(action) => {
            lastGlideAction = action.name;
        }}
    />
{/snippet}

{#snippet defaultExample()}
    <DefaultExample
        onActivate={(action) => {
            lastAction = action.name;
        }}
    />
{/snippet}

{#snippet drivenExample()}
    <DrivenExample
        bind:visibility={drivenVisibility}
        onActivate={(action) => {
            lastDrivenAction = action.name;
        }}
    />
{/snippet}

{#snippet contextExample()}
    <ContextAreaExample
        onActivate={(action) => {
            lastContextAction = action.name;
        }}
    />
{/snippet}

{#snippet staysOpenExample()}
    <DefaultExample items={ZOOM_ACTIONS} caption={"Zoom"} onActivate={applyZoom} />
{/snippet}

{#snippet disabledItemsExample()}
    <DefaultExample
        items={ACTIONS_WITH_DISABLED}
        onActivate={(action) => {
            lastDisabledAction = action.name;
        }}
    />
{/snippet}

{#snippet disabledItemsReachableExample()}
    <DefaultExample
        items={ACTIONS_WITH_REACHABLE}
        onActivate={(action) => {
            lastReachableAction = action.name;
        }}
    />
{/snippet}

{#snippet submenusExample()}
    <SubmenusExample
        onActivate={(action) => {
            lastNestedAction = action.name;
        }}
    />
{/snippet}

{#snippet cascaderExample()}
    <CascaderExample bind:path={cascaderPath} />
{/snippet}

{#snippet rightToLeftExample()}
    <RightToLeftExample
        onActivate={(action) => {
            lastRightToLeftAction = action.name;
        }}
    />
{/snippet}

{#snippet placedAboveExample()}
    <PlacedAboveExample
        onActivate={(action) => {
            lastFlippedAction = action.name;
        }}
    />
{/snippet}

{#snippet scrollingListExample()}
    <DefaultExample
        items={LAYERS}
        caption={"Layers"}
        onActivate={(action) => {
            lastLayerAction = action.name;
        }}
    />
{/snippet}

{#snippet statefulExample()}
    <StatefulExample
        bind:checked={viewChecked}
        onActivate={(action) => {
            lastViewAction = `ran ${action.name}`;
        }}
    />
{/snippet}

{#snippet disabledExample()}
    <DisabledExample />
{/snippet}

{#snippet reachableExample()}
    <ReachableExample />
{/snippet}

<PageExamples items={examples} />
