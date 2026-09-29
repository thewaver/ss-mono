import type { Signal } from "solid-js";
import { createEffect, createMemo, createSignal, createUniqueId, untrack } from "solid-js";

import {
    COLOR_INPUT_DEFAULTS,
    type ColorInputRenderProps,
    ColorInputUtils,
    ColorInputStyles as styles,
} from "@thewaver/ss-components";
import type { Color } from "@thewaver/ss-utils";

import { SignalMirrorSolidUtils } from "../../../Abstracts/SignalMirror/SignalMirrorSolid.utils";
import { InteractionWrapper } from "../../../Primitives/InteractionWrapper/InteractionWrapper";
import { Popover } from "../../../Primitives/Popover/Popover";
import { access } from "../../../Utils/propUtils";
import { ColorArea } from "../ColorArea/ColorArea";
import { FormFieldSolidUtils } from "../FormField/FormFieldSolid.utils";
import { LabelSolidUtils } from "../Label/LabelSolid.utils";
import { Range } from "../Range/Range";
import type { ColorInputFieldProps, ColorInputProps } from "./ColorInputSolid.types";

const ColorInputField = (props: ColorInputFieldProps) => {
    const getAriaLabel = LabelSolidUtils.resolveAriaLabel(
        props.ariaLabel === undefined ? undefined : () => access(props.ariaLabel)!,
    );
    const getAriaDescribedBy = FormFieldSolidUtils.resolveAriaDescribedBy();

    const [getElementRef, setElementRef] = createSignal<HTMLElement>();

    FormFieldSolidUtils.registerControl(getElementRef);

    const getIsDisabled = () => access(props.flags).isDisabled ?? false;

    return (
        <button
            id={access(props.id)}
            ref={(element) => {
                setElementRef(element);
                props.ref?.(element);
            }}
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
    const [getIsOpen, setIsOpen] = SignalMirrorSolidUtils.createOptional(() => props.visibility, false);
    const startingState = ColorInputUtils.computeStartingState(props.value[0]());

    const [getHsv, setHsv] = createSignal<Color.HSVA>(startingState.hsv);
    const [getNotation, setNotation] = createSignal<Color.Notation>(startingState.notation);
    const [getIsUnreadable, setIsUnreadable] = createSignal(startingState.isUnreadable);

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
        const incoming = ColorInputUtils.computeIncoming(props.value[0](), untrack(getHsv));

        setIsUnreadable(incoming.isUnreadable);

        if (incoming.notation !== undefined) setNotation(incoming.notation);

        if (incoming.hsv !== undefined) setHsv(() => incoming.hsv!);
    });

    createEffect(() => {
        const hsv = getHsv();
        const value = untrack(() =>
            ColorInputUtils.computeOutgoing(hsv, getNotation(), props.value[0](), getIsUnreadable()),
        );

        if (value === undefined) return;

        props.value[1](value);

        void props.onInput?.(value);
    });

    const renderSurface = () => (
        <>
            <ColorArea
                hsv={hsvSignal}
                sizing={"fill"}
                isDisabled={getIsDisabled}
                ariaLabel={props.areaLabel}
                axisLabels={props.areaAxisLabels}
                renderContent={props.renderArea}
            />

            <Range
                value={hueSignal}
                sizing={"fill"}
                isDisabled={getIsDisabled}
                max={() => ColorInputUtils.HUE_MAX}
                step={() => ColorInputUtils.HUE_STEP}
                ariaLabel={props.hueLabel}
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
                    value: props.value[0](),
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
                    "aria-label": access(props.pickerLabel),
                })}
                isOpen={getIsOpen}
                anchorRef={getFieldRef}
                placement={() => access(props.placement) ?? COLOR_INPUT_DEFAULTS.placement}
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
