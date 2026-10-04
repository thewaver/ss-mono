import type { JSX } from "solid-js";
import { Show, createEffect, createMemo, createSignal, on, onCleanup, onMount } from "solid-js";

import {
    FLIPBOOK_DEFAULTS,
    type FlipbookStep,
    type FlipbookStepRenderProps,
    FlipbookUtils,
    LiveAnnouncerUtils,
    type SpineSide,
    SpineUtils,
    FlipbookStyles as styles,
} from "@thewaver/ss-components";

import { InteractionTrackerSolidUtils } from "../../../Abstracts/InteractionTracker/InteractionTrackerSolid.utils";
import { SignalMirrorSolidUtils } from "../../../Abstracts/SignalMirror/SignalMirrorSolid.utils";
import { InteractionWrapper } from "../../../Primitives/InteractionWrapper/InteractionWrapper";
import { Spine } from "../../../Primitives/Spine/Spine";
import { access } from "../../../Utils/propUtils";
import { accessStore } from "../../../Utils/storeUtils";
import type { FlipbookControlProps, FlipbookControls, FlipbookProps } from "./FlipbookSolid.types";

const FIRST_SPREAD = 0;

const FlipbookControl = (props: FlipbookControlProps) => {
    const getIsDisabled = () => access(props.flags).isDisabled ?? false;

    return (
        <button
            ref={(element) => props.ref?.(element)}
            type="button"
            class={styles.flipbookControl}
            aria-label={access(props.ariaLabel)}
            aria-disabled={getIsDisabled() || undefined}
            onClick={() => {
                if (getIsDisabled()) return;

                props.onActivate();
            }}
        >
            {props.renderContent(() => access(props.flags))}
        </button>
    );
};

export const Flipbook = <T,>(props: FlipbookProps<T>) => {
    onMount(() => LiveAnnouncerUtils.reserve("polite"));

    const [getBookRef, setBookRef] = createSignal<HTMLElement>();

    const [getIndex, setIndex] = SignalMirrorSolidUtils.createOptional(() => props.index, FIRST_SPREAD);

    const getPages = createMemo(() => access(props.pages));

    const getPageCount = createMemo(() => getPages().length);

    const getCurrentIndex = createMemo(() => FlipbookUtils.clampSpread(getIndex(), getPageCount()));

    const getSpreadCount = createMemo(() => FlipbookUtils.getSpreadCount(getPageCount()));

    const getLeaves = createMemo(() =>
        Array.from({ length: FlipbookUtils.getLeafCount(getPageCount()) }, (_, leaf) => leaf),
    );

    const getIsDisabled = createMemo(() => access(props.isDisabled) ?? false);

    const getCommitRatio = createMemo(() => access(props.commitRatio) ?? FLIPBOOK_DEFAULTS.commitRatio);

    const getTransitionDurationMs = createMemo(
        () => access(props.transitionDurationMs) ?? FLIPBOOK_DEFAULTS.transitionDurationMs,
    );

    const book = FlipbookUtils.createBook({
        getPageCount,
        getIndex,
        setIndex: (index) => setIndex(index),
        getIsDisabled,
        getTransitionDurationMs,
    });

    onCleanup(() => book.stop());

    const getPosition = accessStore(book.position);

    const getIsDragDisabled = () =>
        FlipbookUtils.getIsDragDisabled(props.renderControls !== undefined, getIsDisabled(), getPageCount());

    InteractionTrackerSolidUtils.trackAxialSwipe(getBookRef, getIsDragDisabled, {
        getAxis: () => "horizontal",
        getCommitRatio,
        onSwipe: book.push,
        onSwipeEnd: book.release,
    });

    createEffect(on(getCurrentIndex, (index) => book.glideTo(index), { defer: true }));

    createEffect<number | undefined>((previous) => {
        const index = getCurrentIndex();
        const pageCount = getPageCount();

        if (FlipbookUtils.getIsAnnounced(previous, index)) {
            LiveAnnouncerUtils.announce(
                props.computeSpreadAnnouncement(FlipbookUtils.getShowingPages(index, pageCount), pageCount),
            );
        }

        return index;
    });

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.target !== e.currentTarget) return;

        const step = FlipbookUtils.getKeyStep(e.key);

        if (step === undefined || !book.turn(step)) return;

        e.preventDefault();
    };

    const renderStepControl = (step: FlipbookStep): JSX.Element => (
        <InteractionWrapper<FlipbookStepRenderProps>
            isDisabled={() => FlipbookUtils.getIsStepDisabled(step, getCurrentIndex(), getPageCount(), getIsDisabled())}
            extraFlags={() => ({
                step,
                targetIndex: FlipbookUtils.getStepTarget(step, getCurrentIndex(), getPageCount()),
            })}
            renderControl={(setElementRef, getRenderProps) => (
                <FlipbookControl
                    ref={setElementRef}
                    ariaLabel={() => props.computeStepLabel(step)}
                    flags={getRenderProps}
                    renderContent={() => props.renderStep?.(() => step, getRenderProps)}
                    onActivate={() => book.turn(step)}
                />
            )}
        />
    );

    const controls: FlipbookControls = {
        getIndex: getCurrentIndex,
        getSpreadCount,
        renderStep: renderStepControl,
    };

    const renderLeafPage = (leaf: number, side: SpineSide) => {
        const getPage = () => FlipbookUtils.getLeafPage(leaf, side, getPageCount());

        return (
            <Show when={getPage() !== undefined}>
                <div
                    class={[
                        styles.flipbookPage,
                        side === "front" ? styles.flipbookPageFront : styles.flipbookPageBack,
                    ].join(" ")}
                >
                    {props.renderPage(
                        () => getPages()[getPage()!],
                        () => FlipbookUtils.getPageState(getPage()!, getPageCount(), getCurrentIndex()),
                    )}
                </div>
            </Show>
        );
    };

    return (
        <div
            class={styles.flipbookRoot}
            style={{ gap: `${access(props.gap) ?? FLIPBOOK_DEFAULTS.gap}px` }}
            role="region"
            aria-roledescription={access(props.roleDescription) ?? FLIPBOOK_DEFAULTS.roleDescription}
            aria-label={access(props.ariaLabel)}
            tabindex={0}
            onKeyDown={handleKeyDown}
        >
            <div ref={setBookRef} class={styles.flipbookBook}>
                <Spine
                    position={getPosition}
                    hasBacks={true}
                    faceRoleDescription={() =>
                        access(props.pageRoleDescription) ?? FLIPBOOK_DEFAULTS.pageRoleDescription
                    }
                    computeFaceAngle={SpineUtils.leaves}
                    computeFaceDefs={(leaf, side) =>
                        FlipbookUtils.getLeafFaceDefs(
                            leaf,
                            side,
                            getPageCount(),
                            getCurrentIndex(),
                            props.computePageLabel,
                        )
                    }
                    faces={getLeaves}
                    renderFace={(_getLeaf, leaf, side) => renderLeafPage(leaf, side)}
                />
            </div>

            {props.renderControls?.(controls)}
        </div>
    );
};
