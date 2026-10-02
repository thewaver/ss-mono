<script lang="ts">
    import { ShapeKnobs } from "../../Knobs/Shapes.const";
    import PageExampleKnobs from "../../PageComponents/ExampleKnobs/PageExampleKnobs.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import MorphExample from "./Examples/Morph.svelte";
    import type { ShapeExampleProps } from "./ShapePage.types";

    let props: ShapeExampleProps = $props();

    let starPoints = $state(ShapeKnobs.STARTING_STAR_POINTS);
</script>

<MorphExample {...props} {starPoints} />

<PageExampleKnobs>
    <PageProp
        itemKey={"starPoints"}
        label={"Star points"}
        hint={"How many tips the star has. The contour carries twice as many points: one per tip, one per notch between tips."}
    >
        <PageNumberField
            value={starPoints}
            min={ShapeKnobs.MIN_STAR_POINTS}
            max={ShapeKnobs.MAX_STAR_POINTS}
            step={ShapeKnobs.STAR_POINTS_STEP}
            ariaLabel={"Star points"}
            onInput={(value) => {
                starPoints = value;
            }}
        />
    </PageProp>
</PageExampleKnobs>
