<script lang="ts">
    import { untrack } from "svelte";

    import {
        SLOT_TEXT_DEFAULTS,
        type SlotTextFixedSlot,
        type SlotTextTurningSlot,
        SlotTextUtils,
        SlotTextStyles as styles,
    } from "@thewaver/ss-components";

    import { MediaQueryMonitorSvelteUtils } from "../../../Abstracts/MediaQueryMonitor/MediaQueryMonitorSvelte.utils.svelte.js";
    import Barrel from "../../../Primitives/Barrel/Barrel.svelte";
    import { watchChange } from "../../../Utils/effectUtils.svelte.js";
    import type { SlotTextProps } from "./SlotText.types.js";
    import SlotTextFlapColumn from "./SlotTextFlapColumn.svelte";
    import SlotTextSlot from "./SlotTextSlot.svelte";

    const RESTING_ANGLE = 0;
    const NO_DELAY = 0;
    const FIRST = 0;
    const HIDDEN_FACE = { ariaLabel: "", isHidden: true };

    let props: SlotTextProps = $props();

    const letters = $derived(props.letters ?? SLOT_TEXT_DEFAULTS.letters);
    const slots = $derived(SlotTextUtils.getSlots(props.text, letters));
    const getPrefersReducedMotion = MediaQueryMonitorSvelteUtils.createReducedMotion();

    const characterSize = $derived(props.characterSize);
    const turnDelayMs = $derived(props.turnDelayMs ?? SLOT_TEXT_DEFAULTS.turnDelayMs);
    const turnDurationMs = $derived(props.turnDurationMs ?? SLOT_TEXT_DEFAULTS.turnDurationMs);
    const mechanism = $derived(props.mechanism ?? SLOT_TEXT_DEFAULTS.mechanism);
    const letterRoute = $derived(props.letterRoute ?? SLOT_TEXT_DEFAULTS.letterRoute);

    const createBoard = (initialSlots: ReturnType<typeof SlotTextUtils.getSlots>, initialLetters: string) => {
        const initialWheels = SlotTextUtils.getWheels(initialSlots, initialLetters);

        return {
            shownWheels: initialWheels,
            columnWheels: initialWheels,
            angles: initialWheels.map((wheel) => SlotTextUtils.getRestingAngle(wheel.face, wheel.faces.length)),
            delays: [] as number[],
            durations: [] as (number | undefined)[],
            fixed: SlotTextUtils.computeShownSlots<SlotTextFixedSlot>(
                [],
                SlotTextUtils.getFixedSlots(initialSlots),
                true,
            ),
            turningSlots: SlotTextUtils.computeShownSlots<SlotTextTurningSlot>(
                [],
                SlotTextUtils.getTurningSlots(initialSlots),
                true,
            ),
        };
    };

    let board = $state.raw(createBoard(...untrack(() => [slots, letters] as const)));

    watchChange(
        () => slots,
        (nextSlots) => {
            const nextWheels = SlotTextUtils.getWheels(nextSlots, letters);
            const prefersReducedMotion = getPrefersReducedMotion();
            const computeReel = props.computeReel;
            const turn = SlotTextUtils.computeTurn({
                shownWheels: board.shownWheels,
                columnWheels: board.columnWheels,
                angles: board.angles,
                wheels: nextWheels,
                isInstant: prefersReducedMotion,
                reels: computeReel && nextWheels.map((_wheel, index) => computeReel(index, nextWheels.length)),
                turnDelayMs,
                letterRoute,
            });

            board = {
                shownWheels: nextWheels,
                columnWheels: turn.columnWheels,
                angles: turn.angles,
                delays: turn.delays,
                durations: turn.durations,
                fixed: SlotTextUtils.computeShownSlots(
                    board.fixed,
                    SlotTextUtils.getFixedSlots(nextSlots),
                    prefersReducedMotion,
                ),
                turningSlots: SlotTextUtils.computeShownSlots(
                    board.turningSlots,
                    SlotTextUtils.getTurningSlots(nextSlots),
                    prefersReducedMotion,
                ),
            };
        },
        { isBeforeRender: true },
    );

    const settleFixed = (index: number) => {
        board = { ...board, fixed: SlotTextUtils.settleShownSlot(board.fixed, index) };
    };

    const dropFixed = (index: number) => {
        board = { ...board, fixed: SlotTextUtils.dropShownSlot(board.fixed, index) };
    };

    const settleTurning = (index: number) => {
        board = { ...board, turningSlots: SlotTextUtils.settleShownSlot(board.turningSlots, index) };
    };

    const dropTurningColumn = (index: number) => {
        const turningSlots = SlotTextUtils.dropShownSlot(board.turningSlots, index);

        if (index < board.shownWheels.length) {
            board = { ...board, turningSlots };

            return;
        }

        board = {
            ...board,
            turningSlots,
            angles: board.angles.slice(FIRST, index),
            columnWheels: board.columnWheels.slice(FIRST, index),
        };
    };

    const slotSize = $derived(`width: ${characterSize.width}px; height: ${characterSize.height}px`);
</script>

<div class={styles.slotTextRoot} role="group" aria-label={props.ariaLabel}>
    <span class={styles.slotTextValue}>{props.text}</span>

    {#each board.fixed as shown, index (index)}
        {@const flags = SlotTextUtils.getSlotFlags(shown.phase)}
        <SlotTextSlot
            phase={shown.phase}
            widthPx={characterSize.width}
            durationMs={turnDurationMs}
            class={[styles.slotTextFixed, shown.phase === "shown" ? undefined : styles.slotTextFixedClipped]
                .filter(Boolean)
                .join(" ")}
            style={`order: ${shown.slot.order}; ${slotSize}`}
            isHidden={true}
            onGrown={() => settleFixed(index)}
            onShrunk={() => dropFixed(index)}
        >
            {#if props.renderFixed}
                {@render props.renderFixed(shown.slot.character, flags)}
            {:else}
                {shown.slot.character}
            {/if}
        </SlotTextSlot>
    {/each}

    {#each board.turningSlots as shown, index (index)}
        {@const flags = SlotTextUtils.getSlotFlags(shown.phase)}
        {@const wheelIndex = shown.slot.wheelIndex}
        {@const faces = board.columnWheels[wheelIndex]?.faces ?? SlotTextUtils.DIGITS}
        <SlotTextSlot
            phase={shown.phase}
            widthPx={characterSize.width}
            durationMs={turnDurationMs}
            class={styles.slotTextWindow}
            style={`order: ${shown.slot.order}; ${slotSize}`}
            onGrown={() => settleTurning(index)}
            onShrunk={() => dropTurningColumn(index)}
        >
            {#if mechanism === "splitFlap"}
                {#snippet flapCharacter(character: string)}
                    {#if props.renderTurning}
                        {@render props.renderTurning(character, flags)}
                    {:else}
                        {character}
                    {/if}
                {/snippet}
                <SlotTextFlapColumn
                    target={SlotTextUtils.getFlapPosition(board.angles[wheelIndex] ?? RESTING_ANGLE, faces.length)}
                    delayMs={board.delays[wheelIndex] ?? NO_DELAY}
                    durationMs={board.durations[wheelIndex] ?? turnDurationMs}
                    {faces}
                    {characterSize}
                    renderCharacter={flapCharacter}
                />
            {:else}
                <div class={styles.slotTextBarrel}>
                    <Barrel
                        {faces}
                        axis="column"
                        hasBacks={false}
                        faceSize={characterSize}
                        angle={board.angles[wheelIndex] ?? RESTING_ANGLE}
                        transitionDurationMs={board.durations[wheelIndex] ?? turnDurationMs}
                        transitionDelayMs={board.delays[wheelIndex] ?? NO_DELAY}
                        faceRoleDescription=""
                        computeFaceDefs={() => HIDDEN_FACE}
                    >
                        {#snippet renderFace(face: string)}
                            <div class={styles.slotTextFace}>
                                {#if props.renderTurning}
                                    {@render props.renderTurning(face, flags)}
                                {:else}
                                    {face}
                                {/if}
                            </div>
                        {/snippet}
                    </Barrel>
                </div>
            {/if}
        </SlotTextSlot>
    {/each}
</div>
