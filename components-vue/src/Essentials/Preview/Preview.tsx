import { type SlotsType, defineComponent, shallowRef, useId, watch } from "vue";

import {
    CollapsibleUtils,
    PREVIEW_DEFAULTS,
    type PreviewFlags,
    PreviewStyles,
    PreviewUtils,
} from "@thewaver/ss-components";

import { ElementFaderVueUtils } from "../../Abstracts/ElementFader/ElementFaderVue.utils";
import { ElementObserverVueUtils } from "../../Abstracts/ElementObserver/ElementObserverVue.utils";
import { InteractionWrapper } from "../../Primitives/InteractionWrapper/InteractionWrapper";
import type { InteractionWrapperSlots } from "../../Primitives/InteractionWrapper/InteractionWrapper.types";
import { watchAfterRender } from "../../Utils/effectUtils";
import { callSlot, declareProps, forwardProps, useTwoWay } from "../../Utils/propUtils";
import { exposeElement, toElement } from "../../Utils/refUtils";
import type { SlotsContext } from "../../Utils/typeUtils";
import type { PreviewProps, PreviewSlots, PreviewTriggerProps } from "./Preview.types";

const PreviewTrigger = defineComponent(
    (props: PreviewTriggerProps, { slots }: SlotsContext<Pick<PreviewSlots, "renderTrigger">>) => () => {
        const isDisabled = props.flags.isDisabled ?? false;

        return (
            <button
                id={props.id}
                type="button"
                class={PreviewStyles.previewTrigger}
                aria-expanded={props.isExpanded}
                aria-controls={props.contentId}
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
        name: "PreviewTrigger",
        props: declareProps<PreviewTriggerProps>({
            id: null,
            ariaLabel: null,
            flags: null,
            contentId: null,
            isExpanded: Boolean,
            onToggle: null,
        }),
    },
);

export const Preview = defineComponent(
    (props: PreviewProps, { slots, expose }: SlotsContext<PreviewSlots>) => {
        const isExpanded = useTwoWay(props, "expanded", false);

        const contentId = useId();

        const rootRef = shallowRef<HTMLDivElement>();
        const triggerRef = shallowRef<HTMLElement>();
        const contentRef = shallowRef<HTMLDivElement>();

        let isAwaitingScroll = false;

        exposeElement(expose, () => triggerRef.value);

        const getTransitionDurationMs = () => props.transitionDurationMs ?? PREVIEW_DEFAULTS.transitionDurationMs;

        const contentHeight = ElementObserverVueUtils.useBorderBoxHeight(contentRef);

        const fader = ElementFaderVueUtils.useFader(isExpanded, {
            transitionDurationMs: getTransitionDurationMs,
            ref: rootRef,
        });

        watch(
            isExpanded,
            (expanded) => {
                isAwaitingScroll = !expanded;
            },
            { flush: "post" },
        );

        watchAfterRender([fader.hasTransitionFinished], ([hasTransitionFinished]) => {
            if (!isAwaitingScroll || !hasTransitionFinished) return;

            isAwaitingScroll = false;

            const root = rootRef.value;
            const trigger = triggerRef.value;

            if (props.isScrolledIntoViewOnCollapse !== true || !root || !trigger) return;

            return CollapsibleUtils.scrollIntoView(root, trigger);
        });

        return () => {
            const transitionDurationMs = getTransitionDurationMs();
            const sizing = props.sizing ?? PREVIEW_DEFAULTS.sizing;
            const isOverflowing = PreviewUtils.computeIsOverflowing(contentHeight.value, props.collapsedHeight);
            const visibilityTarget = fader.transitionTarget.value;
            const height = PreviewUtils.computeHeight(contentHeight.value, props.collapsedHeight, visibilityTarget);

            return (
                <div ref={rootRef} class={[PreviewStyles.previewRoot, PreviewStyles.previewSizingVariants[sizing]]}>
                    <div class={PreviewStyles.previewFrame}>
                        <div
                            id={contentId}
                            class={PreviewStyles.previewContent}
                            style={{
                                height: `${height}px`,
                                transitionProperty: "height",
                                transitionDuration: `${transitionDurationMs}ms`,
                            }}
                        >
                            <div ref={contentRef}>{slots.renderContent?.()}</div>
                        </div>

                        {slots.renderOverlay && isOverflowing && (
                            <div class={PreviewStyles.previewOverlay}>
                                {callSlot(slots.renderOverlay, {
                                    visibilityTarget: PreviewUtils.computeOverlayTarget(visibilityTarget),
                                    transitionDurationMs,
                                })}
                            </div>
                        )}
                    </div>

                    {isOverflowing && (
                        <InteractionWrapper
                            {...forwardProps(props, InteractionWrapper)}
                            sizing={"fit-content"}
                            extraFlags={{ isExpanded: isExpanded.value }}
                        >
                            {
                                {
                                    renderControl: ({ setElementRef, flags }) => (
                                        <PreviewTrigger
                                            ref={(target) => {
                                                setElementRef(target);
                                                triggerRef.value = toElement(target);
                                            }}
                                            id={props.id}
                                            contentId={contentId}
                                            flags={flags}
                                            isExpanded={isExpanded.value}
                                            onToggle={() => {
                                                isExpanded.value = !isExpanded.value;
                                            }}
                                        >
                                            {{ renderTrigger: slots.renderTrigger }}
                                        </PreviewTrigger>
                                    ),
                                    renderDecoration: slots.renderDecoration,
                                } satisfies Partial<InteractionWrapperSlots<PreviewFlags>>
                            }
                        </InteractionWrapper>
                    )}
                </div>
            );
        };
    },
    {
        name: "Preview",
        slots: Object as SlotsType<PreviewSlots>,
        props: declareProps<PreviewProps>({
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
            "collapsedHeight": null,
            "isScrolledIntoViewOnCollapse": Boolean,
            "transitionDurationMs": null,
            "expanded": Boolean,
            "onUpdate:expanded": null,
        }),
    },
);
