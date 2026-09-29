<script lang="ts">
    import { ShapeKnobs } from "../../Knobs/Shapes.const";
    import PageExampleKnobs from "../../PageComponents/ExampleKnobs/PageExampleKnobs.svelte";
    import TextWrapExample from "./Examples/TextWrap.svelte";
    import ShapeGeometry from "./ShapeGeometry.svelte";
    import type { ShapeExampleProps } from "./ShapePage.types";

    let props: ShapeExampleProps = $props();
</script>

<ShapeGeometry startingShapeKind={ShapeKnobs.STARTING_TEXT_WRAP_SHAPE_KIND}>
    {#snippet children(geometryProps, renderKnobs)}
        <TextWrapExample {...props} {...geometryProps} />

        <PageExampleKnobs>{@render renderKnobs()}</PageExampleKnobs>
    {/snippet}
</ShapeGeometry>
