import type { Accessor } from "solid-js";
import { Index, Show, createMemo } from "solid-js";

import type { Size2d } from "@thewaver/ss-utils";

import { access } from "../../Utils/propUtils";
import type { BarrelAxis, BarrelFace, BarrelProps } from "./Barrel.types";
import { BARREL_PERSPECTIVE_PX, BarrelUtils } from "./Barrel.utils";

import * as styles from "./Barrel.css";

const DEFAULT_BARREL_AXIS: BarrelAxis = "row";
const DEFAULT_BARREL_FACE_SIZE: Size2d = { width: 0, height: 0 };

export const Barrel = <T,>(props: BarrelProps<T>) => {
    const getAxis = createMemo(() => access(props.axis) ?? DEFAULT_BARREL_AXIS);

    const getFaceSize = createMemo(() => access(props.faceSize) ?? DEFAULT_BARREL_FACE_SIZE);

    const getFaceCount = createMemo(() => access(props.faces).length);

    const getFaceExtent = createMemo(() => BarrelUtils.getFaceExtent(getFaceSize(), getAxis()));

    const getApothem = createMemo(() => BarrelUtils.getApothem(getFaceExtent(), getFaceCount()));

    const getGirth = createMemo(() => BarrelUtils.getGirth(getFaceExtent(), getFaceCount()));

    const getHasBacks = createMemo(() => access(props.hasBacks) ?? BarrelUtils.getHasBacks(getFaceCount()));

    const renderBarrelFace = (getFace: Accessor<T>, index: number, face: BarrelFace) => {
        const getDefs = createMemo(() => props.computeFaceDefs(index, face));

        const getTransitionDurationMs = () => access(props.transitionDurationMs);

        return (
            <div
                class={styles.barrelFace}
                style={{
                    "transform": BarrelUtils.getFaceTransform(
                        getAxis(),
                        face,
                        access(props.angle),
                        index,
                        getFaceCount(),
                        getApothem(),
                    ),
                    "transition-duration":
                        getTransitionDurationMs() === undefined ? undefined : `${getTransitionDurationMs()}ms`,
                }}
                role="group"
                aria-roledescription={access(props.faceRoleDescription)}
                aria-label={getDefs().ariaLabel}
                aria-hidden={getDefs().isHidden || undefined}
                inert={getDefs().isHidden}
            >
                {props.renderFace(getFace, index, face)}
            </div>
        );
    };

    return (
        <div
            class={styles.barrelRoot}
            style={{
                width: `${getAxis() === "row" ? getGirth() : getFaceSize().width}px`,
                height: `${getAxis() === "row" ? getFaceSize().height : getGirth()}px`,
            }}
        >
            <div
                class={styles.barrelPerspective}
                style={{
                    width: `${getFaceSize().width}px`,
                    height: `${getFaceSize().height}px`,
                    perspective: `${BARREL_PERSPECTIVE_PX}px`,
                }}
            >
                <div class={styles.barrelBody} style={{ transform: `translateZ(${-getApothem()}px)` }}>
                    <Index each={access(props.faces)}>
                        {(getFace, index) => (
                            <>
                                {renderBarrelFace(getFace, index, "front")}

                                <Show when={getHasBacks()}>{renderBarrelFace(getFace, index, "back")}</Show>
                            </>
                        )}
                    </Index>
                </div>
            </div>
        </div>
    );
};
