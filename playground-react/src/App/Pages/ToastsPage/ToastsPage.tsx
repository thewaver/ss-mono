import { useState } from "react";

import {
    Button,
    TOASTS_ALIGNMENTS,
    TOASTS_DEFAULTS,
    TOASTS_DIRS,
    TOASTS_OVERFLOWS,
    Toasts,
    useStore,
} from "@thewaver/ss-components-react";
import type { Toast, ToastsAlignment, ToastsDir, ToastsOverflow } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/Pages/ToastsPage/ToastsPage.css";
import { StoreUtils } from "@thewaver/ss-utils";

import { ToastKnobs } from "../../Knobs/Toasts.const";
import { PageNumberField, PageSelectField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { PageButtonContent } from "../../StyledComponents/ButtonContent/ButtonContent";
import { PageToastContent } from "../../StyledComponents/ToastContent/ToastContent";
import type {
    ToastAnimation,
    ToastDefs,
    ToastKind,
    ToastStacking,
} from "../../StyledComponents/ToastContent/ToastContent.types";

const NO_LIMIT = 0;
const STICKY = 0;

const BURST_SIZE = 5;

const MESSAGES: Record<ToastKind, string> = {
    info: "Your export is being prepared.",
    success: "Settings saved.",
    error: "Upload failed — the file was larger than 25 MB.",
};

const TOAST_ID_PREFIX = "toast";

const toastQueue = StoreUtils.create<Toast<ToastDefs>[]>([]);
const toastBoundaries = StoreUtils.create({ shown: 0, hidden: 0 });

let toastCount = 0;

const raiseToast = (kind: ToastKind, durationMs: number) => {
    toastCount += 1;

    const id = `${TOAST_ID_PREFIX}${toastCount}`;

    toastQueue.update((prev) => [
        ...prev,
        {
            id,
            value: { kind, message: MESSAGES[kind] },
            durationMs: durationMs === STICKY ? undefined : durationMs,
            ariaLive: kind === "error" ? "assertive" : "polite",
            onShow: () => toastBoundaries.update((prev) => ({ ...prev, shown: prev.shown + 1 })),
            onHide: () => toastBoundaries.update((prev) => ({ ...prev, hidden: prev.hidden + 1 })),
        },
    ]);
};

export const ToastsPage = () => {
    const [alignment, setAlignment] = useState<ToastsAlignment>(TOASTS_DEFAULTS.alignment);
    const [dir, setDir] = useState<ToastsDir>(TOASTS_DEFAULTS.dir);
    const [overflow, setOverflow] = useState<ToastsOverflow>(TOASTS_DEFAULTS.overflow);
    const [animation, setAnimation] = useState<ToastAnimation>(ToastKnobs.STARTING_ANIMATION);
    const [stacking, setStacking] = useState<ToastStacking>(ToastKnobs.STARTING_STACKING);
    const [limit, setLimit] = useState(ToastKnobs.STARTING_LIMIT);
    const [durationMs, setDurationMs] = useState(ToastKnobs.STARTING_DURATION_MS);
    const [gap, setGap] = useState(TOASTS_DEFAULTS.gap);
    const [margin, setMargin] = useState(ToastKnobs.STARTING_MARGIN);
    const [transitionDurationMs, setTransitionDurationMs] = useState(TOASTS_DEFAULTS.transitionDurationMs);

    const toasts = useStore(toastQueue);
    const boundaries = useStore(toastBoundaries);

    const setToasts = (next: Toast<ToastDefs>[]) => {
        toastQueue.set(next);
    };

    return (
        <div className={styles.root}>
            <PagePropsPanel scope={"global"}>
                <PageProp
                    itemKey={"alignment"}
                    label={"Alignment"}
                    hint={"Which corner or edge of the screen the toasts gather at."}
                >
                    <PageSelectField
                        value={alignment}
                        values={TOASTS_ALIGNMENTS}
                        ariaLabel={"Alignment"}
                        onChange={setAlignment}
                    />
                </PageProp>

                <PageProp
                    itemKey={"dir"}
                    label={"Dir"}
                    hint={
                        "Which way the stack grows from there, and so whether a new toast joins at the top or the bottom."
                    }
                >
                    <PageSelectField value={dir} values={TOASTS_DIRS} ariaLabel={"Dir"} onChange={setDir} />
                </PageProp>

                <PageProp
                    itemKey={"limit"}
                    label={"Limit"}
                    hint={"How many toasts may be on screen at once. Choose none and they all show."}
                >
                    <PageSelectField
                        value={limit}
                        values={ToastKnobs.LIMITS}
                        ariaLabel={"Limit"}
                        computeLabel={(limit) => (limit === NO_LIMIT ? "none" : `${limit}`)}
                        onChange={setLimit}
                    />
                </PageProp>

                <PageProp
                    itemKey={"overflow"}
                    label={"Overflow"}
                    hint={
                        "What happens when the limit is reached: the oldest toast is dismissed, or the newest waits its turn."
                    }
                >
                    <PageSelectField
                        value={overflow}
                        values={TOASTS_OVERFLOWS}
                        ariaLabel={"Overflow"}
                        onChange={setOverflow}
                    />
                </PageProp>

                <PageProp
                    itemKey={"durationMs"}
                    label={"Duration"}
                    hint={"How long a toast stays before it dismisses itself. Sticky ones wait to be closed."}
                >
                    <PageSelectField
                        value={durationMs}
                        values={ToastKnobs.DURATIONS_MS}
                        ariaLabel={"Duration"}
                        computeLabel={(durationMs) => (durationMs === STICKY ? "sticky" : `${durationMs}ms`)}
                        onChange={setDurationMs}
                    />
                </PageProp>

                <PageProp itemKey={"animation"} label={"Animation"} hint={"How a toast arrives and leaves."}>
                    <PageSelectField
                        value={animation}
                        values={ToastKnobs.ANIMATIONS}
                        ariaLabel={"Animation"}
                        onChange={setAnimation}
                    />
                </PageProp>

                <PageProp
                    itemKey={"stacking"}
                    label={"Stacking"}
                    hint={
                        "Whether the toasts sit in a row of their own, or pile up on each other with only the top one fully shown."
                    }
                >
                    <PageSelectField
                        value={stacking}
                        values={ToastKnobs.STACKINGS}
                        ariaLabel={"Stacking"}
                        onChange={setStacking}
                    />
                </PageProp>

                <PageProp itemKey={"gap"} label={"Gap (px)"} hint={"The space between one toast and the next."}>
                    <PageNumberField
                        value={gap}
                        min={ToastKnobs.MIN_GAP}
                        max={ToastKnobs.MAX_GAP}
                        ariaLabel={"Gap in pixels"}
                        onInput={setGap}
                    />
                </PageProp>

                <PageProp
                    itemKey={"margin"}
                    label={"Margin (px)"}
                    hint={"How far the stack is held off the edge of the screen."}
                >
                    <PageNumberField
                        value={margin}
                        min={ToastKnobs.MIN_MARGIN}
                        max={ToastKnobs.MAX_MARGIN}
                        ariaLabel={"Margin in pixels"}
                        onInput={setMargin}
                    />
                </PageProp>

                <PageProp
                    itemKey={"transitionDurationMs"}
                    label={"Transition duration (ms)"}
                    hint={"How long a toast takes to arrive, to leave, and to slide when the stack shifts."}
                >
                    <PageNumberField
                        value={transitionDurationMs}
                        min={ToastKnobs.MIN_TRANSITION_DURATION_MS}
                        max={ToastKnobs.MAX_TRANSITION_DURATION_MS}
                        step={ToastKnobs.TRANSITION_DURATION_STEP_MS}
                        ariaLabel={"Transition duration"}
                        onInput={setTransitionDurationMs}
                    />
                </PageProp>
            </PagePropsPanel>

            <div className={styles.raiseRow}>
                <Button
                    id={"raiseInfo"}
                    renderContent={(flags) => <PageButtonContent flags={flags}>Info</PageButtonContent>}
                    onClick={() => raiseToast("info", durationMs)}
                />
                <Button
                    id={"raiseSuccess"}
                    renderContent={(flags) => <PageButtonContent flags={flags}>Success</PageButtonContent>}
                    onClick={() => raiseToast("success", durationMs)}
                />
                <Button
                    id={"raiseError"}
                    renderContent={(flags) => <PageButtonContent flags={flags}>Error</PageButtonContent>}
                    onClick={() => raiseToast("error", durationMs)}
                />
                <Button
                    id={"raiseBurst"}
                    renderContent={(flags) => <PageButtonContent flags={flags}>Raise {BURST_SIZE}</PageButtonContent>}
                    onClick={() => {
                        for (let index = 0; index < BURST_SIZE; index += 1) raiseToast("info", durationMs);
                    }}
                />
                <Button
                    id={"clearToasts"}
                    renderContent={(flags) => <PageButtonContent flags={flags}>Clear</PageButtonContent>}
                    onClick={() => {
                        setToasts([]);
                    }}
                />
            </div>

            <div className={styles.note} data-readout="">
                queued: {toasts.length}, shown: {boundaries.shown}, hidden: {boundaries.hidden} — the queue lives at
                module scope, so raising a notification does not need the raiser to still be mounted. Hover the stack to
                hold every countdown, or press F8 to put the keyboard in it. A toast against the left or right edge, or
                centered along the top or bottom, can be swiped off that edge; Close is the route for anyone who cannot
                drag.
            </div>

            <Toasts
                toastsState={[toasts, setToasts]}
                ariaLabel={"Notifications"}
                computeAnnouncement={(toast) => toast.value.message}
                alignment={alignment}
                dir={dir}
                limit={limit === NO_LIMIT ? undefined : limit}
                overflow={overflow}
                gap={gap}
                margins={{
                    marginTop: margin,
                    marginRight: margin,
                    marginBottom: margin,
                    marginLeft: margin,
                }}
                transitionDurationMs={transitionDurationMs}
                renderToast={(toast, visibilityTarget, toastTransitionDurationMs, state) => (
                    <PageToastContent
                        toast={toast}
                        state={state}
                        animation={animation}
                        stacking={stacking}
                        dir={dir}
                        gap={gap}
                        visibilityTarget={visibilityTarget}
                        transitionDurationMs={toastTransitionDurationMs}
                        onDismiss={() => toastQueue.update((prev) => prev.filter((entry) => entry.id !== toast.id))}
                    />
                )}
            />
        </div>
    );
};
