import { type SlotsType, computed, defineComponent, h, shallowRef, useId, watch } from "vue";

import {
    COLLAPSIBLE_DEFAULTS,
    type CollapsibleFlags,
    CollapsibleStyles,
    CollapsibleUtils,
} from "@thewaver/ss-components";

import { ElementFaderVueUtils } from "../../../Abstracts/ElementFader/ElementFaderVue.utils";
import { ElementObserverVueUtils } from "../../../Abstracts/ElementObserver/ElementObserverVue.utils";
import { InteractionWrapper } from "../../../Primitives/InteractionWrapper/InteractionWrapper";
import type { InteractionWrapperSlots } from "../../../Primitives/InteractionWrapper/InteractionWrapper.types";
import { watchAfterRender } from "../../../Utils/effectUtils";
import { callSlot, declareProps, forwardProps, useTwoWay } from "../../../Utils/propUtils";
import { exposeElement, toElement } from "../../../Utils/refUtils";
import type { SlotsContext } from "../../../Utils/typeUtils";
import type { CollapsibleProps, CollapsibleSlots, CollapsibleTriggerProps } from "./Collapsible.types";

const CollapsibleTrigger = defineComponent(
    (props: CollapsibleTriggerProps, { slots }: SlotsContext<Pick<CollapsibleSlots, "renderTrigger">>) =>
        () => {
            const isDisabled = props.flags.isDisabled ?? false;

            return (
                <button
                    id={props.id}
                    type="button"
                    class={CollapsibleStyles.collapsibleTrigger}
                    aria-expanded={props.isExpanded}
                    aria-controls={props.panelId}
                    aria-disabled={isDisabled || undefined}
                    onClick={() => {
                        if (isDisabled) return;

                        props.onToggle();
                    }}
                >
                    {callSlot(slots.renderTrigger, props.flags)}
                </button>
            );
        },
    {
        name: "CollapsibleTrigger",
        props: declareProps<CollapsibleTriggerProps>({
            id: null,
            ariaLabel: null,
            flags: null,
            panelId: null,
            isExpanded: Boolean,
            onToggle: null,
        }),
    },
);

export const Collapsible = defineComponent(
    (props: CollapsibleProps, { slots, expose }: SlotsContext<CollapsibleSlots>) => {
        const isExpanded = useTwoWay(props, "expanded", false);

        const triggerId = useId();
        const panelId = useId();

        const rootRef = shallowRef<HTMLDivElement>();
        const triggerRef = shallowRef<HTMLElement>();
        const contentRef = shallowRef<HTMLDivElement>();

        let isAwaitingScroll = false;

        exposeElement(expose, () => triggerRef.value);

        const getTransitionDurationMs = () => props.transitionDurationMs ?? COLLAPSIBLE_DEFAULTS.transitionDurationMs;

        const hasPanelContent = computed<boolean>((previous) =>
            CollapsibleUtils.computeHasPanelContent(previous ?? false, props.isPanelBuiltOnExpand, isExpanded.value),
        );

        const contentSize = ElementObserverVueUtils.useBorderBoxSize(contentRef, () => !hasPanelContent.value);

        const fader = ElementFaderVueUtils.useFader(isExpanded, {
            transitionDurationMs: getTransitionDurationMs,
            ref: rootRef,
        });

        watch(
            isExpanded,
            (expanded) => {
                isAwaitingScroll = expanded;
            },
            { flush: "post" },
        );

        watchAfterRender([fader.hasTransitionFinished], ([hasTransitionFinished]) => {
            if (!isAwaitingScroll || !hasTransitionFinished) return;

            isAwaitingScroll = false;

            const root = rootRef.value;
            const trigger = triggerRef.value;

            if (props.isScrolledIntoViewOnExpand !== true || !root || !trigger) return;

            return CollapsibleUtils.scrollIntoView(root, trigger);
        });

        return () => {
            const transitionDurationMs = getTransitionDurationMs();
            const sizing = props.sizing ?? COLLAPSIBLE_DEFAULTS.sizing;
            const side = props.side ?? COLLAPSIBLE_DEFAULTS.side;
            const isSideways = CollapsibleUtils.getIsSideways(side);
            const panelAxis = CollapsibleUtils.getPanelAxis(side);
            const HeadingTag = CollapsibleUtils.getHeadingTag(props.headingLevel);
            const visibilityTarget = fader.transitionTarget.value;
            const panelExtent = CollapsibleUtils.computePanelExtent(visibilityTarget, contentSize.value, side);

            const wrapper = (
                <InteractionWrapper
                    {...forwardProps(props, InteractionWrapper)}
                    sizing={isSideways ? "fit-content" : "fill"}
                    extraFlags={{ isExpanded: isExpanded.value }}
                >
                    {
                        {
                            renderControl: ({ setElementRef, flags }) => (
                                <CollapsibleTrigger
                                    ref={(target) => {
                                        setElementRef(target);
                                        triggerRef.value = toElement(target);
                                    }}
                                    id={props.id ?? triggerId}
                                    panelId={panelId}
                                    flags={flags}
                                    isExpanded={isExpanded.value}
                                    onToggle={() => {
                                        isExpanded.value = !isExpanded.value;
                                    }}
                                >
                                    {{ renderTrigger: slots.renderTrigger }}
                                </CollapsibleTrigger>
                            ),
                            renderDecoration: slots.renderDecoration,
                        } satisfies Partial<InteractionWrapperSlots<CollapsibleFlags>>
                    }
                </InteractionWrapper>
            );

            return (
                <div
                    ref={rootRef}
                    class={[
                        CollapsibleStyles.collapsibleRoot,
                        CollapsibleStyles.collapsibleSizingVariants[sizing],
                        CollapsibleStyles.collapsibleSideVariants[side],
                    ]}
                >
                    {HeadingTag ? h(HeadingTag, { class: CollapsibleStyles.collapsibleHeading }, [wrapper]) : wrapper}

                    <div
                        id={panelId}
                        class={CollapsibleStyles.collapsiblePanel}
                        style={{
                            [panelAxis]: `${panelExtent}px`,
                            transitionProperty: panelAxis,
                            transitionDuration: `${transitionDurationMs}ms`,
                        }}
                        role={props.panelRole}
                        {...props.panelAriaAttributes}
                        inert={!isExpanded.value}
                    >
                        <div
                            ref={contentRef}
                            class={isSideways ? CollapsibleStyles.collapsibleSidewaysContent : undefined}
                        >
                            {hasPanelContent.value &&
                                callSlot(slots.renderPanel, { visibilityTarget, transitionDurationMs })}
                        </div>
                    </div>
                </div>
            );
        };
    },
    {
        name: "Collapsible",
        slots: Object as SlotsType<CollapsibleSlots>,
        props: declareProps<CollapsibleProps>({
            "isDisabled": Boolean,
            "isPressed": Boolean,
            "hasError": Boolean,
            "role": null,
            "isReachableWhenDisabled": Boolean,
            "isFocusableWhenDisabled": Boolean,
            "isTabbable": Boolean,
            "onActivation": null,
            "tooltipDefs": null,
            "id": null,
            "sizing": null,
            "side": null,
            "transitionDurationMs": null,
            "headingLevel": null,
            "isScrolledIntoViewOnExpand": Boolean,
            "isPanelBuiltOnExpand": Boolean,
            "panelRole": null,
            "panelAriaAttributes": null,
            "expanded": Boolean,
            "onUpdate:expanded": null,
        }),
    },
);
