import { createRoot, createSignal, createUniqueId } from "solid-js";

import {
    Button,
    TOASTS_ALIGNMENTS,
    TOASTS_DEFAULTS,
    TOASTS_DIRS,
    TOASTS_OVERFLOWS,
    Toasts,
} from "@thewaver/ss-components";
import type { Toast, ToastsAlignment, ToastsDir, ToastsOverflow } from "@thewaver/ss-components";

import { ToastKnobs } from "../../Knobs/Toasts.const";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { PageButtonContent } from "../../StyledComponents/ButtonContent/ButtonContent";
import { PageNumberField, PageSelectField } from "../../StyledComponents/Field/Field";
import { PageToastContent } from "../../StyledComponents/ToastContent/ToastContent";
import type {
    ToastAnimation,
    ToastDefs,
    ToastKind,
    ToastStacking,
} from "../../StyledComponents/ToastContent/ToastContent.types";

import * as styles from "./ToastsPage.css";

const NO_LIMIT = 0;
const STICKY = 0;

const BURST_SIZE = 5;

const MESSAGES: Record<ToastKind, string> = {
    info: "Your export is being prepared.",
    success: "Settings saved.",
    error: "Upload failed — the file was larger than 25 MB.",
};

const toastQueue = createRoot(() => createSignal<Toast<ToastDefs>[]>([]));
const toastBoundaries = createRoot(() => createSignal({ shown: 0, hidden: 0 }));

const raiseToast = (kind: ToastKind, durationMs: number) => {
    toastQueue[1]((prev) => [
        ...prev,
        {
            id: createUniqueId(),
            value: { kind, message: MESSAGES[kind] },
            durationMs: durationMs === STICKY ? undefined : durationMs,
            ariaLive: kind === "error" ? "assertive" : "polite",
            onShow: () => toastBoundaries[1]((prev) => ({ ...prev, shown: prev.shown + 1 })),
            onHide: () => toastBoundaries[1]((prev) => ({ ...prev, hidden: prev.hidden + 1 })),
        },
    ]);
};

export const ToastsPage = () => {
    const [getAlignment, setAlignment] = createSignal<ToastsAlignment>(TOASTS_DEFAULTS.alignment);
    const [getDir, setDir] = createSignal<ToastsDir>(TOASTS_DEFAULTS.dir);
    const [getOverflow, setOverflow] = createSignal<ToastsOverflow>(TOASTS_DEFAULTS.overflow);
    const [getAnimation, setAnimation] = createSignal<ToastAnimation>(ToastKnobs.STARTING_ANIMATION);
    const [getStacking, setStacking] = createSignal<ToastStacking>(ToastKnobs.STARTING_STACKING);
    const [getLimit, setLimit] = createSignal(ToastKnobs.STARTING_LIMIT);
    const [getDurationMs, setDurationMs] = createSignal(ToastKnobs.STARTING_DURATION_MS);
    const [getGap, setGap] = createSignal(TOASTS_DEFAULTS.gap);
    const [getMargin, setMargin] = createSignal(ToastKnobs.STARTING_MARGIN);
    const [getTransitionDurationMs, setTransitionDurationMs] = createSignal(TOASTS_DEFAULTS.transitionDurationMs);

    const [getToasts, setToasts] = toastQueue;
    const [getBoundaries] = toastBoundaries;

    return (
        <div class={styles.root}>
            <PagePropsPanel scope={"global"}>
                <PageProp
                    key={"alignment"}
                    label={"Alignment"}
                    hint={"Which corner or edge of the screen the toasts gather at."}
                >
                    <PageSelectField
                        value={getAlignment}
                        values={() => TOASTS_ALIGNMENTS}
                        ariaLabel={"Alignment"}
                        onChange={(alignment) => setAlignment(() => alignment)}
                    />
                </PageProp>

                <PageProp
                    key={"dir"}
                    label={"Dir"}
                    hint={
                        "Which way the stack grows from there, and so whether a new toast joins at the top or the bottom."
                    }
                >
                    <PageSelectField
                        value={getDir}
                        values={() => TOASTS_DIRS}
                        ariaLabel={"Dir"}
                        onChange={(dir) => setDir(() => dir)}
                    />
                </PageProp>

                <PageProp
                    key={"limit"}
                    label={"Limit"}
                    hint={"How many toasts may be on screen at once. Choose none and they all show."}
                >
                    <PageSelectField
                        value={getLimit}
                        values={() => ToastKnobs.LIMITS}
                        ariaLabel={"Limit"}
                        computeLabel={(limit) => (limit === NO_LIMIT ? "none" : `${limit}`)}
                        onChange={setLimit}
                    />
                </PageProp>

                <PageProp
                    key={"overflow"}
                    label={"Overflow"}
                    hint={
                        "What happens when the limit is reached: the oldest toast is dismissed, or the newest waits its turn."
                    }
                >
                    <PageSelectField
                        value={getOverflow}
                        values={() => TOASTS_OVERFLOWS}
                        ariaLabel={"Overflow"}
                        onChange={(overflow) => setOverflow(() => overflow)}
                    />
                </PageProp>

                <PageProp
                    key={"durationMs"}
                    label={"Duration"}
                    hint={"How long a toast stays before it dismisses itself. Sticky ones wait to be closed."}
                >
                    <PageSelectField
                        value={getDurationMs}
                        values={() => ToastKnobs.DURATIONS_MS}
                        ariaLabel={"Duration"}
                        computeLabel={(durationMs) => (durationMs === STICKY ? "sticky" : `${durationMs}ms`)}
                        onChange={setDurationMs}
                    />
                </PageProp>

                <PageProp key={"animation"} label={"Animation"} hint={"How a toast arrives and leaves."}>
                    <PageSelectField
                        value={getAnimation}
                        values={() => ToastKnobs.ANIMATIONS}
                        ariaLabel={"Animation"}
                        onChange={(animation) => setAnimation(() => animation)}
                    />
                </PageProp>

                <PageProp
                    key={"stacking"}
                    label={"Stacking"}
                    hint={
                        "Whether the toasts sit in a row of their own, or pile up on each other with only the top one fully shown."
                    }
                >
                    <PageSelectField
                        value={getStacking}
                        values={() => ToastKnobs.STACKINGS}
                        ariaLabel={"Stacking"}
                        onChange={(stacking) => setStacking(() => stacking)}
                    />
                </PageProp>

                <PageProp key={"gap"} label={"Gap (px)"} hint={"The space between one toast and the next."}>
                    <PageNumberField
                        value={getGap}
                        min={() => ToastKnobs.MIN_GAP}
                        max={() => ToastKnobs.MAX_GAP}
                        ariaLabel={"Gap in pixels"}
                        onInput={setGap}
                    />
                </PageProp>

                <PageProp
                    key={"margin"}
                    label={"Margin (px)"}
                    hint={"How far the stack is held off the edge of the screen."}
                >
                    <PageNumberField
                        value={getMargin}
                        min={() => ToastKnobs.MIN_MARGIN}
                        max={() => ToastKnobs.MAX_MARGIN}
                        ariaLabel={"Margin in pixels"}
                        onInput={setMargin}
                    />
                </PageProp>

                <PageProp
                    key={"transitionDurationMs"}
                    label={"Transition duration (ms)"}
                    hint={"How long a toast takes to arrive, to leave, and to slide when the stack shifts."}
                >
                    <PageNumberField
                        value={getTransitionDurationMs}
                        min={() => ToastKnobs.MIN_TRANSITION_DURATION_MS}
                        max={() => ToastKnobs.MAX_TRANSITION_DURATION_MS}
                        step={() => ToastKnobs.TRANSITION_DURATION_STEP_MS}
                        ariaLabel={"Transition duration"}
                        onInput={setTransitionDurationMs}
                    />
                </PageProp>
            </PagePropsPanel>

            <div class={styles.raiseRow}>
                <Button
                    id={"raiseInfo"}
                    renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Info</PageButtonContent>}
                    onClick={() => raiseToast("info", getDurationMs())}
                />
                <Button
                    id={"raiseSuccess"}
                    renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Success</PageButtonContent>}
                    onClick={() => raiseToast("success", getDurationMs())}
                />
                <Button
                    id={"raiseError"}
                    renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Error</PageButtonContent>}
                    onClick={() => raiseToast("error", getDurationMs())}
                />
                <Button
                    id={"raiseBurst"}
                    renderContent={(getFlags) => (
                        <PageButtonContent flags={getFlags}>Raise {BURST_SIZE}</PageButtonContent>
                    )}
                    onClick={() => {
                        for (let index = 0; index < BURST_SIZE; index += 1) raiseToast("info", getDurationMs());
                    }}
                />
                <Button
                    id={"clearToasts"}
                    renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Clear</PageButtonContent>}
                    onClick={() => {
                        setToasts([]);
                    }}
                />
            </div>

            <div class={styles.note} data-readout>
                queued: {getToasts().length}, shown: {getBoundaries().shown}, hidden: {getBoundaries().hidden} — the
                queue lives at module scope, so raising a notification does not need the raiser to still be mounted.
                Hover the stack to hold every countdown, or press F8 to put the keyboard in it. A toast against the left
                or right edge, or centered along the top or bottom, can be swiped off that edge; Close is the route for
                anyone who cannot drag.
            </div>

            <Toasts
                toastsSignal={toastQueue}
                ariaLabel={"Notifications"}
                computeAnnouncement={(toast) => toast.value.message}
                alignment={getAlignment}
                dir={getDir}
                limit={() => (getLimit() === NO_LIMIT ? undefined : getLimit())}
                overflow={getOverflow}
                gap={getGap}
                margins={() => ({
                    marginTop: getMargin(),
                    marginRight: getMargin(),
                    marginBottom: getMargin(),
                    marginLeft: getMargin(),
                })}
                transitionDurationMs={getTransitionDurationMs}
                renderToast={(getToast, getVisibilityTarget, getToastTransitionDurationMs, getState) => (
                    <PageToastContent
                        toast={getToast}
                        state={getState}
                        animation={getAnimation}
                        stacking={getStacking}
                        dir={getDir}
                        gap={getGap}
                        visibilityTarget={getVisibilityTarget}
                        transitionDurationMs={getToastTransitionDurationMs}
                        onDismiss={() => setToasts((prev) => prev.filter((toast) => toast.id !== getToast().id))}
                    />
                )}
            />
        </div>
    );
};
