import { type SlotsType, computed, defineComponent, onScopeDispose, shallowRef, watch } from "vue";

import {
    CarouselUtils,
    INFINITE_CORRIDOR_DEFAULTS,
    type InfiniteCorridorItemState,
    InfiniteCorridorUtils,
    InfiniteCorridorStyles as styles,
} from "@thewaver/ss-components";
import { InfiniteCorridorConst } from "@thewaver/ss-components/internal";

import { ElementObserverVueUtils } from "../../../Abstracts/ElementObserver/ElementObserverVue.utils";
import { callSlot, declareProps, useTwoWay } from "../../../Utils/propUtils";
import type { SlotsContext } from "../../../Utils/typeUtils";
import type { InfiniteCorridorProps, InfiniteCorridorSlots } from "./InfiniteCorridor.types";

export const InfiniteCorridor = defineComponent(
    <T,>(props: InfiniteCorridorProps<T>, { slots }: SlotsContext<InfiniteCorridorSlots<T>>) => {
        const rootRef = shallowRef<HTMLElement>();

        const progress = useTwoWay(props, "progress", InfiniteCorridorConst.NO_PROGRESS);

        const itemRefs: (HTMLElement | undefined)[] = [];

        const size = ElementObserverVueUtils.useBorderBoxSize(rootRef);

        const count = computed(() => props.items.length);

        const getBehindDistance = () => props.layout.behindDistance;

        const copies = computed(() =>
            InfiniteCorridorUtils.getCopyCount(
                count.value,
                props.layout.reach,
                props.layout.behindDistance,
                props.layout.placeMultiple?.(count.value),
            ),
        );

        const placeCount = computed(() => count.value * copies.value);

        const position = computed(() => InfiniteCorridorUtils.toPosition(progress.value, count.value));

        const ringPosition = computed<number | undefined>((previous) =>
            InfiniteCorridorUtils.followCopies(previous, position.value, count.value, copies.value),
        );

        const places = computed(() =>
            Array.from({ length: placeCount.value }, (_, order) => {
                const perItem = copies.value;

                return Math.floor(order / perItem) + (order % perItem) * count.value;
            }),
        );

        const viewDistance = computed(() =>
            InfiniteCorridorUtils.getViewDistance(props.layout.viewDistance, count.value),
        );

        const toIndex = (place: number) => place % Math.max(count.value, 1);

        const getDistance = (place: number) =>
            InfiniteCorridorUtils.getDistance(place, ringPosition.value ?? 0, placeCount.value, getBehindDistance());

        const getIsCopy = (place: number) =>
            place !==
            InfiniteCorridorUtils.getRealPlace(
                toIndex(place),
                ringPosition.value ?? 0,
                count.value,
                copies.value,
                getBehindDistance(),
            );

        let stopGlide: (() => void) | undefined;
        let recentWrites: number[] = [];

        const glideTo = (place: number) => {
            const itemCount = count.value;
            const from = position.value;

            stopGlide?.();

            stopGlide = CarouselUtils.glide({
                from,
                to: InfiniteCorridorUtils.getGlideTarget(from, getDistance(place), viewDistance.value),
                durationMs: props.glideDurationMs ?? INFINITE_CORRIDOR_DEFAULTS.glideDurationMs,
                onFrame: (next) => {
                    const written = InfiniteCorridorUtils.toProgress(next, itemCount);

                    recentWrites = InfiniteCorridorUtils.rememberWrite(recentWrites, written);
                    progress.value = written;
                },
            });
        };

        watch(
            () => progress.value,
            (next) => {
                if (!InfiniteCorridorUtils.getIsEcho(next, recentWrites)) stopGlide?.();
            },
        );

        onScopeDispose(() => stopGlide?.());

        const handleFocusIn = (e: FocusEvent) => {
            const place = itemRefs.findIndex((element) => element?.contains(e.target as Node));

            if (place < 0 || InfiniteCorridorUtils.getIsInView(getDistance(place), viewDistance.value)) return;

            glideTo(place);
        };

        return () => {
            itemRefs.length = placeCount.value;

            return (
                <div
                    ref={rootRef}
                    class={styles.infiniteCorridorRoot}
                    role="region"
                    aria-roledescription={props.roleDescription ?? INFINITE_CORRIDOR_DEFAULTS.roleDescription}
                    aria-label={props.ariaLabel}
                    onFocusin={handleFocusIn}
                >
                    {places.value.map((place) => {
                        const distance = getDistance(place);
                        const isCopy = getIsCopy(place);
                        const placement = props.layout.place({
                            distance,
                            place,
                            placeCount: placeCount.value,
                            index: toIndex(place),
                            count: count.value,
                            size: size.value,
                        });
                        const state: InfiniteCorridorItemState = {
                            index: toIndex(place),
                            count: count.value,
                            distance,
                            isCopy,
                        };

                        return (
                            <div
                                key={place}
                                ref={(element) => {
                                    itemRefs[place] = element instanceof HTMLElement ? element : undefined;
                                }}
                                class={styles.infiniteCorridorItem}
                                style={InfiniteCorridorUtils.toItemStyle(placement, distance)}
                                aria-hidden={isCopy ? "true" : undefined}
                                inert={isCopy}
                            >
                                {callSlot(slots.renderItem, { item: props.items[toIndex(place)], state })}
                            </div>
                        );
                    })}
                </div>
            );
        };
    },
    {
        name: "InfiniteCorridor",
        slots: Object as SlotsType<InfiniteCorridorSlots<any>>,
        props: declareProps<InfiniteCorridorProps<unknown>>({
            "items": null,
            "glideDurationMs": null,
            "ariaLabel": null,
            "roleDescription": null,
            "layout": null,
            "progress": null,
            "onUpdate:progress": null,
        }),
    },
);
