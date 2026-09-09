import { Show, createSignal } from "solid-js";

import { InteractionTracker } from "../../../Abstracts/InteractionTracker/InteractionTracker";
import { PlacementItem } from "../../../Abstracts/Placement/Placement";
import { BinarySwitch } from "../../../Primitives/BinarySwitch/BinarySwitch";
import type { InteractionSizing } from "../../../Primitives/InteractionWrapper/InteractionWrapper.types";
import { access } from "../../../Utils/propUtils";
import { useRadioGroupContext } from "../RadioGroup/RadioGroup.context";
import type { RadioProps } from "./Radio.types";

const ROW_SIZING: InteractionSizing = "fit-content";
const PLACED_SIZING: InteractionSizing = "fill";

export const Radio = <T,>(props: RadioProps<T>) => {
    const getValue = () => access(props.value);

    const context = useRadioGroupContext();

    const [getElementRef, setElementRef] = createSignal<HTMLElement>();

    const getIsDisabled = () => access(props.isDisabled) ?? false;

    const getIsReachable = () =>
        InteractionTracker.computeIsReachable(
            getIsDisabled(),
            access(props.isReachableWhenDisabled) ?? false,
            props.tooltipDefs !== undefined,
        );

    const entry = {
        getElementRef,
        getIsDisabled,
        getIsReachable,
        getValue,
    };

    context.register(entry);

    const getPlacement = () => context.computePlacement(entry);

    const element = (
        <BinarySwitch
            {...props}
            ref={setElementRef}
            type={"radio"}
            name={context.getName}
            sizing={() => (getPlacement() === undefined ? (access(props.sizing) ?? ROW_SIZING) : PLACED_SIZING)}
            isChecked={() => context.getValue() === (getValue() as unknown)}
            isTabbable={() => context.computeIsTabbable(getValue())}
            onChange={(isChecked) => {
                context.setValue(getValue());

                void props.onChange?.(isChecked);
            }}
        />
    );

    return (
        <Show when={getPlacement()} fallback={element}>
            {(getRect) => <PlacementItem placement={getRect}>{element}</PlacementItem>}
        </Show>
    );
};
