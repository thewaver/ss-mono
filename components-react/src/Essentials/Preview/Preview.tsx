import { useEffect, useId, useRef } from "react";

import {
    CollapsibleUtils,
    PREVIEW_DEFAULTS,
    type PreviewFlags,
    PreviewStyles,
    PreviewUtils,
} from "@thewaver/ss-components";

import { ElementFaderReactUtils } from "../../Abstracts/ElementFader/ElementFaderReact.utils";
import { ElementObserverReactUtils } from "../../Abstracts/ElementObserver/ElementObserverReact.utils";
import { SignalMirrorReactUtils } from "../../Abstracts/SignalMirror/SignalMirrorReact.utils";
import { InteractionWrapper } from "../../Primitives/InteractionWrapper/InteractionWrapper";
import { useLatest } from "../../Utils/refUtils";
import type { PreviewProps, PreviewTriggerProps } from "./Preview.types";

const PreviewTrigger = (props: PreviewTriggerProps) => {
    const isDisabled = props.flags.isDisabled ?? false;

    return (
        <button
            id={props.id}
            ref={props.ref}
            type="button"
            className={PreviewStyles.previewTrigger}
            aria-expanded={props.isExpanded}
            aria-controls={props.contentId}
            aria-disabled={isDisabled || undefined}
            onClick={() => {
                if (isDisabled) return;

                props.onToggle();
            }}
        >
            {props.renderTrigger(props.flags)}
        </button>
    );
};

export const Preview = (props: PreviewProps) => {
    const [isExpanded, setIsExpanded] = SignalMirrorReactUtils.useOptionalState(props.expandedState, false);

    const contentId = useId();

    const rootRef = useRef<HTMLDivElement | null>(null);
    const triggerRef = useRef<HTMLElement | null>(null);
    const contentRef = useRef<HTMLDivElement | null>(null);
    const isAwaitingScrollRef = useRef(false);
    const wasExpandedRef = useRef(isExpanded);
    const latest = useLatest(props);

    const transitionDurationMs = props.transitionDurationMs ?? PREVIEW_DEFAULTS.transitionDurationMs;
    const sizing = props.sizing ?? PREVIEW_DEFAULTS.sizing;

    const contentHeight = ElementObserverReactUtils.useBorderBoxHeight(contentRef);
    const isOverflowing = PreviewUtils.computeIsOverflowing(contentHeight, props.collapsedHeight);

    const fader = ElementFaderReactUtils.useFader(isExpanded, { transitionDurationMs, ref: rootRef });

    useEffect(() => {
        if (wasExpandedRef.current === isExpanded) return;

        wasExpandedRef.current = isExpanded;
        isAwaitingScrollRef.current = !isExpanded;
    }, [isExpanded]);

    useEffect(() => {
        if (!isAwaitingScrollRef.current || !fader.hasTransitionFinished) return;

        isAwaitingScrollRef.current = false;

        const root = rootRef.current;
        const trigger = triggerRef.current;

        if (latest.current.isScrolledIntoViewOnCollapse !== true || !root || !trigger) return;

        return CollapsibleUtils.scrollIntoView(root, trigger);
    }, [fader.hasTransitionFinished, latest]);

    const height = PreviewUtils.computeHeight(contentHeight, props.collapsedHeight, fader.transitionTarget);

    return (
        <div
            ref={rootRef}
            className={[PreviewStyles.previewRoot, PreviewStyles.previewSizingVariants[sizing]].join(" ")}
        >
            <div className={PreviewStyles.previewFrame}>
                <div
                    id={contentId}
                    className={PreviewStyles.previewContent}
                    style={{
                        height: `${height}px`,
                        transitionProperty: "height",
                        transitionDuration: `${transitionDurationMs}ms`,
                    }}
                >
                    <div ref={contentRef}>{props.renderContent()}</div>
                </div>

                {props.renderOverlay && isOverflowing && (
                    <div className={PreviewStyles.previewOverlay}>
                        {props.renderOverlay(
                            PreviewUtils.computeOverlayTarget(fader.transitionTarget),
                            transitionDurationMs,
                        )}
                    </div>
                )}
            </div>

            {isOverflowing && (
                <InteractionWrapper<PreviewFlags>
                    {...props}
                    sizing={"fit-content"}
                    extraFlags={{ isExpanded }}
                    renderControl={(setElementRef, flags) => (
                        <PreviewTrigger
                            ref={(element) => {
                                setElementRef(element);
                                triggerRef.current = element;
                            }}
                            id={props.id}
                            contentId={contentId}
                            flags={flags}
                            isExpanded={isExpanded}
                            renderTrigger={props.renderTrigger}
                            onToggle={() => setIsExpanded(!isExpanded)}
                        />
                    )}
                />
            )}
        </div>
    );
};
