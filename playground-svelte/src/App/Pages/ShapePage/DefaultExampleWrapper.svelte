<script lang="ts">
    import { ShapeKnobs } from "../../Knobs/Shapes.const";
    import PageExampleKnobs from "../../PageComponents/ExampleKnobs/PageExampleKnobs.svelte";
    import PageCheckField from "../../PageComponents/Field/PageCheckField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import DefaultExample from "./Examples/Default.svelte";
    import ShapeGeometry from "./ShapeGeometry.svelte";
    import type { ShapeExampleProps } from "./ShapePage.types";

    let props: ShapeExampleProps = $props();

    let shouldClipChildren = $state(ShapeKnobs.STARTING_SHOULD_CLIP_CHILDREN);
    let shouldPadChildren = $state(ShapeKnobs.STARTING_SHOULD_PAD_CHILDREN);
</script>

<ShapeGeometry>
    {#snippet children(geometryProps, renderKnobs)}
        <DefaultExample {...props} {...geometryProps} {shouldClipChildren} {shouldPadChildren} />

        <PageExampleKnobs>
            {@render renderKnobs()}

            <PageProp
                itemKey={"shouldClipChildren"}
                label={"Clip children"}
                hint={"Cuts whatever is inside the shape to the shape's own outline, instead of letting it spill past."}
            >
                <PageCheckField
                    value={shouldClipChildren}
                    ariaLabel={"Clip children"}
                    onChange={(value) => {
                        shouldClipChildren = value;
                    }}
                />
            </PageProp>

            <PageProp
                itemKey={"shouldPadChildren"}
                label={"Pad children"}
                hint={"Insets whatever is inside far enough to clear the rounded corners, so text does not run under them."}
            >
                <PageCheckField
                    value={shouldPadChildren}
                    ariaLabel={"Pad children"}
                    onChange={(value) => {
                        shouldPadChildren = value;
                    }}
                />
            </PageProp>
        </PageExampleKnobs>
    {/snippet}
</ShapeGeometry>
