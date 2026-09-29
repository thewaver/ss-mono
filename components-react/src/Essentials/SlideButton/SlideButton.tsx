import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

import {
    SLIDE_BUTTON_DEFAULTS,
    type SlideButtonRenderProps,
    SlideButtonStyles,
    SlideButtonUtils,
} from "@thewaver/ss-components";

import { InteractionTrackerReactUtils } from "../../Abstracts/InteractionTracker/InteractionTrackerReact.utils";
import { SignalMirrorReactUtils } from "../../Abstracts/SignalMirror/SignalMirrorReact.utils";
import { InteractionWrapper } from "../../Primitives/InteractionWrapper/InteractionWrapper";
import { useLatest } from "../../Utils/refUtils";
import { useStore } from "../../Utils/storeUtils";
import { FormFieldReactUtils } from "../Input/FormField/FormFieldReact.utils";
import { LabelReactUtils } from "../Input/Label/LabelReact.utils";
import type { SlideButtonElementProps, SlideButtonProps } from "./SlideButton.types";

const RATIO_MIN = 0;

const SlideButtonElement = (props: SlideButtonElementProps) => {
    const ariaLabel = LabelReactUtils.useAriaLabel(props.ariaLabel);
    const ariaDescribedBy = FormFieldReactUtils.useAriaDescribedBy();

    const trackRef = useRef<HTMLButtonElement | null>(null);
    const progressRef = useRef(props.progressRatio);
    const latest = useLatest(props);

    FormFieldReactUtils.useRegisterControl(trackRef);

    useLayoutEffect(() => {
        progressRef.current = props.progressRatio;
    });

    const isDisabled = props.flags.isDisabled ?? false;

    const [gesture] = useState(() =>
        SlideButtonUtils.createGesture({
            getMode: () => latest.current.mode,
            getThumbSize: () => latest.current.thumbSize,
            getHoldDurationMs: () => latest.current.holdDurationMs,
            getTrackWidth: () => trackRef.current?.clientWidth ?? 0,
            getProgressRatio: () => progressRef.current,
            setProgressRatio: (ratio) => {
                progressRef.current = ratio;
                latest.current.setProgressRatio(ratio);
            },
            onActivate: () => latest.current.onActivate?.(),
        }),
    );

    useEffect(() => gesture.stopHold, [gesture]);

    const isHolding = useStore(gesture, (state) => state.isHolding);
    const isGrabbed = useStore(gesture, (state) => state.isGrabbed);

    const { isDragging } = InteractionTrackerReactUtils.useDrag(trackRef, isDisabled, {
        onDrag: (ratio) => gesture.drag(ratio.x),
        onDragEnd: (reason) => gesture.dragEnd(reason),
    });

    const setIsDragging = props.setIsDragging;
    const setIsHolding = props.setIsHolding;

    useLayoutEffect(() => setIsDragging(isDragging && isGrabbed), [setIsDragging, isDragging, isGrabbed]);

    useLayoutEffect(() => setIsHolding(isHolding), [setIsHolding, isHolding]);

    useLayoutEffect(() => {
        if (isDisabled) gesture.reset();
    }, [gesture, isDisabled]);

    const setRef = useCallback(
        (element: HTMLButtonElement | null) => {
            trackRef.current = element;
            latest.current.ref?.(element);
        },
        [latest],
    );

    return (
        <button
            id={props.id}
            ref={setRef}
            type="button"
            className={SlideButtonStyles.slideButtonElement}
            aria-label={ariaLabel}
            aria-describedby={ariaDescribedBy}
            aria-disabled={isDisabled || undefined}
            onKeyDown={(e) => {
                if (isDisabled) return;

                gesture.pressKey(e.key, e.repeat);
            }}
            onKeyUp={(e) => gesture.releaseKey(e.key)}
            onBlur={() => gesture.stopHold()}
            onMouseEnter={(e) => {
                if (isDisabled) return;

                props.onMouseEnter?.(e);
            }}
            onMouseLeave={(e) => {
                if (isDisabled) return;

                props.onMouseLeave?.(e);
            }}
        >
            {props.renderContent(props.flags)}
        </button>
    );
};

export const SlideButton = (props: SlideButtonProps) => {
    const [progressRatio, setProgressRatio] = SignalMirrorReactUtils.useOptionalState(props.progress, RATIO_MIN);
    const [isDragging, setIsDragging] = useState(false);
    const [isHolding, setIsHolding] = useState(false);

    const extraFlags: SlideButtonRenderProps = { progressRatio, isDragging, isHolding };

    return (
        <InteractionWrapper<SlideButtonRenderProps>
            {...props}
            extraFlags={extraFlags}
            renderControl={(setElementRef, flags) => (
                <SlideButtonElement
                    ref={setElementRef}
                    id={props.id}
                    ariaLabel={props.ariaLabel}
                    thumbSize={props.thumbSize ?? SLIDE_BUTTON_DEFAULTS.thumbSize}
                    holdDurationMs={props.holdDurationMs ?? SLIDE_BUTTON_DEFAULTS.holdDurationMs}
                    mode={props.mode ?? SLIDE_BUTTON_DEFAULTS.mode}
                    flags={flags}
                    progressRatio={progressRatio}
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
