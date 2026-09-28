import { Index, createComputed, createMemo, on, onCleanup, onMount, untrack } from "solid-js";

import { BarrelUtils, DIE_DEFAULTS, DieUtils, LiveAnnouncerUtils, DieStyles as styles } from "@thewaver/ss-components";

import { SignalMirrorSolidUtils } from "../../Abstracts/SignalMirror/SignalMirrorSolid.utils";
import { access } from "../../Utils/propUtils";
import { accessStore } from "../../Utils/storeUtils";
import type { DieProps } from "./DieSolid.types";

const HALF = 0.5;
const FIRST_FACE = 0;

export const Die = (props: DieProps) => {
    const [getFace, setFace] = SignalMirrorSolidUtils.createOptional(() => props.faceSignal, FIRST_FACE);

    const getShape = createMemo(() => access(props.shape));

    const getSize = createMemo(() => access(props.size));

    const getReservedSize = createMemo(() => DieUtils.getReservedSize(getSize()));

    const getGeometry = createMemo(() => DieUtils.computeFaceGeometry(getShape(), getSize() * HALF));

    const getShownFace = createMemo(() => DieUtils.clampFace(getFace(), getGeometry().length));

    const roller = DieUtils.createRoller({
        getGeometry,
        getShownFace,
        getRollDurationMs: () => access(props.rollDurationMs) ?? DIE_DEFAULTS.rollDurationMs,
        getTumbleCount: () => access(props.tumbleCount) ?? DIE_DEFAULTS.tumbleCount,
        computeRollTarget: () => props.computeRollTarget(),
        computeFaceLabel: (index) => props.computeFaceLabel(index),
        writeFace: (index) => setFace(index),
        onRollEnd: (index) => props.onRollEnd?.(index),
    });

    onCleanup(roller.stop);

    const getOrientation = accessStore(roller, (state) => state.orientation);

    const getIsRolling = accessStore(roller, (state) => state.isRolling);

    const getRestingFace = accessStore(roller, (state) => state.restingFace);

    createComputed(
        on(getShownFace, (index, previous) => {
            if (previous === undefined) {
                roller.rest(index);

                return;
            }

            roller.turnTo(index);
        }),
    );

    createComputed(on(getGeometry, () => roller.reshape(untrack(getShownFace))));

    onMount(() => {
        LiveAnnouncerUtils.reserve("polite");
        props.onMount?.({ getIsRolling, roll: roller.roll });
    });

    return (
        <div
            class={styles.dieRoot}
            style={{ width: `${getReservedSize().width}px`, height: `${getReservedSize().height}px` }}
            role="group"
            aria-roledescription={access(props.roleDescription) ?? DIE_DEFAULTS.roleDescription}
            aria-label={access(props.ariaLabel)}
            aria-busy={getIsRolling() || undefined}
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
                    style={{ transform: DieUtils.getBodyTransform(getOrientation(), getSize()) }}
                >
                    <Index each={getGeometry()}>
                        {(getFaceGeometry, index) => {
                            const getIsShowing = () => index === getRestingFace();

                            const getFaceBox = () => DieUtils.getFaceBox(getFaceGeometry(), getSize());

                            return (
                                <div
                                    class={styles.dieFace}
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
                                    aria-hidden={!getIsShowing() || undefined}
                                    inert={!getIsShowing()}
                                >
                                    {props.renderFace(
                                        () => index,
                                        () => DieUtils.getFaceState(getGeometry(), index, getRestingFace()),
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
