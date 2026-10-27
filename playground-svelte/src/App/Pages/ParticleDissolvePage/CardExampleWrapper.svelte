<script lang="ts">
    import { PARTICLE_DISSOLVE_DEFAULTS } from "@thewaver/ss-components-svelte";

    import PageExampleKnobs from "../../PageComponents/ExampleKnobs/PageExampleKnobs.svelte";
    import AngleKnob from "./AngleKnob.svelte";
    import CardExample from "./Examples/Card.svelte";
    import type { ParticleDissolveExampleProps } from "./ParticleDissolvePageSvelte.types";

    let props: ParticleDissolveExampleProps = $props();

    let angleDegrees = $state(PARTICLE_DISSOLVE_DEFAULTS.angleDegrees);
</script>

<CardExample {...props} {angleDegrees} />

<PageExampleKnobs>
    <AngleKnob
        value={angleDegrees}
        onInput={(value) => {
            angleDegrees = value;
        }}
    />
</PageExampleKnobs>
