<script lang="ts">
    import { ImageMosaicKnobs } from "@thewaver/ss-playground/App/Knobs/ImageMosaics.const";
    import { MosaicImages } from "@thewaver/ss-playground/App/Pages/Mosaics/ImageMosaicPage/MosaicImages.const";
    import { FIELD_WIDTH, MOSAIC_EXTENT } from "@thewaver/ss-playground/App/Pages/Mosaics/Mosaics.const";

    import PageExampleKnobs from "../../../PageComponents/ExampleKnobs/PageExampleKnobs.svelte";
    import PageCheckField from "../../../PageComponents/Field/PageCheckField.svelte";
    import PageSelectField from "../../../PageComponents/Field/PageSelectField.svelte";
    import PageMeasureBox from "../../../PageComponents/MeasureBox/MeasureBox.svelte";
    import PageProp from "../../../PageComponents/Prop/Prop.svelte";
    import type { MosaicSharedProps } from "../Mosaics.types";
    import ImagesExample from "./Examples/Images.svelte";

    let props: MosaicSharedProps = $props();

    let shapeKey = $state<MosaicImages.SampleShapeKey>(ImageMosaicKnobs.STARTING_SHAPE_KEY);
    let isDecorated = $state(ImageMosaicKnobs.STARTING_IS_DECORATED);

    const sources = $derived(MosaicImages.SAMPLE_SOURCES.slice(0, props.itemCount));
</script>

<PageMeasureBox
    width={props.sizeAnchor === "width" ? MOSAIC_EXTENT : undefined}
    height={props.sizeAnchor === "height" ? MOSAIC_EXTENT : undefined}
>
    <ImagesExample
        {sources}
        gap={props.gap}
        sizeAnchor={props.sizeAnchor}
        transitionDurationMs={props.transitionDurationMs}
        {shapeKey}
        {isDecorated}
    />
</PageMeasureBox>

<PageExampleKnobs>
    <PageProp itemKey={"shapeKey"} label={"Target shape"} hint={"The contour the tiles are packed into."}>
        <PageSelectField
            value={shapeKey}
            values={MosaicImages.SAMPLE_SHAPE_KEYS}
            width={FIELD_WIDTH}
            ariaLabel={"Target shape"}
            onChange={(value) => {
                shapeKey = value;
            }}
        />
    </PageProp>

    <PageProp
        itemKey={"isDecorated"}
        label={"Wrapped"}
        hint={"Puts each tile in a frame of its own, so the packing can be told apart from the pictures in it."}
    >
        <PageCheckField
            value={isDecorated}
            ariaLabel={"Wrapped"}
            onChange={(value) => {
                isDecorated = value;
            }}
        />
    </PageProp>
</PageExampleKnobs>
