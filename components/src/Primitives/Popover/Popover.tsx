import { Show, createEffect, createMemo, createSignal } from "solid-js";
import { Portal } from "solid-js/web";

import type { AnchorPlacement } from "../../Abstracts/Anchor/Anchor.types";
import { AnchorUtils } from "../../Abstracts/Anchor/Anchor.utils";
import { DismisserUtils } from "../../Abstracts/Dismisser/Dismisser.utils";
import { ElementFaderUtils } from "../../Abstracts/ElementFader/ElementFader.utils";
import { FocusManagerUtils } from "../../Abstracts/FocusManager/FocusManager.utils";
import { useViewportContext } from "../../Abstracts/Viewport/Viewport.context";
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

    const { getIsVisible, getTransitionTarget, getHasTransitionFinished } = ElementFaderUtils.createFader(
        () => access(props.isOpen),
        {
            getTransitionDurationMs,
        },
    );

    const { getAnchorRect, getIsAnchorOnScreen, getPlacement, getPosition, getZIndex, setContentRef } =
        AnchorUtils.createPortalPosition(() => access(props.anchorRef), getIsVisible, {
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

    FocusManagerUtils.autoFocus(getRootRef, getHasFocus, { getInitialRef: getRootRef });

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

    DismisserUtils.createLayer(() => access(props.isOpen), {
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
