import { createEffect, createMemo, createSignal, createUniqueId } from "solid-js";

import { type PopupTriggerFlags, TIME_PICKER_DEFAULTS } from "@thewaver/ss-components";

import { NavigatorSolidUtils } from "../../../Abstracts/Navigator/NavigatorSolid.utils";
import { SignalMirrorSolidUtils } from "../../../Abstracts/SignalMirror/SignalMirrorSolid.utils";
import { InteractionWrapper } from "../../../Primitives/InteractionWrapper/InteractionWrapper";
import { Popover } from "../../../Primitives/Popover/Popover";
import { PopupTrigger } from "../../../Primitives/PopupTrigger/PopupTrigger";
import { access } from "../../../Utils/propUtils";
import { Clock } from "../Clock/Clock";
import { TimeInput } from "../TimeInput/TimeInput";
import type { TimePickerProps } from "./TimePickerSolid.types";

export const TimePicker = (props: TimePickerProps) => {
    const popupId = createUniqueId();

    const [getRootRef, setRootRef] = createSignal<HTMLElement>();
    const [getIsOpen, setIsOpen] = SignalMirrorSolidUtils.createOptional(() => props.visibility, false);

    const getDirection = NavigatorSolidUtils.createDirectionSignal(getRootRef);

    const getClockLabel = () => access(props.clockLabel);

    const dismiss = () => {
        if (!getIsOpen()) return;

        setIsOpen(false);
        getRootRef()?.querySelector("input")?.focus();
    };

    const getIsLocked = createMemo(() => (access(props.isDisabled) ?? false) || (access(props.isReadOnly) ?? false));

    const open = () => {
        if (getIsLocked()) return;

        setIsOpen(true);
    };

    createEffect(() => {
        const isOpen = getIsOpen();
        const isLocked = getIsLocked();

        if (!isOpen || !isLocked) return;

        setIsOpen(false);
    });

    const renderClock = () => (
        <Clock
            value={props.value}
            minValue={props.minValue}
            maxValue={props.maxValue}
            steps={props.clockSteps}
            gap={props.clockGap}
            hasSeconds={props.hasSeconds}
            isTwelveHour={props.isTwelveHour}
            isDisabled={props.isDisabled}
            locale={props.locale}
            ariaLabel={getClockLabel}
            computeIsTimeDisabled={props.computeIsTimeDisabled}
            renderOption={props.renderOption}
            renderUnit={props.renderUnit}
            renderColumn={props.renderColumn}
        />
    );

    return (
        <div ref={setRootRef}>
            <TimeInput
                {...props}
                renderTrailing={(getFieldFlags, meridiem) => (
                    <>
                        {props.renderTrailing?.(getFieldFlags, meridiem)}

                        <InteractionWrapper<PopupTriggerFlags>
                            isDisabled={getIsLocked}
                            extraFlags={() => ({ isOpen: getIsOpen() })}
                            renderControl={(setElementRef, getRenderProps) => (
                                <PopupTrigger
                                    ref={setElementRef}
                                    id={props.triggerId}
                                    popupId={() => popupId}
                                    isOpen={getIsOpen}
                                    ariaLabel={props.triggerAriaLabel}
                                    flags={getRenderProps}
                                    renderContent={(getTriggerFlags) => props.renderTrigger(getTriggerFlags, meridiem)}
                                    onToggle={() => (getIsOpen() ? dismiss() : open())}
                                />
                            )}
                        />
                    </>
                )}
            />

            <Popover
                id={() => popupId}
                role={"dialog"}
                ariaAttributes={() => ({ "aria-label": getClockLabel() })}
                isOpen={getIsOpen}
                anchorRef={getRootRef}
                placement={() => access(props.placement) ?? TIME_PICKER_DEFAULTS.placement[getDirection()]}
                offset={props.offset}
                transitionDurationMs={props.popupTransitionDurationMs}
                hasAutoFocus={true}
                onDismiss={(reason) => (reason === "escape" ? dismiss() : setIsOpen(false))}
                renderContent={(getVisibilityTarget, getTransitionDurationMs) =>
                    props.renderPopup(renderClock, getVisibilityTarget, getTransitionDurationMs)
                }
            />
        </div>
    );
};
