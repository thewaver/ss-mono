<script lang="ts">
    import { ParticleDissolveKnobs } from "@thewaver/ss-playground/App/Knobs/ParticleDissolves.const";
    import { FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/ParticleDissolvePage/ParticleDissolvePage.const";

    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";

    type Props = {
        value: number;
        onInput: (value: number) => void;
    };

    let props: Props = $props();
</script>

<PageProp
    itemKey={"angleDegrees"}
    {...ParticleDissolveKnobs.ANGLE_DEGREES_TEXT}
>
    <PageNumberField
        value={props.value}
        min={ParticleDissolveKnobs.MIN_ANGLE}
        max={ParticleDissolveKnobs.MAX_ANGLE}
        step={ParticleDissolveKnobs.ANGLE_STEP}
        width={FIELD_WIDTH}
        ariaLabel={"Angle in degrees"}
        onInput={props.onInput}
    />
</PageProp>
