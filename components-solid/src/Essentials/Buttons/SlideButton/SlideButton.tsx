import { createMemo, createRenderEffect, createSignal, onCleanup } from "solid-js";

import {
    SLIDE_BUTTON_DEFAULTS,
    type SlideButtonRenderProps,
    SlideButtonUtils,
    SlideButtonStyles as styles,
} from "@thewaver/ss-components";

import { InteractionTrackerSolidUtils } from "../../../Abstracts/InteractionTracker/InteractionTrackerSolid.utils";
import { SignalMirrorSolidUtils } from "../../../Abstracts/SignalMirror/SignalMirrorSolid.utils";
import { InteractionWrapper } from "../../../Primitives/InteractionWrapper/InteractionWrapper";
import { access } from "../../../Utils/propUtils";
import { accessStore } from "../../../Utils/storeUtils";
import { FormFieldSolidUtils } from "../../Input/FormField/FormFieldSolid.utils";
import { LabelSolidUtils } from "../../Input/Label/LabelSolid.utils";
import type { SlideButtonElementProps, SlideButtonProps } from "./SlideButtonSolid.types";

const RATIO_MIN = 0;

const SlideButtonElement = (props: SlideButtonElementProps) => {
    const getAriaLabel = LabelSolidUtils.resolveAriaLabel(
        props.ariaLabel === undefined ? undefined : () => access(props.ariaLabel)!,
    );
    const getAriaDescribedBy = FormFieldSolidUtils.resolveAriaDescribedBy();

    const [getTrackRef, setTrackRef] = createSignal<HTMLElement>();

    FormFieldSolidUtils.registerControl(getTrackRef);

    const getIsDisabled = createMemo(() => access(props.flags).isDisabled ?? false);

    const gesture = SlideButtonUtils.createGesture({
        getMode: () => access(props.mode),
        getThumbSize: () => access(props.thumbSize),
        getHoldDurationMs: () => access(props.holdDurationMs),
        getTrackWidth: () => getTrackRef()?.clientWidth ?? 0,
        getProgressRatio: () => access(props.progressRatio),
        setProgressRatio: (ratio) => props.setProgressRatio(ratio),
        onActivate: () => void props.onActivate?.(),
    });

    onCleanup(gesture.stopHold);

    const getIsHolding = accessStore(gesture, (state) => state.isHolding);
    const getIsGrabbed = accessStore(gesture, (state) => state.isGrabbed);

    const { getIsDragging } = InteractionTrackerSolidUtils.trackDrag(getTrackRef, getIsDisabled, {
        onDrag: (ratio) => gesture.drag(ratio.x),
        onDragEnd: (reason) => gesture.dragEnd(reason),
    });

    createRenderEffect(() => {
        props.setIsDragging(getIsDragging() && getIsGrabbed());
    });

    createRenderEffect(() => {
        props.setIsHolding(getIsHolding());
    });

    createRenderEffect(() => {
        if (!getIsDisabled()) return;

        gesture.reset();
    });

    return (
        <button
            id={access(props.id)}
            ref={(element) => {
                setTrackRef(element);
                props.ref?.(element);
            }}
            type="button"
            class={styles.slideButtonElement}
            aria-label={getAriaLabel()}
            aria-describedby={getAriaDescribedBy()}
            aria-disabled={getIsDisabled() || undefined}
            onKeyDown={(e) => {
                if (getIsDisabled()) return;

                gesture.pressKey(e.key, e.repeat);
            }}
            onKeyUp={(e) => gesture.releaseKey(e.key)}
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
    );
};

export const SlideButton = (props: SlideButtonProps) => {
    const [getProgressRatio, setProgressRatio] = SignalMirrorSolidUtils.createOptional(() => props.progress, RATIO_MIN);
    const [getIsDragging, setIsDragging] = createSignal(false);
    const [getIsHolding, setIsHolding] = createSignal(false);

    const getThumbSize = createMemo(() => access(props.thumbSize) ?? SLIDE_BUTTON_DEFAULTS.thumbSize);

    const getHoldDurationMs = createMemo(() => access(props.holdDurationMs) ?? SLIDE_BUTTON_DEFAULTS.holdDurationMs);

    const getMode = createMemo(() => access(props.mode) ?? SLIDE_BUTTON_DEFAULTS.mode);

    return (
        <InteractionWrapper
            {...props}
            extraFlags={(): SlideButtonRenderProps => ({
                progressRatio: getProgressRatio(),
                isDragging: getIsDragging(),
                isHolding: getIsHolding(),
            })}
            renderControl={(setElementRef, getRenderProps) => (
                <SlideButtonElement
                    ref={setElementRef}
                    id={props.id}
                    ariaLabel={props.ariaLabel}
                    thumbSize={getThumbSize}
                    holdDurationMs={getHoldDurationMs}
                    mode={getMode}
                    flags={getRenderProps}
                    progressRatio={getProgressRatio}
                    renderContent={props.renderContent}
                    setProgressRatio={setProgressRatio}
                    setIsDragging={setIsDragging}
                    setIsHolding={setIsHolding}
                    onActivate={props.onActivate}
                    onMouseEnter={props.onMouseEnter}
                    onMouseLeave={props.onMouseLeave}
                />
            )}
        />
    );
};
