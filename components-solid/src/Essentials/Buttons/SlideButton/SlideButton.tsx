import { Show, createMemo, createRenderEffect, createSignal, createUniqueId, onCleanup } from "solid-js";

import {
    type NavigatorDirection,
    SLIDE_BUTTON_DEFAULTS,
    type SlideButtonRenderProps,
    SlideButtonUtils,
    SlideButtonStyles as styles,
} from "@thewaver/ss-components";
import { SlideButtonConst } from "@thewaver/ss-components/internal";

import { InteractionTrackerSolidUtils } from "../../../Abstracts/InteractionTracker/InteractionTrackerSolid.utils";
import { NavigatorSolidUtils } from "../../../Abstracts/Navigator/NavigatorSolid.utils";
import { SignalMirrorSolidUtils } from "../../../Abstracts/SignalMirror/SignalMirrorSolid.utils";
import { InteractionWrapper } from "../../../Primitives/InteractionWrapper/InteractionWrapper";
import { access } from "../../../Utils/propUtils";
import { accessStore } from "../../../Utils/storeUtils";
import { FormFieldSolidUtils } from "../../Input/FormField/FormFieldSolid.utils";
import type { SlideButtonElementProps, SlideButtonProps } from "./SlideButtonSolid.types";

const SlideButtonElement = (props: SlideButtonElementProps) => {
    const { getAriaLabel, getAriaLabelledBy } = FormFieldSolidUtils.resolveAriaName(
        props.ariaLabel === undefined ? undefined : () => access(props.ariaLabel)!,
    );
    const getFieldDescribedBy = FormFieldSolidUtils.resolveAriaDescribedBy();
    const descriptionId = createUniqueId();

    SlideButtonUtils.warnIfUndescribed(access(props.ariaDescription), "ariaDescription");

    const getHasDescription = () => !!access(props.ariaDescription);

    const getAriaDescribedBy = () =>
        [getFieldDescribedBy(), getHasDescription() ? descriptionId : undefined].filter(Boolean).join(" ") || undefined;

    const [getTrackRef, setTrackRef] = createSignal<HTMLElement>();

    FormFieldSolidUtils.registerControl(getTrackRef);

    const getDirection = NavigatorSolidUtils.createDirectionSignal(getTrackRef);

    const getIsDisabled = createMemo(() => access(props.flags).isDisabled ?? false);

    const gesture = SlideButtonUtils.createGesture({
        getMode: () => access(props.mode),
        getOrientation: () => access(props.orientation),
        getDirection,
        getThumbSize: () => access(props.thumbSize),
        getHoldDurationMs: () => access(props.holdDurationMs),
        getCompletionRatio: () => access(props.completionRatio),
        getTrackSize: () => ({ width: getTrackRef()?.clientWidth ?? 0, height: getTrackRef()?.clientHeight ?? 0 }),
        getProgressRatio: () => access(props.progressRatio),
        setProgressRatio: (ratio) => props.setProgressRatio(ratio),
        onActivate: () => void props.onActivate?.(),
    });

    onCleanup(gesture.stopHold);

    const getIsHolding = accessStore(gesture, (state) => state.isHolding);
    const getIsGrabbed = accessStore(gesture, (state) => state.isGrabbed);

    const { getIsDragging } = InteractionTrackerSolidUtils.trackDrag(getTrackRef, getIsDisabled, {
        onDrag: (ratio) => gesture.drag(ratio),
        onDragEnd: (reason) => gesture.dragEnd(reason),
    });

    createRenderEffect(() => {
        props.setIsDragging(getIsDragging() && getIsGrabbed());
    });

    createRenderEffect(() => {
        props.setIsHolding(getIsHolding());
    });

    createRenderEffect(() => {
        props.setDirection(getDirection());
    });

    createRenderEffect(() => {
        if (!getIsDisabled()) return;

        gesture.reset();
    });

    return (
        <>
            <button
                id={access(props.id)}
                ref={(element) => {
                    setTrackRef(element);
                    props.ref?.(element);
                }}
                type="button"
                class={styles.slideButtonElement}
                aria-label={getAriaLabel()}
                aria-labelledby={getAriaLabelledBy()}
                aria-describedby={getAriaDescribedBy()}
                aria-pressed={access(props.flags).isPressed}
                aria-disabled={getIsDisabled() || undefined}
                onKeyDown={(e) => {
                    if (getIsDisabled()) return;

                    gesture.pressKey(e.key, e.repeat);
                }}
                onKeyUp={(e) => gesture.releaseKey(e.key)}
                onClick={() => {
                    if (getIsDisabled()) return;

                    gesture.click();
                }}
                onBlur={() => gesture.stopHold()}
                onMouseEnter={(e) => {
                    if (getIsDisabled()) return;

                    void props.onMouseEnter?.(e);
                }}
                onMouseLeave={(e) => {
                    if (getIsDisabled()) return;

                    void props.onMouseLeave?.(e);
                }}
            >
                {props.renderContent(() => access(props.flags))}
            </button>

            <Show when={getHasDescription()}>
                <span id={descriptionId} class={styles.slideButtonDescription}>
                    {access(props.ariaDescription)}
                </span>
            </Show>
        </>
    );
};

export const SlideButton = (props: SlideButtonProps) => {
    const [getProgressRatio, setProgressRatio] = SignalMirrorSolidUtils.createOptional(
        () => props.progress,
        SlideButtonConst.RATIO_MIN,
    );
    const [getIsDragging, setIsDragging] = createSignal(false);
    const [getIsHolding, setIsHolding] = createSignal(false);
    const [getDirection, setDirection] = createSignal<NavigatorDirection>("ltr");

    const getOrientation = createMemo(() => access(props.orientation) ?? SLIDE_BUTTON_DEFAULTS.orientation);

    const getThumbSize = createMemo(() => access(props.thumbSize) ?? SLIDE_BUTTON_DEFAULTS.thumbSize);

    const getHoldDurationMs = createMemo(() => access(props.holdDurationMs) ?? SLIDE_BUTTON_DEFAULTS.holdDurationMs);

    const getMode = createMemo(() => access(props.mode) ?? SLIDE_BUTTON_DEFAULTS.mode);

    const getCompletionRatio = createMemo(() => access(props.completionRatio) ?? SLIDE_BUTTON_DEFAULTS.completionRatio);

    return (
        <InteractionWrapper
            {...props}
            extraFlags={(): SlideButtonRenderProps => ({
                orientation: getOrientation(),
                direction: getDirection(),
                progressRatio: getProgressRatio(),
                isDragging: getIsDragging(),
                isHolding: getIsHolding(),
            })}
            renderControl={(setElementRef, getRenderProps) => (
                <SlideButtonElement
                    ref={setElementRef}
                    id={props.id}
                    ariaLabel={props.ariaLabel}
                    ariaDescription={props.ariaDescription}
                    orientation={getOrientation}
                    thumbSize={getThumbSize}
                    holdDurationMs={getHoldDurationMs}
                    mode={getMode}
                    completionRatio={getCompletionRatio}
                    flags={getRenderProps}
                    progressRatio={getProgressRatio}
                    renderContent={props.renderContent}
                    setProgressRatio={setProgressRatio}
                    setIsDragging={setIsDragging}
                    setIsHolding={setIsHolding}
                    setDirection={setDirection}
                    onActivate={props.onActivate}
                    onMouseEnter={props.onMouseEnter}
                    onMouseLeave={props.onMouseLeave}
                />
            )}
        />
    );
};
