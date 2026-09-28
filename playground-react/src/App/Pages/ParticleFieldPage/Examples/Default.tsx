import { useCallback } from "react";

import {
    CellAnimationKeyframes,
    CellAnimationOrigins,
    CellAnimationWeights,
    ParticleField,
    type ParticleFieldProps,
} from "@thewaver/ss-components-react";
import {
    computeParticlePos,
    computeParticleTimeline,
} from "@thewaver/ss-playground/App/Pages/ParticleFieldPage/ParticleFieldPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ParticleFieldPage/ParticleFieldPage.css";
import type { Index2d } from "@thewaver/ss-utils";

import type { ParticleFieldExampleProps } from "../ParticleFieldPage.types";

export const DefaultExample = ({
    originType,
    weightType,
    animationType,
    holdShare,
    isScattered,
    ...otherProps
}: ParticleFieldExampleProps & Pick<ParticleFieldProps, "computeShapePoints" | "shapeJoinRadii" | "progressState">) => {
    const computeCellWeights = useCallback(
        (count: Index2d) =>
            CellAnimationWeights.computeCellWeights(
                weightType,
                count,
                CellAnimationOrigins.computeOrigin(originType, count),
            ),
        [weightType, originType],
    );

    return (
        <ParticleField
            {...otherProps}
            computeCellWeights={computeCellWeights}
            computeParticlePos={(defs) => computeParticlePos(defs.rect, isScattered)}
            computeParticleAnimation={(defs, t) =>
                CellAnimationKeyframes.SAMPLE_ANIMATIONS[animationType](computeParticleTimeline(t, holdShare), {
                    ...defs,
                    origin: CellAnimationOrigins.computeOrigin(originType, defs.count),
                })
            }
            renderParticle={() => <div className={styles.particle} />}
        />
    );
};
