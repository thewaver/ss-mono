import { type SlotsType, Teleport, computed, defineComponent, shallowRef } from "vue";

import { POPOVER_DEFAULTS, PopoverStyles, PopoverUtils } from "@thewaver/ss-components";

import { AnchorVueUtils } from "../../Abstracts/Anchor/AnchorVue.utils";
import { DismisserVueUtils } from "../../Abstracts/Dismisser/DismisserVue.utils";
import { ElementFaderVueUtils } from "../../Abstracts/ElementFader/ElementFaderVue.utils";
import { FocusManagerVueUtils } from "../../Abstracts/FocusManager/FocusManagerVue.utils";
import { useViewportContext } from "../../Abstracts/Viewport/Viewport.context";
import { watchAfterRender } from "../../Utils/effectUtils";
import { callSlot, declareProps } from "../../Utils/propUtils";
import { toElement } from "../../Utils/refUtils";
import type { SlotsContext } from "../../Utils/typeUtils";
import type { PopoverProps, PopoverSlots } from "./Popover.types";

export const Popover = defineComponent(
    (props: PopoverProps, { slots }: SlotsContext<PopoverSlots>) => {
        const viewportContext = useViewportContext();

        const rootRef = shallowRef<HTMLElement>();

        let hasSeenAnchor = false;

        const getTransitionDurationMs = () => props.transitionDurationMs ?? POPOVER_DEFAULTS.transitionDurationMs;
        const getIsPinned = () => props.isPinned === true;

        const fader = ElementFaderVueUtils.useFader(() => props.isOpen, {
            transitionDurationMs: getTransitionDurationMs,
            ref: rootRef,
        });

        const { anchorRect, isAnchorOnScreen, placement, position, zIndex, setContentRef } =
            AnchorVueUtils.usePortalPosition(() => props.anchorRef, fader.isVisible, {
                placement: () => props.placement ?? POPOVER_DEFAULTS.placement,
                offset: () => props.offset,
                reservedScreenSize: () => props.reservedScreenSize,
                isPinned: getIsPinned,
                anchorRect: () => props.anchorRect,
            });

        const anchorColor = computed(() =>
            props.anchorRef && fader.isVisible.value ? getComputedStyle(props.anchorRef).color : undefined,
        );

        FocusManagerVueUtils.useAutoFocus(
            rootRef,
            () => (props.hasAutoFocus ?? false) && props.isOpen && position.value !== undefined,
            { initialRef: rootRef },
        );

        watchAfterRender([() => props.isOpen, getIsPinned, isAnchorOnScreen], ([isOpen, isPinned, isOnScreen]) => {
            const presence = PopoverUtils.computeAnchorPresence(hasSeenAnchor, isOpen, isPinned, isOnScreen);

            hasSeenAnchor = presence.hasSeenAnchor;

            if (presence.isGone) props.onDismiss?.("anchorGone");
        });

        DismisserVueUtils.useLayer(() => props.isOpen, {
            getRoots: () => [rootRef.value, props.anchorRect === undefined ? props.anchorRef : undefined],
            onDismiss: (reason) => props.onDismiss?.(reason),
        });

        watchAfterRender([fader.hasTransitionFinished], ([hasTransitionFinished]) => {
            props.onTransitionStatusChange?.(hasTransitionFinished);
        });

        return () => {
            if (!fader.isVisible.value) return null;

            return (
                <Teleport to={viewportContext.getPortalRef() ?? document.body}>
                    <div
                        ref={(target) => {
                            rootRef.value = toElement(target);
                            setContentRef(target);
                        }}
                        id={props.id}
                        class={[
                            PopoverStyles.popoverRoot,
                            props.isTransparentToPointer === true && PopoverStyles.popoverTransparent,
                        ]}
                        style={{
                            visibility: position.value ? "visible" : "hidden",
                            transform: `translate(${position.value?.x ?? 0}px, ${position.value?.y ?? 0}px)`,
                            minWidth: props.hasAnchorMinWidth ? `${anchorRect.value?.width ?? 0}px` : undefined,
                            color: anchorColor.value,
                            zIndex: zIndex.value,
                        }}
                        tabindex={-1}
                        inert={!props.isOpen}
                        role={props.role}
                        {...props.ariaAttributes}
                        onKeydown={(e) => props.onKeyDown?.(e)}
                        onBlur={(e) => props.onBlur?.(e)}
                        onMousedown={(e) => {
                            if (!PopoverUtils.getIsFocusKeptOnPress(props.role)) return;

                            e.preventDefault();
                        }}
                    >
                        <div
                            class={[
                                PopoverStyles.popoverContent,
                                props.isCovered === true && PopoverStyles.popoverContentCovered,
                            ]}
                        >
                            {callSlot(slots.renderContent, {
                                visibilityTarget: fader.transitionTarget.value,
                                transitionDurationMs: getTransitionDurationMs(),
                                placement: placement.value,
                            })}
                        </div>
                    </div>
                </Teleport>
            );
        };
    },
    {
        name: "Popover",
        inheritAttrs: false,
        slots: Object as SlotsType<PopoverSlots>,
        props: declareProps<PopoverProps>({
            id: null,
            role: null,
            ariaAttributes: null,
            placement: null,
            offset: null,
            reservedScreenSize: null,
            transitionDurationMs: null,
            hasAnchorMinWidth: Boolean,
            hasAutoFocus: Boolean,
            isTransparentToPointer: Boolean,
            isPinned: Boolean,
            isCovered: Boolean,
            isOpen: Boolean,
            anchorRef: null,
            anchorRect: null,
            onKeyDown: null,
            onBlur: null,
            onDismiss: null,
            onTransitionStatusChange: null,
        }),
    },
);
