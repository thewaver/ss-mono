<script lang="ts">
    import type { MenuItem } from "@thewaver/ss-components-svelte";

    import type { ExampleDefs } from "../../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../../PageComponents/Examples/PageExamples.svelte";
    import FanExample from "./Examples/Fan.svelte";
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

    let lastAction = $state(NOTHING_RUN);
    let lastNestedAction = $state(NOTHING_RUN);

    const examples: ExampleDefs[] = [
        {
            key: "default",
            name: "Default",
            readout: () =>
                `${lastAction} — a narrow arc opening sideways, the shape a combat menu uses: upright labels reading outward from the thing that opened them`,
            component: defaultExample,
            path: `${EXAMPLES_ROOT}/Fan.svelte`,
        },
        {
            key: "submenus",
            name: "Submenus",
            readout: () =>
                `${lastNestedAction} — a level replaces the one before it rather than stacking beside it, and the row at the top is the item you came in through`,
            component: submenusExample,
            path: `${EXAMPLES_ROOT}/Fan.svelte`,
        },
    ];
</script>

{#snippet defaultExample()}
    <FanExample
        caption={"Fan"}
        items={ACTIONS}
        onActivate={(action) => {
            lastAction = action.name;
        }}
    />
{/snippet}

{#snippet submenusExample()}
    <FanExample
        caption={"Fan"}
        items={NESTED_ACTIONS}
        onActivate={(action) => {
            lastNestedAction = action.name;
        }}
    />
{/snippet}

<PageExamples items={examples} />
