<script module lang="ts">
    import type { Toast } from "@thewaver/ss-components-svelte";
    import { StoreUtils } from "@thewaver/ss-utils";

    import type { ToastDefs, ToastKind } from "../../StyledComponents/ToastContent/ToastContent.types";

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
</script>

<script lang="ts">
    import {
        Button,
        TOASTS_ALIGNMENTS,
        TOASTS_DEFAULTS,
        TOASTS_DIRS,
        TOASTS_OVERFLOWS,
        Toasts,
        readStore,
    } from "@thewaver/ss-components-svelte";
    import type { ToastsAlignment, ToastsDir, ToastsOverflow } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/ToastsPage/ToastsPage.css";

    import { ToastKnobs } from "../../Knobs/Toasts.const";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageSelectField from "../../PageComponents/Field/PageSelectField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.svelte";
    import PageButtonContent from "../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import PageToastContent from "../../StyledComponents/ToastContent/ToastContent.svelte";
    import type { ToastAnimation, ToastStacking } from "../../StyledComponents/ToastContent/ToastContent.types";

    let alignment = $state<ToastsAlignment>(TOASTS_DEFAULTS.alignment);
    let dir = $state<ToastsDir>(TOASTS_DEFAULTS.dir);
    let overflow = $state<ToastsOverflow>(TOASTS_DEFAULTS.overflow);
    let animation = $state<ToastAnimation>(ToastKnobs.STARTING_ANIMATION);
    let stacking = $state<ToastStacking>(ToastKnobs.STARTING_STACKING);
    let limit = $state(ToastKnobs.STARTING_LIMIT);
    let durationMs = $state(ToastKnobs.STARTING_DURATION_MS);
    let gap = $state(TOASTS_DEFAULTS.gap);
    let margin = $state(ToastKnobs.STARTING_MARGIN);
    let transitionDurationMs = $state(TOASTS_DEFAULTS.transitionDurationMs);

    const getToasts = readStore(toastQueue);
    const getBoundaries = readStore(toastBoundaries);

    const setToasts = (next: Toast<ToastDefs>[]) => {
        toastQueue.set(next);
    };
</script>

<div class={styles.root}>
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
                onChange={(value) => {
                    alignment = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"dir"}
            label={"Dir"}
            hint={"Which way the stack grows from there, and so whether a new toast joins at the top or the bottom."}
        >
            <PageSelectField
                value={dir}
                values={TOASTS_DIRS}
                ariaLabel={"Dir"}
                onChange={(value) => {
                    dir = value;
                }}
            />
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
                onChange={(value) => {
                    limit = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"overflow"}
            label={"Overflow"}
            hint={"What happens when the limit is reached: the oldest toast is dismissed, or the newest waits its turn."}
        >
            <PageSelectField
                value={overflow}
                values={TOASTS_OVERFLOWS}
                ariaLabel={"Overflow"}
                onChange={(value) => {
                    overflow = value;
                }}
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
                onChange={(value) => {
                    durationMs = value;
                }}
            />
        </PageProp>

        <PageProp itemKey={"animation"} label={"Animation"} hint={"How a toast arrives and leaves."}>
            <PageSelectField
                value={animation}
                values={ToastKnobs.ANIMATIONS}
                ariaLabel={"Animation"}
                onChange={(value) => {
                    animation = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"stacking"}
            label={"Stacking"}
            hint={"Whether the toasts sit in a row of their own, or pile up on each other with only the top one fully shown."}
        >
            <PageSelectField
                value={stacking}
                values={ToastKnobs.STACKINGS}
                ariaLabel={"Stacking"}
                onChange={(value) => {
                    stacking = value;
                }}
            />
        </PageProp>

        <PageProp itemKey={"gap"} label={"Gap (px)"} hint={"The space between one toast and the next."}>
            <PageNumberField
                value={gap}
                min={ToastKnobs.MIN_GAP}
                max={ToastKnobs.MAX_GAP}
                ariaLabel={"Gap in pixels"}
                onInput={(value) => {
                    gap = value;
                }}
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
                onInput={(value) => {
                    margin = value;
                }}
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
                onInput={(value) => {
                    transitionDurationMs = value;
                }}
            />
        </PageProp>
    </PagePropsPanel>

    <div class={styles.raiseRow}>
        <Button id={"raiseInfo"} onClick={() => raiseToast("info", durationMs)}>
            {#snippet renderContent(flags)}
                <PageButtonContent {flags}>Info</PageButtonContent>
            {/snippet}
        </Button>
        <Button id={"raiseSuccess"} onClick={() => raiseToast("success", durationMs)}>
            {#snippet renderContent(flags)}
                <PageButtonContent {flags}>Success</PageButtonContent>
            {/snippet}
        </Button>
        <Button id={"raiseError"} onClick={() => raiseToast("error", durationMs)}>
            {#snippet renderContent(flags)}
                <PageButtonContent {flags}>Error</PageButtonContent>
            {/snippet}
        </Button>
        <Button
            id={"raiseBurst"}
            onClick={() => {
                for (let index = 0; index < BURST_SIZE; index += 1) raiseToast("info", durationMs);
            }}
        >
            {#snippet renderContent(flags)}
                <PageButtonContent {flags}>Raise {BURST_SIZE}</PageButtonContent>
            {/snippet}
        </Button>
        <Button
            id={"clearToasts"}
            onClick={() => {
                setToasts([]);
            }}
        >
            {#snippet renderContent(flags)}
                <PageButtonContent {flags}>Clear</PageButtonContent>
            {/snippet}
        </Button>
    </div>

    <div class={styles.note} data-readout="">
        queued: {getToasts().length}, shown: {getBoundaries().shown}, hidden: {getBoundaries().hidden} — the queue lives
        at module scope, so raising a notification does not need the raiser to still be mounted. Hover the stack to hold
        every countdown, or press F8 to put the keyboard in it. A toast against the left or right edge, or centered
        along the top or bottom, can be swiped off that edge; Close is the route for anyone who cannot drag.
    </div>

    <Toasts
        bind:toasts={getToasts, setToasts}
        ariaLabel={"Notifications"}
        computeAnnouncement={(toast) => toast.value.message}
        {alignment}
        {dir}
        limit={limit === NO_LIMIT ? undefined : limit}
        {overflow}
        {gap}
        margins={{
            marginTop: margin,
            marginRight: margin,
            marginBottom: margin,
            marginLeft: margin,
        }}
        {transitionDurationMs}
    >
        {#snippet renderToast(toast, visibilityTarget, toastTransitionDurationMs, state)}
            <PageToastContent
                {toast}
                {state}
                {animation}
                {stacking}
                {dir}
                {gap}
                {visibilityTarget}
                transitionDurationMs={toastTransitionDurationMs}
                onDismiss={() => toastQueue.update((prev) => prev.filter((entry) => entry.id !== toast.id))}
            />
        {/snippet}
    </Toasts>
</div>
