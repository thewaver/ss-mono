<script lang="ts">
    import { untrack } from "svelte";

    import {
        BarrelUtils,
        DIE_DEFAULTS,
        DieUtils,
        LiveAnnouncerUtils,
        DieStyles as styles,
    } from "@thewaver/ss-components";

    import { readStore } from "../../../Utils/storeUtils.js";
    import type { DieController, DieProps } from "./Die.types.js";

    const HALF = 0.5;
    const FIRST_FACE = 0;

    let { face = $bindable(FIRST_FACE), ...props }: DieProps = $props();

    const size = $derived(props.size);
    const reservedSize = $derived(DieUtils.getReservedSize(size));
    const geometry = $derived(DieUtils.computeFaceGeometry(props.shape, size * HALF));
    const shownFace = $derived(DieUtils.clampFace(face, geometry.length));

    const roller = DieUtils.createRoller({
        getGeometry: () => geometry,
        getShownFace: () => shownFace,
        getRollDurationMs: () => props.rollDurationMs ?? DIE_DEFAULTS.rollDurationMs,
        getTumbleCount: () => props.tumbleCount ?? DIE_DEFAULTS.tumbleCount,
        computeRollTarget: () => props.computeRollTarget(),
        computeFaceLabel: (index) => props.computeFaceLabel(index),
        writeFace: (index) => {
            face = index;
        },
        onRollEnd: (index) => props.onRollEnd?.(index),
    });

    $effect(() => () => roller.stop());

    const getOrientation = readStore(roller, (state) => state.orientation);
    const getIsRolling = readStore(roller, (state) => state.isRolling);
    const getRestingFace = readStore(roller, (state) => state.restingFace);

    let previousShownFace: number | undefined;

    $effect(() => {
        const next = shownFace;

        untrack(() => {
            const previous = previousShownFace;

            previousShownFace = next;

            if (previous === undefined) {
                roller.rest(next);
            } else if (previous !== next) {
                roller.turnTo(next);
            }
        });
    });

    $effect(() => {
        void geometry;

        untrack(() => roller.reshape(shownFace));
    });

    const controller: DieController = {
        getIsRolling,
        roll: roller.roll,
    };

    $effect(() => {
        untrack(() => {
            LiveAnnouncerUtils.reserve("polite");
            props.onMount?.(controller);
        });
    });

    const faceRoleDescription = $derived(props.faceRoleDescription ?? DIE_DEFAULTS.faceRoleDescription);
</script>

<div
    class={styles.dieRoot}
    style:width={`${reservedSize.width}px`}
    style:height={`${reservedSize.height}px`}
    role="group"
    aria-roledescription={props.roleDescription ?? DIE_DEFAULTS.roleDescription}
    aria-label={props.ariaLabel}
    aria-busy={getIsRolling() ? "true" : undefined}
>
    <div
        class={styles.diePerspective}
        style:width={`${size}px`}
        style:height={`${size}px`}
        style:perspective={`${BarrelUtils.PERSPECTIVE_PX}px`}
    >
        <div class={styles.dieBody} style:transform={DieUtils.getBodyTransform(getOrientation(), size)}>
            {#each geometry as faceGeometry, index (index)}
                {@const isShowing = index === getRestingFace()}
                {@const faceBox = DieUtils.getFaceBox(faceGeometry, size)}
                <div
                    class={styles.dieFace}
                    style:width={`${faceGeometry.size.width}px`}
                    style:height={`${faceGeometry.size.height}px`}
                    style:left={`${faceBox.left}px`}
                    style:top={`${faceBox.top}px`}
                    style:transform={DieUtils.computeFaceTransform(faceGeometry)}
                    style:clip-path={faceBox.clipPath}
                    role="group"
                    aria-roledescription={faceRoleDescription}
                    aria-label={props.computeFaceLabel(index)}
                    aria-hidden={isShowing ? undefined : "true"}
                    inert={!isShowing}
                >
                    {@render props.renderFace(index, DieUtils.getFaceState(geometry, index, getRestingFace()))}
                </div>
            {/each}
        </div>
    </div>
</div>
