import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import {
    COLOR_AREA_DEFAULTS,
    type ColorAreaAxis,
    type ColorAreaRenderProps,
    ColorAreaStyles,
    ColorAreaUtils,
    InteractionTrackerUtils,
} from "@thewaver/ss-components";
import type { Color } from "@thewaver/ss-utils";

import { InteractionTrackerReactUtils } from "../../../Abstracts/InteractionTracker/InteractionTrackerReact.utils";
import { InteractionWrapper } from "../../../Primitives/InteractionWrapper/InteractionWrapper";
import { useLatest } from "../../../Utils/refUtils";
import { LabelReactUtils } from "../Label/LabelReact.utils";
import type { ColorAreaElementProps, ColorAreaProps } from "./ColorArea.types";

const readFocusVisibleAxis = (element: HTMLElement, axis: ColorAreaAxis) =>
    InteractionTrackerUtils.computeIsFocusVisible(element) ? axis : undefined;

const ColorAreaElement = (props: ColorAreaElementProps) => {
    const ariaLabel = LabelReactUtils.useAriaLabel(props.ariaLabel);

    const surfaceRef = useRef<HTMLDivElement | null>(null);
    const axisRefs = useRef<Partial<Record<ColorAreaAxis, HTMLInputElement>>>({});
    const isPressedRef = useRef(false);
    const latestRef = useLatest(props.ref);

    const [axisElements, setAxisElements] = useState<Partial<Record<ColorAreaAxis, HTMLInputElement>>>({});

    const isDisabled = props.flags.isDisabled ?? false;

    const { isDragging } = InteractionTrackerReactUtils.useDrag(surfaceRef, isDisabled, {
        onDrag: (ratio) => {
            isPressedRef.current = true;
            props.setDragged(ratio);
            axisRefs.current.saturation?.focus();
        },
        onDragEnd: () => {
            isPressedRef.current = false;
        },
    });

    useEffect(() => {
        if (!isDragging) isPressedRef.current = false;
    }, [isDragging]);

    const setIsDragging = props.setIsDragging;

    useLayoutEffect(() => setIsDragging(isDragging), [setIsDragging, isDragging]);

    useLayoutEffect(() => {
        for (const axis of ColorAreaUtils.AXES) {
            const element = axisRefs.current[axis];

            if (element) ColorAreaUtils.syncAxis(element, props.hsv, axis);
        }
    });

    InteractionTrackerReactUtils.useExtraControls(
        ColorAreaUtils.AXES.map((axis) => axisElements[axis]),
        isDisabled,
        { isTabbable: props.isTabbable },
    );

    const setSurfaceRef = useCallback(
        (element: HTMLDivElement | null) => {
            surfaceRef.current = element;
            latestRef.current?.(element);
        },
        [latestRef],
    );

    const axisRefSetters = useMemo(
        () =>
            Object.fromEntries(
                ColorAreaUtils.AXES.map((axis) => [
                    axis,
                    (element: HTMLInputElement | null) => {
                        axisRefs.current[axis] = element ?? undefined;

                        setAxisElements((previous) =>
                            previous[axis] === (element ?? undefined)
                                ? previous
                                : { ...previous, [axis]: element ?? undefined },
                        );
                    },
                ]),
            ) as Record<ColorAreaAxis, (element: HTMLInputElement | null) => void>,
        [],
    );

    return (
        <div
            ref={setSurfaceRef}
            id={props.id}
            className={ColorAreaStyles.colorAreaSurface}
            role="group"
            aria-label={ariaLabel}
            aria-disabled={isDisabled || undefined}
            aria-invalid={props.flags.hasError || undefined}
            onMouseEnter={(e) => {
                if (isDisabled) return;

                props.onMouseEnter?.(e);
            }}
            onMouseLeave={(e) => {
                if (isDisabled) return;

                props.onMouseLeave?.(e);
            }}
        >
            {props.renderContent(props.flags)}

            {ColorAreaUtils.AXES.map((axis) => (
                <input
                    key={axis}
                    ref={axisRefSetters[axis]}
                    type="range"
                    name={props.name && `${props.name}-${axis}`}
                    className={ColorAreaStyles.colorAreaAxis}
                    min={ColorAreaUtils.AXIS_MIN}
                    max={ColorAreaUtils.AXIS_MAX}
                    step={props.step}
                    aria-label={props.axisLabels[axis]}
                    aria-valuetext={ColorAreaUtils.computeValueText(props.hsv, axis)}
                    aria-disabled={isDisabled || undefined}
                    onInput={(e) => {
                        const element = e.currentTarget;

                        if (!isDisabled) props.setAxis(axis, Number(element.value));

                        ColorAreaUtils.syncAxis(element, props.hsv, axis);
                    }}
                    onFocus={(e) =>
                        props.setFocusVisibleAxis(
                            isPressedRef.current ? undefined : readFocusVisibleAxis(e.currentTarget, axis),
                        )
                    }
                    onKeyDown={(e) => props.setFocusVisibleAxis(readFocusVisibleAxis(e.currentTarget, axis))}
                    onBlur={() => props.setFocusVisibleAxis(undefined)}
                />
            ))}
        </div>
    );
};

export const ColorArea = (props: ColorAreaProps) => {
    const [hsv, setHsv] = props.hsvState;

    const [focusVisibleAxis, setFocusVisibleAxis] = useState<ColorAreaAxis>();
    const [isDragging, setIsDragging] = useState(false);

    const writeHsv = (next: Color.HSVA) => {
        setHsv(next);

        props.onInput?.(next);
    };

    const extraFlags: ColorAreaRenderProps = { hsv, isDragging, focusVisibleAxis };

    return (
        <InteractionWrapper<ColorAreaRenderProps>
            {...props}
            isTabbable={false}
            extraFlags={extraFlags}
            renderControl={(setElementRef, flags) => (
                <ColorAreaElement
                    ref={setElementRef}
                    id={props.id}
                    name={props.name}
                    ariaLabel={props.ariaLabel}
                    axisLabels={props.axisLabels}
                    step={props.step ?? COLOR_AREA_DEFAULTS.step}
                    flags={flags}
                    hsv={hsv}
                    isTabbable={props.isTabbable}
                    renderContent={props.renderContent}
                    setAxis={(axis, percent) => writeHsv(ColorAreaUtils.computeAxisHsv(hsv, axis, percent))}
                    setDragged={(ratio) => writeHsv(ColorAreaUtils.computeDraggedHsv(hsv, ratio))}
                    setFocusVisibleAxis={setFocusVisibleAxis}
                    setIsDragging={setIsDragging}
                    onMouseEnter={props.onMouseEnter}
                    onMouseLeave={props.onMouseLeave}
                />
            )}
        />
    );
};
