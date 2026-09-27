import { createMemo, on } from "solid-js";

import {
    FLIP_CARD_DEFAULTS,
    type FlipCardFace,
    type FlipCardState,
    FlipCardUtils,
    FlipCardStyles as styles,
} from "@thewaver/ss-components";

import { Barrel } from "../../Primitives/Barrel/Barrel";
import { access, accessSignal } from "../../Utils/propUtils";
import type { FlipCardProps } from "./FlipCardSolid.types";

export const FlipCard = (props: FlipCardProps) => {
    const [getIsFlipped] = accessSignal(() => props.flippedSignal);

    const getShownFace = createMemo(() => FlipCardUtils.getShownFace(getIsFlipped()));

    const getRestingAngle = createMemo(
        on(getIsFlipped, (isFlipped, _, angle?: number) =>
            FlipCardUtils.computeRestingAngle(angle, isFlipped, access(props.turnDirection)),
        ),
    );

    const getPeekRatio = createMemo(() =>
        FlipCardUtils.getPeekRatio(access(props.peekRatio) ?? FLIP_CARD_DEFAULTS.peekRatio),
    );

    const getAngle = createMemo(() =>
        FlipCardUtils.computeAngle(getRestingAngle(), getIsFlipped(), getPeekRatio(), access(props.turnDirection)),
    );

    const getTransitionDurationMs = createMemo(() =>
        FlipCardUtils.getTransitionDurationMs(
            getPeekRatio(),
            access(props.transitionDurationMs) ?? FLIP_CARD_DEFAULTS.transitionDurationMs,
        ),
    );

    const getFaceLabel = (face: FlipCardFace) => props.computeFaceLabel(face);

    const getState = (face: FlipCardFace): FlipCardState => ({
        face,
        isShowing: face === getShownFace(),
    });

    return (
        <div
            class={styles.flipCardRoot}
            role="group"
            aria-roledescription={access(props.roleDescription) ?? FLIP_CARD_DEFAULTS.roleDescription}
            aria-label={access(props.ariaLabel)}
        >
            <Barrel<FlipCardFace>
                faces={[...FlipCardUtils.FACES]}
                axis={() => access(props.axis) ?? FLIP_CARD_DEFAULTS.axis}
                faceSize={() => access(props.size)}
                angle={getAngle}
                transitionDurationMs={getTransitionDurationMs}
                faceRoleDescription={() => access(props.faceRoleDescription) ?? FLIP_CARD_DEFAULTS.faceRoleDescription}
                computeFaceDefs={(index) => ({
                    ariaLabel: getFaceLabel(FlipCardUtils.FACES[index]!),
                    isHidden: FlipCardUtils.FACES[index] !== getShownFace(),
                })}
                renderFace={(getFace) =>
                    getFace() === "back"
                        ? props.renderBack(() => getState("back"))
                        : props.renderFront(() => getState("front"))
                }
            />
        </div>
    );
};
