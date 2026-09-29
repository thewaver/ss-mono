<script lang="ts">
    import { MenubarKnobs } from "@thewaver/ss-playground/App/Knobs/Menubars.const";

    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.svelte";
    import DefaultExample from "./Examples/Default.svelte";
    import MenubarFrame from "./MenubarFrame.svelte";
    import { NOTHING_PICKED, VIEW_DEFAULTS } from "./MenubarPage.const.svelte";
    import type { MenubarEntry } from "./MenubarPage.types";

    const EXAMPLES_ROOT = "/src/App/Pages/MenubarPage/Examples";

    let barWidth = $state(MenubarKnobs.STARTING_BAR_WIDTH);
    let lastPicked = $state(NOTHING_PICKED);
    let checked = $state.raw<MenubarEntry[]>(VIEW_DEFAULTS);

    const examples: ExampleDefs[] = [
        {
            key: "default",
            name: "File, Edit and View",
            readout: () =>
                `last picked: ${lastPicked} — with a menu open, the left and right arrows close it and open the next one; narrow the bar and a word becomes a submenu of the overflow menu`,
            component: defaultExample,
            path: `${EXAMPLES_ROOT}/Default.svelte`,
        },
    ];
</script>

{#snippet defaultExample()}
    <MenubarFrame width={barWidth}>
        <DefaultExample
            bind:checked
            onActivate={(entry) => {
                lastPicked = entry.name;
            }}
        />
    </MenubarFrame>
{/snippet}

<PagePropsPanel scope={"global"}>
    <PageProp
        itemKey={"barWidth"}
        label={"Bar width (px)"}
        hint={"How wide the bar is. Narrow it far enough and words start moving into the overflow menu."}
    >
        <PageNumberField
            value={barWidth}
            min={MenubarKnobs.MIN_BAR_WIDTH}
            max={MenubarKnobs.MAX_BAR_WIDTH}
            step={MenubarKnobs.BAR_WIDTH_STEP}
            ariaLabel={"Bar width in pixels"}
            onInput={(value) => {
                barWidth = value;
            }}
        />
    </PageProp>
</PagePropsPanel>

<PageExamples items={examples} layout={"flow"} />
