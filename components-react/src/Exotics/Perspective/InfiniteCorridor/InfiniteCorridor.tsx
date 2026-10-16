import { type CSSProperties, type FocusEvent, useEffect, useMemo, useRef, useState } from "react";

import {
    CarouselUtils,
    INFINITE_CORRIDOR_DEFAULTS,
    type InfiniteCorridorItemState,
    InfiniteCorridorUtils,
    InfiniteCorridorStyles as styles,
} from "@thewaver/ss-components";
import { InfiniteCorridorConst } from "@thewaver/ss-components/internal";
import { StringUtils } from "@thewaver/ss-utils";

import { ElementObserverReactUtils } from "../../../Abstracts/ElementObserver/ElementObserverReact.utils";
import { SignalMirrorReactUtils } from "../../../Abstracts/SignalMirror/SignalMirrorReact.utils";
import { useLatest } from "../../../Utils/refUtils";
import type { InfiniteCorridorProps } from "./InfiniteCorridor.types";

const toReactStyle = (style: Record<string, string>) =>
    Object.fromEntries(
        Object.entries(style).map(([key, value]) => [StringUtils.kebabToCamelCase(key), value]),
    ) as CSSProperties;

export const InfiniteCorridor = <T,>(props: InfiniteCorridorProps<T>) => {
    const rootRef = useRef<HTMLDivElement | null>(null);
    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

    const [progress, setProgress] = SignalMirrorReactUtils.useOptionalState(
        props.progress,
        InfiniteCorridorConst.NO_PROGRESS,
    );

    const size = ElementObserverReactUtils.useBorderBoxSize(rootRef);

    const count = props.items.length;
    const { layout } = props;
    const behindDistance = layout.behindDistance;

    const copies = InfiniteCorridorUtils.getCopyCount(
        count,
        layout.reach,
        layout.behindDistance,
        layout.placeMultiple?.(count),
    );
    const placeCount = count * copies;

    const position = InfiniteCorridorUtils.toPosition(progress, count);

    const [followedRing, setFollowedRing] = useState<number | undefined>(undefined);
    const ringPosition = InfiniteCorridorUtils.followCopies(followedRing, position, count, copies);

    if (ringPosition !== followedRing) setFollowedRing(ringPosition);

    const places = useMemo(
        () => Array.from({ length: placeCount }, (_, order) => Math.floor(order / copies) + (order % copies) * count),
        [placeCount, copies, count],
    );

    const viewDistance = InfiniteCorridorUtils.getViewDistance(layout.viewDistance, count);

    const toIndex = (place: number) => place % Math.max(count, 1);

    const getDistance = (place: number) =>
        InfiniteCorridorUtils.getDistance(place, ringPosition, placeCount, behindDistance);

    const getIsCopy = (place: number) =>
        place !== InfiniteCorridorUtils.getRealPlace(toIndex(place), ringPosition, count, copies, behindDistance);

    const stopGlideRef = useRef<(() => void) | undefined>(undefined);
    const recentWritesRef = useRef<number[]>([]);
    const latest = useLatest({ setProgress });

    const glideTo = (place: number) => {
        const from = position;

        stopGlideRef.current?.();

        stopGlideRef.current = CarouselUtils.glide({
            from,
            to: InfiniteCorridorUtils.getGlideTarget(from, getDistance(place), viewDistance),
            durationMs: props.glideDurationMs ?? INFINITE_CORRIDOR_DEFAULTS.glideDurationMs,
            onFrame: (next) => {
                const written = InfiniteCorridorUtils.toProgress(next, count);

                recentWritesRef.current = InfiniteCorridorUtils.rememberWrite(recentWritesRef.current, written);
                latest.current.setProgress(written);
            },
        });
    };

    const hasProgressMountedRef = useRef(false);

    useEffect(() => {
        if (!hasProgressMountedRef.current) {
            hasProgressMountedRef.current = true;

            return;
        }

        if (!InfiniteCorridorUtils.getIsEcho(progress, recentWritesRef.current)) stopGlideRef.current?.();
    }, [progress]);

    useEffect(() => () => stopGlideRef.current?.(), []);

    const handleFocus = (e: FocusEvent<HTMLDivElement>) => {
        const place = itemRefs.current.findIndex((element) => element?.contains(e.target as Node));

        if (place < 0 || InfiniteCorridorUtils.getIsInView(getDistance(place), viewDistance)) return;

        glideTo(place);
    };

    return (
        <div
            ref={rootRef}
            className={styles.infiniteCorridorRoot}
            role="region"
            aria-roledescription={props.roleDescription ?? INFINITE_CORRIDOR_DEFAULTS.roleDescription}
            aria-label={props.ariaLabel}
            onFocus={handleFocus}
        >
            {places.map((place, order) => {
                const distance = getDistance(place);
                const isCopy = getIsCopy(place);
                const state: InfiniteCorridorItemState = { index: toIndex(place), count, distance, isCopy };
                const placement = layout.place({
                    distance,
                    place,
                    placeCount,
                    index: state.index,
                    count,
                    size,
                });

                return (
                    <div
                        key={order}
                        ref={(element) => {
                            itemRefs.current[place] = element;
                        }}
                        className={styles.infiniteCorridorItem}
                        style={toReactStyle(InfiniteCorridorUtils.toItemStyle(placement, distance))}
                        aria-hidden={isCopy ? "true" : undefined}
                        inert={isCopy}
                    >
                        {props.renderItem(props.items[state.index], state)}
                    </div>
                );
            })}
        </div>
    );
};
