import { Index, createMemo } from "solid-js";

import { BARREL_PERSPECTIVE_PX } from "../../Abstracts/Barrel/Barrel.utils";
import { access } from "../../Utils/propUtils";
import type { CuboidFace, CuboidFaceState, CuboidProps } from "./Cuboid.types";
import { CuboidUtils } from "./Cuboid.utils";

import * as styles from "./Cuboid.css";

const DEFAULT_CUBOID_TRANSITION_DURATION_MS = 400;

const HALF = 0.5;

const FACES: CuboidFace[] = ["front", "right", "back", "left", "top", "bottom"];

const FACE_LABELS: Record<CuboidFace, string> = {
    front: "Front",
    right: "Right",
    back: "Back",
    left: "Left",
    top: "Top",
    bottom: "Bottom",
};

const CUBOID_ROLE_DESCRIPTION = "box";
const FACE_ROLE_DESCRIPTION = "face";

export const Cuboid = (props: CuboidProps) => {
    const [getYaw] = props.yawSignal;
    const [getPitch] = props.pitchSignal;

    const getSize = createMemo(() => access(props.size));

    const getReservedSize = createMemo(() => CuboidUtils.getReservedSize(getSize()));

    const getFacing = createMemo(() => CuboidUtils.getFacing(getYaw(), getPitch()));

    const getFaceLabel = (face: CuboidFace) => props.computeFaceLabel?.(face) ?? FACE_LABELS[face];

    const getFaceState = (face: CuboidFace): CuboidFaceState => ({
        face,
        isShowing: face === getFacing(),
    });

    return (
        <div
            class={styles.cuboidRoot}
            style={{
                width: `${getReservedSize().width}px`,
                height: `${getReservedSize().height}px`,
            }}
            role="group"
            aria-roledescription={CUBOID_ROLE_DESCRIPTION}
            aria-label={access(props.ariaLabel)}
        >
            <div
                class={styles.cuboidPerspective}
                style={{
                    width: `${getSize().width}px`,
                    height: `${getSize().height}px`,
                    perspective: `${BARREL_PERSPECTIVE_PX}px`,
                }}
            >
                <div
                    class={styles.cuboidBody}
                    style={{
                        "transform": CuboidUtils.getTurnTransform(getYaw(), getPitch(), getSize()),
                        "transition-duration": `${access(props.transitionDurationMs) ?? DEFAULT_CUBOID_TRANSITION_DURATION_MS}ms`,
                    }}
                >
                    <Index each={FACES}>
                        {(getFace) => {
                            const getIsShowing = () => getFace() === getFacing();

                            const getFaceSize = () => CuboidUtils.getFaceSize(getFace(), getSize());

                            return (
                                <div
                                    class={styles.cuboidFace}
                                    style={{
                                        width: `${getFaceSize().width}px`,
                                        height: `${getFaceSize().height}px`,
                                        left: `${(getSize().width - getFaceSize().width) * HALF}px`,
                                        top: `${(getSize().height - getFaceSize().height) * HALF}px`,
                                        transform: CuboidUtils.getFaceTransform(getFace(), getSize()),
                                    }}
                                    role="group"
                                    aria-roledescription={FACE_ROLE_DESCRIPTION}
                                    aria-label={getFaceLabel(getFace())}
                                    aria-hidden={!getIsShowing() || undefined}
                                    inert={!getIsShowing()}
                                >
                                    {props.renderFace(getFace, () => getFaceState(getFace()))}
                                </div>
                            );
                        }}
                    </Index>
                </div>
            </div>
        </div>
    );
};
