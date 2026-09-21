import type { Signal } from "solid-js";
import { createEffect, createMemo, createSignal, createUniqueId, untrack } from "solid-js";

import { Color } from "@thewaver/ss-utils";

import type { AnchorPlacement } from "../../../Abstracts/Anchor/Anchor.types";
import { SignalMirrorUtils } from "../../../Abstracts/SignalMirror/SignalMirror.utils";
import { InteractionWrapper } from "../../../Primitives/InteractionWrapper/InteractionWrapper";
import { Popover } from "../../../Primitives/Popover/Popover";
import { access } from "../../../Utils/propUtils";
import { ColorArea } from "../ColorArea/ColorArea";
import { FormFieldUtils } from "../FormField/FormField.utils";
import { LabelUtils } from "../Label/Label.utils";
import { Range } from "../Range/Range";
import type { ColorInputFieldProps, ColorInputProps, ColorInputRenderProps } from "./ColorInput.types";

import * as styles from "./ColorInput.css";

const DEFAULT_COLOR_INPUT_PLACEMENT: AnchorPlacement = { x: "left-in", y: "bottom-out" };
const DEFAULT_COLOR_INPUT_PICKER_LABEL = "Choose a color";
const DEFAULT_COLOR_INPUT_AREA_LABEL = "Saturation and brightness";
const DEFAULT_COLOR_INPUT_HUE_LABEL = "Hue";
const STARTING_COLOR: Color.HSVA = { h: 0, s: 0, v: 0, a: 1 };
const DEFAULT_NOTATION: Color.Notation = "hex";
const HUE_MAX = 360;
const HUE_STEP = 1;

const ColorInputField = (props: ColorInputFieldProps) => {
    const getAriaLabel = LabelUtils.resolveAriaLabel(
        props.ariaLabel === undefined ? undefined : () => access(props.ariaLabel)!,
    );
    const getAriaDescribedBy = FormFieldUtils.resolveAriaDescribedBy();

    const getIsDisabled = () => access(props.flags).isDisabled ?? false;

    return (
        <button
            id={access(props.id)}
            ref={(element) => props.ref?.(element)}
            type="button"
            class={styles.colorInputField}
            aria-label={getAriaLabel()}
            aria-describedby={getAriaDescribedBy()}
            aria-haspopup="dialog"
            aria-expanded={access(props.isOpen)}
            aria-controls={access(props.isOpen) ? access(props.popupId) : undefined}
            aria-disabled={getIsDisabled() || undefined}
            aria-invalid={access(props.flags).hasError || undefined}
            onClick={() => {
                if (getIsDisabled()) return;

                props.onToggle();
            }}
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
        </button>
    );
};

export const ColorInput = (props: ColorInputProps) => {
    const popupId = createUniqueId();

    const [getFieldRef, setFieldRef] = createSignal<HTMLElement>();
    const [getIsOpen, setIsOpen] = SignalMirrorUtils.createOptional(() => props.visibilitySignal, false);
    const startingValue = props.valueSignal[0]();

    const [getHsv, setHsv] = createSignal<Color.HSVA>(Color.parse(startingValue) ?? STARTING_COLOR);
    const [getNotation, setNotation] = createSignal<Color.Notation>(
        Color.getNotationOf(startingValue) ?? DEFAULT_NOTATION,
    );
    const [getIsUnreadable, setIsUnreadable] = createSignal(Color.parse(startingValue) === undefined);

    const toValue = (hsva: Color.HSVA) => Color.toNotation(hsva, untrack(getNotation));

    const hsvSignal: Signal<Color.HSVA> = [getHsv, setHsv];
    const hueSignal: Signal<number> = [() => getHsv().h, (hue) => setHueValue(hue)];

    const getIsDisabled = createMemo(() => access(props.isDisabled) ?? false);

    const setHueValue = (hue: number | ((prev: number) => number)) => {
        const next = typeof hue === "function" ? hue(untrack(() => getHsv().h)) : hue;

        setHsv((prev) => ({ ...prev, h: next }));

        return next;
    };

    const open = () => {
        if (getIsDisabled()) return;

        setIsOpen(true);
    };

    createEffect(() => {
        if (!getIsOpen() || !getIsDisabled()) return;

        setIsOpen(false);
    });

    const dismiss = () => {
        if (!getIsOpen()) return;

        setIsOpen(false);
        getFieldRef()?.focus();
    };

    createEffect(() => {
        const value = props.valueSignal[0]();
        const parsed = Color.parse(value);

        setIsUnreadable(parsed === undefined);

        if (parsed === undefined) return;

        setNotation(Color.getNotationOf(value) ?? DEFAULT_NOTATION);

        if (
            Color.isSame(
                value,
                untrack(() => toValue(getHsv())),
            )
        )
            return;

        setHsv(() => parsed);
    });

    createEffect(() => {
        const value = toValue(getHsv());

        if (untrack(getIsUnreadable)) return;

        if (Color.isSame(untrack(props.valueSignal[0]), value)) return;

        props.valueSignal[1](value);

        void props.onInput?.(value);
    });

    const renderSurface = () => (
        <>
            <ColorArea
                hsvSignal={hsvSignal}
                sizing={"fill"}
                isDisabled={getIsDisabled}
                ariaLabel={() => access(props.areaLabel) ?? DEFAULT_COLOR_INPUT_AREA_LABEL}
                renderContent={props.renderArea}
            />

            <Range
                valueSignal={hueSignal}
                sizing={"fill"}
                isDisabled={getIsDisabled}
                max={() => HUE_MAX}
                step={() => HUE_STEP}
                ariaLabel={() => access(props.hueLabel) ?? DEFAULT_COLOR_INPUT_HUE_LABEL}
                renderContent={props.renderHue}
            />
        </>
    );

    return (
        <>
            <InteractionWrapper
                {...props}
                hasError={() => (access(props.hasError) ?? false) || getIsUnreadable()}
                extraFlags={(): ColorInputRenderProps => ({
                    value: props.valueSignal[0](),
                    hsv: getHsv(),
                    isOpen: getIsOpen(),
                    isUnreadable: getIsUnreadable(),
                })}
                ref={(element) => {
                    setFieldRef(element);
                    props.ref?.(element);
                }}
                renderControl={(setElementRef, getRenderProps) => (
                    <ColorInputField
                        ref={setElementRef}
                        id={props.id}
                        ariaLabel={props.ariaLabel}
                        popupId={() => popupId}
                        isOpen={getIsOpen}
                        flags={getRenderProps}
                        renderContent={props.renderContent}
                        onToggle={() => (getIsOpen() ? setIsOpen(false) : open())}
                        onMouseEnter={props.onMouseEnter}
                        onMouseLeave={props.onMouseLeave}
                    />
                )}
            />

            <Popover
                id={() => popupId}
                role={"dialog"}
                ariaAttributes={() => ({
                    "aria-label": access(props.pickerLabel) ?? DEFAULT_COLOR_INPUT_PICKER_LABEL,
                })}
                isOpen={getIsOpen}
                anchorRef={getFieldRef}
                placement={() => access(props.placement) ?? DEFAULT_COLOR_INPUT_PLACEMENT}
                offset={props.offset}
                transitionDurationMs={props.transitionDurationMs}
                hasAutoFocus={true}
                onDismiss={(reason) => (reason === "escape" ? dismiss() : setIsOpen(false))}
                renderContent={(getVisibilityTarget, getTransitionDurationMs) =>
                    props.renderPopup(renderSurface, hsvSignal, getVisibilityTarget, getTransitionDurationMs)
                }
            />
        </>
    );
};
