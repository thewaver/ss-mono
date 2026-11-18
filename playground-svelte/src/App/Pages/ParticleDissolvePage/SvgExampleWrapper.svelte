<script lang="ts">
    import { PARTICLE_DISSOLVE_DEFAULTS } from "@thewaver/ss-components-svelte";
    import { ParticleDissolveKnobs } from "@thewaver/ss-playground/App/Knobs/ParticleDissolves.const";
    import { ShapeConst } from "@thewaver/ss-utils";

    import PageExampleKnobs from "../../PageComponents/ExampleKnobs/PageExampleKnobs.svelte";
    import PageSelectField from "../../PageComponents/Field/PageSelectField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import AngleKnob from "./AngleKnob.svelte";
    import SvgExample from "./Examples/Svg.svelte";
    import type { ParticleDissolveExampleProps } from "./ParticleDissolvePageSvelte.types";

    let props: ParticleDissolveExampleProps = $props();

    let angleDegrees = $state(PARTICLE_DISSOLVE_DEFAULTS.angleDegrees);
    let shapeKind = $state<ShapeConst.DefaultShape>(ParticleDissolveKnobs.STARTING_SHAPE_KIND);
</script>

<SvgExample {...props} {angleDegrees} {shapeKind} />

<PageExampleKnobs>
    <AngleKnob
        value={angleDegrees}
        onInput={(value) => {
            angleDegrees = value;
        }}
    />

    <PageProp
        itemKey={"shapeKind"}
        {...ParticleDissolveKnobs.SHAPE_KIND_TEXT}
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
</PageExampleKnobs>
