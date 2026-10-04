import { type CSSProperties, type SlotsType, computed, defineComponent, shallowRef } from "vue";

import { REVEAL_DEFAULTS, RevealStyles, RevealUtils } from "@thewaver/ss-components";
import { MathUtils, type Point2d, StringUtils } from "@thewaver/ss-utils";

import { ElementObserverVueUtils } from "../../../Abstracts/ElementObserver/ElementObserverVue.utils";
import { PointerTrackerVueUtils } from "../../../Abstracts/PointerTracker/PointerTrackerVue.utils";
import { callSlot, declareProps } from "../../../Utils/propUtils";
import type { SlotsContext } from "../../../Utils/typeUtils";
import type { RevealProps, RevealSlots } from "./Reveal.types";

const toVueStyle = (style: Record<string, string>) =>
    Object.fromEntries(
        Object.entries(style).map(([key, value]) => [StringUtils.kebabToCamelCase(key), value]),
    ) as CSSProperties;

export const Reveal = defineComponent(
    (props: RevealProps, { slots }: SlotsContext<RevealSlots>) => {
        const rootRef = shallowRef<HTMLDivElement>();

        const getIsDisabled = () => props.isDisabled === true;

        const { reading, isPointerPresent } = PointerTrackerVueUtils.usePointerReading(
            rootRef,
            getIsDisabled,
            () => props.pointSource,
        );

        const size = ElementObserverVueUtils.useBorderBoxSize(rootRef, getIsDisabled);

        const keyboardPoint = shallowRef<Point2d>();

        const getRadius = () => props.radius ?? REVEAL_DEFAULTS.radius;

        const holeImage = computed(() =>
            RevealUtils.buildHoleImage(
                getRadius(),
                MathUtils.clamp01(props.softness ?? REVEAL_DEFAULTS.softness),
                props.computePoints,
                props.joinRadii,
                props.lameExponents,
            ),
        );

        return () => {
            const isDisabled = getIsDisabled();
            const radius = getRadius();
            const isPointerInside = RevealUtils.getIsPointerInside(isPointerPresent.value, reading.value);
            const isKeyboardDriven = !isDisabled && keyboardPoint.value !== undefined;
            const isRevealing = RevealUtils.getIsRevealing(isDisabled, isKeyboardDriven, isPointerInside);
            const hasHole = RevealUtils.getHasHole(isDisabled, isKeyboardDriven, isPointerPresent.value, radius);
            const pointerPoint = RevealUtils.toPointerPoint(reading.value, size.value);

            const holeCenter = RevealUtils.computeHoleCenter(
                isKeyboardDriven ? keyboardPoint.value : undefined,
                pointerPoint,
                size.value,
            );

            const maskStyle = toVueStyle(RevealUtils.computeMaskStyle(hasHole, holeCenter, radius, holeImage.value));

            const handleFocus = () => {
                if (isDisabled || !rootRef.value?.matches(":focus-visible")) return;

                keyboardPoint.value = RevealUtils.toCenter(size.value);
            };

            const handleKeyDown = (e: KeyboardEvent) => {
                const nudge = RevealUtils.getNudge(e);

                if (isDisabled || !nudge) return;

                e.preventDefault();

                const from = isKeyboardDriven
                    ? holeCenter
                    : isPointerInside
                      ? pointerPoint
                      : RevealUtils.toCenter(size.value);

                keyboardPoint.value = RevealUtils.computeNudgedPoint(
                    from,
                    nudge,
                    props.stepSize ?? REVEAL_DEFAULTS.stepSize,
                    size.value,
                );
            };

            return (
                <div
                    ref={rootRef}
                    class={RevealStyles.revealRoot}
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

                    <div class={RevealStyles.revealCover}>
                        {callSlot(slots.renderCover, { isRevealing, maskStyle })}
                    </div>
                </div>
            );
        };
    },
    {
        name: "Reveal",
        slots: Object as SlotsType<RevealSlots>,
        props: declareProps<RevealProps>({
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
