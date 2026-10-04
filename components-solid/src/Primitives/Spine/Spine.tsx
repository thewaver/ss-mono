import type { Accessor } from "solid-js";
import { Index, Show, createMemo } from "solid-js";

import { SPINE_DEFAULTS, type SpineSide, SpineUtils, SpineStyles as styles } from "@thewaver/ss-components";

import { access } from "../../Utils/propUtils";
import type { SpineProps } from "./SpineSolid.types";

export const Spine = <T,>(props: SpineProps<T>) => {
    const getAxis = createMemo(() => access(props.axis) ?? SPINE_DEFAULTS.axis);

    const getFaceCount = createMemo(() => access(props.faces).length);

    const getHasBacks = createMemo(() => access(props.hasBacks) ?? SPINE_DEFAULTS.hasBacks);

    const getPerspectivePx = createMemo(() => access(props.perspectivePx) ?? SPINE_DEFAULTS.perspectivePx);

    const renderSpineFace = (getFace: Accessor<T>, index: number, side: SpineSide, getDistance: Accessor<number>) => {
        const getAngle = createMemo(() =>
            props.computeFaceAngle({ distance: getDistance(), index, count: getFaceCount() }),
        );

        const getDefs = createMemo(() => props.computeFaceDefs(index, side, getAngle()));

        const getTransitionDurationMs = () => access(props.transitionDurationMs);

        const getTransitionDelayMs = () => access(props.transitionDelayMs);

        return (
            <div
                class={styles.spineFace}
                style={{
                    "transform": SpineUtils.getFaceTransform(
                        getAxis(),
                        side,
                        getAngle(),
                        SpineUtils.getStackOffset(getDistance(), getFaceCount()),
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
                {props.renderFace(getFace, index, side)}
            </div>
        );
    };

    return (
        <div
            class={styles.spineRoot}
            style={{
                width: access(props.faceSize) === undefined ? undefined : `${access(props.faceSize)!.width}px`,
                height: access(props.faceSize) === undefined ? undefined : `${access(props.faceSize)!.height}px`,
                perspective: `${getPerspectivePx()}px`,
            }}
        >
            <div class={styles.spineBody}>
                <Index each={access(props.faces)}>
                    {(getFace, index) => {
                        const getDistance = createMemo(() => SpineUtils.getDistance(index, access(props.position)));

                        return (
                            <>
                                {renderSpineFace(getFace, index, "front", getDistance)}

                                <Show when={getHasBacks()}>{renderSpineFace(getFace, index, "back", getDistance)}</Show>
                            </>
                        );
                    }}
                </Index>
            </div>
        </div>
    );
};
