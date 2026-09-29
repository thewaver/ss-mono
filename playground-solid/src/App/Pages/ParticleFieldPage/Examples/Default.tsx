import {
    CellAnimationKeyframes,
    CellAnimationOrigins,
    CellAnimationWeights,
    ParticleField,
    type ParticleFieldProps,
    access,
} from "@thewaver/ss-components-solid";
import {
    computeParticlePos,
    computeParticleTimeline,
} from "@thewaver/ss-playground/App/Pages/ParticleFieldPage/ParticleFieldPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ParticleFieldPage/ParticleFieldPage.css";

import type { ParticleFieldExampleProps } from "../ParticleFieldPage.types";

export const DefaultExample = ({
    originType,
    weightType,
    animationType,
    holdShare,
    isScattered,
    ...otherProps
}: ParticleFieldExampleProps & Pick<ParticleFieldProps, "computeShapePoints" | "shapeJoinRadii" | "progress">) => (
    <ParticleField
        {...otherProps}
        computeCellWeights={(count) =>
            CellAnimationWeights.computeCellWeights(
                access(weightType),
                count,
                CellAnimationOrigins.computeOrigin(access(originType), count),
            )
        }
        computeParticlePos={(defs) => computeParticlePos(defs.rect, access(isScattered))}
        computeParticleAnimation={(defs, t) =>
            CellAnimationKeyframes.SAMPLE_ANIMATIONS[access(animationType)](
                computeParticleTimeline(t, access(holdShare)),
                { ...defs, origin: CellAnimationOrigins.computeOrigin(access(originType), defs.count) },
            )
        }
        renderParticle={() => <div class={styles.particle} />}
    />
);
