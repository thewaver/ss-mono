<script lang="ts">
    import { untrack } from "svelte";

    import {
        BarrelUtils,
        CUBOID_DEFAULTS,
        CUBOID_FACES,
        type CuboidFace,
        type CuboidTurns,
        CuboidUtils,
        CuboidStyles as styles,
    } from "@thewaver/ss-components";
    import type { Matrix3d } from "@thewaver/ss-utils";

    import { InteractionTrackerSvelteUtils } from "../../Abstracts/InteractionTracker/InteractionTrackerSvelte.utils.svelte.js";
    import type { CuboidController, CuboidProps } from "./Cuboid.types.js";

    const NO_DURATION = 0;
    const DRAG_COMMIT_RATIO = 0.5;

    const NO_TURNS: CuboidTurns = { yaw: 0, pitch: 0 };

    let { yaw = $bindable(), pitch = $bindable(), ...props }: CuboidProps = $props();

    const size = $derived(props.size);
    const transitionDurationMs = $derived(props.transitionDurationMs ?? CUBOID_DEFAULTS.transitionDurationMs);
    const isUpright = $derived(props.isUpright ?? CUBOID_DEFAULTS.isUpright);
    const isDraggable = $derived(props.isDraggable ?? CUBOID_DEFAULTS.isDraggable);

    let perspective = $state<HTMLDivElement>();
    let body = $state<HTMLDivElement>();
    let dragTurns = $state.raw(NO_TURNS);
    let orientation = $state.raw(
        CuboidUtils.standUpright(CuboidUtils.getCountedOrientation(untrack(() => yaw), untrack(() => pitch))),
    );

    let tracked = untrack(() => ({ yaw, pitch, isUpright }));

    const facing = $derived(CuboidUtils.getFacing(isUpright, orientation, yaw, pitch));

    const readDrawnOrientation = () => CuboidUtils.readDrawnOrientation(body ?? undefined);

    const settle = (from: Matrix3d | undefined, to: Matrix3d, turns: CuboidTurns) =>
        CuboidUtils.settle(body ?? undefined, from, to, size, turns, transitionDurationMs);

    $effect.pre(() => {
        const next = { yaw, pitch, isUpright };

        untrack(() => {
            if (tracked.yaw === next.yaw && tracked.pitch === next.pitch && tracked.isUpright === next.isUpright) {
                return;
            }

            const from = readDrawnOrientation();

            if (tracked.isUpright !== next.isUpright) {
                const counted = CuboidUtils.getCountedOrientation(next.yaw, next.pitch);

                orientation = CuboidUtils.standUpright(counted);
                settle(from, next.isUpright ? orientation : counted, NO_TURNS);
            } else if (next.isUpright) {
                const turns = { yaw: next.yaw - tracked.yaw, pitch: next.pitch - tracked.pitch };

                orientation = CuboidUtils.turnUpright(orientation, turns);
                settle(from, orientation, turns);
            }

            tracked = next;
        });
    });

    const { getIsSwiping } = InteractionTrackerSvelteUtils.trackFreeSwipe(
        () => perspective ?? undefined,
        () => !isDraggable,
        {
            getCommitRatio: () => DRAG_COMMIT_RATIO,
            onSwipe: (travel) => {
                if (isUpright) CuboidUtils.stopSettling(body ?? undefined);

                dragTurns = CuboidUtils.getDragTurns(travel, CuboidUtils.getAcrossSign(isUpright, pitch));
            },
            onSwipeEnd: (direction) => {
                const turns = CuboidUtils.getReleaseTurns(direction, dragTurns);
                const from = isUpright ? readDrawnOrientation() : undefined;
                const previousYaw = yaw;
                const previousPitch = pitch;

                dragTurns = NO_TURNS;
                yaw = previousYaw + turns.yaw;
                pitch = previousPitch + turns.pitch;

                if (from && yaw === previousYaw && pitch === previousPitch) settle(from, orientation, NO_TURNS);
            },
        },
    );

    const controller: CuboidController = {
        getFacing: () => facing,
        turnTo: (face: CuboidFace) => {
            const turns = CuboidUtils.findTurnsTo(face, isUpright, orientation, yaw, pitch);

            if (!turns) return false;

            yaw = yaw + turns.yaw;
            pitch = pitch + turns.pitch;

            return true;
        },
    };

    $effect(() => {
        untrack(() => props.onMount?.(controller));
    });

    const reservedSize = $derived(CuboidUtils.getReservedSize(size));
    const faceRoleDescription = $derived(props.faceRoleDescription ?? CUBOID_DEFAULTS.faceRoleDescription);
</script>

<div
    class={styles.cuboidRoot}
    style:width={`${reservedSize.width}px`}
    style:height={`${reservedSize.height}px`}
    role="group"
    aria-roledescription={props.roleDescription ?? CUBOID_DEFAULTS.roleDescription}
    aria-label={props.ariaLabel}
>
    <div
        bind:this={perspective}
        class={styles.cuboidPerspective}
        style:width={`${size.width}px`}
        style:height={`${size.height}px`}
        style:perspective={`${BarrelUtils.PERSPECTIVE_PX}px`}
    >
        <div
            bind:this={body}
            class={styles.cuboidBody}
            style:transform={CuboidUtils.getBodyTransform(isUpright, orientation, yaw, pitch, dragTurns, size)}
            style:transition-duration={`${isUpright || getIsSwiping() ? NO_DURATION : transitionDurationMs}ms`}
        >
            {#each CUBOID_FACES as face (face)}
                {@const isShowing = face === facing}
                {@const faceBox = CuboidUtils.getFaceBox(face, size)}
                <div
                    class={styles.cuboidFace}
                    style:width={`${faceBox.width}px`}
                    style:height={`${faceBox.height}px`}
                    style:left={`${faceBox.left}px`}
                    style:top={`${faceBox.top}px`}
                    style:transform={CuboidUtils.getFaceTransform(face, size)}
                    role="group"
                    aria-roledescription={faceRoleDescription}
                    aria-label={props.computeFaceLabel(face)}
                    aria-hidden={isShowing ? undefined : "true"}
                    inert={!isShowing}
                >
                    {@render props.renderFace(face, { face, isShowing })}
                </div>
            {/each}
        </div>
    </div>
</div>
