import { type CSSProperties, type SlotsType, computed, defineComponent, shallowRef } from "vue";

import { LENS_DEFAULTS, LensStyles, LensUtils, RevealUtils } from "@thewaver/ss-components";
import { MathUtils, type Point2d, StringUtils } from "@thewaver/ss-utils";

import { ElementObserverVueUtils } from "../../../Abstracts/ElementObserver/ElementObserverVue.utils";
import { PointerTrackerVueUtils } from "../../../Abstracts/PointerTracker/PointerTrackerVue.utils";
import { callSlot, declareProps } from "../../../Utils/propUtils";
import type { SlotsContext } from "../../../Utils/typeUtils";
import type { LensProps, LensSlots } from "./Lens.types";

const toVueStyle = (style: Record<string, string>) =>
    Object.fromEntries(
        Object.entries(style).map(([key, value]) => [StringUtils.kebabToCamelCase(key), value]),
    ) as CSSProperties;

export const Lens = defineComponent(
    (props: LensProps, { slots }: SlotsContext<LensSlots>) => {
        const rootRef = shallowRef<HTMLDivElement>();

        const getIsDisabled = () => props.isDisabled === true;

        const { reading, isPointerPresent } = PointerTrackerVueUtils.usePointerReading(
            rootRef,
            getIsDisabled,
            () => props.pointSource,
        );

        const size = ElementObserverVueUtils.useBorderBoxSize(rootRef, getIsDisabled);

        const keyboardPoint = shallowRef<Point2d>();

        const getRadius = () => props.radius ?? LENS_DEFAULTS.radius;

        const lensImage = computed(() =>
            RevealUtils.buildHoleImage(
                getRadius(),
                MathUtils.clamp01(props.softness ?? LENS_DEFAULTS.softness),
                props.computePoints,
                props.joinRadii,
                props.lameExponents,
            ),
        );

        return () => {
            const isDisabled = getIsDisabled();
            const radius = getRadius();
            const zoom = props.zoom ?? LENS_DEFAULTS.zoom;
            const isPointerInside = RevealUtils.getIsPointerInside(isPointerPresent.value, reading.value);
            const isKeyboardDriven = !isDisabled && keyboardPoint.value !== undefined;
            const hasLens = RevealUtils.getHasHole(isDisabled, isKeyboardDriven, isPointerPresent.value, radius);
            const pointerPoint = RevealUtils.toPointerPoint(reading.value, size.value);

            const lensCenter = RevealUtils.computeHoleCenter(
                isKeyboardDriven ? keyboardPoint.value : undefined,
                pointerPoint,
                size.value,
            );

            const layerStyle = toVueStyle(LensUtils.computeLayerStyle(hasLens, lensCenter, radius, lensImage.value));
            const copyStyle = toVueStyle(LensUtils.computeCopyStyle(lensCenter, zoom));

            const handleFocus = () => {
                if (isDisabled || !rootRef.value?.matches(":focus-visible")) return;

                keyboardPoint.value = RevealUtils.toCenter(size.value);
            };

            const handleKeyDown = (e: KeyboardEvent) => {
                const nudge = RevealUtils.getNudge(e);

                if (isDisabled || !nudge) return;

                e.preventDefault();

                const from = isKeyboardDriven
                    ? lensCenter
                    : isPointerInside
                      ? pointerPoint
                      : RevealUtils.toCenter(size.value);

                keyboardPoint.value = RevealUtils.computeNudgedPoint(
                    from,
                    nudge,
                    props.stepSize ?? LENS_DEFAULTS.stepSize,
                    size.value,
                );
            };

            return (
                <div
                    ref={rootRef}
                    class={LensStyles.lensRoot}
                    role="group"
                    tabindex={isDisabled ? undefined : 0}
                    aria-label={props.ariaLabel}
                    aria-disabled={isDisabled || undefined}
                    onFocus={handleFocus}
                    onBlur={() => {
                        keyboardPoint.value = undefined;
                    }}
                    onPointermove={() => {
                        keyboardPoint.value = undefined;
                    }}
                    onKeydown={handleKeyDown}
                >
                    {callSlot(slots.renderContent, undefined)}

                    <div class={LensStyles.lensLayer} style={layerStyle} aria-hidden="true" inert>
                        <div class={LensStyles.lensCopy} style={copyStyle}>
                            {callSlot(slots.renderContent, undefined)}
                        </div>
                    </div>
                </div>
            );
        };
    },
    {
        name: "Lens",
        slots: Object as SlotsType<LensSlots>,
        props: declareProps<LensProps>({
            zoom: null,
            radius: null,
            joinRadii: null,
            lameExponents: null,
            softness: null,
            stepSize: null,
            isDisabled: Boolean,
            pointSource: null,
            ariaLabel: null,
            computePoints: null,
        }),
    },
);
