<script lang="ts">
    import PageExampleKnobs from "../../PageComponents/ExampleKnobs/PageExampleKnobs.svelte";
    import SharedPaintExample from "./Examples/SharedPaint.svelte";
    import ShapeGeometry from "./ShapeGeometry.svelte";
    import type { ShapeExampleProps } from "./ShapePage.types";

    let props: ShapeExampleProps = $props();
</script>

<ShapeGeometry>
    {#snippet children(geometryProps, renderKnobs)}
        <SharedPaintExample {...props} {...geometryProps} />

        <PageExampleKnobs>{@render renderKnobs()}</PageExampleKnobs>
    {/snippet}
</ShapeGeometry>
