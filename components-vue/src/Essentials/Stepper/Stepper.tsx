import { type SlotsType, type VNodeChild, computed, defineComponent } from "vue";

import {
    type InteractionSizing,
    STEPPER_DEFAULTS,
    type Step,
    type StepperFlags,
    StepperStyles,
    StepperUtils,
} from "@thewaver/ss-components";

import { InteractionWrapper } from "../../Primitives/InteractionWrapper/InteractionWrapper";
import type {
    InteractionControlSlots,
    InteractionWrapperSlots,
} from "../../Primitives/InteractionWrapper/InteractionWrapper.types";
import { PlacementBox } from "../../Primitives/PlacementBox/PlacementBox";
import { PlacementItem } from "../../Primitives/PlacementItem/PlacementItem";
import { watchAfterRender } from "../../Utils/effectUtils";
import { callSlot, declareProps } from "../../Utils/propUtils";
import type { SlotsContext } from "../../Utils/typeUtils";
import type { StepperItemProps, StepperProps, StepperSlots } from "./Stepper.types";

const ROW_SIZING: InteractionSizing = "fit-content";
const PLACED_SIZING: InteractionSizing = "fill";

const StepperItem = defineComponent(
    <TValue, TState>(
        props: StepperItemProps<TValue, TState>,
        { slots }: SlotsContext<InteractionControlSlots<StepperFlags>>,
    ) =>
        () => {
            const isNavigable = props.step.isNavigable ?? false;

            return (
                <button
                    type="button"
                    class={StepperStyles.stepperItem}
                    id={props.step.id}
                    aria-label={props.ariaLabel}
                    aria-current={props.flags.isCurrent ? "step" : undefined}
                    aria-disabled={isNavigable ? undefined : true}
                    onClick={() => {
                        if (!isNavigable) return;

                        props.onSelect(props.step.value);
                    }}
                >
                    {callSlot(slots.renderContent, props.flags)}
                </button>
            );
        },
    {
        name: "StepperItem",
        props: declareProps<StepperItemProps<unknown, unknown>>({
            ariaLabel: null,
            flags: null,
            step: null,
            onSelect: null,
        }),
    },
);

export const Stepper = defineComponent(
    <TValue, TState>(props: StepperProps<TValue, TState>, { slots }: SlotsContext<StepperSlots<TValue, TState>>) => {
        watchAfterRender(
            [() => props.computeLayout !== undefined, () => slots.renderBody !== undefined],
            ([hasLayout, hasBody]) => StepperUtils.warnIfBodyIgnored(hasLayout, hasBody),
        );

        const itemCount = computed(() => props.steps.length);
        const layout = computed(() => props.computeLayout?.({ itemCount: itemCount.value }));

        return () => {
            const orientation = props.orientation ?? STEPPER_DEFAULTS.orientation;
            const flexDirection = orientation === "horizontal" ? "row" : "column";
            const lastIndex = itemCount.value - 1;
            const currentLayout = layout.value;

            const getHasConnector = (index: number) => slots.renderConnector !== undefined && index !== lastIndex;

            const renderConnector = (index: number) =>
                callSlot(slots.renderConnector, StepperUtils.computeConnectorDefs(index, currentLayout));

            const renderControl = (step: Step<TValue, TState>, index: number) => {
                const tooltipDefs = props.computeTooltipDefs?.(step, index);

                return (
                    <InteractionWrapper
                        sizing={currentLayout?.placements[index] === undefined ? ROW_SIZING : PLACED_SIZING}
                        isDisabled={!(step.isNavigable ?? false)}
                        isReachableWhenDisabled={tooltipDefs !== undefined}
                        isFocusableWhenDisabled={step.isReachableWhenDisabled ?? false}
                        tooltipDefs={tooltipDefs}
                        extraFlags={{ isCurrent: step.value === props.currentValue }}
                    >
                        {
                            {
                                renderControl: ({ setElementRef, flags }) => (
                                    <StepperItem
                                        ref={setElementRef}
                                        step={step}
                                        flags={flags}
                                        ariaLabel={props.computeStepAriaLabel(step, index)}
                                        onSelect={(value) => props.onCurrentChange?.(value)}
                                    >
                                        {
                                            {
                                                renderContent: (itemFlags) =>
                                                    callSlot(slots.renderStep, { step, flags: itemFlags }),
                                            } satisfies InteractionControlSlots<StepperFlags>
                                        }
                                    </StepperItem>
                                ),
                            } satisfies Partial<InteractionWrapperSlots<StepperFlags>>
                        }
                    </InteractionWrapper>
                );
            };

            const renderPlacedEntry = (step: Step<TValue, TState>, index: number) => {
                const placement = currentLayout?.placements[index];

                return (
                    <li key={index} class={StepperStyles.stepperLayer}>
                        {getHasConnector(index) && (
                            <span class={StepperStyles.stepperLayerConnector} aria-hidden="true">
                                {renderConnector(index)}
                            </span>
                        )}

                        {placement && (
                            <PlacementItem placement={placement}>
                                {{ default: () => renderControl(step, index) }}
                            </PlacementItem>
                        )}
                    </li>
                );
            };

            const renderEntry = (step: Step<TValue, TState>, index: number) => (
                <li key={index} class={StepperStyles.stepperEntry} style={{ flexDirection }}>
                    {renderControl(step, index)}

                    {slots.renderBody ? (
                        <div class={StepperStyles.stepperTail}>
                            {getHasConnector(index) && (
                                <span
                                    class={[StepperStyles.stepperConnector, StepperStyles.stepperTailConnector]}
                                    aria-hidden="true"
                                >
                                    {renderConnector(index)}
                                </span>
                            )}

                            <div class={StepperStyles.stepperBody}>{callSlot(slots.renderBody, { step, index })}</div>
                        </div>
                    ) : (
                        getHasConnector(index) && (
                            <span class={StepperStyles.stepperConnector} aria-hidden="true">
                                {renderConnector(index)}
                            </span>
                        )
                    )}
                </li>
            );

            const renderList = (children: VNodeChild) => (
                <ol
                    class={[StepperStyles.stepperList, currentLayout !== undefined && StepperStyles.stepperPlacedList]}
                    style={{
                        flexDirection: currentLayout === undefined ? flexDirection : undefined,
                        flexWrap: currentLayout === undefined && orientation === "horizontal" ? "wrap" : undefined,
                        gap: currentLayout === undefined ? `${props.gap ?? STEPPER_DEFAULTS.gap}px` : undefined,
                    }}
                    aria-label={props.ariaLabel}
                >
                    {children}
                </ol>
            );

            const entries = props.steps.map((step, index) =>
                currentLayout === undefined ? renderEntry(step, index) : renderPlacedEntry(step, index),
            );

            return currentLayout ? (
                <PlacementBox layout={currentLayout} computeEffect={props.computeEffect}>
                    {{ default: () => renderList(entries) }}
                </PlacementBox>
            ) : (
                renderList(entries)
            );
        };
    },
    {
        name: "Stepper",
        slots: Object as SlotsType<StepperSlots<any, any>>,
        props: declareProps<StepperProps<unknown, unknown>>({
            orientation: null,
            gap: null,
            ariaLabel: null,
            steps: null,
            currentValue: null,
            computeLayout: null,
            computeEffect: null,
            computeStepAriaLabel: null,
            computeTooltipDefs: null,
            onCurrentChange: null,
        }),
    },
);
