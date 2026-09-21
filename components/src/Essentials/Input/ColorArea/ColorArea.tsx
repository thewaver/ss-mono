import { For, createRenderEffect, createSignal } from "solid-js";

import { Color, MathUtils } from "@thewaver/ss-utils";

import { InteractionTrackerUtils } from "../../../Abstracts/InteractionTracker/InteractionTracker.utils";
import { InteractionWrapper } from "../../../Primitives/InteractionWrapper/InteractionWrapper";
import { access, accessSignal } from "../../../Utils/propUtils";
import { LabelUtils } from "../Label/Label.utils";
import type { ColorAreaAxis, ColorAreaElementProps, ColorAreaProps, ColorAreaRenderProps } from "./ColorArea.types";

import * as styles from "./ColorArea.css";

const DEFAULT_COLOR_AREA_STEP = 1;
const DEFAULT_COLOR_AREA_AXIS_LABELS: Record<ColorAreaAxis, string> = {
    saturation: "Saturation",
    brightness: "Brightness",
};

const AXES: ColorAreaAxis[] = ["saturation", "brightness"];
const PERCENT_MIN = 0;
const PERCENT_MAX = 100;
const RATIO_MAX = 1;

const readFocusVisibleAxis = (element: HTMLElement, axis: ColorAreaAxis) =>
    InteractionTrackerUtils.computeIsFocusVisible(element) ? axis : undefined;

const getAxisPercent = (hsv: Color.HSVA, axis: ColorAreaAxis) => (axis === "saturation" ? hsv.s : hsv.v);

const ColorAreaElement = (props: ColorAreaElementProps) => {
    const getAriaLabel = LabelUtils.resolveAriaLabel(
        props.ariaLabel === undefined ? undefined : () => access(props.ariaLabel)!,
    );

    const [getSurfaceRef, setSurfaceRef] = createSignal<HTMLElement>();
    const [getAxisRefs, setAxisRefs] = createSignal<Partial<Record<ColorAreaAxis, HTMLInputElement>>>({});

    const getIsDisabled = () => access(props.flags).isDisabled ?? false;

    const { getIsDragging } = InteractionTrackerUtils.trackDrag(getSurfaceRef, getIsDisabled, {
        onDrag: (ratio) => {
            props.setAxes(ratio.x * PERCENT_MAX, (RATIO_MAX - ratio.y) * PERCENT_MAX);
            getAxisRefs().saturation?.focus();
        },
    });

    createRenderEffect(() => {
        props.setIsDragging(getIsDragging());
    });

    const syncAxis = (element: HTMLInputElement, axis: ColorAreaAxis) => {
        const value = `${getAxisPercent(access(props.hsv), axis)}`;

        if (element.value === value) return;

        element.value = value;
    };

    createRenderEffect(() => {
        for (const axis of AXES) {
            const element = getAxisRefs()[axis];

            if (element) syncAxis(element, axis);
        }
    });

    InteractionTrackerUtils.wrapExtraControls(() => AXES.map((axis) => getAxisRefs()[axis]), getIsDisabled, {
        getIsTabbable: props.isTabbable === undefined ? undefined : () => access(props.isTabbable)!,
    });

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

            <For each={AXES}>
                {(axis) => (
                    <input
                        ref={(element) => setAxisRefs((prev) => ({ ...prev, [axis]: element }))}
                        type="range"
                        name={access(props.name) && `${access(props.name)}-${axis}`}
                        class={styles.colorAreaAxis}
                        min={PERCENT_MIN}
                        max={PERCENT_MAX}
                        step={access(props.step)}
                        aria-label={access(props.axisLabels)[axis]}
                        aria-valuetext={`${Math.round(getAxisPercent(access(props.hsv), axis))}%`}
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
        const clamped = MathUtils.clamp(percent, PERCENT_MIN, PERCENT_MAX);
        const hsv = hsvSignal[0]();

        writeHsv(axis === "saturation" ? { ...hsv, s: clamped } : { ...hsv, v: clamped });
    };

    const setAxes = (saturation: number, brightness: number) => {
        writeHsv({
            ...hsvSignal[0](),
            s: MathUtils.clamp(saturation, PERCENT_MIN, PERCENT_MAX),
            v: MathUtils.clamp(brightness, PERCENT_MIN, PERCENT_MAX),
        });
    };

    return (
        <InteractionWrapper
            {...props}
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
                    axisLabels={() => access(props.axisLabels) ?? DEFAULT_COLOR_AREA_AXIS_LABELS}
                    step={() => access(props.step) ?? DEFAULT_COLOR_AREA_STEP}
                    flags={getRenderProps}
                    hsv={() => hsvSignal[0]()}
                    isTabbable={props.isTabbable}
                    renderContent={props.renderContent}
                    setAxes={setAxes}
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
