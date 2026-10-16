import { Index, createEffect, createMemo, createSignal, on, onCleanup } from "solid-js";

import {
    CarouselUtils,
    INFINITE_CORRIDOR_DEFAULTS,
    type InfiniteCorridorItemState,
    InfiniteCorridorUtils,
    InfiniteCorridorStyles as styles,
} from "@thewaver/ss-components";
import { InfiniteCorridorConst } from "@thewaver/ss-components/internal";

import { ElementObserverSolidUtils } from "../../../Abstracts/ElementObserver/ElementObserverSolid.utils";
import { SignalMirrorSolidUtils } from "../../../Abstracts/SignalMirror/SignalMirrorSolid.utils";
import { access } from "../../../Utils/propUtils";
import type { InfiniteCorridorProps } from "./InfiniteCorridorSolid.types";

export const InfiniteCorridor = <T,>(props: InfiniteCorridorProps<T>) => {
    const [getRootRef, setRootRef] = createSignal<HTMLElement>();

    const [getProgress, setProgress] = SignalMirrorSolidUtils.createOptional(
        () => props.progress,
        InfiniteCorridorConst.NO_PROGRESS,
    );

    const itemRefs: (HTMLElement | undefined)[] = [];

    const getSize = ElementObserverSolidUtils.createBorderBoxSizeObserver(getRootRef);

    const getCount = createMemo(() => access(props.items).length);

    const getBehindDistance = () => props.layout.behindDistance;

    const getCopies = createMemo(() =>
        InfiniteCorridorUtils.getCopyCount(
            getCount(),
            props.layout.reach,
            props.layout.behindDistance,
            props.layout.placeMultiple?.(getCount()),
        ),
    );

    const getPlaceCount = () => getCount() * getCopies();

    const getPosition = () => InfiniteCorridorUtils.toPosition(getProgress(), getCount());

    const getRingPosition = createMemo<number | undefined>((previous) =>
        InfiniteCorridorUtils.followCopies(previous, getPosition(), getCount(), getCopies()),
    );

    const getPlaces = createMemo(() =>
        Array.from({ length: getPlaceCount() }, (_, order) => {
            const copies = getCopies();

            return Math.floor(order / copies) + (order % copies) * getCount();
        }),
    );

    const getViewDistance = createMemo(() =>
        InfiniteCorridorUtils.getViewDistance(props.layout.viewDistance, getCount()),
    );

    const toIndex = (place: number) => place % Math.max(getCount(), 1);

    const getDistance = (place: number) =>
        InfiniteCorridorUtils.getDistance(place, getRingPosition() ?? 0, getPlaceCount(), getBehindDistance());

    const getIsCopy = (place: number) =>
        place !==
        InfiniteCorridorUtils.getRealPlace(
            toIndex(place),
            getRingPosition() ?? 0,
            getCount(),
            getCopies(),
            getBehindDistance(),
        );

    let stopGlide: (() => void) | undefined;
    let recentWrites: number[] = [];

    const glideTo = (place: number) => {
        const count = getCount();
        const from = getPosition();

        stopGlide?.();

        stopGlide = CarouselUtils.glide({
            from,
            to: InfiniteCorridorUtils.getGlideTarget(from, getDistance(place), getViewDistance()),
            durationMs: access(props.glideDurationMs) ?? INFINITE_CORRIDOR_DEFAULTS.glideDurationMs,
            onFrame: (position) => {
                const progress = InfiniteCorridorUtils.toProgress(position, count);

                recentWrites = InfiniteCorridorUtils.rememberWrite(recentWrites, progress);
                setProgress(progress);
            },
        });
    };

    createEffect(
        on(
            getProgress,
            (progress) => {
                if (!InfiniteCorridorUtils.getIsEcho(progress, recentWrites)) stopGlide?.();
            },
            { defer: true },
        ),
    );

    onCleanup(() => stopGlide?.());

    const handleFocusIn = (e: FocusEvent) => {
        const place = itemRefs.findIndex((element) => element?.contains(e.target as Node));

        if (place < 0 || InfiniteCorridorUtils.getIsInView(getDistance(place), getViewDistance())) return;

        glideTo(place);
    };

    return (
        <div
            ref={setRootRef}
            class={styles.infiniteCorridorRoot}
            role="region"
            aria-roledescription={access(props.roleDescription) ?? INFINITE_CORRIDOR_DEFAULTS.roleDescription}
            aria-label={access(props.ariaLabel)}
            onFocusIn={handleFocusIn}
        >
            <Index each={getPlaces()}>
                {(getPlace) => {
                    const getItem = () => access(props.items)[toIndex(getPlace())];

                    const getPlacement = createMemo(() =>
                        props.layout.place({
                            distance: getDistance(getPlace()),
                            place: getPlace(),
                            placeCount: getPlaceCount(),
                            index: toIndex(getPlace()),
                            count: getCount(),
                            size: getSize(),
                        }),
                    );

                    const getState = (): InfiniteCorridorItemState => ({
                        index: toIndex(getPlace()),
                        count: getCount(),
                        distance: getDistance(getPlace()),
                        isCopy: getIsCopy(getPlace()),
                    });

                    onCleanup(() => {
                        itemRefs[getPlace()] = undefined;
                    });

                    return (
                        <div
                            ref={(element) => {
                                itemRefs[getPlace()] = element;
                            }}
                            class={styles.infiniteCorridorItem}
                            style={InfiniteCorridorUtils.toItemStyle(getPlacement(), getDistance(getPlace()))}
                            aria-hidden={getIsCopy(getPlace()) || undefined}
                            inert={getIsCopy(getPlace())}
                        >
                            {props.renderItem(getItem, getState)}
                        </div>
                    );
                }}
            </Index>
        </div>
    );
};
