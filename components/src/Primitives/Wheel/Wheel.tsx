import type { Accessor } from "solid-js";
import { Index, Show, createMemo, onMount } from "solid-js";

import type { Size2d } from "@thewaver/ss-utils";

import { Barrel } from "../../Abstracts/Barrel/Barrel";
import { Rotator } from "../../Abstracts/Rotator/Rotator";
import { access } from "../../Utils/propUtils";
import type { WheelAxis, WheelController, WheelFace, WheelProps, WheelWedgeState } from "./Wheel.types";

import * as styles from "./Wheel.css";

const DEFAULT_WHEEL_AXIS: WheelAxis = "row";
const DEFAULT_WHEEL_WEDGE_SIZE: Size2d = { width: 0, height: 0 };

const WHEEL_ROLE_DESCRIPTION = "wheel";
const WEDGE_ROLE_DESCRIPTION = "wedge";

export const Wheel = <T,>(props: WheelProps<T>) => {
    const getWedgeCount = createMemo(() => access(props.wedges).length);

    const getIsDisabled = createMemo(() => access(props.isDisabled) ?? false);

    const getAxis = createMemo(() => access(props.axis) ?? DEFAULT_WHEEL_AXIS);

    const getWedgeSize = createMemo(() => access(props.wedgeSize) ?? DEFAULT_WHEEL_WEDGE_SIZE);

    const rotation = Rotator.createRotator(getIsDisabled, {
        stepCount: getWedgeCount,
        spinDurationMs: props.spinDurationMs,
        settleDurationMs: props.settleDurationMs,
        restDurationMs: props.restDurationMs,
        idleDelayMs: props.idleDelayMs,
        computeSpinTarget: props.computeSpinTarget,
        computeSpinDefs: props.computeSpinDefs,
        computeStepLabel: props.computeWedgeLabel,
        onStepChange: props.onSelectedWedgeChange,
        indexSignal: props.indexSignal,
        autoSpinSignal: props.autoSpinSignal,
        onSpinEnd: props.onSpinEnd,
    });

    const getWedgeLabel = (index: number) =>
        props.computeWedgeLabel?.(index, getWedgeCount()) ?? `${index + 1} of ${getWedgeCount()}`;

    const getSelectedIndex = createMemo(() =>
        rotation.getPhase() === "idling" ? undefined : rotation.getSelectedIndex(),
    );

    const getWedgeState = (index: number, face: WheelFace): WheelWedgeState => ({
        index,
        wedgeCount: getWedgeCount(),
        face,
        isSelected: index === getSelectedIndex(),
    });

    const controller: WheelController = {
        getIndex: rotation.getIndex,
        getPhase: rotation.getPhase,
        getIsSpinnable: rotation.getIsSpinnable,
        getIsAutoSpinning: () => rotation.getPhase() === "idling",
        getIsUserSpinning: () =>
            rotation.getIsAwaitingTarget() || rotation.getPhase() === "spinning" || rotation.getPhase() === "settling",
        spin: rotation.spin,
    };

    const renderWedge = (getWedge: Accessor<T>, index: number, face: WheelFace) =>
        face === "back"
            ? props.renderWedgeBack?.(getWedge, () => getWedgeState(index, face))
            : props.renderWedge(getWedge, () => getWedgeState(index, face));

    onMount(() => {
        props.onMount?.(controller);
    });

    return (
        <Show
            when={access(props.variant) === "overhead"}
            fallback={
                <div
                    class={styles.drumWheelRoot}
                    role="group"
                    aria-roledescription={WHEEL_ROLE_DESCRIPTION}
                    aria-label={access(props.ariaLabel)}
                >
                    <Barrel<T>
                        faces={props.wedges}
                        axis={getAxis}
                        faceSize={getWedgeSize}
                        angle={rotation.getAngle}
                        faceRoleDescription={WEDGE_ROLE_DESCRIPTION}
                        computeFaceDefs={(index, face) => ({
                            ariaLabel: getWedgeLabel(index),
                            isHidden: face === "back" || index !== rotation.getIndex(),
                        })}
                        renderFace={renderWedge}
                    />
                </div>
            }
        >
            <div
                class={styles.overheadWheelRoot}
                role="group"
                aria-roledescription={WHEEL_ROLE_DESCRIPTION}
                aria-label={access(props.ariaLabel)}
            >
                <Index each={access(props.wedges)}>
                    {(getWedge, index) => (
                        <div
                            class={styles.overheadWheelWedge}
                            style={{
                                transform: `rotate(${index * rotation.getStepAngle() + rotation.getAngle()}deg)`,
                            }}
                            role="group"
                            aria-roledescription={WEDGE_ROLE_DESCRIPTION}
                            aria-label={getWedgeLabel(index)}
                        >
                            {renderWedge(getWedge, index, "front")}
                        </div>
                    )}
                </Index>
            </div>
        </Show>
    );
};
