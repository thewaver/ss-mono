import { type SlotsType, defineComponent, shallowRef } from "vue";

import {
    SEGMENTED_INPUT_DEFAULTS,
    type SegmentedInputSelection,
    SegmentedInputStyles,
    SegmentedInputUtils,
    TextSyncUtils,
} from "@thewaver/ss-components";

import { TextField } from "../../../Primitives/TextField/TextField";
import type { TextFieldSlots } from "../../../Primitives/TextField/TextField.types";
import { watchAfterRender } from "../../../Utils/effectUtils";
import { callSlot, declareProps, forwardProps, useTwoWay } from "../../../Utils/propUtils";
import { exposeElement, toElement } from "../../../Utils/refUtils";
import type { SlotsContext } from "../../../Utils/typeUtils";
import type { SegmentedInputProps, SegmentedInputSlots } from "./SegmentedInput.types";

const NO_SELECTION: SegmentedInputSelection = { start: 0, end: 0 };

export const SegmentedInput = defineComponent(
    (props: SegmentedInputProps, { slots, expose }: SlotsContext<SegmentedInputSlots>) => {
        const value = useTwoWay(props, "value", "");

        const element = shallowRef<HTMLInputElement>();
        const cellRefs: (HTMLElement | undefined)[] = [];

        exposeElement(expose, () => element.value);

        const selection = shallowRef(NO_SELECTION);

        const getCellCount = () => Math.max(0, props.cellCount);

        const reportSelection = (next: SegmentedInputSelection) => {
            if (selection.value.start === next.start && selection.value.end === next.end) return;

            selection.value = next;
        };

        watchAfterRender([element], ([input]) => {
            if (!input) return;

            return SegmentedInputUtils.observeSelection(input, {
                getIsDisabled: () => props.isDisabled ?? false,
                getCells: () =>
                    cellRefs.slice(0, getCellCount()).filter((cell): cell is HTMLElement => cell !== undefined),
                onSelectionChange: reportSelection,
            });
        });

        watchAfterRender([element, () => value.value], ([input]) => {
            if (!input) return;

            reportSelection(SegmentedInputUtils.readSelection(input));
        });

        return () => {
            const cellCount = getCellCount();
            const indices = Array.from({ length: cellCount }, (_unused, index) => index);

            return (
                <TextField
                    {...{
                        ...forwardProps(props, TextField),
                        "value": value.value,
                        "onUpdate:value": (next: string) => {
                            value.value = next;
                        },
                    }}
                    ref={(target) => {
                        element.value = toElement<HTMLInputElement>(target);
                    }}
                    element={"input"}
                    type={"text"}
                    isConcealed={true}
                    inputMode={props.inputMode ?? SEGMENTED_INPUT_DEFAULTS.inputMode}
                    computeMaskedText={(_previous, next, caret) =>
                        TextSyncUtils.applyFilter(
                            props.computeIsAllowed ?? SEGMENTED_INPUT_DEFAULTS.computeIsAllowed,
                            cellCount,
                            next,
                            caret,
                        )
                    }
                >
                    {
                        {
                            renderContent: (flags) => (
                                <div
                                    class={SegmentedInputStyles.segmentedInputCells}
                                    style={{ gap: `${props.gap ?? SEGMENTED_INPUT_DEFAULTS.gap}px` }}
                                    aria-hidden="true"
                                >
                                    {indices.map((index) => (
                                        <div
                                            key={index}
                                            ref={(cell) => {
                                                cellRefs[index] = toElement(cell);
                                            }}
                                            class={SegmentedInputStyles.segmentedInputCell}
                                        >
                                            {callSlot(slots.renderCell, {
                                                ...flags,
                                                ...SegmentedInputUtils.computeCellFlags(index, {
                                                    isFocused: flags.isFocused ?? false,
                                                    selection: selection.value,
                                                    cellCount,
                                                }),
                                                index,
                                                char: value.value[index],
                                            })}
                                        </div>
                                    ))}
                                </div>
                            ),
                            renderDecoration: slots.renderDecoration,
                        } satisfies Partial<TextFieldSlots>
                    }
                </TextField>
            );
        };
    },
    {
        name: "SegmentedInput",
        slots: Object as SlotsType<SegmentedInputSlots>,
        props: declareProps<SegmentedInputProps>({
            "isDisabled": Boolean,
            "isPressed": Boolean,
            "hasError": Boolean,
            "role": null,
            "sizing": null,
            "isReachableWhenDisabled": Boolean,
            "isFocusableWhenDisabled": Boolean,
            "isTabbable": Boolean,
            "onActivation": null,
            "tooltipDefs": null,
            "onInput": null,
            "onMouseEnter": null,
            "onMouseLeave": null,
            "id": null,
            "name": null,
            "ariaLabel": null,
            "isReadOnly": Boolean,
            "isRequired": Boolean,
            "autoComplete": null,
            "inputMode": null,
            "value": null,
            "onUpdate:value": null,
            "cellCount": null,
            "gap": null,
            "computeIsAllowed": null,
        }),
    },
);
