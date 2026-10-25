import { useCallback, useEffect, useId, useRef, useState } from "react";

import { type PopupTriggerFlags, TIME_PICKER_DEFAULTS } from "@thewaver/ss-components";

import { NavigatorReactUtils } from "../../../Abstracts/Navigator/NavigatorReact.utils";
import { SignalMirrorReactUtils } from "../../../Abstracts/SignalMirror/SignalMirrorReact.utils";
import { InteractionWrapper } from "../../../Primitives/InteractionWrapper/InteractionWrapper";
import { Popover } from "../../../Primitives/Popover/Popover";
import { PopupTrigger } from "../../../Primitives/PopupTrigger/PopupTrigger";
import { Clock } from "../Clock/Clock";
import { TimeInput } from "../TimeInput/TimeInput";
import type { TimePickerProps } from "./TimePicker.types";

export const TimePicker = (props: TimePickerProps) => {
    const popupId = useId();

    const rootRef = useRef<HTMLDivElement | null>(null);
    const isFocusReturnedRef = useRef(false);
    const [root, setRoot] = useState<HTMLDivElement>();
    const [isOpen, setIsOpen] = SignalMirrorReactUtils.useOptionalState(props.visibility, false);

    const direction = NavigatorReactUtils.useDirection(rootRef);

    const isLocked = (props.isDisabled ?? false) || (props.isReadOnly ?? false);

    const setRootRef = useCallback((element: HTMLDivElement | null) => {
        rootRef.current = element;
        setRoot(element ?? undefined);
    }, []);

    const dismiss = () => {
        if (!isOpen) return;

        isFocusReturnedRef.current = true;
        setIsOpen(false);
    };

    const open = () => {
        if (isLocked) return;

        setIsOpen(true);
    };

    useEffect(() => {
        if (isOpen && isLocked) setIsOpen(false);
    }, [isOpen, isLocked]);

    useEffect(() => {
        if (isOpen || !isFocusReturnedRef.current) return;

        isFocusReturnedRef.current = false;
        rootRef.current?.querySelector("input")?.focus();
    }, [isOpen]);

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
            ariaLabel={props.clockLabel}
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
                renderTrailing={(fieldFlags, meridiem) => (
                    <>
                        {props.renderTrailing?.(fieldFlags, meridiem)}

                        <InteractionWrapper<PopupTriggerFlags>
                            isDisabled={isLocked}
                            extraFlags={{ isOpen }}
                            renderControl={(setElementRef, flags) => (
                                <PopupTrigger
                                    ref={setElementRef}
                                    id={props.triggerId}
                                    popupId={popupId}
                                    isOpen={isOpen}
                                    ariaLabel={props.triggerAriaLabel}
                                    flags={flags}
                                    renderContent={(triggerFlags) => props.renderTrigger(triggerFlags, meridiem)}
                                    onToggle={() => (isOpen ? dismiss() : open())}
                                />
                            )}
                        />
                    </>
                )}
            />

            <Popover
                id={popupId}
                role={"dialog"}
                ariaAttributes={{ "aria-label": props.clockLabel }}
                isOpen={isOpen}
                anchorRef={root}
                placement={props.placement ?? TIME_PICKER_DEFAULTS.placement[direction]}
                offset={props.offset}
                transitionDurationMs={props.popupTransitionDurationMs}
                hasAutoFocus={true}
                onDismiss={(reason) => (reason === "escape" ? dismiss() : setIsOpen(false))}
                renderContent={(visibilityTarget, transitionDurationMs) =>
                    props.renderPopup(renderClock, visibilityTarget, transitionDurationMs)
                }
            />
        </div>
    );
};
