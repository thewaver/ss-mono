import { Index, createEffect, createMemo, createSignal, onCleanup } from "solid-js";

import {
    SEGMENTED_INPUT_DEFAULTS,
    type SegmentedInputSelection,
    SegmentedInputUtils,
    TextSyncUtils,
    SegmentedInputStyles as styles,
} from "@thewaver/ss-components";

import { TextField } from "../../../Primitives/TextField/TextField";
import { access } from "../../../Utils/propUtils";
import type { SegmentedInputProps } from "./SegmentedInputSolid.types";

export const SegmentedInput = (props: SegmentedInputProps) => {
    const [getElement, setElement] = createSignal<HTMLInputElement>();
    const [getSelectionStart, setSelectionStart] = createSignal(0);
    const [getSelectionEnd, setSelectionEnd] = createSignal(0);

    const cellRefs: HTMLElement[] = [];

    const getCellCount = () => Math.max(0, access(props.cellCount));

    const getIndices = createMemo(() => Array.from({ length: getCellCount() }, (_unused, index) => index));

    const setSelection = (selection: SegmentedInputSelection) => {
        setSelectionStart(selection.start);
        setSelectionEnd(selection.end);
    };

    createEffect(() => {
        const element = getElement();

        if (!element) return;

        onCleanup(
            SegmentedInputUtils.observeSelection(element, {
                getIsDisabled: () => access(props.isDisabled) ?? false,
                getCells: () => cellRefs.slice(0, getCellCount()),
                onSelectionChange: setSelection,
            }),
        );
    });

    createEffect(() => {
        props.value[0]();

        const element = getElement();

        if (!element) return;

        setSelection(SegmentedInputUtils.readSelection(element));
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

                                    return {
                                        ...flags,
                                        ...SegmentedInputUtils.computeCellFlags(index, {
                                            isFocused: flags.isFocused ?? false,
                                            selection: { start: getSelectionStart(), end: getSelectionEnd() },
                                            cellCount: getCellCount(),
                                        }),
                                        index,
                                        char: props.value[0]()[index],
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
