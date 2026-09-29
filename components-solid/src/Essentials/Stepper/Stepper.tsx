import { type Accessor, Index, type JSX, Show, createMemo } from "solid-js";

import {
    type InteractionSizing,
    STEPPER_DEFAULTS,
    type Step,
    StepperUtils,
    StepperStyles as styles,
} from "@thewaver/ss-components";

import { InteractionWrapper } from "../../Primitives/InteractionWrapper/InteractionWrapper";
import { PlacementBox } from "../../Primitives/PlacementBox/PlacementBox";
import { PlacementItem } from "../../Primitives/PlacementItem/PlacementItem";
import { access } from "../../Utils/propUtils";
import type { StepperItemProps, StepperProps } from "./StepperSolid.types";

const ROW_SIZING: InteractionSizing = "fit-content";
const PLACED_SIZING: InteractionSizing = "fill";

const StepperItem = <TValue, TState>(props: StepperItemProps<TValue, TState>) => {
    const getIsNavigable = () => access(props.step).isNavigable ?? false;

    const handleClick = () => {
        if (!getIsNavigable()) return;

        props.onSelect(access(props.step).value);
    };

    return (
        <button
            type="button"
            ref={(element) => props.ref?.(element)}
            class={styles.stepperItem}
            id={access(props.step).id}
            aria-label={access(props.ariaLabel)}
            aria-current={access(props.flags).isCurrent ? "step" : undefined}
            aria-disabled={getIsNavigable() ? undefined : true}
            onClick={handleClick}
        >
            {props.renderContent(() => access(props.flags))}
        </button>
    );
};

export const Stepper = <TValue, TState>(props: StepperProps<TValue, TState>) => {
    StepperUtils.warnIfBodyIgnored(props.computeLayout !== undefined, props.renderBody !== undefined);

    const getOrientation = createMemo(() => access(props.orientation) ?? STEPPER_DEFAULTS.orientation);

    const getFlexDirection = createMemo(() => (getOrientation() === "horizontal" ? "row" : "column"));

    const getLastIndex = createMemo(() => access(props.steps).length - 1);

    const getLayout = createMemo(() => props.computeLayout?.({ itemCount: access(props.steps).length }));

    const getPlacementAt = (index: number) => getLayout()?.placements[index];

    const getHasConnector = (index: number) => props.renderConnector !== undefined && index !== getLastIndex();

    const renderConnector = (index: number) =>
        props.renderConnector!(() => StepperUtils.computeConnectorDefs(index, getLayout()));

    const renderControl = (getStep: Accessor<Step<TValue, TState>>, index: number) => {
        const getTooltipDefs = () => props.computeTooltipDefs?.(getStep(), index);

        return (
            <InteractionWrapper
                sizing={getPlacementAt(index) === undefined ? ROW_SIZING : PLACED_SIZING}
                isDisabled={() => !(getStep().isNavigable ?? false)}
                isReachableWhenDisabled={() => getTooltipDefs() !== undefined}
                isFocusableWhenDisabled={() => getStep().isReachableWhenDisabled ?? false}
                tooltipDefs={getTooltipDefs}
                extraFlags={() => ({ isCurrent: getStep().value === access(props.currentValue) })}
                renderControl={(setElementRef, getFlags) => (
                    <StepperItem
                        ref={setElementRef}
                        step={getStep}
                        flags={getFlags}
                        ariaLabel={() => props.computeStepAriaLabel(getStep(), index)}
                        renderContent={(getItemFlags) => props.renderStep(getStep, getItemFlags)}
                        onSelect={(value) => props.onCurrentChange?.(value)}
                    />
                )}
            />
        );
    };

    const renderPlacedEntry = (getStep: Accessor<Step<TValue, TState>>, index: number) => (
        <li class={styles.stepperLayer}>
            <Show when={getHasConnector(index)}>
                <span class={styles.stepperLayerConnector} aria-hidden="true">
                    {renderConnector(index)}
                </span>
            </Show>

            <Show when={getPlacementAt(index)}>
                {(getRect) => <PlacementItem placement={getRect}>{renderControl(getStep, index)}</PlacementItem>}
            </Show>
        </li>
    );

    const renderEntry = (getStep: Accessor<Step<TValue, TState>>, index: number) => (
        <li class={styles.stepperEntry} style={{ "flex-direction": getFlexDirection() }}>
            {renderControl(getStep, index)}

            <Show
                when={props.renderBody}
                fallback={
                    <Show when={getHasConnector(index)}>
                        <span class={styles.stepperConnector} aria-hidden="true">
                            {renderConnector(index)}
                        </span>
                    </Show>
                }
            >
                {(getRenderBody) => (
                    <div class={styles.stepperTail}>
                        <Show when={getHasConnector(index)}>
                            <span
                                class={[styles.stepperConnector, styles.stepperTailConnector].join(" ")}
                                aria-hidden="true"
                            >
                                {renderConnector(index)}
                            </span>
                        </Show>

                        <div class={styles.stepperBody}>{getRenderBody()(getStep, index)}</div>
                    </div>
                )}
            </Show>
        </li>
    );

    const renderSteps = () => (
        <Index each={access(props.steps)}>
            {(getStep, index) =>
                getLayout() === undefined ? renderEntry(getStep, index) : renderPlacedEntry(getStep, index)
            }
        </Index>
    );

    const renderList = (children: JSX.Element) => (
        <ol
            class={styles.stepperList}
            classList={{ [styles.stepperPlacedList]: getLayout() !== undefined }}
            style={{
                "flex-direction": getLayout() === undefined ? getFlexDirection() : undefined,
                "flex-wrap": getLayout() === undefined && getOrientation() === "horizontal" ? "wrap" : undefined,
                "gap": getLayout() === undefined ? `${access(props.gap) ?? STEPPER_DEFAULTS.gap}px` : undefined,
            }}
            aria-label={access(props.ariaLabel)}
        >
            {children}
        </ol>
    );

    return (
        <Show when={getLayout()} fallback={renderList(renderSteps())}>
            {(getResolved) => (
                <PlacementBox layout={getResolved} computeEffect={props.computeEffect}>
                    {renderList(renderSteps())}
                </PlacementBox>
            )}
        </Show>
    );
};
