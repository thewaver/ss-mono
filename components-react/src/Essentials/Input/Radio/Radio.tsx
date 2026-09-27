import { useLayoutEffect, useRef, useState } from "react";

import { type InteractionSizing, InteractionTrackerUtils, type RadioGroupEntry } from "@thewaver/ss-components";

import { BinarySwitch } from "../../../Primitives/BinarySwitch/BinarySwitch";
import { PlacementItem } from "../../../Primitives/PlacementItem/PlacementItem";
import { useLatest } from "../../../Utils/refUtils";
import { useRadioGroupContext } from "../RadioGroup/RadioGroup.context";
import type { RadioProps } from "./Radio.types";

const ROW_SIZING: InteractionSizing = "fit-content";
const PLACED_SIZING: InteractionSizing = "fill";

export const Radio = <T,>(props: RadioProps<T>) => {
    const context = useRadioGroupContext();

    const elementRef = useRef<HTMLElement | null>(null);

    const isDisabled = props.isDisabled ?? false;

    const isReachable = InteractionTrackerUtils.computeIsReachable(
        isDisabled,
        props.isReachableWhenDisabled ?? false,
        props.isFocusableWhenDisabled ?? false,
    );

    const latest = useLatest({ value: props.value, isDisabled, isReachable });

    const [entry] = useState((): RadioGroupEntry => ({
        getElementRef: () => elementRef.current ?? undefined,
        getIsDisabled: () => latest.current.isDisabled,
        getIsReachable: () => latest.current.isReachable,
        getValue: () => latest.current.value,
    }));

    const register = context.register;

    useLayoutEffect(() => register(entry), [register, entry, props.value, isDisabled, isReachable]);

    const placement = context.computePlacement(entry);

    const element = (
        <BinarySwitch
            {...props}
            ref={(next) => {
                elementRef.current = next;
            }}
            type={"radio"}
            name={context.name}
            sizing={placement === undefined ? (props.sizing ?? ROW_SIZING) : PLACED_SIZING}
            isChecked={context.value === props.value}
            isTabbable={context.computeIsTabbable(props.value)}
            onChange={(isChecked) => {
                context.setValue(props.value);

                props.onChange?.(isChecked);
            }}
        />
    );

    return placement ? <PlacementItem placement={placement}>{element}</PlacementItem> : element;
};
