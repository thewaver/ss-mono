import { Index, createEffect, createMemo, createSignal, onCleanup } from "solid-js";

import { TextSyncUtils } from "../../../Abstracts/TextSync/TextSync.utils";
import { TextField } from "../../../Primitives/TextField/TextField";
import { access } from "../../../Utils/propUtils";
import { SEGMENTED_INPUT_DEFAULTS } from "./SegmentedInput.const";
import type { SegmentedInputProps } from "./SegmentedInput.types";

import * as styles from "./SegmentedInput.css";

const PRIMARY_BUTTON = 0;

const computeDistance = (x: number, rect: DOMRect) => Math.max(rect.left - x, 0, x - rect.right);

export const SegmentedInput = (props: SegmentedInputProps) => {
    const [getElement, setElement] = createSignal<HTMLInputElement>();
    const [getSelectionStart, setSelectionStart] = createSignal(0);
    const [getSelectionEnd, setSelectionEnd] = createSignal(0);

    const cellRefs: HTMLElement[] = [];

    let dragAnchor: number | undefined;

    const getCellCount = () => Math.max(0, access(props.cellCount));

    const getIndices = createMemo(() => Array.from({ length: getCellCount() }, (_unused, index) => index));

    const getCaretIndex = () => Math.min(getSelectionStart(), getCellCount() - 1);

    const readSelection = () => {
        const element = getElement();

        if (!element) return;

        setSelectionStart(element.selectionStart ?? element.value.length);
        setSelectionEnd(element.selectionEnd ?? element.value.length);
    };

    const readSelectionLater = () => {
        setTimeout(readSelection);
    };

    const findCellIndex = (x: number) => {
        let found = 0;
        let nearest = Number.POSITIVE_INFINITY;

        cellRefs.slice(0, getCellCount()).forEach((cell, index) => {
            const distance = computeDistance(x, cell.getBoundingClientRect());

            if (distance >= nearest) return;

            nearest = distance;
            found = index;
        });

        return found;
    };

    const selectCells = (element: HTMLInputElement, from: number, to: number) => {
        const length = element.value.length;
        const low = Math.min(from, to);
        const high = Math.max(from, to);

        if (low >= length) element.setSelectionRange(length, length);
        else element.setSelectionRange(low, Math.min(high + 1, length));

        readSelection();
    };

    const handlePointerDown = (e: PointerEvent) => {
        const element = getElement();

        if (!element || e.button !== PRIMARY_BUTTON || access(props.isDisabled)) return;

        e.preventDefault();

        dragAnchor = findCellIndex(e.clientX);

        element.focus();
        element.setPointerCapture(e.pointerId);

        selectCells(element, dragAnchor, dragAnchor);
    };

    const handlePointerMove = (e: PointerEvent) => {
        const element = getElement();

        if (!element || dragAnchor === undefined) return;

        selectCells(element, dragAnchor, findCellIndex(e.clientX));
    };

    const handlePointerEnd = () => {
        dragAnchor = undefined;
    };

    createEffect(() => {
        const element = getElement();

        if (!element) return;

        const listeners: [string, EventListener][] = [
            ["pointerdown", handlePointerDown as EventListener],
            ["pointermove", handlePointerMove as EventListener],
            ["pointerup", handlePointerEnd],
            ["pointercancel", handlePointerEnd],
            ["selectionchange", readSelection],
            ["select", readSelection],
            ["focus", readSelection],
            ["blur", readSelection],
            ["keydown", readSelectionLater],
            ["keyup", readSelection],
        ];

        for (const [type, listener] of listeners) element.addEventListener(type, listener);

        onCleanup(() => {
            for (const [type, listener] of listeners) element.removeEventListener(type, listener);
        });
    });

    createEffect(() => {
        props.valueSignal[0]();

        readSelection();
    });

    return (
        <TextField
            {...props}
            element={"input"}
            type={"text"}
            isConcealed={true}
            inputMode={props.inputMode ?? SEGMENTED_INPUT_DEFAULTS.inputMode}
            ref={(element) => {
                setElement(element as HTMLInputElement);
                props.ref?.(element);
            }}
            computeMaskedText={(_previous, next, caret) =>
                TextSyncUtils.applyFilter(
                    props.computeIsAllowed ?? SEGMENTED_INPUT_DEFAULTS.computeIsAllowed,
                    getCellCount(),
                    next,
                    caret,
                )
            }
            renderContent={(getFlags) => (
                <div
                    class={styles.segmentedInputCells}
                    style={{ gap: `${access(props.gap) ?? SEGMENTED_INPUT_DEFAULTS.gap}px` }}
                    aria-hidden="true"
                >
                    <Index each={getIndices()}>
                        {(_unused, index) => (
                            <div ref={(cell) => (cellRefs[index] = cell)} class={styles.segmentedInputCell}>
                                {props.renderCell(() => {
                                    const flags = getFlags();
                                    const isFocused = flags.isFocused ?? false;
                                    const start = getSelectionStart();
                                    const end = getSelectionEnd();

                                    return {
                                        ...flags,
                                        index,
                                        char: props.valueSignal[0]()[index],
                                        hasCaret: isFocused && index === getCaretIndex(),
                                        isSelected: isFocused && start !== end && index >= start && index < end,
                                    };
                                })}
                            </div>
                        )}
                    </Index>
                </div>
            )}
        />
    );
};
