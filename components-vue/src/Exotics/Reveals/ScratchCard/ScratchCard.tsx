import { type CSSProperties, type SlotsType, defineComponent, onScopeDispose, shallowRef, useId } from "vue";

import {
    NavigatorUtils,
    SCRATCH_CARD_DEFAULTS,
    type ScratchCardController,
    ScratchCardStyles,
    ScratchCardUtils,
} from "@thewaver/ss-components";
import { StringUtils } from "@thewaver/ss-utils";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { ElementObserverVueUtils } from "../../../Abstracts/ElementObserver/ElementObserverVue.utils";
import { InteractionTrackerVueUtils } from "../../../Abstracts/InteractionTracker/InteractionTrackerVue.utils";
import { PointerTrackerVueUtils } from "../../../Abstracts/PointerTracker/PointerTrackerVue.utils";
import { watchAfterRender } from "../../../Utils/effectUtils";
import { callSlot, declareProps } from "../../../Utils/propUtils";
import type { SlotsContext } from "../../../Utils/typeUtils";
import type { ScratchCardProps, ScratchCardSlots } from "./ScratchCard.types";

const NOTHING_RUBBED = 0;
const NO_PATH = "";

const toVueStyle = (style: Record<string, string>) =>
    Object.fromEntries(
        Object.entries(style).map(([key, value]) => [StringUtils.kebabToCamelCase(key), value]),
    ) as CSSProperties;

export const ScratchCard = defineComponent(
    (props: ScratchCardProps, { slots }: SlotsContext<ScratchCardSlots>) => {
        const maskId = useId();

        const rootRef = shallowRef<HTMLDivElement>();
        const coverRef = shallowRef<HTMLDivElement>();
        const pathRef = shallowRef<SVGPathElement>();

        const path = shallowRef(NO_PATH);
        const clearedRatio = shallowRef(NOTHING_RUBBED);
        const isClearing = shallowRef(false);
        const isCleared = shallowRef(false);

        const getIsDisabled = () => props.isDisabled === true;
        const getBrushRadius = () => props.brushRadius ?? SCRATCH_CARD_DEFAULTS.brushRadius;
        const getClearDurationMs = () => props.clearDurationMs ?? SCRATCH_CARD_DEFAULTS.clearDurationMs;

        const getBrushShape = () => ({
            radius: getBrushRadius(),
            computePoints: props.computePoints,
            joinRadii: props.joinRadii,
            lameExponents: props.lameExponents,
        });

        const size = ElementObserverVueUtils.useBorderBoxSize(coverRef, getIsDisabled);

        const scheduler = ScratchCardUtils.createMeasureScheduler(() => {
            clearedRatio.value = ScratchCardUtils.measureClearedRatio(
                pathRef.value ?? undefined,
                path.value,
                size.value,
                props.precision ?? SCRATCH_CARD_DEFAULTS.precision,
            );
        });

        const controller: ScratchCardController = {
            reset: () => {
                scheduler.reset();
                isClearing.value = false;
                isCleared.value = false;
                path.value = NO_PATH;
                clearedRatio.value = NOTHING_RUBBED;

                return true;
            },
            clear: () => {
                if (isClearing.value) return false;

                isClearing.value = true;

                return true;
            },
        };

        watchAfterRender([], () => {
            props.onMount?.(controller);
        });

        onScopeDispose(scheduler.cancel);

        watchAfterRender([path], ([current]) => {
            if (current !== NO_PATH) scheduler.schedule();
        });

        let reportedRatio = clearedRatio.value;

        watchAfterRender([clearedRatio], ([ratio]) => {
            if (reportedRatio === ratio) return;

            reportedRatio = ratio;
            props.onScratch?.(ratio);

            if (ratio < (props.clearThreshold ?? SCRATCH_CARD_DEFAULTS.clearThreshold) || isCleared.value) return;

            isClearing.value = true;
        });

        watchAfterRender([isClearing, getClearDurationMs], ([clearing, clearDurationMs]) => {
            if (!clearing) return;

            const timeout = setTimeout(() => {
                ScratchCardUtils.keepFocus(coverRef.value ?? undefined, rootRef.value ?? undefined);

                isCleared.value = true;
                props.onClear?.();
            }, clearDurationMs);

            return () => clearTimeout(timeout);
        });

        const { isDragging } = InteractionTrackerVueUtils.useDrag(coverRef, getIsDisabled, {
            onDrag: (ratio) => {
                const point = ScratchCardUtils.toPoint(ratio, size.value);
                const brushRadius = getBrushRadius();

                if (ScratchCardUtils.getIsRubbedAt(pathRef.value ?? undefined, path.value, point, brushRadius)) return;

                path.value =
                    path.value +
                    ScratchCardUtils.computeStampPath(
                        point,
                        brushRadius,
                        ScratchCardUtils.computeBrushPoints(getBrushShape()),
                    );
            },
        });

        const { reading, isPointerPresent } = PointerTrackerVueUtils.usePointerReading(coverRef, getIsDisabled);

        const handleKeyDown = (e: KeyboardEvent) => {
            if (getIsDisabled() || !NavigatorUtils.getIsActivationKey(e.key)) return;

            e.preventDefault();
            isClearing.value = true;
        };

        return () => {
            const isDisabled = getIsDisabled();
            const brushRadius = getBrushRadius();
            const softness = props.softness ?? SCRATCH_CARD_DEFAULTS.softness;

            const brushGeometry = ScratchCardUtils.computeBrushGeometry({
                hasRenderer: slots.renderBrush !== undefined,
                isClearing: isClearing.value,
                isPointerPresent: isPointerPresent.value,
                reading: reading.value,
                size: size.value,
                shape: getBrushShape(),
            });

            return (
                <div ref={rootRef} class={ScratchCardStyles.scratchCardRoot} tabindex={-1}>
                    {callSlot(slots.renderContent, undefined)}

                    <svg class={ScratchCardStyles.scratchCardDefs} aria-hidden="true">
                        <defs>
                            <filter id={`${maskId}-soften`} x="-20%" y="-20%" width="140%" height="140%">
                                <feGaussianBlur
                                    stdDeviation={ScratchCardUtils.computeBlurDeviation(brushRadius, softness)}
                                />
                            </filter>

                            <mask
                                id={maskId}
                                maskUnits="userSpaceOnUse"
                                x="0"
                                y="0"
                                width={size.value.width}
                                height={size.value.height}
                            >
                                <rect width={size.value.width} height={size.value.height} fill="white" />

                                <path
                                    ref={pathRef}
                                    d={path.value}
                                    fill="black"
                                    fill-rule="nonzero"
                                    filter={`url(#${maskId}-soften)`}
                                />
                            </mask>
                        </defs>
                    </svg>

                    {!isCleared.value && (
                        <div
                            ref={coverRef}
                            class={[
                                ScratchCardStyles.scratchCardCover,
                                isClearing.value && ScratchCardStyles.scratchCardCoverClearing,
                            ]}
                            style={assignInlineVars({
                                [ScratchCardStyles.clearDurationVar]: `${getClearDurationMs()}ms`,
                            })}
                            role="button"
                            tabindex={isDisabled ? undefined : 0}
                            aria-label={props.ariaLabel}
                            aria-disabled={isDisabled || undefined}
                            onKeydown={handleKeyDown}
                        >
                            {callSlot(slots.renderCover, toVueStyle(ScratchCardUtils.computeMaskStyle(maskId)))}

                            {brushGeometry && (
                                <div
                                    class={ScratchCardStyles.scratchCardBrush}
                                    style={{
                                        left: `${brushGeometry.box.x}px`,
                                        top: `${brushGeometry.box.y}px`,
                                        width: `${brushGeometry.box.width}px`,
                                        height: `${brushGeometry.box.height}px`,
                                    }}
                                    aria-hidden="true"
                                >
                                    {callSlot(slots.renderBrush, {
                                        isRubbing: isDragging.value,
                                        geometry: brushGeometry,
                                    })}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            );
        };
    },
    {
        name: "ScratchCard",
        slots: Object as SlotsType<ScratchCardSlots>,
        props: declareProps<ScratchCardProps>({
            brushRadius: null,
            joinRadii: null,
            lameExponents: null,
            softness: null,
            precision: null,
            clearThreshold: null,
            clearDurationMs: null,
            isDisabled: Boolean,
            ariaLabel: null,
            computePoints: null,
            onMount: null,
            onScratch: null,
            onClear: null,
        }),
    },
);
