<script lang="ts">
    import { MOSAIC_SIZE_ANCHORS } from "@thewaver/ss-components-svelte";
    import { MosaicKnobs } from "@thewaver/ss-playground/App/Knobs/Mosaics.const";
    import { FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/Mosaics/Mosaics.const";

    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageSelectField from "../../PageComponents/Field/PageSelectField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.svelte";
    import type { MosaicsControls } from "./Mosaics.types";

    type Props = {
        controls: MosaicsControls;
    };

    let props: Props = $props();

    const controls = $derived(props.controls);
</script>

<PagePropsPanel scope={"global"}>
    <PageProp
        itemKey={"itemCount"}
        label={"Items"}
        hint={"How many tiles the mosaic packs. The arrangement is recomputed from scratch each time it changes."}
    >
        <PageNumberField
            value={controls.itemCount[0]()}
            min={MosaicKnobs.MIN_ITEM_COUNT}
            max={MosaicKnobs.MAX_ITEM_COUNT}
            step={MosaicKnobs.ITEM_COUNT_STEP}
            width={FIELD_WIDTH}
            ariaLabel={"Items"}
            onInput={controls.itemCount[1]}
        />
    </PageProp>

    <PageProp itemKey={"gap"} label={"Gap (px)"} hint={"The space left between tiles."}>
        <PageNumberField
            value={controls.gap[0]()}
            min={MosaicKnobs.MIN_GAP}
            max={MosaicKnobs.MAX_GAP}
            step={MosaicKnobs.GAP_STEP}
            width={FIELD_WIDTH}
            ariaLabel={"Gap in pixels"}
            onInput={controls.gap[1]}
        />
    </PageProp>

    <PageProp
        itemKey={"sizeAnchor"}
        label={"Fixed side"}
        hint={"Which side the mosaic takes as given: it fills that one and works the other out from the tiles."}
    >
        <PageSelectField
            value={controls.sizeAnchor[0]()}
            values={MOSAIC_SIZE_ANCHORS}
            width={FIELD_WIDTH}
            ariaLabel={"Fixed side"}
            onChange={controls.sizeAnchor[1]}
        />
    </PageProp>

    <PageProp
        itemKey={"transitionDurationMs"}
        label={"Glide (ms)"}
        hint={
            "How long a tile takes to glide to its new place when tiles are added, taken out or resized. Resizing the mosaic itself never glides. At 0 tiles move at once, and under reduced motion they always do."
        }
    >
        <PageNumberField
            value={controls.transitionDurationMs[0]()}
            min={MosaicKnobs.MIN_DURATION_MS}
            max={MosaicKnobs.MAX_DURATION_MS}
            step={MosaicKnobs.DURATION_STEP_MS}
            width={FIELD_WIDTH}
            ariaLabel={"Glide duration in milliseconds"}
            onInput={controls.transitionDurationMs[1]}
        />
    </PageProp>
</PagePropsPanel>
