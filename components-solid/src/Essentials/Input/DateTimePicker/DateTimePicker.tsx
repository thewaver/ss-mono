import { Show, createEffect, createMemo, createSignal, splitProps } from "solid-js";

import {
    DateTimePickerUtils,
    type InteractionFlags,
    InteractionTrackerUtils,
    type TextFieldFlags,
    TextFieldUtils,
    DateTimePickerStyles as styles,
} from "@thewaver/ss-components";

import { DateTimeValueSolidUtils } from "../../../Abstracts/DateTimeValue/DateTimeValueSolid.utils";
import { access, accessSignal } from "../../../Utils/propUtils";
import { Tooltip } from "../../Overlays/Tooltip/Tooltip";
import { DatePicker } from "../DatePicker/DatePicker";
import { FormFieldContextProvider, useFormFieldContext } from "../FormField/FormField.context";
import { FormFieldSolidUtils } from "../FormField/FormFieldSolid.utils";
import { LabelContextProvider, useLabelContext } from "../Label/Label.context";
import { TimePicker } from "../TimePicker/TimePicker";
import type { DateTimePickerProps } from "./DateTimePickerSolid.types";

export const DateTimePicker = (props: DateTimePickerProps) => {
    const [, halfProps] = splitProps(props, ["tooltipDefs", "isReachableWhenDisabled"]);
    const [, timeProps] = splitProps(halfProps, ["renderLeading", "triggerId"]);

    const { date: dateSignal, time: timeSignal } = DateTimeValueSolidUtils.createSplit(accessSignal(() => props.value));

    const [getRootRef, setRootRef] = createSignal<HTMLElement>();

    const [getDateFlags, setDateFlags] = createSignal<() => InteractionFlags<TextFieldFlags>>();
    const [getTimeFlags, setTimeFlags] = createSignal<() => InteractionFlags<TextFieldFlags>>();

    const getPairFlags = () =>
        TextFieldUtils.mergeFlags(
            [getDateFlags(), getTimeFlags()].flatMap((getFlags) => (getFlags ? [getFlags()] : [])),
        );

    const getIsDisabled = createMemo(() => access(props.isDisabled) ?? false);

    const getIsReachable = createMemo(() =>
        InteractionTrackerUtils.computeIsReachable(
            getIsDisabled(),
            access(props.isReachableWhenDisabled) ?? false,
            false,
            access(props.tooltipDefs) !== undefined,
        ),
    );

    createEffect(() =>
        InteractionTrackerUtils.warnIfReachableWithoutTooltip(
            access(props.isReachableWhenDisabled) ?? false,
            props.tooltipDefs !== undefined,
        ),
    );

    const getTooltipDefs = createMemo(() => {
        const defs = access(props.tooltipDefs);

        return defs && (!getIsDisabled() || getIsReachable()) ? defs : undefined;
    });

    const getLastTooltipDefs = createMemo<ReturnType<typeof getTooltipDefs>>(
        (previous) => getTooltipDefs() ?? previous,
    );

    const getGroupLabelledBy = FormFieldSolidUtils.resolveAriaLabelledBy();
    const outerFieldContext = useFormFieldContext();
    const outerLabelContext = useLabelContext();
    const fieldContext = { ...outerFieldContext, getCaptionId: () => undefined };
    const labelContext = { ...outerLabelContext, getIsLabeled: () => false };

    return (
        <div ref={setRootRef} class={styles.dateTimePickerRoot} role="group" aria-labelledby={getGroupLabelledBy()}>
            <FormFieldContextProvider value={fieldContext}>
                <LabelContextProvider value={labelContext}>
                    <DatePicker
                        {...halfProps}
                        isFocusableWhenDisabled={getIsReachable}
                        value={dateSignal}
                        id={access(props.id) === undefined ? undefined : `${access(props.id)}-date`}
                        name={access(props.name) === undefined ? undefined : `${access(props.name)}-date`}
                        visibility={props.dateVisibility}
                        ariaLabel={props.dateLabel}
                        minValue={props.minValue === undefined ? undefined : () => access(props.minValue)!.date}
                        maxValue={props.maxValue === undefined ? undefined : () => access(props.maxValue)!.date}
                        renderContent={(getFlags) => {
                            setDateFlags(() => getFlags);

                            return props.renderContent(getFlags);
                        }}
                    />

                    {props.renderSeparator?.()}

                    <TimePicker
                        {...timeProps}
                        isFocusableWhenDisabled={getIsReachable}
                        value={timeSignal}
                        id={access(props.id) === undefined ? undefined : `${access(props.id)}-time`}
                        name={access(props.name) === undefined ? undefined : `${access(props.name)}-time`}
                        visibility={props.timeVisibility}
                        ariaLabel={props.timeLabel}
                        minValue={
                            props.minValue === undefined
                                ? undefined
                                : () => DateTimePickerUtils.computeMinTime(dateSignal[0](), access(props.minValue)!)
                        }
                        maxValue={
                            props.maxValue === undefined
                                ? undefined
                                : () => DateTimePickerUtils.computeMaxTime(dateSignal[0](), access(props.maxValue)!)
                        }
                        triggerId={props.timeTriggerId}
                        triggerAriaLabel={props.timeTriggerAriaLabel}
                        renderContent={(getFlags) => {
                            setTimeFlags(() => getFlags);

                            return props.renderContent(getFlags);
                        }}
                        renderTrailing={props.renderTimeTrailing}
                        renderTrigger={props.renderTimeTrigger}
                        renderPopup={props.renderTimePopup}
                    />
                </LabelContextProvider>
            </FormFieldContextProvider>

            <Show when={getLastTooltipDefs()}>
                {(getDefs) => (
                    <Tooltip
                        {...getDefs()}
                        isAnchorGroup={true}
                        anchorRef={() => (getTooltipDefs() ? getRootRef() : undefined)}
                        renderContent={(getVisibilityTarget, getTransitionDurationMs, getPlacement, getArrowAim) =>
                            getDefs().renderContent(
                                getVisibilityTarget,
                                getTransitionDurationMs,
                                getPlacement,
                                getPairFlags,
                                getArrowAim,
                            )
                        }
                    />
                )}
            </Show>
        </div>
    );
};
