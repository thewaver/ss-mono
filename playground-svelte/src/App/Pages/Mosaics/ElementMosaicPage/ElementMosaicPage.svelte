<script lang="ts">
    import { TILES } from "@thewaver/ss-playground/App/Pages/Mosaics/Mosaics.const";

    import type { ExampleDefs } from "../../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../../PageComponents/Examples/PageExamples.svelte";
    import { createMosaicsControls } from "../Mosaics.utils.svelte";
    import PageMosaicsPanel from "../MosaicsPanel.svelte";
    import ElementsExampleWrapper from "./ElementsExampleWrapper.svelte";
    import WalkedExampleWrapper from "./WalkedExampleWrapper.svelte";
    import {
    EXAMPLE_NAMES,
    EXAMPLES_ROOT,
} from "@thewaver/ss-playground/App/Pages/Mosaics/ElementMosaicPage/ElementMosaicPage.const";

    const controls = createMosaicsControls();

    let pickedNames = $state.raw<string[]>([]);

    const togglePicked = (index: number) => {
        const name = TILES[index]?.name;

        if (name === undefined) return;

        pickedNames = pickedNames.includes(name)
            ? pickedNames.filter((picked) => picked !== name)
            : [...pickedNames, name];
    };

    const examples: ExampleDefs[] = [
        {
            key: "elements",
            name: EXAMPLE_NAMES.elements,
            readout: () =>
                "every tile is handed its own width and height, and the arrangement only decides where each one goes",
            component: elementsExample,
            path: `${EXAMPLES_ROOT}/Elements.svelte`,
        },
        {
            key: "walked",
            name: EXAMPLE_NAMES.walked,
            readout: () =>
                `${pickedNames.length ? `grown: ${pickedNames.join(", ")}` : "nothing grown"} — Tab in, then Left and Right follow the reading order, Up and Down go to the tile below or above, and Enter, Space or a press grows or shrinks a tile so the rest re-pack around it`,
            component: walkedExample,
            path: `${EXAMPLES_ROOT}/Walked.svelte`,
        },
    ];
</script>

{#snippet elementsExample()}
    <ElementsExampleWrapper {...controls.getSharedProps()} />
{/snippet}

{#snippet walkedExample()}
    <WalkedExampleWrapper {...controls.getSharedProps()} {pickedNames} onActivate={togglePicked} />
{/snippet}

<PageMosaicsPanel {controls} />

<PageExamples items={examples} layout={"flow"} />
