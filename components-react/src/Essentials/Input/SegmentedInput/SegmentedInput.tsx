import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

import {
    SEGMENTED_INPUT_DEFAULTS,
    type SegmentedInputSelection,
    SegmentedInputStyles,
    SegmentedInputUtils,
    TextSyncUtils,
} from "@thewaver/ss-components";

import { TextField } from "../../../Primitives/TextField/TextField";
import { useElement, useLatest } from "../../../Utils/refUtils";
import type { SegmentedInputProps } from "./SegmentedInput.types";

const NO_SELECTION: SegmentedInputSelection = { start: 0, end: 0 };

export const SegmentedInput = (props: SegmentedInputProps) => {
    const [value] = props.valueState;

    const elementRef = useRef<HTMLInputElement | null>(null);
    const element = useElement(elementRef);
    const cellRefs = useRef<(HTMLDivElement | null)[]>([]);
    const latestRef = useLatest(props.ref);

    const [selection, setSelection] = useState(NO_SELECTION);

    const cellCount = Math.max(0, props.cellCount);
    const indices = Array.from({ length: cellCount }, (_unused, index) => index);

    const latest = useLatest({ isDisabled: props.isDisabled ?? false, cellCount });

    const reportSelection = useCallback((next: SegmentedInputSelection) => {
        setSelection((previous) => (previous.start === next.start && previous.end === next.end ? previous : next));
    }, []);

    useEffect(() => {
        if (!element) return;

        return SegmentedInputUtils.observeSelection(element, {
            getIsDisabled: () => latest.current.isDisabled,
            getCells: () =>
                cellRefs.current
                    .slice(0, latest.current.cellCount)
                    .filter((cell): cell is HTMLDivElement => cell !== null),
            onSelectionChange: reportSelection,
        });
    }, [element, latest, reportSelection]);

    useLayoutEffect(() => {
        if (!element) return;

        reportSelection(SegmentedInputUtils.readSelection(element));
    }, [element, value, reportSelection]);

    const setRef = useCallback(
        (next: HTMLElement | null) => {
            elementRef.current = next as HTMLInputElement | null;
            latestRef.current?.(next);
        },
        [latestRef],
    );

    return (
        <TextField
            {...props}
            element={"input"}
            type={"text"}
            isConcealed={true}
            inputMode={props.inputMode ?? SEGMENTED_INPUT_DEFAULTS.inputMode}
            ref={setRef}
            computeMaskedText={(_previous, next, caret) =>
                TextSyncUtils.applyFilter(
                    props.computeIsAllowed ?? SEGMENTED_INPUT_DEFAULTS.computeIsAllowed,
                    cellCount,
                    next,
                    caret,
                )
            }
            renderContent={(flags) => (
                <div
                    className={SegmentedInputStyles.segmentedInputCells}
                    style={{ gap: `${props.gap ?? SEGMENTED_INPUT_DEFAULTS.gap}px` }}
                    aria-hidden="true"
                >
                    {indices.map((index) => (
                        <div
                            key={index}
                            ref={(cell) => {
                                cellRefs.current[index] = cell;
                            }}
                            className={SegmentedInputStyles.segmentedInputCell}
                        >
                            {props.renderCell({
                                ...flags,
                                ...SegmentedInputUtils.computeCellFlags(index, {
                                    isFocused: flags.isFocused ?? false,
                                    selection,
                                    cellCount,
                                }),
                                index,
                                char: value[index],
                            })}
                        </div>
                    ))}
                </div>
            )}
        />
    );
};
