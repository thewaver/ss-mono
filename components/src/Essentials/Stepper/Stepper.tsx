import { type Accessor, Index, type JSX, Show, createMemo } from "solid-js";

import { InteractionWrapper } from "../../Primitives/InteractionWrapper/InteractionWrapper";
import type { InteractionSizing } from "../../Primitives/InteractionWrapper/InteractionWrapper.types";
import { PlacementBox } from "../../Primitives/PlacementBox/PlacementBox";
import { PlacementItem } from "../../Primitives/PlacementItem/PlacementItem";
import { access } from "../../Utils/propUtils";
import { STEPPER_DEFAULTS } from "./Stepper.const";
import type { Step, StepperItemProps, StepperProps } from "./Stepper.types";

import * as styles from "./Stepper.css";

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
    if (props.computeLayout !== undefined && props.renderBody !== undefined) {
        console.warn(
            "Stepper: renderBody is ignored when computeLayout is given. A body is a panel beside a straight connector and a laid-out stepper has nowhere to put one — drop one of them.",
        );
    }

    const getOrientation = createMemo(() => access(props.orientation) ?? STEPPER_DEFAULTS.orientation);

    const getFlexDirection = createMemo(() => (getOrientation() === "horizontal" ? "row" : "column"));

    const getLastIndex = createMemo(() => access(props.steps).length - 1);

    const getLayout = createMemo(() => props.computeLayout?.({ itemCount: access(props.steps).length }));

    const getPlacementAt = (index: number) => getLayout()?.placements[index];

    const getHasConnector = (index: number) => props.renderConnector !== undefined && index !== getLastIndex();

    const renderConnector = (index: number) =>
        props.renderConnector!(() => ({
            index,
            from: getPlacementAt(index),
            to: getPlacementAt(index + 1),
            origin: getLayout()?.origin,
            radii: getLayout()?.radii,
        }));

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
