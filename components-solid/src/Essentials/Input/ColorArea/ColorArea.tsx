import { For, createRenderEffect, createSignal } from "solid-js";

import {
    COLOR_AREA_DEFAULTS,
    type ColorAreaAxis,
    type ColorAreaRenderProps,
    ColorAreaUtils,
    InteractionTrackerUtils,
    ColorAreaStyles as styles,
} from "@thewaver/ss-components";
import type { Color } from "@thewaver/ss-utils";

import { InteractionTrackerSolidUtils } from "../../../Abstracts/InteractionTracker/InteractionTrackerSolid.utils";
import { InteractionWrapper } from "../../../Primitives/InteractionWrapper/InteractionWrapper";
import { access, accessSignal } from "../../../Utils/propUtils";
import { LabelSolidUtils } from "../Label/LabelSolid.utils";
import type { ColorAreaElementProps, ColorAreaProps } from "./ColorAreaSolid.types";

const readFocusVisibleAxis = (element: HTMLElement, axis: ColorAreaAxis) =>
    InteractionTrackerUtils.computeIsFocusVisible(element) ? axis : undefined;

const ColorAreaElement = (props: ColorAreaElementProps) => {
    const getAriaLabel = LabelSolidUtils.resolveAriaLabel(
        props.ariaLabel === undefined ? undefined : () => access(props.ariaLabel)!,
    );

    const [getSurfaceRef, setSurfaceRef] = createSignal<HTMLElement>();
    const [getAxisRefs, setAxisRefs] = createSignal<Partial<Record<ColorAreaAxis, HTMLInputElement>>>({});

    const getIsDisabled = () => access(props.flags).isDisabled ?? false;

    const { getIsDragging } = InteractionTrackerSolidUtils.trackDrag(getSurfaceRef, getIsDisabled, {
        onDrag: (ratio) => {
            props.setDragged(ratio);
            getAxisRefs().saturation?.focus();
        },
    });

    createRenderEffect(() => {
        props.setIsDragging(getIsDragging());
    });

    const syncAxis = (element: HTMLInputElement, axis: ColorAreaAxis) =>
        ColorAreaUtils.syncAxis(element, access(props.hsv), axis);

    createRenderEffect(() => {
        for (const axis of ColorAreaUtils.AXES) {
            const element = getAxisRefs()[axis];

            if (element) syncAxis(element, axis);
        }
    });

    InteractionTrackerSolidUtils.wrapExtraControls(
        () => ColorAreaUtils.AXES.map((axis) => getAxisRefs()[axis]),
        getIsDisabled,
        {
            getIsTabbable: props.isTabbable === undefined ? undefined : () => access(props.isTabbable)!,
        },
    );

    return (
        <div
            ref={(element) => {
                setSurfaceRef(element);
                props.ref?.(element);
            }}
            id={access(props.id)}
            class={styles.colorAreaSurface}
            role="group"
            aria-label={getAriaLabel()}
            aria-disabled={getIsDisabled() || undefined}
            aria-invalid={access(props.flags).hasError || undefined}
            onMouseEnter={(e) => {
                if (getIsDisabled()) return;

                void props.onMouseEnter?.(e);
            }}
            onMouseLeave={(e) => {
                if (getIsDisabled()) return;

                void props.onMouseLeave?.(e);
            }}
        >
            {props.renderContent(() => access(props.flags))}

            <For each={ColorAreaUtils.AXES}>
                {(axis) => (
                    <input
                        ref={(element) => setAxisRefs((prev) => ({ ...prev, [axis]: element }))}
                        type="range"
                        name={access(props.name) && `${access(props.name)}-${axis}`}
                        class={styles.colorAreaAxis}
                        min={ColorAreaUtils.AXIS_MIN}
                        max={ColorAreaUtils.AXIS_MAX}
                        step={access(props.step)}
                        aria-label={access(props.axisLabels)[axis]}
                        aria-valuetext={ColorAreaUtils.computeValueText(access(props.hsv), axis)}
                        aria-disabled={getIsDisabled() || undefined}
                        onInput={(e) => {
                            const element = e.currentTarget;

                            if (!getIsDisabled()) props.setAxis(axis, Number(element.value));

                            syncAxis(element, axis);
                        }}
                        onFocus={(e) =>
                            props.setFocusVisibleAxis(
                                getIsDragging() ? undefined : readFocusVisibleAxis(e.currentTarget, axis),
                            )
                        }
                        onKeyDown={(e) => props.setFocusVisibleAxis(readFocusVisibleAxis(e.currentTarget, axis))}
                        onBlur={() => props.setFocusVisibleAxis(undefined)}
                    />
                )}
            </For>
        </div>
    );
};

export const ColorArea = (props: ColorAreaProps) => {
    const hsvSignal = accessSignal(() => props.hsvSignal);

    const [getFocusVisibleAxis, setFocusVisibleAxis] = createSignal<ColorAreaAxis>();
    const [getIsDragging, setIsDragging] = createSignal(false);

    const writeHsv = (next: Color.HSVA) => {
        hsvSignal[1](() => next);

        void props.onInput?.(next);
    };

    const setAxis = (axis: ColorAreaAxis, percent: number) => {
        writeHsv(ColorAreaUtils.computeAxisHsv(hsvSignal[0](), axis, percent));
    };

    const setDragged = (ratio: { x: number; y: number }) => {
        writeHsv(ColorAreaUtils.computeDraggedHsv(hsvSignal[0](), ratio));
    };

    return (
        <InteractionWrapper
            {...props}
            isTabbable={false}
            extraFlags={(): ColorAreaRenderProps => ({
                hsv: hsvSignal[0](),
                isDragging: getIsDragging(),
                focusVisibleAxis: getFocusVisibleAxis(),
            })}
            renderControl={(setElementRef, getRenderProps) => (
                <ColorAreaElement
                    ref={setElementRef}
                    id={props.id}
                    name={props.name}
                    ariaLabel={props.ariaLabel}
                    axisLabels={props.axisLabels}
                    step={() => access(props.step) ?? COLOR_AREA_DEFAULTS.step}
                    flags={getRenderProps}
                    hsv={() => hsvSignal[0]()}
                    isTabbable={props.isTabbable}
                    renderContent={props.renderContent}
                    setDragged={setDragged}
                    setAxis={setAxis}
                    setFocusVisibleAxis={setFocusVisibleAxis}
                    setIsDragging={setIsDragging}
                    onMouseEnter={props.onMouseEnter}
                    onMouseLeave={props.onMouseLeave}
                />
            )}
        />
    );
};
