import { useCallback, useMemo } from "react";

import {
    CellAnimationKeyframes,
    CellAnimationOrigins,
    ParticleField,
    type ParticleFieldProps,
    SliceAnimationKeyframeUtils,
    SliceAnimationWeights,
} from "@thewaver/ss-components-react";
import { ParticlePictureUtils } from "@thewaver/ss-playground/App/PageComponents/ParticlePicture/ParticlePicture.utils";
import { computeParticlePos } from "@thewaver/ss-playground/App/Pages/ParticleFieldPage/ParticleFieldPage.const";
import { themeVars } from "@thewaver/ss-playground/App/Theme.css";
import type { Count2d } from "@thewaver/ss-utils";

import type { ParticleFieldExampleProps } from "../ParticleFieldPage.types";

export const DefaultExample = (
    props: ParticleFieldExampleProps &
        Pick<ParticleFieldProps, "computeShapePoints" | "shapeJoinRadii" | "progress" | "renderer">,
) => {
    const { originType, weightType, animationType, holdShare, isScattered, ...otherProps } = props;

    const src = useMemo(
        () => ParticlePictureUtils.createDotSrc(themeVars.color.success.light, themeVars.color.success.dark),
        [],
    );

    const animation = useMemo(
        () =>
            SliceAnimationKeyframeUtils.createEnvelope(
                CellAnimationKeyframes.SAMPLE_ANIMATIONS[props.animationType],
                props.holdShare,
            ),
        [props.animationType, props.holdShare],
    );

    const origin = useMemo(
        () => CellAnimationOrigins.computeOrigin(props.originType, otherProps.cellCount),
        [props.originType, otherProps.cellCount],
    );

    const computeCellWeights = useCallback(
        (count: Count2d) =>
            SliceAnimationWeights.computeSliceWeights(
                props.weightType,
                count,
                CellAnimationOrigins.computeOrigin(props.originType, count),
            ),
        [props.weightType, props.originType],
    );

    return (
        <ParticleField
            {...otherProps}
            src={src}
            origin={origin}
            computeCellWeights={computeCellWeights}
            computeParticlePos={(defs) => computeParticlePos(defs.rect, props.isScattered)}
            computeParticleAnimation={animation}
        />
    );
};
