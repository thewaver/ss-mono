<script lang="ts">
    import type { WheelMenuItem } from "@thewaver/ss-components-svelte";

    import type { ExampleDefs } from "../../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../../PageComponents/Examples/PageExamples.svelte";
    import WheelExample from "./Examples/Wheel.svelte";
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
                    items: [
                        { value: { name: "Blank" } },
                        { value: { name: "Dashboard" } },
                        { value: { name: "Report" } },
                    ],
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

    let lastAction = $state(NOTHING_RUN);
    let lastHalfAction = $state(NOTHING_RUN);
    let lastNestedAction = $state(NOTHING_RUN);
    let lastHalfNestedAction = $state(NOTHING_RUN);
    let lastTunedAction = $state(NOTHING_RUN);
    let lastWeightedAction = $state(NOTHING_RUN);
    let lastFlickedAction = $state(NOTHING_RUN);

    const examples: ExampleDefs[] = [
        {
            key: "wheel",
            name: "Whole wheel",
            readout: () =>
                `${lastAction} — the items are wedges of a hollow wheel, picked by the direction they lie in, with an ✕ in the hole that closes it`,
            component: wheelExample,
            path: `${EXAMPLES_ROOT}/Wheel.svelte`,
        },
        {
            key: "half",
            name: "Half wheel",
            readout: () =>
                `${lastHalfAction} — the same component over half a turn, on a wider hole because half a turn leaves each wedge half the room`,
            component: halfExample,
            path: `${EXAMPLES_ROOT}/Wheel.svelte`,
        },
        {
            key: "concentric",
            name: "Concentric bands",
            readout: () =>
                `${lastNestedAction} — a submenu is a band round the same center, aimed at the wedge that opened it and only as wide as its own items need`,
            component: concentricExample,
            path: `${EXAMPLES_ROOT}/Wheel.svelte`,
        },
        {
            key: "concentricHalves",
            name: "Concentric halves",
            readout: () =>
                `${lastHalfNestedAction} — the same nesting on half a wheel, shifted to stay in the upper half`,
            component: concentricHalvesExample,
            path: `${EXAMPLES_ROOT}/Wheel.svelte`,
        },
        {
            key: "weighted",
            name: "A wedge that asks for room",
            readout: () =>
                `${lastWeightedAction} — Confirm asks for half the turn and the other three share what is left`,
            component: weightedExample,
            path: `${EXAMPLES_ROOT}/Wheel.svelte`,
        },
        {
            key: "flick",
            name: "Hold and flick",
            readout: () =>
                `${lastFlickedAction} — press and hold the button, move a short way toward a wedge and let go; coming back to the middle before letting go picks nothing, and a plain click leaves the wheel open to be clicked through instead`,
            component: flickExample,
            path: `${EXAMPLES_ROOT}/Wheel.svelte`,
        },
        {
            key: "tuned",
            name: "Tuned",
            readout: () => `${lastTunedAction} — the same wheel with a fatter band and wider gaps between the wedges`,
            component: tunedExample,
            path: `${EXAMPLES_ROOT}/Wheel.svelte`,
        },
    ];
</script>

{#snippet wheelExample()}
    <WheelExample
        caption={"Wheel"}
        items={ACTIONS}
        onActivate={(action) => {
            lastAction = action.name;
        }}
    />
{/snippet}

{#snippet halfExample()}
    <WheelExample
        caption={"Half"}
        items={ACTIONS}
        spreadDegrees={HALF_TURN_DEGREES}
        onActivate={(action) => {
            lastHalfAction = action.name;
        }}
    />
{/snippet}

{#snippet concentricExample()}
    <WheelExample
        caption={"Wheel"}
        items={NESTED_ACTIONS}
        onActivate={(action) => {
            lastNestedAction = action.name;
        }}
    />
{/snippet}

{#snippet concentricHalvesExample()}
    <WheelExample
        caption={"Half"}
        items={NESTED_ACTIONS}
        spreadDegrees={HALF_TURN_DEGREES}
        onActivate={(action) => {
            lastHalfNestedAction = action.name;
        }}
    />
{/snippet}

{#snippet weightedExample()}
    <WheelExample
        caption={"Wheel"}
        items={WEIGHTED_ACTIONS}
        onActivate={(action) => {
            lastWeightedAction = action.name;
        }}
    />
{/snippet}

{#snippet flickExample()}
    <WheelExample
        caption={"Hold"}
        items={ACTIONS}
        opensOnHold={true}
        onActivate={(action) => {
            lastFlickedAction = action.name;
        }}
    />
{/snippet}

{#snippet tunedExample()}
    <WheelExample
        caption={"Wheel"}
        items={ACTIONS}
        holeRadius={64}
        bandWidth={120}
        layoutDefs={{ wedgeGapDegrees: 10 }}
        onActivate={(action) => {
            lastTunedAction = action.name;
        }}
    />
{/snippet}

<PageExamples items={examples} />
