import { Index, createEffect, createMemo, createSignal, on, onMount } from "solid-js";

import { ElementObserver } from "../../Abstracts/ElementObserver/ElementObserver";
import { InteractionTracker } from "../../Abstracts/InteractionTracker/InteractionTracker";
import { access } from "../../Utils/propUtils";
import type { ScratchCardProps } from "./ScratchCard.types";
import { ScratchCardUtils } from "./ScratchCard.utils";

import * as styles from "./ScratchCard.css";

const DEFAULT_BRUSH_RADIUS = 26;
const DEFAULT_CLEAR_THRESHOLD = 1;
const NOTHING_SCRATCHED = 0;
const CLEAR_KEYS = ["Enter", " "];

export const ScratchCard = (props: ScratchCardProps) => {
    const [getCoverRef, setCoverRef] = createSignal<HTMLElement>();
    const [getScratched, setScratched] = createSignal<Set<number>>(new Set());

    const getCellCount = createMemo(() => access(props.cellCount));

    const getIsDisabled = createMemo(() => access(props.isDisabled) === true);

    const getSize = ElementObserver.createBorderBoxSizeObserver(getCoverRef, () => !getIsDisabled());

    const getTotal = createMemo(() => ScratchCardUtils.getCellCount(getCellCount()));

    const getClearedRatio = createMemo(() => ScratchCardUtils.computeClearedRatio(getScratched().size, getCellCount()));

    const getIsCleared = createMemo(() => getTotal() > NOTHING_SCRATCHED && getScratched().size >= getTotal());

    const getClearThreshold = createMemo(() => access(props.clearThreshold) ?? DEFAULT_CLEAR_THRESHOLD);

    const clearAll = () => setScratched(new Set(Array.from({ length: getTotal() }, (_unused, index) => index)));

    const controller = createMemo(() => ({
        reset: () => setScratched(new Set<number>()),
        clear: clearAll,
    }));

    onMount(() => {
        props.onMount?.(controller());
    });

    createEffect(on(getCellCount, () => setScratched(new Set<number>()), { defer: true }));

    createEffect(
        on(
            getClearedRatio,
            (ratio) => {
                props.onScratch?.(ratio);

                if (ratio < getClearThreshold() || getIsCleared()) return;

                clearAll();
            },
            { defer: true },
        ),
    );

    createEffect(
        on(
            getIsCleared,
            (isCleared) => {
                if (isCleared) props.onClear?.();
            },
            { defer: true },
        ),
    );

    const scratchAt = (ratio: { x: number; y: number }) => {
        const size = getSize();
        const brushed = ScratchCardUtils.computeBrushedCells({
            point: { x: ratio.x * size.width, y: ratio.y * size.height },
            size,
            cellCount: getCellCount(),
            radius: access(props.brushRadius) ?? DEFAULT_BRUSH_RADIUS,
        });

        setScratched((previous) => {
            if (brushed.every((index) => previous.has(index))) return previous;

            return new Set([...previous, ...brushed]);
        });
    };

    InteractionTracker.trackDrag(getCoverRef, getIsDisabled, { onDrag: scratchAt });

    const handleKeyDown = (e: KeyboardEvent) => {
        if (getIsDisabled() || !CLEAR_KEYS.includes(e.key)) return;

        e.preventDefault();
        clearAll();
    };

    return (
        <div class={styles.scratchCardRoot}>
            {props.renderContent()}

            {!getIsCleared() && (
                <div
                    ref={setCoverRef}
                    class={styles.scratchCardCover}
                    style={{
                        "grid-template-columns": `repeat(${getCellCount().x}, 1fr)`,
                        "grid-template-rows": `repeat(${getCellCount().y}, 1fr)`,
                    }}
                    role="button"
                    tabindex={getIsDisabled() ? undefined : 0}
                    aria-label={access(props.ariaLabel)}
                    aria-disabled={getIsDisabled() || undefined}
                    onKeyDown={handleKeyDown}
                >
                    <Index each={Array.from({ length: getTotal() }, (_unused, index) => index)}>
                        {(getIndex) => (
                            <div
                                class={styles.scratchCardCell}
                                classList={{ [styles.scratchCardScratched]: getScratched().has(getIndex()) }}
                            >
                                {props.renderCell(() => ({
                                    index: getIndex(),
                                    cell: ScratchCardUtils.getCellPosition(getIndex(), getCellCount()),
                                    isScratched: getScratched().has(getIndex()),
                                }))}
                            </div>
                        )}
                    </Index>
                </div>
            )}
        </div>
    );
};
