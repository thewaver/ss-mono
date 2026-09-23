import type { Accessor } from "solid-js";
import { Index, Show, createMemo } from "solid-js";

import { access } from "../../Utils/propUtils";
import { BARREL_DEFAULTS } from "./Barrel.const";
import type { BarrelFace, BarrelProps } from "./Barrel.types";
import { BarrelUtils } from "./Barrel.utils";

import * as styles from "./Barrel.css";

export const Barrel = <T,>(props: BarrelProps<T>) => {
    const getAxis = createMemo(() => access(props.axis) ?? BARREL_DEFAULTS.axis);

    const getFaceSize = createMemo(() => access(props.faceSize) ?? BARREL_DEFAULTS.faceSize);

    const getFaceCount = createMemo(() => access(props.faces).length);

    const getFaceExtent = createMemo(() => BarrelUtils.getFaceExtent(getFaceSize(), getAxis()));

    const getApothem = createMemo(() => BarrelUtils.getApothem(getFaceExtent(), getFaceCount()));

    const getGirth = createMemo(() => BarrelUtils.getGirth(getFaceExtent(), getFaceCount()));

    const getHasBacks = createMemo(() => access(props.hasBacks) ?? BarrelUtils.getHasBacks(getFaceCount()));

    const renderBarrelFace = (getFace: Accessor<T>, index: number, face: BarrelFace) => {
        const getDefs = createMemo(() => props.computeFaceDefs(index, face));

        const getTransitionDurationMs = () => access(props.transitionDurationMs);

        const getTransitionDelayMs = () => access(props.transitionDelayMs);

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
                    "transition-delay":
                        getTransitionDelayMs() === undefined ? undefined : `${getTransitionDelayMs()}ms`,
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
                    perspective: `${BarrelUtils.PERSPECTIVE_PX}px`,
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
