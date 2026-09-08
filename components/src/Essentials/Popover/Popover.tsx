import { Show, createEffect, createMemo, createSignal } from "solid-js";
import { Portal } from "solid-js/web";

import { Anchor } from "../../Abstracts/Anchor/Anchor";
import type { AnchorPlacement } from "../../Abstracts/Anchor/Anchor.types";
import { DismisserStack } from "../../Abstracts/Dismisser/DismisserStack";
import { ElementFader } from "../../Abstracts/ElementFader/ElementFader";
import { FocusManager } from "../../Abstracts/FocusManager/FocusManager";
import { useViewportContext } from "../../Exotics/Viewport/Viewport.context";
import { access } from "../../Utils/propUtils";
import type { PopoverProps } from "./Popover.types";

import * as styles from "./Popover.css";

const DEFAULT_POPOVER_PLACEMENT: AnchorPlacement = { x: "left-in", y: "bottom-out" };
const DEFAULT_POPOVER_TRANSITION_DURATION_MS = 200;

export const Popover = (props: PopoverProps) => {
    const viewportContext = useViewportContext();

    const [getRootRef, setRootRef] = createSignal<HTMLElement>();

    const getTransitionDurationMs = createMemo(
        () => access(props.transitionDurationMs) ?? DEFAULT_POPOVER_TRANSITION_DURATION_MS,
    );

    const { getIsVisible, getTransitionTarget, getHasTransitionFinished } = ElementFader.createFader(
        () => access(props.isOpen),
        {
            getTransitionDurationMs,
        },
    );

    const { getAnchorRect, getIsAnchorOnScreen, getPlacement, getPosition, getZIndex, setContentRef } =
        Anchor.createPortalPosition(() => access(props.anchorRef), getIsVisible, {
            getPlacement: () => access(props.placement) ?? DEFAULT_POPOVER_PLACEMENT,
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

    FocusManager.autoFocus(getRootRef, getHasFocus, { getInitialRef: getRootRef });

    // a pinned layer does not follow its anchor, so once the anchor has gone the layer is pointing at nothing.
    // the anchor's rect is only observed while the layer is visible, so the first reading after opening can still
    // be the stale one from last time — hence the latch: the anchor has to have been seen before it can be gone
    let hasSeenAnchor = false;

    createEffect(() => {
        if (!access(props.isOpen) || access(props.isPinned) !== true) {
            hasSeenAnchor = false;

            return;
        }

        if (getIsAnchorOnScreen()) {
            hasSeenAnchor = true;

            return;
        }

        if (!hasSeenAnchor) return;

        props.onDismiss?.("anchorGone");
    });

    DismisserStack.createLayer(() => access(props.isOpen), {
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
                        if (access(props.role) === "dialog") return;

                        e.preventDefault();
                    }}
                >
                    {props.renderContent(getTransitionTarget, getTransitionDurationMs, getPlacement)}
                </div>
            </Portal>
        </Show>
    );
};
