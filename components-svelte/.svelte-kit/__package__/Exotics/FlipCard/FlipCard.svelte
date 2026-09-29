<script lang="ts">
    import {
        FLIP_CARD_DEFAULTS,
        type FlipCardFace,
        type FlipCardState,
        FlipCardUtils,
        FlipCardStyles as styles,
    } from "@thewaver/ss-components";

    import Barrel from "../../Primitives/Barrel/Barrel.svelte";
    import type { FlipCardProps } from "./FlipCard.types.js";

    let { flipped = $bindable(), ...props }: FlipCardProps = $props();

    let rest: { angle: number; isFlipped: boolean } | undefined;

    const restingAngle = $derived.by(() => {
        if (rest && rest.isFlipped === flipped) return rest.angle;

        const angle = FlipCardUtils.computeRestingAngle(rest?.angle, flipped, props.turnDirection);

        rest = { angle, isFlipped: flipped };

        return angle;
    });

    const shownFace = $derived(FlipCardUtils.getShownFace(flipped));
    const peekRatio = $derived(FlipCardUtils.getPeekRatio(props.peekRatio ?? FLIP_CARD_DEFAULTS.peekRatio));
    const angle = $derived(FlipCardUtils.computeAngle(restingAngle, flipped, peekRatio, props.turnDirection));
    const transitionDurationMs = $derived(
        FlipCardUtils.getTransitionDurationMs(
            peekRatio,
            props.transitionDurationMs ?? FLIP_CARD_DEFAULTS.transitionDurationMs,
        ),
    );

    const getState = (face: FlipCardFace): FlipCardState => ({ face, isShowing: face === shownFace });
</script>

{#snippet renderFace(face: FlipCardFace)}
    {#if face === "back"}
        {@render props.renderBack(getState("back"))}
    {:else}
        {@render props.renderFront(getState("front"))}
    {/if}
{/snippet}

<div
    class={styles.flipCardRoot}
    role="group"
    aria-roledescription={props.roleDescription ?? FLIP_CARD_DEFAULTS.roleDescription}
    aria-label={props.ariaLabel}
>
    <Barrel
        faces={[...FlipCardUtils.FACES]}
        axis={props.axis ?? FLIP_CARD_DEFAULTS.axis}
        faceSize={props.size}
        {angle}
        {transitionDurationMs}
        faceRoleDescription={props.faceRoleDescription ?? FLIP_CARD_DEFAULTS.faceRoleDescription}
        computeFaceDefs={(index) => ({
            ariaLabel: props.computeFaceLabel(FlipCardUtils.FACES[index]!),
            isHidden: FlipCardUtils.FACES[index] !== shownFace,
        })}
        {renderFace}
    />
</div>
