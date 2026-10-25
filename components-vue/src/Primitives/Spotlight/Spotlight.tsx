import { type SlotsType, Teleport, computed, defineComponent, shallowRef, watch } from "vue";

import {
    CutoutUtils,
    DismisserUtils,
    FocusManagerUtils,
    LiveAnnouncerUtils,
    SPOTLIGHT_DEFAULTS,
    SpotlightStyles,
    SpotlightUtils,
} from "@thewaver/ss-components";

import { AnchorVueUtils } from "../../Abstracts/Anchor/AnchorVue.utils";
import { ElementFaderVueUtils } from "../../Abstracts/ElementFader/ElementFaderVue.utils";
import { ElementObserverVueUtils } from "../../Abstracts/ElementObserver/ElementObserverVue.utils";
import { ElevationVueUtils } from "../../Abstracts/Elevation/ElevationVue.utils";
import { FocusManagerVueUtils } from "../../Abstracts/FocusManager/FocusManagerVue.utils";
import { useViewportContext } from "../../Abstracts/Viewport/Viewport.context";
import { watchAfterRender } from "../../Utils/effectUtils";
import { callSlot, declareProps, useTwoWay } from "../../Utils/propUtils";
import { toElement } from "../../Utils/refUtils";
import { useStore } from "../../Utils/storeUtils";
import type { SlotsContext } from "../../Utils/typeUtils";
import type { SpotlightPopupSlot, SpotlightProps, SpotlightSlots } from "./Spotlight.types";

export const Spotlight = defineComponent(
    (props: SpotlightProps, { slots }: SlotsContext<SpotlightSlots & SpotlightPopupSlot>) => {
        const viewportContext = useViewportContext();

        const visibility = useTwoWay(props, "visibility", false);

        const portalRef = shallowRef<HTMLElement>();
        const popupRef = shallowRef<HTMLElement>();

        let announced: string | undefined;

        const getTransitionDurationMs = () => props.transitionDurationMs ?? SPOTLIGHT_DEFAULTS.transitionDurationMs;
        const getHasPopup = () => props.mode === "guide" && slots.renderPopup !== undefined;

        const dismiss = () => {
            visibility.value = false;
        };

        const layer = SpotlightUtils.createLayer(() => props.mode, dismiss);

        const isOnTop = useStore(DismisserUtils.openLayers, () => SpotlightUtils.getIsOnTop(layer));

        const fader = ElementFaderVueUtils.useFader(() => visibility.value && isOnTop.value, {
            transitionDurationMs: getTransitionDurationMs,
            ref: portalRef,
        });

        const isVisible = fader.isVisible;
        const isActing = computed(() => isVisible.value && isOnTop.value);

        watchAfterRender([() => visibility.value || isVisible.value], ([isRegistered]) => {
            if (!isRegistered) return;

            return DismisserUtils.addLayer(layer);
        });

        watch(
            () => visibility.value,
            (isOpen, wasOpen) => {
                if (isOpen) props.onShow?.();
                else if (wasOpen) props.onHide?.();
            },
            { immediate: true },
        );

        const rect = ElementObserverVueUtils.useViewportRect(() => props.elementRef, isVisible, {
            padding: () => props.padding ?? SPOTLIGHT_DEFAULTS.padding,
        });

        ElevationVueUtils.useElevation(() => props.elementRef, isActing, SpotlightStyles.SPOTLIGHT_Z_INDEX);

        watchAfterRender([isVisible, () => props.elementRef], ([isShown, element]) => {
            if (!isShown || !element) return;

            element.scrollIntoView({ block: "nearest", inline: "nearest" });
        });

        const { placement, position, setContentRef } = AnchorVueUtils.usePortalPosition(
            () => props.elementRef,
            () => isVisible.value && getHasPopup(),
            {
                placement: () => props.popupPlacement ?? SPOTLIGHT_DEFAULTS.popupPlacement,
                offset: () => props.popupOffset ?? SPOTLIGHT_DEFAULTS.popupOffset,
                anchorRect: rect,
            },
        );

        watchAfterRender([isActing], ([isOn]) => {
            if (!isOn) return;

            return SpotlightUtils.observeDismissKeys(layer, () => props.mode, dismiss);
        });

        watchAfterRender([isActing, () => props.mode, () => props.elementRef], ([isOn, mode, element]) => {
            if (!isOn || mode !== "prompt" || !element) return;

            return SpotlightUtils.holdFocus(element);
        });

        watchAfterRender([isActing, () => props.mode, portalRef], ([isOn, mode, portal]) => {
            if (!isOn || mode !== "guide" || !portal) return;

            return FocusManagerUtils.sealAround(portal);
        });

        watchAfterRender([() => props.announcement !== undefined], ([hasAnnouncement]) => {
            if (!hasAnnouncement) return;

            LiveAnnouncerUtils.reserve("polite");
        });

        watchAfterRender([isActing, () => props.announcement], ([isOn, announcement]) => {
            if (!isOn) {
                announced = undefined;

                return;
            }

            if (SpotlightUtils.getIsAnnouncementDue(announced, announcement)) {
                LiveAnnouncerUtils.announce(announcement!);
            }

            announced = announcement;
        });

        let hasWarnedUnannounced = false;

        watchAfterRender(
            [() => props.announcement, () => isVisible.value && props.mode === "guide"],
            ([announcement, isGuideShowing]) => {
                if (hasWarnedUnannounced || !isGuideShowing) return;

                hasWarnedUnannounced = SpotlightUtils.warnIfUnannounced(announcement, "announcement");
            },
        );

        const isPlacing = computed(() => isActing.value && getHasPopup());
        const hasPlaced = shallowRef(false);

        watch(
            [isPlacing, () => position.value !== undefined],
            ([placing, isPositioned]) => {
                if (!placing) {
                    hasPlaced.value = false;
                } else if (isPositioned) {
                    hasPlaced.value = true;
                }
            },
            { immediate: true },
        );

        FocusManagerVueUtils.useAutoFocus(popupRef, hasPlaced, { isOpen: () => visibility.value });

        return () => {
            const currentRect = rect.value;

            if (!isVisible.value || !currentRect) return null;

            const transitionDurationMs = getTransitionDurationMs();
            const visibilityTarget = fader.transitionTarget.value;
            const maskStyle = CutoutUtils.getMaskStyle([currentRect]);

            return (
                <Teleport to={viewportContext.getPortalRef() ?? document.body}>
                    <div
                        ref={(target) => {
                            portalRef.value = toElement(target);
                        }}
                    >
                        <div class={SpotlightStyles.spotlightOverlay}>
                            {callSlot(slots.renderOverlay, { visibilityTarget, transitionDurationMs, maskStyle })}
                        </div>

                        <div
                            class={SpotlightStyles.spotlightBlocker}
                            style={{ clipPath: SpotlightUtils.getHoleClipPath(currentRect) }}
                            onClick={() => {
                                if (props.mode === "hint") dismiss();
                            }}
                        />

                        {slots.renderHighlight && (
                            <div
                                class={SpotlightStyles.spotlightDecoration}
                                style={{
                                    top: `${currentRect.y}px`,
                                    left: `${currentRect.x}px`,
                                    width: `${currentRect.width}px`,
                                    height: `${currentRect.height}px`,
                                }}
                            >
                                {callSlot(slots.renderHighlight, { visibilityTarget, transitionDurationMs })}
                            </div>
                        )}

                        {getHasPopup() && (
                            <div
                                ref={(target) => {
                                    popupRef.value = toElement(target);
                                    setContentRef(target);
                                }}
                                class={SpotlightStyles.spotlightPopup}
                                style={{
                                    visibility: position.value ? "visible" : "hidden",
                                    transform: `translate(${position.value?.x ?? 0}px, ${position.value?.y ?? 0}px)`,
                                }}
                                tabindex={-1}
                                role="dialog"
                                aria-modal="true"
                                aria-label={props.ariaLabel}
                                onKeydown={(e) =>
                                    FocusManagerUtils.focusTrapKeyDown(
                                        e as Parameters<typeof FocusManagerUtils.focusTrapKeyDown>[0],
                                        popupRef.value,
                                    )
                                }
                            >
                                {callSlot(slots.renderPopup, {
                                    visibilityTarget,
                                    transitionDurationMs,
                                    placement: placement.value,
                                })}
                            </div>
                        )}
                    </div>
                </Teleport>
            );
        };
    },
    {
        name: "Spotlight",
        inheritAttrs: false,
        slots: Object as SlotsType<SpotlightSlots & Partial<SpotlightPopupSlot>>,
        props: declareProps<SpotlightProps>({
            "visibility": Boolean,
            "onUpdate:visibility": null,
            "padding": null,
            "transitionDurationMs": null,
            "elementRef": null,
            "onShow": null,
            "onHide": null,
            "ariaLabel": null,
            "announcement": null,
            "popupPlacement": null,
            "popupOffset": null,
            "mode": null,
        }),
    },
);
