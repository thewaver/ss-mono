<script lang="ts">
    import type { ParticleDissolveParticleDefs } from "@thewaver/ss-components-svelte";
    import { PARTICLE_SHARE } from "@thewaver/ss-playground/App/Pages/ParticleDissolvePage/ParticleDissolvePage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/ParticleDissolvePage/ParticleDissolvePage.css";

    type Props = {
        defs: ParticleDissolveParticleDefs;
    };

    let props: Props = $props();
</script>

<div
    class={styles.ashParticle}
    style:width={`${props.defs.cell.size.width * PARTICLE_SHARE}px`}
    style:height={`${props.defs.cell.size.height * PARTICLE_SHARE}px`}
    style:background-color={props.defs.color}
></div>
