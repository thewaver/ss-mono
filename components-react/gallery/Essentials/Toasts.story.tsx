import { useRef, useState } from "react";

import type { Toast, ToastsAlignment, ToastsOverflow } from "@thewaver/ss-components";

import { Toasts } from "../../src";
import { ScreenLayer } from "./ModalFixtures";

type ToastKind = "info" | "success" | "error";

const DURATION_MS = 4_000;
const LIMIT = 3;
const BURST_SIZE = 5;

const MESSAGES: Record<ToastKind, string> = {
    info: "Your export is being prepared.",
    success: "Settings saved.",
    error: "Upload failed — the file was larger than 25 MB.",
};

type DefaultProps = {
    overflow?: ToastsOverflow;
    alignment?: ToastsAlignment;
    isAnnounced?: boolean;
    isDismissableOnSwipe?: boolean;
};

export const Default = ({ overflow, alignment, isAnnounced = true, isDismissableOnSwipe }: DefaultProps) => {
    const toastsState = useState<Toast<ToastKind>[]>([]);
    const [toasts, setToasts] = toastsState;
    const [boundaries, setBoundaries] = useState({ shown: 0, hidden: 0 });
    const nextIdRef = useRef(0);

    const create = (kind: ToastKind): Toast<ToastKind> => {
        nextIdRef.current += 1;

        return {
            id: `toast-${nextIdRef.current}`,
            value: kind,
            durationMs: DURATION_MS,
            ariaLive: kind === "error" ? "assertive" : "polite",
            onShow: () => setBoundaries((previous) => ({ ...previous, shown: previous.shown + 1 })),
            onHide: () => setBoundaries((previous) => ({ ...previous, hidden: previous.hidden + 1 })),
        };
    };

    const raise = (kind: ToastKind) => setToasts([...toasts, create(kind)]);

    return (
        <ScreenLayer>
            <div style={{ position: "relative", zIndex: 20 }}>
                <button type="button" id="raiseInfo" onClick={() => raise("info")}>
                    Info
                </button>
                <button type="button" id="raiseSuccess" onClick={() => raise("success")}>
                    Success
                </button>
                <button type="button" id="raiseError" onClick={() => raise("error")}>
                    Error
                </button>
                <button
                    type="button"
                    id="raiseBurst"
                    onClick={() => setToasts([...toasts, ...Array.from({ length: BURST_SIZE }, () => create("info"))])}
                >
                    Burst
                </button>
                <button type="button" id="clearToasts" onClick={() => setToasts([])}>
                    Clear
                </button>
                <output data-readout="queue">
                    {`queued: ${toasts.length}, shown: ${boundaries.shown}, hidden: ${boundaries.hidden}`}
                </output>
            </div>
            <Toasts
                toastsState={toastsState}
                ariaLabel={"Notifications"}
                computeAnnouncement={isAnnounced ? (toast) => MESSAGES[toast.value] : undefined}
                alignment={alignment}
                limit={LIMIT}
                overflow={overflow}
                isDismissableOnSwipe={isDismissableOnSwipe}
                renderToast={(toast, visibilityTarget, durationMs, state) => (
                    <div
                        data-index={state.index}
                        data-swipe={state.swipeDirection ?? "none"}
                        style={{
                            width: 280,
                            padding: 12,
                            background: "white",
                            border: "1px solid black",
                            opacity: visibilityTarget,
                            transition: `opacity ${durationMs}ms`,
                        }}
                    >
                        <span>{MESSAGES[toast.value]}</span>
                        <button
                            type="button"
                            onClick={() => setToasts(toasts.filter((entry) => entry.id !== toast.id))}
                        >
                            Close
                        </button>
                        {toast.durationMs !== undefined && (
                            <div
                                data-countdown
                                style={{
                                    height: 2,
                                    background: "black",
                                    animationDuration: `${toast.durationMs}ms`,
                                    animationPlayState: state.isPaused ? "paused" : "running",
                                }}
                            />
                        )}
                    </div>
                )}
            />
        </ScreenLayer>
    );
};
