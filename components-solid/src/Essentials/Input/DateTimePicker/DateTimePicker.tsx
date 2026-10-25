import { Show, createMemo, createSignal, splitProps } from "solid-js";

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
import { TimePicker } from "../TimePicker/TimePicker";
import type { DateTimePickerProps } from "./DateTimePickerSolid.types";

export const DateTimePicker = (props: DateTimePickerProps) => {
    const [, halfProps] = splitProps(props, ["tooltipDefs"]);
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

    const getTooltipDefs = createMemo(() => {
        const defs = access(props.tooltipDefs);
        const isReachable = InteractionTrackerUtils.computeIsReachable(
            getIsDisabled(),
            access(props.isReachableWhenDisabled) ?? false,
        );

        return defs && (!getIsDisabled() || isReachable) ? defs : undefined;
    });

    const getLastTooltipDefs = createMemo<ReturnType<typeof getTooltipDefs>>(
        (previous) => getTooltipDefs() ?? previous,
    );

    return (
        <div ref={setRootRef} class={styles.dateTimePickerRoot}>
            <DatePicker
                {...halfProps}
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
