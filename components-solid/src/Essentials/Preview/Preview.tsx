import { Show, createEffect, createMemo, createSignal, createUniqueId, on, onCleanup } from "solid-js";

import {
    CollapsibleUtils,
    PREVIEW_DEFAULTS,
    type PreviewFlags,
    PreviewUtils,
    PreviewStyles as styles,
} from "@thewaver/ss-components";

import { ElementFaderSolidUtils } from "../../Abstracts/ElementFader/ElementFaderSolid.utils";
import { ElementObserverSolidUtils } from "../../Abstracts/ElementObserver/ElementObserverSolid.utils";
import { SignalMirrorSolidUtils } from "../../Abstracts/SignalMirror/SignalMirrorSolid.utils";
import { InteractionWrapper } from "../../Primitives/InteractionWrapper/InteractionWrapper";
import { access } from "../../Utils/propUtils";
import type { PreviewProps, PreviewTriggerProps } from "./PreviewSolid.types";

const PreviewTrigger = (props: PreviewTriggerProps) => {
    const getIsDisabled = () => access(props.flags).isDisabled ?? false;

    return (
        <button
            id={access(props.id)}
            ref={(element) => props.ref?.(element)}
            type="button"
            class={styles.previewTrigger}
            aria-expanded={access(props.isExpanded)}
            aria-controls={access(props.contentId)}
            aria-disabled={getIsDisabled() || undefined}
            onClick={() => {
                if (getIsDisabled()) return;

                props.onToggle();
            }}
        >
            {props.renderTrigger(() => access(props.flags))}
        </button>
    );
};

export const Preview = (props: PreviewProps) => {
    const expandedSignal = SignalMirrorSolidUtils.createOptional(() => props.expandedSignal, false);

    const contentId = createUniqueId();

    const [getRootRef, setRootRef] = createSignal<HTMLElement>();
    const [getTriggerRef, setTriggerRef] = createSignal<HTMLElement>();
    const [getContentRef, setContentRef] = createSignal<HTMLElement>();

    const getIsExpanded = () => expandedSignal[0]();

    const getTransitionDurationMs = createMemo(
        () => access(props.transitionDurationMs) ?? PREVIEW_DEFAULTS.transitionDurationMs,
    );

    const getSizing = createMemo(() => access(props.sizing) ?? PREVIEW_DEFAULTS.sizing);

    const getContentHeight = ElementObserverSolidUtils.createBorderBoxHeightObserver(getContentRef);

    const getIsOverflowing = createMemo(() =>
        PreviewUtils.computeIsOverflowing(getContentHeight(), access(props.collapsedHeight)),
    );

    const { getTransitionTarget, getHasTransitionFinished } = ElementFaderSolidUtils.createFader(getIsExpanded, {
        getTransitionDurationMs,
        getRef: getRootRef,
    });

    let isAwaitingScroll = false;

    createEffect(on(getIsExpanded, (isExpanded) => (isAwaitingScroll = !isExpanded), { defer: true }));

    createEffect(
        on([getIsExpanded, getHasTransitionFinished], ([, hasTransitionFinished]) => {
            if (!isAwaitingScroll || !hasTransitionFinished) return;

            isAwaitingScroll = false;

            const root = getRootRef();
            const trigger = getTriggerRef();

            if (access(props.isScrolledIntoViewOnCollapse) !== true || !root || !trigger) return;

            onCleanup(CollapsibleUtils.scrollIntoView(root, trigger));
        }),
    );

    const getHeight = createMemo(() =>
        PreviewUtils.computeHeight(getContentHeight(), access(props.collapsedHeight), getTransitionTarget()),
    );

    const getOverlayTarget = createMemo(() => PreviewUtils.computeOverlayTarget(getTransitionTarget()));

    return (
        <div ref={setRootRef} class={[styles.previewRoot, styles.previewSizingVariants[getSizing()]].join(" ")}>
            <div class={styles.previewFrame}>
                <div
                    id={contentId}
                    class={styles.previewContent}
                    style={{
                        "height": `${getHeight()}px`,
                        "transition-property": "height",
                        "transition-duration": `${getTransitionDurationMs()}ms`,
                    }}
                >
                    <div ref={setContentRef}>{props.renderContent()}</div>
                </div>

                <Show when={props.renderOverlay && getIsOverflowing()}>
                    <div class={styles.previewOverlay}>
                        {props.renderOverlay?.(getOverlayTarget, getTransitionDurationMs)}
                    </div>
                </Show>
            </div>

            <Show when={getIsOverflowing()}>
                <InteractionWrapper
                    {...props}
                    sizing={"fit-content"}
                    extraFlags={(): PreviewFlags => ({ isExpanded: getIsExpanded() })}
                    renderControl={(setElementRef, getFlags) => (
                        <PreviewTrigger
                            ref={(element) => {
                                setElementRef(element);
                                setTriggerRef(element);
                                props.ref?.(element);
                            }}
                            id={props.id}
                            contentId={() => contentId}
                            flags={getFlags}
                            isExpanded={getIsExpanded}
                            renderTrigger={props.renderTrigger}
                            onToggle={() => expandedSignal[1]((prev) => !prev)}
                        />
                    )}
                />
            </Show>
        </div>
    );
};
