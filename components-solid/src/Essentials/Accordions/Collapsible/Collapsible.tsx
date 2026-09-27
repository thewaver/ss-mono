import { Show, createEffect, createMemo, createSignal, createUniqueId, on, onCleanup } from "solid-js";
import { Dynamic } from "solid-js/web";

import {
    COLLAPSIBLE_DEFAULTS,
    type CollapsibleFlags,
    CollapsibleUtils,
    CollapsibleStyles as styles,
} from "@thewaver/ss-components";

import { ElementFaderSolidUtils } from "../../../Abstracts/ElementFader/ElementFaderSolid.utils";
import { ElementObserverSolidUtils } from "../../../Abstracts/ElementObserver/ElementObserverSolid.utils";
import { SignalMirrorSolidUtils } from "../../../Abstracts/SignalMirror/SignalMirrorSolid.utils";
import { InteractionWrapper } from "../../../Primitives/InteractionWrapper/InteractionWrapper";
import { access } from "../../../Utils/propUtils";
import type { CollapsibleProps, CollapsibleTriggerProps } from "./CollapsibleSolid.types";

const CollapsibleTrigger = (props: CollapsibleTriggerProps) => {
    const getIsDisabled = () => access(props.flags).isDisabled ?? false;

    return (
        <button
            id={access(props.id)}
            ref={(element) => props.ref?.(element)}
            type="button"
            class={styles.collapsibleTrigger}
            aria-expanded={access(props.isExpanded)}
            aria-controls={access(props.panelId)}
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

export const Collapsible = (props: CollapsibleProps) => {
    const expandedSignal = SignalMirrorSolidUtils.createOptional(() => props.expandedSignal, false);

    const triggerId = createUniqueId();
    const panelId = createUniqueId();

    const [getRootRef, setRootRef] = createSignal<HTMLElement>();
    const [getTriggerRef, setTriggerRef] = createSignal<HTMLElement>();
    const [getContentRef, setContentRef] = createSignal<HTMLElement>();
    const [getIsAwaitingScroll, setIsAwaitingScroll] = createSignal(false);

    const getIsExpanded = () => expandedSignal[0]();

    const getTransitionDurationMs = createMemo(
        () => access(props.transitionDurationMs) ?? COLLAPSIBLE_DEFAULTS.transitionDurationMs,
    );

    const getSizing = createMemo(() => access(props.sizing) ?? COLLAPSIBLE_DEFAULTS.sizing);

    const getHasPanelContent = createMemo(
        (hasContent: boolean) =>
            CollapsibleUtils.computeHasPanelContent(hasContent, access(props.isPanelBuiltOnExpand), getIsExpanded()),
        false,
    );

    const getSide = createMemo(() => access(props.side) ?? COLLAPSIBLE_DEFAULTS.side);

    const getIsSideways = () => CollapsibleUtils.getIsSideways(getSide());

    const getContentSize = ElementObserverSolidUtils.createBorderBoxSizeObserver(
        getContentRef,
        () => !getHasPanelContent(),
    );

    const getPanelAxis = () => CollapsibleUtils.getPanelAxis(getSide());

    const { getTransitionTarget, getHasTransitionFinished } = ElementFaderSolidUtils.createFader(getIsExpanded, {
        getTransitionDurationMs,
        getRef: getRootRef,
    });

    const getPanelExtent = () =>
        CollapsibleUtils.computePanelExtent(getTransitionTarget(), getContentSize(), getSide());

    createEffect(on(getIsExpanded, (isExpanded) => setIsAwaitingScroll(isExpanded), { defer: true }));

    createEffect(() => {
        if (!getIsAwaitingScroll() || !getHasTransitionFinished()) return;

        setIsAwaitingScroll(false);

        const root = getRootRef();
        const trigger = getTriggerRef();

        if (access(props.isScrolledIntoViewOnExpand) !== true || !root || !trigger) return;

        onCleanup(CollapsibleUtils.scrollIntoView(root, trigger));
    });

    const getHeadingTag = createMemo(() => CollapsibleUtils.getHeadingTag(access(props.headingLevel)));

    const renderWrapper = () => (
        <InteractionWrapper
            {...props}
            sizing={getIsSideways() ? "fit-content" : "fill"}
            extraFlags={(): CollapsibleFlags => ({ isExpanded: getIsExpanded() })}
            renderControl={(setElementRef, getFlags) => (
                <CollapsibleTrigger
                    ref={(element) => {
                        setElementRef(element);
                        setTriggerRef(element);
                    }}
                    id={() => access(props.id) ?? triggerId}
                    panelId={() => panelId}
                    flags={getFlags}
                    isExpanded={getIsExpanded}
                    renderTrigger={props.renderTrigger}
                    onToggle={() => expandedSignal[1]((prev) => !prev)}
                />
            )}
        />
    );

    return (
        <div
            ref={setRootRef}
            class={[
                styles.collapsibleRoot,
                styles.collapsibleSizingVariants[getSizing()],
                styles.collapsibleSideVariants[getSide()],
            ].join(" ")}
        >
            <Show when={getHeadingTag()} fallback={renderWrapper()}>
                {(getTag) => (
                    <Dynamic component={getTag()} class={styles.collapsibleHeading}>
                        {renderWrapper()}
                    </Dynamic>
                )}
            </Show>

            <div
                id={panelId}
                class={styles.collapsiblePanel}
                style={{
                    [getPanelAxis()]: `${getPanelExtent()}px`,
                    "transition-property": getPanelAxis(),
                    "transition-duration": `${getTransitionDurationMs()}ms`,
                }}
                role={access(props.panelRole)}
                {...(access(props.panelAriaAttributes) ?? {})}
                inert={!getIsExpanded()}
            >
                <div ref={setContentRef} class={getIsSideways() ? styles.collapsibleSidewaysContent : undefined}>
                    <Show when={getHasPanelContent()}>
                        {props.renderPanel(getTransitionTarget, getTransitionDurationMs)}
                    </Show>
                </div>
            </div>
        </div>
    );
};
