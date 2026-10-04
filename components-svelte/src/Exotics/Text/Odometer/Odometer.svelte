<script lang="ts">
    import { untrack } from "svelte";

    import {
        ODOMETER_DEFAULTS,
        type OdometerDigitSlot,
        type OdometerFixedSlot,
        OdometerUtils,
        OdometerStyles as styles,
    } from "@thewaver/ss-components";

    import { MediaQueryMonitorSvelteUtils } from "../../../Abstracts/MediaQueryMonitor/MediaQueryMonitorSvelte.utils.svelte.js";
    import Barrel from "../../../Primitives/Barrel/Barrel.svelte";
    import { watchChange } from "../../../Utils/effectUtils.svelte.js";
    import type { OdometerProps } from "./Odometer.types.js";
    import OdometerFlapColumn from "./OdometerFlapColumn.svelte";
    import OdometerSlot from "./OdometerSlot.svelte";

    const RESTING_ANGLE = 0;
    const NO_DELAY = 0;
    const FIRST = 0;

    let props: OdometerProps = $props();

    const slots = $derived(OdometerUtils.getSlots(props.text));
    const getPrefersReducedMotion = MediaQueryMonitorSvelteUtils.createReducedMotion();

    const digitSize = $derived(props.digitSize);
    const cascadeDelayMs = $derived(props.cascadeDelayMs ?? ODOMETER_DEFAULTS.cascadeDelayMs);
    const turnDurationMs = $derived(props.turnDurationMs ?? ODOMETER_DEFAULTS.turnDurationMs);
    const mechanism = $derived(props.mechanism ?? ODOMETER_DEFAULTS.mechanism);

    const createBoard = (initialSlots: ReturnType<typeof OdometerUtils.getSlots>) => {
        const initialDigits = OdometerUtils.getDigits(initialSlots);

        return {
            shownDigits: initialDigits,
            columnDigits: initialDigits,
            angles: initialDigits.map(OdometerUtils.getRestingAngle),
            delays: [] as number[],
            durations: [] as (number | undefined)[],
            fixed: OdometerUtils.computeShownSlots<OdometerFixedSlot>(
                [],
                OdometerUtils.getFixedSlots(initialSlots),
                true,
            ),
            digitSlots: OdometerUtils.computeShownSlots<OdometerDigitSlot>(
                [],
                OdometerUtils.getDigitSlots(initialSlots),
                true,
            ),
        };
    };

    let board = $state.raw(createBoard(untrack(() => slots)));

    watchChange(
        () => slots,
        (nextSlots) => {
            const nextDigits = OdometerUtils.getDigits(nextSlots);
            const prefersReducedMotion = getPrefersReducedMotion();
            const computeReel = props.computeReel;
            const turn = OdometerUtils.computeTurn({
                shownDigits: board.shownDigits,
                columnDigits: board.columnDigits,
                angles: board.angles,
                digits: nextDigits,
                isInstant: prefersReducedMotion,
                reels: computeReel && nextDigits.map((_digit, index) => computeReel(index, nextDigits.length)),
                cascadeDelayMs,
            });

            board = {
                shownDigits: nextDigits,
                columnDigits: turn.columnDigits,
                angles: turn.angles,
                delays: turn.delays,
                durations: turn.durations,
                fixed: OdometerUtils.computeShownSlots(
                    board.fixed,
                    OdometerUtils.getFixedSlots(nextSlots),
                    prefersReducedMotion,
                ),
                digitSlots: OdometerUtils.computeShownSlots(
                    board.digitSlots,
                    OdometerUtils.getDigitSlots(nextSlots),
                    prefersReducedMotion,
                ),
            };
        },
        { isBeforeRender: true },
    );

    const settleFixed = (index: number) => {
        board = { ...board, fixed: OdometerUtils.settleShownSlot(board.fixed, index) };
    };

    const dropFixed = (index: number) => {
        board = { ...board, fixed: OdometerUtils.dropShownSlot(board.fixed, index) };
    };

    const settleDigit = (index: number) => {
        board = { ...board, digitSlots: OdometerUtils.settleShownSlot(board.digitSlots, index) };
    };

    const dropDigitColumn = (index: number) => {
        const digitSlots = OdometerUtils.dropShownSlot(board.digitSlots, index);

        if (index < board.shownDigits.length) {
            board = { ...board, digitSlots };

            return;
        }

        board = {
            ...board,
            digitSlots,
            angles: board.angles.slice(FIRST, index),
            columnDigits: board.columnDigits.slice(FIRST, index),
        };
    };

    const slotSize = $derived(`width: ${digitSize.width}px; height: ${digitSize.height}px`);
</script>

<div class={styles.odometerRoot} role="group" aria-label={props.ariaLabel}>
    <span class={styles.odometerValue}>{props.text}</span>

    {#each board.fixed as shown, index (index)}
        {@const flags = OdometerUtils.getSlotFlags(shown.phase)}
        <OdometerSlot
            phase={shown.phase}
            widthPx={digitSize.width}
            durationMs={turnDurationMs}
            class={[styles.odometerFixed, shown.phase === "shown" ? undefined : styles.odometerFixedClipped]
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
        </OdometerSlot>
    {/each}

    {#each board.digitSlots as shown, index (index)}
        {@const flags = OdometerUtils.getSlotFlags(shown.phase)}
        {@const digitIndex = shown.slot.digitIndex}
        <OdometerSlot
            phase={shown.phase}
            widthPx={digitSize.width}
            durationMs={turnDurationMs}
            class={styles.odometerWindow}
            style={`order: ${shown.slot.order}; ${slotSize}`}
            onGrown={() => settleDigit(index)}
            onShrunk={() => dropDigitColumn(index)}
        >
            {#if mechanism === "splitFlap"}
                {#snippet flapCharacter(character: string)}
                    {#if props.renderDigit}
                        {@render props.renderDigit(character, flags)}
                    {:else}
                        {character}
                    {/if}
                {/snippet}
                <OdometerFlapColumn
                    target={OdometerUtils.getFlapPosition(board.angles[digitIndex] ?? RESTING_ANGLE)}
                    delayMs={board.delays[digitIndex] ?? NO_DELAY}
                    durationMs={board.durations[digitIndex] ?? turnDurationMs}
                    {digitSize}
                    renderCharacter={flapCharacter}
                />
            {:else}
                <div class={styles.odometerBarrel}>
                    <Barrel
                        faces={OdometerUtils.DIGITS}
                        axis="column"
                        hasBacks={false}
                        faceSize={digitSize}
                        angle={board.angles[digitIndex] ?? RESTING_ANGLE}
                        transitionDurationMs={board.durations[digitIndex] ?? turnDurationMs}
                        transitionDelayMs={board.delays[digitIndex] ?? NO_DELAY}
                        faceRoleDescription=""
                        computeFaceDefs={() => ({ ariaLabel: "", isHidden: true })}
                    >
                        {#snippet renderFace(face: string)}
                            <div class={styles.odometerDigitFace}>
                                {#if props.renderDigit}
                                    {@render props.renderDigit(face, flags)}
                                {:else}
                                    {face}
                                {/if}
                            </div>
                        {/snippet}
                    </Barrel>
                </div>
            {/if}
        </OdometerSlot>
    {/each}
</div>
