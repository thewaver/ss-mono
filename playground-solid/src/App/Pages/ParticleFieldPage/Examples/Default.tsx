import { createMemo } from "solid-js";

import {
    CellAnimationKeyframes,
    CellAnimationOrigins,
    ParticleField,
    type ParticleFieldProps,
    SliceAnimationWeights,
    access,
} from "@thewaver/ss-components-solid";
import { ParticlePictureUtils } from "@thewaver/ss-playground/App/PageComponents/ParticlePicture/ParticlePicture.utils";
import {
    computeParticlePos,
    createEnvelope,
} from "@thewaver/ss-playground/App/Pages/ParticleFieldPage/ParticleFieldPage.const";
import { themeVars } from "@thewaver/ss-playground/App/Theme.css";

import type { ParticleFieldExampleProps } from "../ParticleFieldPage.types";

export const DefaultExample = ({
    originType,
    weightType,
    animationType,
    holdShare,
    isScattered,
    ...otherProps
}: ParticleFieldExampleProps &
    Pick<ParticleFieldProps, "computeShapePoints" | "shapeJoinRadii" | "progress" | "renderer">) => {
    const getSrc = createMemo(() =>
        ParticlePictureUtils.createDotSrc(themeVars.color.success.light, themeVars.color.success.dark),
    );

    const getAnimation = createMemo(() =>
        createEnvelope(CellAnimationKeyframes.SAMPLE_ANIMATIONS[access(animationType)], access(holdShare)),
    );

    return (
        <ParticleField
            {...otherProps}
            src={getSrc}
            origin={() => CellAnimationOrigins.computeOrigin(access(originType), access(otherProps.cellCount))}
            computeCellWeights={(count) =>
                SliceAnimationWeights.computeSliceWeights(
                    access(weightType),
                    count,
                    CellAnimationOrigins.computeOrigin(access(originType), count),
                )
            }
            computeParticlePos={(defs) => computeParticlePos(defs.rect, access(isScattered))}
            computeParticleAnimation={getAnimation()}
        />
    );
};
