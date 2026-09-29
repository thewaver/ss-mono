import { type ReactNode, useEffect, useMemo } from "react";

import {
    type InteractionSizing,
    STEPPER_DEFAULTS,
    type Step,
    type StepperFlags,
    StepperStyles,
    StepperUtils,
} from "@thewaver/ss-components";

import { InteractionWrapper } from "../../Primitives/InteractionWrapper/InteractionWrapper";
import { PlacementBox } from "../../Primitives/PlacementBox/PlacementBox";
import { PlacementItem } from "../../Primitives/PlacementItem/PlacementItem";
import type { StepperItemProps, StepperProps } from "./Stepper.types";

const ROW_SIZING: InteractionSizing = "fit-content";
const PLACED_SIZING: InteractionSizing = "fill";

const StepperItem = <TValue, TState>(props: StepperItemProps<TValue, TState>) => {
    const isNavigable = props.step.isNavigable ?? false;

    const handleClick = () => {
        if (!isNavigable) return;

        props.onSelect(props.step.value);
    };

    return (
        <button
            type="button"
            ref={props.ref}
            className={StepperStyles.stepperItem}
            id={props.step.id}
            aria-label={props.ariaLabel}
            aria-current={props.flags.isCurrent ? "step" : undefined}
            aria-disabled={isNavigable ? undefined : true}
            onClick={handleClick}
        >
            {props.renderContent(props.flags)}
        </button>
    );
};

export const Stepper = <TValue, TState>(props: StepperProps<TValue, TState>) => {
    const hasLayout = props.computeLayout !== undefined;
    const hasBody = props.renderBody !== undefined;

    useEffect(() => StepperUtils.warnIfBodyIgnored(hasLayout, hasBody), [hasLayout, hasBody]);

    const orientation = props.orientation ?? STEPPER_DEFAULTS.orientation;
    const flexDirection = orientation === "horizontal" ? "row" : "column";
    const steps = props.steps;
    const itemCount = steps.length;
    const lastIndex = itemCount - 1;

    const computeLayout = props.computeLayout;
    const layout = useMemo(() => computeLayout?.({ itemCount }), [computeLayout, itemCount]);

    const getHasConnector = (index: number) => props.renderConnector !== undefined && index !== lastIndex;

    const renderConnector = (index: number) => props.renderConnector!(StepperUtils.computeConnectorDefs(index, layout));

    const renderControl = (step: Step<TValue, TState>, index: number) => {
        const tooltipDefs = props.computeTooltipDefs?.(step, index);

        return (
            <InteractionWrapper<StepperFlags>
                sizing={layout?.placements[index] === undefined ? ROW_SIZING : PLACED_SIZING}
                isDisabled={!(step.isNavigable ?? false)}
                isReachableWhenDisabled={tooltipDefs !== undefined}
                isFocusableWhenDisabled={step.isReachableWhenDisabled ?? false}
                tooltipDefs={tooltipDefs}
                extraFlags={{ isCurrent: step.value === props.currentValue }}
                renderControl={(setElementRef, flags) => (
                    <StepperItem
                        ref={setElementRef}
                        step={step}
                        flags={flags}
                        ariaLabel={props.computeStepAriaLabel(step, index)}
                        renderContent={(itemFlags) => props.renderStep(step, itemFlags)}
                        onSelect={(value) => props.onCurrentChange?.(value)}
                    />
                )}
            />
        );
    };

    const renderPlacedEntry = (step: Step<TValue, TState>, index: number) => {
        const placement = layout?.placements[index];

        return (
            <li key={index} className={StepperStyles.stepperLayer}>
                {getHasConnector(index) && (
                    <span className={StepperStyles.stepperLayerConnector} aria-hidden="true">
                        {renderConnector(index)}
                    </span>
                )}

                {placement && <PlacementItem placement={placement}>{renderControl(step, index)}</PlacementItem>}
            </li>
        );
    };

    const renderEntry = (step: Step<TValue, TState>, index: number) => (
        <li key={index} className={StepperStyles.stepperEntry} style={{ flexDirection }}>
            {renderControl(step, index)}

            {props.renderBody ? (
                <div className={StepperStyles.stepperTail}>
                    {getHasConnector(index) && (
                        <span
                            className={[StepperStyles.stepperConnector, StepperStyles.stepperTailConnector].join(" ")}
                            aria-hidden="true"
                        >
                            {renderConnector(index)}
                        </span>
                    )}

                    <div className={StepperStyles.stepperBody}>{props.renderBody(step, index)}</div>
                </div>
            ) : (
                getHasConnector(index) && (
                    <span className={StepperStyles.stepperConnector} aria-hidden="true">
                        {renderConnector(index)}
                    </span>
                )
            )}
        </li>
    );

    const renderList = (children: ReactNode) => (
        <ol
            className={[StepperStyles.stepperList, layout !== undefined && StepperStyles.stepperPlacedList]
                .filter(Boolean)
                .join(" ")}
            style={{
                flexDirection: layout === undefined ? flexDirection : undefined,
                flexWrap: layout === undefined && orientation === "horizontal" ? "wrap" : undefined,
                gap: layout === undefined ? `${props.gap ?? STEPPER_DEFAULTS.gap}px` : undefined,
            }}
            aria-label={props.ariaLabel}
        >
            {children}
        </ol>
    );

    const entries = steps.map((step, index) =>
        layout === undefined ? renderEntry(step, index) : renderPlacedEntry(step, index),
    );

    return layout ? (
        <PlacementBox layout={layout} computeEffect={props.computeEffect}>
            {renderList(entries)}
        </PlacementBox>
    ) : (
        renderList(entries)
    );
};
