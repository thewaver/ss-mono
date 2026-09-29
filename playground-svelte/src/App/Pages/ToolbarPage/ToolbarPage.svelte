<script lang="ts">
    import { TOOLBAR_DEFAULTS } from "@thewaver/ss-components-svelte";
    import { ToolbarKnobs } from "@thewaver/ss-playground/App/Knobs/Toolbars.const";

    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.svelte";
    import DefaultExample from "./Examples/Default.svelte";
    import PaletteExample from "./Examples/Palette.svelte";
    import PressedExample from "./Examples/Pressed.svelte";
    import RefusingExample from "./Examples/Refusing.svelte";
    import ResizableBar from "./ResizableBar.svelte";
    import { NOTHING_RUN } from "./ToolbarPage.const.svelte";
    import type { ToolbarExampleProps } from "./ToolbarPage.types";

    const EXAMPLES_ROOT = "/src/App/Pages/ToolbarPage/Examples";

    const WIDE_SPAN = 2;

    let barWidth = $state(ToolbarKnobs.STARTING_BAR_WIDTH);
    let gap = $state(TOOLBAR_DEFAULTS.gap);
    let lastRun = $state(NOTHING_RUN);
    let pressedValues = $state.raw<string[]>([]);

    const commonProps: ToolbarExampleProps = $derived({
        gap,
        onActivate: (value) => {
            lastRun = value;
        },
    });

    const setBarWidth = (value: number) => {
        barWidth = value;
    };

    const examples: ExampleDefs[] = [
        {
            key: "default",
            name: "Default",
            span: WIDE_SPAN,
            readout: () => `last run: ${lastRun} — drag the right edge and the row's tail moves into the menu`,
            component: defaultExample,
            path: `${EXAMPLES_ROOT}/Default.svelte`,
        },
        {
            key: "refusing",
            name: "Refusing",
            span: WIDE_SPAN,
            readout: () =>
                "Share never collapses, so it is the last one standing; Print is never in the row; Rename is disabled, so the arrows step past it",
            component: refusingExample,
            path: `${EXAMPLES_ROOT}/Refusing.svelte`,
        },
        {
            key: "pressed",
            name: "Pressed",
            span: WIDE_SPAN,
            readout: () =>
                `pressed: ${pressedValues.join(", ") || "nothing"} — each action stays down until pressed again, and one that collapses is a checkbox in the menu, checked from the same list`,
            component: pressedExample,
            path: `${EXAMPLES_ROOT}/Pressed.svelte`,
        },
        {
            key: "palette",
            name: "A ring of tools",
            readout: () =>
                `last run: ${lastRun} — a layout sizes the bar itself, so nothing runs out of room and the overflow menu has nothing to hold`,
            component: paletteExample,
            path: `${EXAMPLES_ROOT}/Palette.svelte`,
        },
    ];
</script>

{#snippet defaultExample()}
    <ResizableBar width={barWidth} onResize={setBarWidth}>
        <DefaultExample {...commonProps} />
    </ResizableBar>
{/snippet}

{#snippet refusingExample()}
    <ResizableBar width={barWidth} onResize={setBarWidth}>
        <RefusingExample {...commonProps} />
    </ResizableBar>
{/snippet}

{#snippet pressedExample()}
    <ResizableBar width={barWidth} onResize={setBarWidth}>
        <PressedExample {...commonProps} bind:pressedValues />
    </ResizableBar>
{/snippet}

{#snippet paletteExample()}
    <PaletteExample {...commonProps} />
{/snippet}

<PagePropsPanel scope={"global"}>
    <PageProp
        itemKey={"barWidth"}
        label={"Bar width (px)"}
        hint={"How wide the bar is. Narrow it far enough and items start moving into the overflow menu."}
    >
        <PageNumberField
            value={barWidth}
            min={ToolbarKnobs.MIN_BAR_WIDTH}
            max={ToolbarKnobs.MAX_BAR_WIDTH}
            step={ToolbarKnobs.BAR_WIDTH_STEP}
            ariaLabel={"Bar width in pixels"}
            onInput={setBarWidth}
        />
    </PageProp>

    <PageProp itemKey={"gap"} label={"Gap (px)"} hint={"The space left between items on the bar."}>
        <PageNumberField
            value={gap}
            min={ToolbarKnobs.MIN_GAP}
            max={ToolbarKnobs.MAX_GAP}
            step={ToolbarKnobs.GAP_STEP}
            ariaLabel={"Gap in pixels"}
            onInput={(value) => {
                gap = value;
            }}
        />
    </PageProp>
</PagePropsPanel>

<PageExamples items={examples} layout={"flow"} />
