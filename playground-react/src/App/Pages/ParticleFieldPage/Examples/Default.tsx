import { useCallback, useMemo } from "react";

import {
    CellAnimationKeyframes,
    CellAnimationOrigins,
    ParticleField,
    type ParticleFieldProps,
    SliceAnimationWeights,
} from "@thewaver/ss-components-react";
import { ParticlePictureUtils } from "@thewaver/ss-playground/App/PageComponents/ParticlePicture/ParticlePicture.utils";
import {
    computeParticlePos,
    createEnvelope,
} from "@thewaver/ss-playground/App/Pages/ParticleFieldPage/ParticleFieldPage.const";
import { themeVars } from "@thewaver/ss-playground/App/Theme.css";
import type { Index2d } from "@thewaver/ss-utils";

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
    const src = useMemo(
        () => ParticlePictureUtils.createDotSrc(themeVars.color.success.light, themeVars.color.success.dark),
        [],
    );

    const animation = useMemo(
        () => createEnvelope(CellAnimationKeyframes.SAMPLE_ANIMATIONS[animationType], holdShare),
        [animationType, holdShare],
    );

    const origin = useMemo(
        () => CellAnimationOrigins.computeOrigin(originType, otherProps.cellCount),
        [originType, otherProps.cellCount],
    );

    const computeCellWeights = useCallback(
        (count: Index2d) =>
            SliceAnimationWeights.computeSliceWeights(
                weightType,
                count,
                CellAnimationOrigins.computeOrigin(originType, count),
            ),
        [weightType, originType],
    );

    return (
        <ParticleField
            {...otherProps}
            src={src}
            origin={origin}
            computeCellWeights={computeCellWeights}
            computeParticlePos={(defs) => computeParticlePos(defs.rect, isScattered)}
            computeParticleAnimation={animation}
        />
    );
};
