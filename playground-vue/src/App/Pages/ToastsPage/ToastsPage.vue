<script setup lang="ts">
import { shallowRef } from "vue";

import {
    Button,
    TOASTS_ALIGNMENTS,
    TOASTS_DEFAULTS,
    TOASTS_DIRS,
    TOASTS_OVERFLOWS,
    Toasts,
    useStore,
} from "@thewaver/ss-components-vue";
import type { Toast, ToastsAlignment, ToastsDir, ToastsOverflow } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/ToastsPage/ToastsPage.css";
import { StoreUtils } from "@thewaver/ss-utils";

import { ToastKnobs } from "../../Knobs/Toasts.const";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageSelectField from "../../PageComponents/Field/PageSelectField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.vue";
import PageButtonContent from "../../StyledComponents/ButtonContent/ButtonContent.vue";
import PageToastContent from "../../StyledComponents/ToastContent/ToastContent.vue";
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

const alignment = shallowRef<ToastsAlignment>(TOASTS_DEFAULTS.alignment);
const dir = shallowRef<ToastsDir>(TOASTS_DEFAULTS.dir);
const overflow = shallowRef<ToastsOverflow>(TOASTS_DEFAULTS.overflow);
const animation = shallowRef<ToastAnimation>(ToastKnobs.STARTING_ANIMATION);
const stacking = shallowRef<ToastStacking>(ToastKnobs.STARTING_STACKING);
const limit = shallowRef(ToastKnobs.STARTING_LIMIT);
const durationMs = shallowRef(ToastKnobs.STARTING_DURATION_MS);
const gap = shallowRef(TOASTS_DEFAULTS.gap);
const margin = shallowRef(ToastKnobs.STARTING_MARGIN);
const transitionDurationMs = shallowRef(TOASTS_DEFAULTS.transitionDurationMs);

const toasts = useStore(toastQueue);
const boundaries = useStore(toastBoundaries);

const setToasts = (next: Toast<ToastDefs>[]) => {
    toastQueue.set(next);
};

const computeLimitLabel = (value: number) => (value === NO_LIMIT ? "none" : `${value}`);

const computeDurationLabel = (value: number) => (value === STICKY ? "sticky" : `${value}ms`);

const computeAnnouncement = (toast: Toast<ToastDefs>) => toast.value.message;

const raiseBurst = () => {
    for (let index = 0; index < BURST_SIZE; index += 1) raiseToast("info", durationMs.value);
};

const clearToasts = () => {
    setToasts([]);
};

const dismissToast = (id: string) => {
    toastQueue.update((prev) => prev.filter((entry) => entry.id !== id));
};
</script>

<template>
    <div :class="styles.root">
        <PagePropsPanel scope="global">
            <PageProp item-key="alignment" label="Alignment" hint="Which corner or edge of the screen the toasts gather at.">
                <PageSelectField
                    :value="alignment"
                    :values="TOASTS_ALIGNMENTS"
                    ariaLabel="Alignment"
                    @change="(value: ToastsAlignment) => (alignment = value)"
                />
            </PageProp>

            <PageProp
                item-key="dir"
                label="Dir"
                hint="Which way the stack grows from there, and so whether a new toast joins at the top or the bottom."
            >
                <PageSelectField
                    :value="dir"
                    :values="TOASTS_DIRS"
                    ariaLabel="Dir"
                    @change="(value: ToastsDir) => (dir = value)"
                />
            </PageProp>

            <PageProp
                item-key="limit"
                label="Limit"
                hint="How many toasts may be on screen at once. Choose none and they all show."
            >
                <PageSelectField
                    :value="limit"
                    :values="ToastKnobs.LIMITS"
                    ariaLabel="Limit"
                    :compute-label="computeLimitLabel"
                    @change="(value: number) => (limit = value)"
                />
            </PageProp>

            <PageProp
                item-key="overflow"
                label="Overflow"
                hint="What happens when the limit is reached: the oldest toast is dismissed, or the newest waits its turn."
            >
                <PageSelectField
                    :value="overflow"
                    :values="TOASTS_OVERFLOWS"
                    ariaLabel="Overflow"
                    @change="(value: ToastsOverflow) => (overflow = value)"
                />
            </PageProp>

            <PageProp
                item-key="durationMs"
                label="Duration"
                hint="How long a toast stays before it dismisses itself. Sticky ones wait to be closed."
            >
                <PageSelectField
                    :value="durationMs"
                    :values="ToastKnobs.DURATIONS_MS"
                    ariaLabel="Duration"
                    :compute-label="computeDurationLabel"
                    @change="(value: number) => (durationMs = value)"
                />
            </PageProp>

            <PageProp item-key="animation" label="Animation" hint="How a toast arrives and leaves.">
                <PageSelectField
                    :value="animation"
                    :values="ToastKnobs.ANIMATIONS"
                    ariaLabel="Animation"
                    @change="(value: ToastAnimation) => (animation = value)"
                />
            </PageProp>

            <PageProp
                item-key="stacking"
                label="Stacking"
                hint="Whether the toasts sit in a row of their own, or pile up on each other with only the top one fully shown."
            >
                <PageSelectField
                    :value="stacking"
                    :values="ToastKnobs.STACKINGS"
                    ariaLabel="Stacking"
                    @change="(value: ToastStacking) => (stacking = value)"
                />
            </PageProp>

            <PageProp item-key="gap" label="Gap (px)" hint="The space between one toast and the next.">
                <PageNumberField
                    :value="gap"
                    :min="ToastKnobs.MIN_GAP"
                    :max="ToastKnobs.MAX_GAP"
                    ariaLabel="Gap in pixels"
                    @input="(value: number) => (gap = value)"
                />
            </PageProp>

            <PageProp item-key="margin" label="Margin (px)" hint="How far the stack is held off the edge of the screen.">
                <PageNumberField
                    :value="margin"
                    :min="ToastKnobs.MIN_MARGIN"
                    :max="ToastKnobs.MAX_MARGIN"
                    ariaLabel="Margin in pixels"
                    @input="(value: number) => (margin = value)"
                />
            </PageProp>

            <PageProp
                item-key="transitionDurationMs"
                label="Transition duration (ms)"
                hint="How long a toast takes to arrive, to leave, and to slide when the stack shifts."
            >
                <PageNumberField
                    :value="transitionDurationMs"
                    :min="ToastKnobs.MIN_TRANSITION_DURATION_MS"
                    :max="ToastKnobs.MAX_TRANSITION_DURATION_MS"
                    :step="ToastKnobs.TRANSITION_DURATION_STEP_MS"
                    ariaLabel="Transition duration"
                    @input="(value: number) => (transitionDurationMs = value)"
                />
            </PageProp>
        </PagePropsPanel>

        <div :class="styles.raiseRow">
            <Button id="raiseInfo" @click="raiseToast('info', durationMs)">
                <template #renderContent="flags">
                    <PageButtonContent :flags="flags">Info</PageButtonContent>
                </template>
            </Button>
            <Button id="raiseSuccess" @click="raiseToast('success', durationMs)">
                <template #renderContent="flags">
                    <PageButtonContent :flags="flags">Success</PageButtonContent>
                </template>
            </Button>
            <Button id="raiseError" @click="raiseToast('error', durationMs)">
                <template #renderContent="flags">
                    <PageButtonContent :flags="flags">Error</PageButtonContent>
                </template>
            </Button>
            <Button id="raiseBurst" @click="raiseBurst">
                <template #renderContent="flags">
                    <PageButtonContent :flags="flags">Raise {{ BURST_SIZE }}</PageButtonContent>
                </template>
            </Button>
            <Button id="clearToasts" @click="clearToasts">
                <template #renderContent="flags">
                    <PageButtonContent :flags="flags">Clear</PageButtonContent>
                </template>
            </Button>
        </div>

        <div :class="styles.note" data-readout="">
            queued: {{ toasts.length }}, shown: {{ boundaries.shown }}, hidden: {{ boundaries.hidden }} — the queue lives
            at module scope, so raising a notification does not need the raiser to still be mounted. Hover the stack to
            hold every countdown, or press F8 to put the keyboard in it. A toast against the left or right edge, or
            centered along the top or bottom, can be swiped off that edge; Close is the route for anyone who cannot
            drag.
        </div>

        <Toasts
            :toasts="toasts"
            ariaLabel="Notifications"
            :compute-announcement="computeAnnouncement"
            :alignment="alignment"
            :dir="dir"
            :limit="limit === NO_LIMIT ? undefined : limit"
            :overflow="overflow"
            :gap="gap"
            :margins="{
                marginTop: margin,
                marginRight: margin,
                marginBottom: margin,
                marginLeft: margin,
            }"
            :transition-duration-ms="transitionDurationMs"
            @update:toasts="setToasts"
        >
            <template #renderToast="toastProps">
                <PageToastContent
                    :toast="toastProps.toast"
                    :state="toastProps.state"
                    :animation="animation"
                    :stacking="stacking"
                    :dir="dir"
                    :gap="gap"
                    :visibility-target="toastProps.visibilityTarget"
                    :transition-duration-ms="toastProps.transitionDurationMs"
                    @dismiss="dismissToast(toastProps.toast.id)"
                />
            </template>
        </Toasts>
    </div>
</template>
