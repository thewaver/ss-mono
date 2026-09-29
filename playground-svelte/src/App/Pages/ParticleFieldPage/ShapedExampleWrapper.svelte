<script lang="ts">
    import { ParticleFieldKnobs } from "@thewaver/ss-playground/App/Knobs/ParticleFields.const";
    import { ShapeConst } from "@thewaver/ss-utils";

    import PageExampleKnobs from "../../PageComponents/ExampleKnobs/PageExampleKnobs.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageSelectField from "../../PageComponents/Field/PageSelectField.svelte";
    import PageMeasureBox from "../../PageComponents/MeasureBox/MeasureBox.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import ShapedExample from "./Examples/Shaped.svelte";
    import type { ParticleFieldExampleProps } from "./ParticleFieldPage.types";

    const SHAPED_BOX_SIZE = 320;

    let { playback = $bindable(), ...props }: ParticleFieldExampleProps = $props();

    let shapeKind = $state<ShapeConst.DefaultShape>(ParticleFieldKnobs.STARTING_SHAPE_KIND);
    let joinRadius = $state(ParticleFieldKnobs.STARTING_JOIN_RADIUS);
</script>

<PageMeasureBox width={SHAPED_BOX_SIZE} height={SHAPED_BOX_SIZE}>
    <ShapedExample {...props} bind:playback {shapeKind} {joinRadius} />
</PageMeasureBox>

<PageExampleKnobs>
    <PageProp
        itemKey={"shapeKind"}
        label={"Shape"}
        hint={"The area particles may appear in. A cell spawns only when its center is inside it."}
    >
        <PageSelectField
            value={shapeKind}
            values={ShapeConst.DEFAULT_SHAPES}
            ariaLabel={"Shape"}
            onChange={(kind) => {
                shapeKind = kind;
            }}
        />
    </PageProp>

    <PageProp
        itemKey={"joinRadius"}
        label={"Corner radius"}
        hint={"How far each corner of the area is rounded, as the Shape page rounds them."}
    >
        <PageNumberField
            value={joinRadius}
            min={ParticleFieldKnobs.MIN_JOIN_RADIUS}
            max={ParticleFieldKnobs.MAX_JOIN_RADIUS}
            step={ParticleFieldKnobs.JOIN_RADIUS_STEP}
            ariaLabel={"Corner radius"}
            onInput={(value) => {
                joinRadius = value;
            }}
        />
    </PageProp>
</PageExampleKnobs>
