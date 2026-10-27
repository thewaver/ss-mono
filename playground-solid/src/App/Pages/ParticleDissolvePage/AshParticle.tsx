import type { ParticleDissolveParticleDefs } from "@thewaver/ss-components-solid";
import { PARTICLE_SHARE } from "@thewaver/ss-playground/App/Pages/ParticleDissolvePage/ParticleDissolvePage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ParticleDissolvePage/ParticleDissolvePage.css";

type Props = {
    defs: ParticleDissolveParticleDefs;
};

export const AshParticle = (props: Props) => (
    <div
        class={styles.ashParticle}
        style={{
            "width": `${props.defs.cell.size.width * PARTICLE_SHARE}px`,
            "height": `${props.defs.cell.size.height * PARTICLE_SHARE}px`,
            "background-color": props.defs.color,
        }}
    />
);
