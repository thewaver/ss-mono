import { type SlotsType, computed, defineComponent, onScopeDispose, shallowRef } from "vue";

import { WRAPAROUND_DEFAULTS, WraparoundStyles, type WraparoundTile, WraparoundUtils } from "@thewaver/ss-components";

import { ElementObserverVueUtils } from "../../Abstracts/ElementObserver/ElementObserverVue.utils";
import { InteractionTrackerVueUtils } from "../../Abstracts/InteractionTracker/InteractionTrackerVue.utils";
import { watchAfterRender } from "../../Utils/effectUtils";
import { callSlot, declareProps, useTwoWay } from "../../Utils/propUtils";
import { useStableList } from "../../Utils/refUtils";
import { useStore } from "../../Utils/storeUtils";
import type { SlotsContext } from "../../Utils/typeUtils";
import type { WraparoundProps, WraparoundSlots } from "./Wraparound.types";

const KEY_SEPARATOR = ",";
const ORIGINAL_KEY = "original";

const toKey = (tile: WraparoundTile) => `${tile.column}${KEY_SEPARATOR}${tile.row}`;

const fromKey = (key: string): WraparoundTile => {
    const [column, row] = key.split(KEY_SEPARATOR).map(Number);

    return { column, row };
};

export const Wraparound = defineComponent(
    (props: WraparoundProps, { slots }: SlotsContext<WraparoundSlots>) => {
        const rootRef = shallowRef<HTMLDivElement>();
        const originalRef = shallowRef<HTMLDivElement>();

        const viewportSize = ElementObserverVueUtils.useBorderBoxSize(rootRef);
        const tileSize = ElementObserverVueUtils.useBorderBoxSize(originalRef);

        const isPlaying = useTwoWay(props, "playback", true);
        const isHeld = InteractionTrackerVueUtils.useHold(rootRef);

        const getIsDisabled = () => props.isDisabled ?? false;
        const getIsMovable = () => props.isMovable ?? WRAPAROUND_DEFAULTS.isMovable;

        const plane = WraparoundUtils.createPlane({
            getTileSize: () => tileSize.value,
            getViewportSize: () => viewportSize.value,
            getOriginal: () => originalRef.value,
            getIsDisabled,
            getIsMovable,
            getMomentumMs: () => props.momentumMs ?? WRAPAROUND_DEFAULTS.momentumMs,
            getGlideDurationMs: () => props.glideDurationMs ?? WRAPAROUND_DEFAULTS.glideDurationMs,
            getKeyStepPx: () => props.keyStepPx ?? WRAPAROUND_DEFAULTS.keyStepPx,
        });

        onScopeDispose(plane.destroy);

        watchAfterRender([rootRef], ([root]) => (root ? plane.observe(root) : undefined));

        const isDrifting = computed(() => isPlaying.value && !isHeld.value && !getIsDisabled());

        watchAfterRender(
            [
                isDrifting,
                () => props.driftPxPerSecond ?? WRAPAROUND_DEFAULTS.driftPxPerSecond,
                () => props.driftDegrees ?? WRAPAROUND_DEFAULTS.driftDegrees,
            ],
            ([drifting, pxPerSecond, degrees]) =>
                plane.setDrift(drifting ? WraparoundUtils.computeDriftVelocity(pxPerSecond, degrees) : undefined),
        );

        const offset = useStore(plane, (state) => state.offset);
        const originalTile = useStore(plane, (state) => state.original);
        const isDragging = useStore(plane, (state) => state.isDragging);

        const copyKeys = useStableList(() =>
            WraparoundUtils.computeTiles(
                offset.value,
                tileSize.value,
                viewportSize.value,
                props.maxCopies ?? WRAPAROUND_DEFAULTS.maxCopies,
            ).map(toKey),
        );

        return () => {
            const size = tileSize.value;
            const originalKey = toKey(originalTile.value);

            const toTileTransform = (tile: WraparoundTile) =>
                `translate(${tile.column * size.width}px, ${tile.row * size.height}px)`;

            return (
                <div
                    ref={rootRef}
                    class={[
                        WraparoundStyles.wraparoundRoot,
                        isDragging.value && WraparoundStyles.isDragging,
                        !getIsMovable() && WraparoundStyles.isImmovable,
                    ]}
                    role="region"
                    aria-label={props.ariaLabel}
                    tabindex={getIsDisabled() || !getIsMovable() ? undefined : 0}
                >
                    <div
                        class={WraparoundStyles.wraparoundPlane}
                        style={{ transform: `translate(${offset.value.x}px, ${offset.value.y}px)` }}
                    >
                        <div
                            key={ORIGINAL_KEY}
                            ref={originalRef}
                            class={WraparoundStyles.wraparoundTile}
                            style={{ transform: toTileTransform(originalTile.value) }}
                        >
                            {callSlot(slots.renderContent, undefined)}
                        </div>

                        {copyKeys.value.map((key) => (
                            <div
                                key={key}
                                class={WraparoundStyles.wraparoundTile}
                                style={{
                                    transform: toTileTransform(fromKey(key)),
                                    visibility: key === originalKey ? "hidden" : undefined,
                                }}
                                aria-hidden="true"
                                inert
                            >
                                {callSlot(slots.renderContent, undefined)}
                            </div>
                        ))}
                    </div>
                </div>
            );
        };
    },
    {
        name: "Wraparound",
        slots: Object as SlotsType<WraparoundSlots>,
        props: declareProps<WraparoundProps>({
            "ariaLabel": null,
            "isDisabled": Boolean,
            "momentumMs": null,
            "glideDurationMs": null,
            "keyStepPx": null,
            "maxCopies": null,
            "isMovable": Boolean,
            "driftPxPerSecond": null,
            "driftDegrees": null,
            "playback": Boolean,
            "onUpdate:playback": null,
        }),
    },
);
