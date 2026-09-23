import { For, Index, createEffect, createMemo, createSignal, on, onCleanup, onMount } from "solid-js";
import type { ParentProps } from "solid-js";

import { type ElementSegment, JSXTextParserUtils } from "@thewaver/ss-utils";

import { access } from "../../Utils/propUtils";
import { TYPEWRITER_DEFAULTS } from "./Typewriter.const";
import type { TypewriterProps, TypewriterUpdateCause } from "./Typewriter.types";

import * as styles from "./Typewriter.css";

const EMPTY_SEGMENTS: (ElementSegment & { startIndex: number })[] = [];

export const Typewriter = (props: ParentProps<TypewriterProps>) => {
    const [getContainerRef, setContainerRef] = createSignal<HTMLElement>();
    const [getIndexedSegments, setIndexedSegments] =
        createSignal<(ElementSegment & { startIndex: number })[]>(EMPTY_SEGMENTS);
    const [getAnimatedElementCount, setAnimatedElementCount] = createSignal(0);
    const [getIsAnimating, setIsAnimating] = createSignal(false);
    const [getHasAnimatedOnce, setHasAnimatedOnce] = createSignal(false);

    let animationToggleTimeout: ReturnType<typeof setTimeout> | undefined;
    let lastParsedWidth: number | undefined;

    onCleanup(() => {
        clearTimeout(animationToggleTimeout);
    });

    const getAnimationName = createMemo(() => access(props.animationName) ?? TYPEWRITER_DEFAULTS.animationName);

    const getAnimationDurationMs = createMemo(
        () => access(props.animationDurationMs) ?? TYPEWRITER_DEFAULTS.animationDurationMs,
    );

    const getAnimationDelayMs = createMemo(
        () => access(props.animationDelayMs) ?? TYPEWRITER_DEFAULTS.animationDelayMs,
    );

    const getInitialAnimationDelayMs = createMemo(
        () => access(props.initialAnimationDelayMs) ?? TYPEWRITER_DEFAULTS.initialAnimationDelayMs,
    );

    const getAnimationBase = createMemo(() =>
        getIsAnimating()
            ? {
                  name: getAnimationName(),
                  durationMs: getAnimationDurationMs(),
                  delayMs: getAnimationDelayMs(),
                  initialDelayMs: getInitialAnimationDelayMs(),
              }
            : undefined,
    );

    const clearAnimation = () => {
        setIsAnimating(false);
        clearTimeout(animationToggleTimeout);
    };

    const restartAnimation = (cause: TypewriterUpdateCause = "other") => {
        clearAnimation();

        const timeoutDuration =
            getAnimatedElementCount() * getAnimationDelayMs() + getInitialAnimationDelayMs() + getAnimationDurationMs();

        if (
            getHasAnimatedOnce() &&
            ((cause === "content" && access(props.resetAnimationOnContent) === false) ||
                (cause === "layout" && access(props.resetAnimationOnLayout) === false))
        )
            return;

        setIsAnimating(true);
        setHasAnimatedOnce(true);

        animationToggleTimeout = setTimeout(() => {
            setIsAnimating(false);

            props.onAnimationEnd?.();
        }, timeoutDuration);
    };

    const update = (cause: TypewriterUpdateCause) => {
        const containerRef = getContainerRef();

        if (!containerRef) return false;

        const width = containerRef.clientWidth;

        if (cause === "layout" && width === lastParsedWidth) return false;

        lastParsedWidth = width;

        clearAnimation();

        let itemCount = 0;

        const segments = JSXTextParserUtils.getSegmentTokens(containerRef);
        const inlinedSegments = JSXTextParserUtils.getInlinedSegments(segments, width);
        const indexedSegments = inlinedSegments.map((segment) => {
            const result = { ...segment, startIndex: itemCount };

            itemCount += segment.type === "text" ? Array.from(segment.text).length : 1;

            return result;
        });

        setIndexedSegments(indexedSegments);
        setAnimatedElementCount(itemCount);
        restartAnimation(cause);

        return true;
    };

    const controller = createMemo(() => ({
        restartAnimation: () => {
            restartAnimation();

            return true;
        },
        update,
    }));

    createEffect(on(getAnimationName, () => restartAnimation(), { defer: true }));

    onMount(() => {
        props.onMount?.(controller());

        let childrenContainerObserver: ResizeObserver | undefined;

        onCleanup(() => {
            childrenContainerObserver?.disconnect();
        });

        const containerRef = getContainerRef();

        if (!containerRef) return;

        childrenContainerObserver = new ResizeObserver(() => update("layout"));
        childrenContainerObserver.observe(containerRef);
    });

    return (
        <div class={styles.typewriterRoot}>
            <div ref={setContainerRef} class={styles.typewriterChildrenWrap} aria-hidden="true" inert>
                {props.children}
            </div>

            {!!getIndexedSegments().length && (
                <div class={styles.typewriterTextWrap} style={{ width: `${getContainerRef()?.clientWidth ?? 0}px` }}>
                    <For each={getIndexedSegments()}>
                        {(segment) => {
                            const getAnimationStyle = (startIndex: number) => {
                                const base = getAnimationBase();

                                if (!base) return undefined;

                                return {
                                    "animation-name": base.name,
                                    "animation-duration": `${base.durationMs}ms`,
                                    "animation-delay": `${startIndex * base.delayMs + base.initialDelayMs}ms`,
                                };
                            };

                            switch (segment.type) {
                                case "atomic": {
                                    return (
                                        <span
                                            class={
                                                segment.isBlockLike
                                                    ? styles.typewriterBlockLikeAtomic
                                                    : styles.typewriterChar
                                            }
                                            style={getAnimationStyle(segment.startIndex)}
                                        >
                                            {segment.element}
                                        </span>
                                    );
                                }
                                case "linebreak":
                                    return <br style={getAnimationStyle(segment.startIndex)} />;
                                case "text": {
                                    const style = { ...segment.nonMetrics, ...segment.metrics };

                                    return (
                                        <>
                                            {getIsAnimating() ? (
                                                <span style={style}>
                                                    <Index each={Array.from(segment.text)}>
                                                        {(getChar, charIndex) => (
                                                            <span
                                                                class={styles.typewriterChar}
                                                                style={getAnimationStyle(
                                                                    segment.startIndex + charIndex,
                                                                )}
                                                            >
                                                                {getChar()}
                                                            </span>
                                                        )}
                                                    </Index>
                                                </span>
                                            ) : segment.meta?.anchor ? (
                                                <a
                                                    class={styles.typewriterChar}
                                                    style={style}
                                                    {...segment.meta?.common}
                                                    {...segment.meta?.anchor}
                                                >
                                                    {segment.text}
                                                </a>
                                            ) : (
                                                <span
                                                    class={styles.typewriterChar}
                                                    style={style}
                                                    {...segment.meta?.common}
                                                >
                                                    {segment.text}
                                                </span>
                                            )}
                                        </>
                                    );
                                }
                            }
                        }}
                    </For>
                </div>
            )}
        </div>
    );
};
