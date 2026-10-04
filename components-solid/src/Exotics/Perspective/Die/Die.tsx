import { Index, createMemo, createSignal, onMount } from "solid-js";

import { BarrelUtils, DIE_DEFAULTS, DieUtils, DieStyles as styles } from "@thewaver/ss-components";

import { RollerSolidUtils } from "../../../Abstracts/Roller/RollerSolid.utils";
import { access } from "../../../Utils/propUtils";
import type { DieController, DieProps } from "./DieSolid.types";

const HALF = 0.5;

export const Die = (props: DieProps) => {
    const [getRootRef, setRootRef] = createSignal<HTMLElement>();

    const getShape = createMemo(() => access(props.shape));

    const getSize = createMemo(() => access(props.size));

    const getReservedSize = createMemo(() => DieUtils.getReservedSize(getSize()));

    const getGeometry = createMemo(() => DieUtils.computeFaceGeometry(getShape(), getSize() * HALF));

    const getIsMovable = createMemo(() => access(props.isMovable) ?? DIE_DEFAULTS.isMovable);

    const getIsSeeThrough = createMemo(() => access(props.isSeeThrough) ?? DIE_DEFAULTS.isSeeThrough);

    const roller = RollerSolidUtils.createRoller(getRootRef, () => false, {
        faces: getGeometry,
        radius: () => getSize() * HALF,
        rollDurationMs: props.rollDurationMs,
        settleDurationMs: props.settleDurationMs,
        restDurationMs: props.restDurationMs,
        tumbleCount: props.tumbleCount,
        momentumMs: props.momentumMs,
        driftAxis: props.driftAxis,
        idleDelayMs: props.idleDelayMs,
        isMovable: getIsMovable,
        get computeRollTarget() {
            return props.computeRollTarget;
        },
        computeFaceLabel: (index) => props.computeFaceLabel(index),
        targetFace: props.face,
        autoSpin: props.autoSpin,
        onRollEnd: (index) => props.onRollEnd?.(index),
    });

    const controller: DieController = {
        getCurrentFace: roller.getCurrentFace,
        getPhase: roller.getPhase,
        getIsRollable: roller.getIsRollable,
        getIsRolling: () => roller.getIsAwaitingTarget() || roller.getPhase() === "rolling",
        getIsAutoSpinning: () => roller.getPhase() === "idling",
        roll: roller.roll,
        step: roller.step,
    };

    onMount(() => {
        props.onMount?.(controller);
    });

    return (
        <div
            ref={setRootRef}
            class={styles.dieRoot}
            classList={{ [styles.dieRootMovable]: getIsMovable() }}
            style={{ width: `${getReservedSize().width}px`, height: `${getReservedSize().height}px` }}
            role="group"
            tabIndex={getIsMovable() ? 0 : undefined}
            aria-roledescription={access(props.roleDescription) ?? DIE_DEFAULTS.roleDescription}
            aria-label={access(props.ariaLabel)}
            aria-busy={roller.getIsBusy() || undefined}
        >
            <div
                class={styles.diePerspective}
                style={{
                    width: `${getSize()}px`,
                    height: `${getSize()}px`,
                    perspective: `${BarrelUtils.PERSPECTIVE_PX}px`,
                }}
            >
                <div
                    class={styles.dieBody}
                    style={{ transform: DieUtils.getBodyTransform(roller.getOrientation(), getSize()) }}
                >
                    <Index each={getGeometry()}>
                        {(getFaceGeometry, index) => {
                            const getIsTarget = () => index === roller.getTargetFace();

                            const getFaceBox = () => DieUtils.getFaceBox(getFaceGeometry(), getSize());

                            return (
                                <div
                                    class={styles.dieFace}
                                    classList={{ [styles.dieFaceSeeThrough]: getIsSeeThrough() }}
                                    style={{
                                        "width": `${getFaceGeometry().size.width}px`,
                                        "height": `${getFaceGeometry().size.height}px`,
                                        "left": `${getFaceBox().left}px`,
                                        "top": `${getFaceBox().top}px`,
                                        "transform": DieUtils.computeFaceTransform(getFaceGeometry()),
                                        "clip-path": getFaceBox().clipPath,
                                    }}
                                    role="group"
                                    aria-roledescription={
                                        access(props.faceRoleDescription) ?? DIE_DEFAULTS.faceRoleDescription
                                    }
                                    aria-label={props.computeFaceLabel(index)}
                                    aria-hidden={getIsTarget() ? undefined : "true"}
                                    inert={!getIsTarget()}
                                >
                                    {props.renderFace(
                                        () => index,
                                        () => DieUtils.getFaceState(getGeometry(), index, roller.getRestingFace()),
                                    )}
                                </div>
                            );
                        }}
                    </Index>
                </div>
            </div>
        </div>
    );
};
