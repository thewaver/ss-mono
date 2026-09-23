import { createMemo, on } from "solid-js";

import { MathUtils } from "@thewaver/ss-utils";

import { Barrel } from "../../Primitives/Barrel/Barrel";
import { access, accessSignal } from "../../Utils/propUtils";
import { FLIP_CARD_DEFAULTS } from "./FlipCard.const";
import type { FlipCardFace, FlipCardProps, FlipCardState, FlipCardTurnDirection } from "./FlipCard.types";

import * as styles from "./FlipCard.css";

const FACES: FlipCardFace[] = ["front", "back"];

const FLIP_ANGLE_DEG = 180;
const FRONT_ANGLE_DEG = 0;
const NO_PEEK = 0;
const NO_DURATION = 0;

const TURN_SIGNS: Record<FlipCardTurnDirection, number> = {
    forward: -1,
    backward: 1,
};

export const FlipCard = (props: FlipCardProps) => {
    const [getIsFlipped] = accessSignal(() => props.flippedSignal);

    const getShownFace = createMemo((): FlipCardFace => (getIsFlipped() ? "back" : "front"));

    const getTurnSign = (isTurningToBack: boolean) =>
        TURN_SIGNS[access(props.turnDirection) ?? (isTurningToBack ? "forward" : "backward")];

    const getRestingAngle = createMemo(
        on(getIsFlipped, (isFlipped, _, angle?: number) => {
            if (angle === undefined) return isFlipped ? -FLIP_ANGLE_DEG : FRONT_ANGLE_DEG;

            return angle + getTurnSign(isFlipped) * FLIP_ANGLE_DEG;
        }),
    );

    const getPeekRatio = createMemo(() => MathUtils.clamp01(access(props.peekRatio) ?? FLIP_CARD_DEFAULTS.peekRatio));

    const getAngle = createMemo(
        () => getRestingAngle() + getTurnSign(!getIsFlipped()) * getPeekRatio() * FLIP_ANGLE_DEG,
    );

    const getTransitionDurationMs = createMemo(() =>
        getPeekRatio() === NO_PEEK
            ? (access(props.transitionDurationMs) ?? FLIP_CARD_DEFAULTS.transitionDurationMs)
            : NO_DURATION,
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
                faces={FACES}
                axis={() => access(props.axis) ?? FLIP_CARD_DEFAULTS.axis}
                faceSize={() => access(props.size)}
                angle={getAngle}
                transitionDurationMs={getTransitionDurationMs}
                faceRoleDescription={() => access(props.faceRoleDescription) ?? FLIP_CARD_DEFAULTS.faceRoleDescription}
                computeFaceDefs={(index) => ({
                    ariaLabel: getFaceLabel(FACES[index]!),
                    isHidden: FACES[index] !== getShownFace(),
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
