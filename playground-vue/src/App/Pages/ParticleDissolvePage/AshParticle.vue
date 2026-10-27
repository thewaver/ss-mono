<script setup lang="ts">
import type { ParticleDissolveParticleDefs } from "@thewaver/ss-components-vue";
import { PARTICLE_SHARE } from "@thewaver/ss-playground/App/Pages/ParticleDissolvePage/ParticleDissolvePage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ParticleDissolvePage/ParticleDissolvePage.css";

type Props = {
    defs: ParticleDissolveParticleDefs;
};

defineProps<Props>();
</script>

<template>
    <div
        :class="styles.ashParticle"
        :style="{
            width: `${defs.cell.size.width * PARTICLE_SHARE}px`,
            height: `${defs.cell.size.height * PARTICLE_SHARE}px`,
            backgroundColor: defs.color,
        }"
    />
</template>
