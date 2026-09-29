import { useEffect, useId, useRef, useState } from "react";

import {
    COLLAPSIBLE_DEFAULTS,
    type CollapsibleFlags,
    CollapsibleStyles,
    CollapsibleUtils,
} from "@thewaver/ss-components";

import { ElementFaderReactUtils } from "../../../Abstracts/ElementFader/ElementFaderReact.utils";
import { ElementObserverReactUtils } from "../../../Abstracts/ElementObserver/ElementObserverReact.utils";
import { SignalMirrorReactUtils } from "../../../Abstracts/SignalMirror/SignalMirrorReact.utils";
import { InteractionWrapper } from "../../../Primitives/InteractionWrapper/InteractionWrapper";
import { useLatest } from "../../../Utils/refUtils";
import type { CollapsibleProps, CollapsibleTriggerProps } from "./Collapsible.types";

const CollapsibleTrigger = (props: CollapsibleTriggerProps) => {
    const isDisabled = props.flags.isDisabled ?? false;

    return (
        <button
            id={props.id}
            ref={props.ref}
            type="button"
            className={CollapsibleStyles.collapsibleTrigger}
            aria-expanded={props.isExpanded}
            aria-controls={props.panelId}
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

export const Collapsible = (props: CollapsibleProps) => {
    const [isExpanded, setIsExpanded] = SignalMirrorReactUtils.useOptionalState(props.expanded, false);

    const triggerId = useId();
    const panelId = useId();

    const rootRef = useRef<HTMLDivElement | null>(null);
    const triggerRef = useRef<HTMLElement | null>(null);
    const contentRef = useRef<HTMLDivElement | null>(null);
    const isAwaitingScrollRef = useRef(false);
    const wasExpandedRef = useRef(isExpanded);
    const latest = useLatest(props);

    const transitionDurationMs = props.transitionDurationMs ?? COLLAPSIBLE_DEFAULTS.transitionDurationMs;
    const sizing = props.sizing ?? COLLAPSIBLE_DEFAULTS.sizing;
    const side = props.side ?? COLLAPSIBLE_DEFAULTS.side;
    const isSideways = CollapsibleUtils.getIsSideways(side);
    const panelAxis = CollapsibleUtils.getPanelAxis(side);

    const [hasBuiltContent, setHasBuiltContent] = useState(false);
    const hasPanelContent = CollapsibleUtils.computeHasPanelContent(
        hasBuiltContent,
        props.isPanelBuiltOnExpand,
        isExpanded,
    );

    if (hasPanelContent && !hasBuiltContent) setHasBuiltContent(true);

    const contentSize = ElementObserverReactUtils.useBorderBoxSize(contentRef, !hasPanelContent);

    const fader = ElementFaderReactUtils.useFader(isExpanded, { transitionDurationMs, ref: rootRef });

    useEffect(() => {
        if (wasExpandedRef.current === isExpanded) return;

        wasExpandedRef.current = isExpanded;
        isAwaitingScrollRef.current = isExpanded;
    }, [isExpanded]);

    useEffect(() => {
        if (!isAwaitingScrollRef.current || !fader.hasTransitionFinished) return;

        isAwaitingScrollRef.current = false;

        const root = rootRef.current;
        const trigger = triggerRef.current;

        if (latest.current.isScrolledIntoViewOnExpand !== true || !root || !trigger) return;

        return CollapsibleUtils.scrollIntoView(root, trigger);
    }, [fader.hasTransitionFinished, latest]);

    const HeadingTag = CollapsibleUtils.getHeadingTag(props.headingLevel);

    const wrapper = (
        <InteractionWrapper<CollapsibleFlags>
            {...props}
            sizing={isSideways ? "fit-content" : "fill"}
            extraFlags={{ isExpanded }}
            renderControl={(setElementRef, flags) => (
                <CollapsibleTrigger
                    ref={(element) => {
                        setElementRef(element);
                        triggerRef.current = element;
                    }}
                    id={props.id ?? triggerId}
                    panelId={panelId}
                    flags={flags}
                    isExpanded={isExpanded}
                    renderTrigger={props.renderTrigger}
                    onToggle={() => setIsExpanded(!isExpanded)}
                />
            )}
        />
    );

    return (
        <div
            ref={rootRef}
            className={[
                CollapsibleStyles.collapsibleRoot,
                CollapsibleStyles.collapsibleSizingVariants[sizing],
                CollapsibleStyles.collapsibleSideVariants[side],
            ].join(" ")}
        >
            {HeadingTag ? <HeadingTag className={CollapsibleStyles.collapsibleHeading}>{wrapper}</HeadingTag> : wrapper}

            <div
                id={panelId}
                className={CollapsibleStyles.collapsiblePanel}
                style={{
                    [panelAxis]: `${CollapsibleUtils.computePanelExtent(fader.transitionTarget, contentSize, side)}px`,
                    transitionProperty: panelAxis,
                    transitionDuration: `${transitionDurationMs}ms`,
                }}
                role={props.panelRole}
                {...props.panelAriaAttributes}
                inert={!isExpanded}
            >
                <div ref={contentRef} className={isSideways ? CollapsibleStyles.collapsibleSidewaysContent : undefined}>
                    {hasPanelContent && props.renderPanel(fader.transitionTarget, transitionDurationMs)}
                </div>
            </div>
        </div>
    );
};
