import { Show, createEffect, createMemo, createSignal } from "solid-js";
import { Portal } from "solid-js/web";

import { POPOVER_DEFAULTS, PopoverUtils, PopoverStyles as styles } from "@thewaver/ss-components";

import { AnchorSolidUtils } from "../../Abstracts/Anchor/AnchorSolid.utils";
import { DismisserSolidUtils } from "../../Abstracts/Dismisser/DismisserSolid.utils";
import { ElementFaderSolidUtils } from "../../Abstracts/ElementFader/ElementFaderSolid.utils";
import { FocusManagerSolidUtils } from "../../Abstracts/FocusManager/FocusManagerSolid.utils";
import { useViewportContext } from "../../Abstracts/Viewport/Viewport.context";
import { access } from "../../Utils/propUtils";
import type { PopoverProps } from "./PopoverSolid.types";

export const Popover = (props: PopoverProps) => {
    const viewportContext = useViewportContext();

    const [getRootRef, setRootRef] = createSignal<HTMLElement>();

    const getTransitionDurationMs = createMemo(
        () => access(props.transitionDurationMs) ?? POPOVER_DEFAULTS.transitionDurationMs,
    );

    const { getIsVisible, getTransitionTarget, getHasTransitionFinished } = ElementFaderSolidUtils.createFader(
        () => access(props.isOpen),
        {
            getTransitionDurationMs,
            getRef: getRootRef,
        },
    );

    const { getAnchorRect, getIsAnchorOnScreen, getPlacement, getPosition, getZIndex, setContentRef } =
        AnchorSolidUtils.createPortalPosition(() => access(props.anchorRef), getIsVisible, {
            getPlacement: () => access(props.placement) ?? POPOVER_DEFAULTS.placement,
            getOffset: props.offset === undefined ? undefined : () => access(props.offset)!,
            getReservedScreenSize:
                props.reservedScreenSize === undefined ? undefined : () => access(props.reservedScreenSize)!,
            getIsPinned: () => access(props.isPinned) === true,
            getAnchorRect: props.anchorRect === undefined ? undefined : () => access(props.anchorRect),
        });

    const getMinWidth = createMemo(() =>
        access(props.hasAnchorMinWidth) ? `${getAnchorRect()?.width ?? 0}px` : undefined,
    );

    const getAnchorColor = createMemo(() => {
        const anchor = access(props.anchorRef);

        return anchor && getIsVisible() ? getComputedStyle(anchor).color : undefined;
    });

    const getHasFocus = createMemo(
        () => (access(props.hasAutoFocus) ?? false) && access(props.isOpen) && getPosition() !== undefined,
    );

    FocusManagerSolidUtils.autoFocus(getRootRef, getHasFocus, { getInitialRef: getRootRef });

    let hasSeenAnchor = false;

    createEffect(() => {
        const presence = PopoverUtils.computeAnchorPresence(
            hasSeenAnchor,
            access(props.isOpen),
            access(props.isPinned) === true,
            getIsAnchorOnScreen(),
        );

        hasSeenAnchor = presence.hasSeenAnchor;

        if (presence.isGone) props.onDismiss?.("anchorGone");
    });

    DismisserSolidUtils.createLayer(() => access(props.isOpen), {
        getRoots: () => [getRootRef(), props.anchorRect === undefined ? access(props.anchorRef) : undefined],
        onDismiss: (reason) => props.onDismiss?.(reason),
    });

    createEffect(() => {
        props.onTransitionStatusChange?.(getHasTransitionFinished());
    });

    return (
        <Show when={getIsVisible()}>
            <Portal mount={viewportContext.getPortalRef()}>
                <div
                    ref={(element) => {
                        setContentRef(element);
                        setRootRef(element);
                    }}
                    id={access(props.id)}
                    class={styles.popoverRoot}
                    classList={{ [styles.popoverTransparent]: access(props.isTransparentToPointer) === true }}
                    style={{
                        "visibility": getPosition() ? "visible" : "hidden",
                        "transform": `translate(${getPosition()?.x ?? 0}px, ${getPosition()?.y ?? 0}px)`,
                        "min-width": getMinWidth(),
                        "color": getAnchorColor(),
                        "z-index": getZIndex(),
                    }}
                    tabIndex={-1}
                    inert={!access(props.isOpen)}
                    role={access(props.role)}
                    {...access(props.ariaAttributes)}
                    onKeyDown={(e) => props.onKeyDown?.(e)}
                    onBlur={(e) => props.onBlur?.(e)}
                    onMouseDown={(e) => {
                        if (!PopoverUtils.getIsFocusKeptOnPress(access(props.role))) return;

                        e.preventDefault();
                    }}
                >
                    <div
                        class={styles.popoverContent}
                        classList={{ [styles.popoverContentCovered]: access(props.isCovered) === true }}
                    >
                        {props.renderContent(getTransitionTarget, getTransitionDurationMs, getPlacement)}
                    </div>
                </div>
            </Portal>
        </Show>
    );
};
