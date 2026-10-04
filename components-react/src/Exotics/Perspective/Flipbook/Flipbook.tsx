import { type KeyboardEvent, type ReactNode, useEffect, useLayoutEffect, useRef, useState } from "react";

import {
    FLIPBOOK_DEFAULTS,
    type FlipbookStep,
    type FlipbookStepRenderProps,
    FlipbookStyles,
    FlipbookUtils,
    LiveAnnouncerUtils,
    type SpineSide,
    SpineUtils,
} from "@thewaver/ss-components";

import { InteractionTrackerReactUtils } from "../../../Abstracts/InteractionTracker/InteractionTrackerReact.utils";
import { SignalMirrorReactUtils } from "../../../Abstracts/SignalMirror/SignalMirrorReact.utils";
import { InteractionWrapper } from "../../../Primitives/InteractionWrapper/InteractionWrapper";
import { Spine } from "../../../Primitives/Spine/Spine";
import { useLatest } from "../../../Utils/refUtils";
import { useStore } from "../../../Utils/storeUtils";
import type { FlipbookControlProps, FlipbookControls, FlipbookProps } from "./Flipbook.types";

const FIRST_SPREAD = 0;

const FlipbookControl = (props: FlipbookControlProps) => {
    const isDisabled = props.flags.isDisabled ?? false;

    return (
        <button
            ref={props.ref}
            type="button"
            className={FlipbookStyles.flipbookControl}
            aria-label={props.ariaLabel}
            aria-disabled={isDisabled || undefined}
            onClick={() => {
                if (isDisabled) return;

                props.onActivate();
            }}
        >
            {props.renderContent(props.flags)}
        </button>
    );
};

export const Flipbook = <T,>(props: FlipbookProps<T>) => {
    useEffect(() => LiveAnnouncerUtils.reserve("polite"), []);

    const bookRef = useRef<HTMLDivElement | null>(null);

    const [index, setIndex] = SignalMirrorReactUtils.useOptionalState(props.index, FIRST_SPREAD);

    const indexRef = useRef(index);

    useLayoutEffect(() => {
        indexRef.current = index;
    }, [index]);

    const pageCount = props.pages.length;
    const currentIndex = FlipbookUtils.clampSpread(index, pageCount);
    const spreadCount = FlipbookUtils.getSpreadCount(pageCount);
    const isDisabled = props.isDisabled ?? false;
    const commitRatio = props.commitRatio ?? FLIPBOOK_DEFAULTS.commitRatio;
    const transitionDurationMs = props.transitionDurationMs ?? FLIPBOOK_DEFAULTS.transitionDurationMs;
    const pageRoleDescription = props.pageRoleDescription ?? FLIPBOOK_DEFAULTS.pageRoleDescription;
    const leaves = Array.from({ length: FlipbookUtils.getLeafCount(pageCount) }, (_, leaf) => leaf);

    const latest = useLatest({ pageCount, isDisabled, transitionDurationMs, setIndex });

    const [book] = useState(() =>
        FlipbookUtils.createBook({
            getPageCount: () => latest.current.pageCount,
            getIndex: () => indexRef.current,
            setIndex: (next) => {
                indexRef.current = next;
                latest.current.setIndex(next);
            },
            getIsDisabled: () => latest.current.isDisabled,
            getTransitionDurationMs: () => latest.current.transitionDurationMs,
        }),
    );

    useEffect(() => () => book.stop(), [book]);

    const position = useStore(book.position);

    const isDragDisabled = FlipbookUtils.getIsDragDisabled(props.renderControls !== undefined, isDisabled, pageCount);

    InteractionTrackerReactUtils.useAxialSwipe(bookRef, isDragDisabled, {
        axis: "horizontal",
        commitRatio,
        onSwipe: book.push,
        onSwipeEnd: book.release,
    });

    const glidedIndexRef = useRef(currentIndex);

    useEffect(() => {
        if (glidedIndexRef.current === currentIndex) return;

        glidedIndexRef.current = currentIndex;
        book.glideTo(currentIndex);
    }, [book, currentIndex]);

    const announcedIndexRef = useRef<number | undefined>(undefined);
    const computeSpreadAnnouncementRef = useLatest(props.computeSpreadAnnouncement);

    useEffect(() => {
        if (FlipbookUtils.getIsAnnounced(announcedIndexRef.current, currentIndex)) {
            LiveAnnouncerUtils.announce(
                computeSpreadAnnouncementRef.current(
                    FlipbookUtils.getShowingPages(currentIndex, latest.current.pageCount),
                    latest.current.pageCount,
                ),
            );
        }

        announcedIndexRef.current = currentIndex;
    }, [currentIndex]);

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.target !== e.currentTarget) return;

        const step = FlipbookUtils.getKeyStep(e.key);

        if (step === undefined || !book.turn(step)) return;

        e.preventDefault();
    };

    const renderStepControl = (step: FlipbookStep): ReactNode => (
        <InteractionWrapper<FlipbookStepRenderProps>
            key={step}
            isDisabled={FlipbookUtils.getIsStepDisabled(step, currentIndex, pageCount, isDisabled)}
            extraFlags={{ step, targetIndex: FlipbookUtils.getStepTarget(step, currentIndex, pageCount) }}
            renderControl={(setElementRef, renderProps) => (
                <FlipbookControl
                    ref={setElementRef}
                    ariaLabel={props.computeStepLabel(step)}
                    flags={renderProps}
                    renderContent={() => props.renderStep?.(step, renderProps)}
                    onActivate={() => book.turn(step)}
                />
            )}
        />
    );

    const controls: FlipbookControls = {
        index: currentIndex,
        spreadCount,
        renderStep: renderStepControl,
    };

    const renderLeafPage = (leaf: number, side: SpineSide): ReactNode => {
        const page = FlipbookUtils.getLeafPage(leaf, side, pageCount);

        if (page === undefined) return null;

        return (
            <div
                className={[
                    FlipbookStyles.flipbookPage,
                    side === "front" ? FlipbookStyles.flipbookPageFront : FlipbookStyles.flipbookPageBack,
                ].join(" ")}
            >
                {props.renderPage(props.pages[page], FlipbookUtils.getPageState(page, pageCount, currentIndex))}
            </div>
        );
    };

    return (
        <div
            className={FlipbookStyles.flipbookRoot}
            style={{ gap: `${props.gap ?? FLIPBOOK_DEFAULTS.gap}px` }}
            role="region"
            aria-roledescription={props.roleDescription ?? FLIPBOOK_DEFAULTS.roleDescription}
            aria-label={props.ariaLabel}
            tabIndex={0}
            onKeyDown={handleKeyDown}
        >
            <div ref={bookRef} className={FlipbookStyles.flipbookBook}>
                <Spine
                    position={position}
                    hasBacks={true}
                    faceRoleDescription={pageRoleDescription}
                    computeFaceAngle={SpineUtils.leaves}
                    computeFaceDefs={(leaf, side) =>
                        FlipbookUtils.getLeafFaceDefs(leaf, side, pageCount, currentIndex, props.computePageLabel)
                    }
                    faces={leaves}
                    renderFace={(_leaf, leaf, side) => renderLeafPage(leaf, side)}
                />
            </div>

            {props.renderControls?.(controls)}
        </div>
    );
};
