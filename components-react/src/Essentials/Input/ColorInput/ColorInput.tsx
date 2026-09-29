import { useCallback, useEffect, useId, useRef, useState } from "react";

import {
    COLOR_INPUT_DEFAULTS,
    type ColorInputRenderProps,
    ColorInputStyles,
    ColorInputUtils,
} from "@thewaver/ss-components";
import type { Color } from "@thewaver/ss-utils";

import { SignalMirrorReactUtils } from "../../../Abstracts/SignalMirror/SignalMirrorReact.utils";
import { InteractionWrapper } from "../../../Primitives/InteractionWrapper/InteractionWrapper";
import { Popover } from "../../../Primitives/Popover/Popover";
import { useLatest } from "../../../Utils/refUtils";
import { ColorArea } from "../ColorArea/ColorArea";
import { FormFieldReactUtils } from "../FormField/FormFieldReact.utils";
import { LabelReactUtils } from "../Label/LabelReact.utils";
import { Range } from "../Range/Range";
import type { ColorInputFieldProps, ColorInputProps } from "./ColorInput.types";

const ColorInputField = (props: ColorInputFieldProps) => {
    const ariaLabel = LabelReactUtils.useAriaLabel(props.ariaLabel);
    const ariaDescribedBy = FormFieldReactUtils.useAriaDescribedBy();

    const elementRef = useRef<HTMLButtonElement | null>(null);
    const latestRef = useLatest(props.ref);

    FormFieldReactUtils.useRegisterControl(elementRef);

    const isDisabled = props.flags.isDisabled ?? false;

    const setRef = useCallback(
        (element: HTMLButtonElement | null) => {
            elementRef.current = element;
            latestRef.current?.(element);
        },
        [latestRef],
    );

    return (
        <button
            id={props.id}
            ref={setRef}
            type="button"
            className={ColorInputStyles.colorInputField}
            aria-label={ariaLabel}
            aria-describedby={ariaDescribedBy}
            aria-haspopup="dialog"
            aria-expanded={props.isOpen}
            aria-controls={props.isOpen ? props.popupId : undefined}
            aria-disabled={isDisabled || undefined}
            aria-invalid={props.flags.hasError || undefined}
            onClick={() => {
                if (isDisabled) return;

                props.onToggle();
            }}
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
        </button>
    );
};

export const ColorInput = (props: ColorInputProps) => {
    const popupId = useId();

    const [fieldElement, setFieldElement] = useState<HTMLElement>();
    const [isOpen, setIsOpen] = SignalMirrorReactUtils.useOptionalState(props.visibility, false);

    const [value, setValue] = props.value;

    const [startingState] = useState(() => ColorInputUtils.computeStartingState(value));
    const [hsv, setHsv] = useState<Color.HSVA>(startingState.hsv);
    const [notation, setNotation] = useState<Color.Notation>(startingState.notation);
    const [isUnreadable, setIsUnreadable] = useState(startingState.isUnreadable);

    const isDisabled = props.isDisabled ?? false;

    const latest = useLatest({ value, setValue, hsv, notation, isUnreadable, onInput: props.onInput });
    const latestRef = useLatest(props.ref);

    useEffect(() => {
        if (isOpen && isDisabled) setIsOpen(false);
    }, [isOpen, isDisabled, setIsOpen]);

    useEffect(() => {
        const incoming = ColorInputUtils.computeIncoming(value, latest.current.hsv);

        setIsUnreadable(incoming.isUnreadable);

        if (incoming.notation !== undefined) setNotation(incoming.notation);

        if (incoming.hsv !== undefined) setHsv(incoming.hsv);
    }, [value, latest]);

    useEffect(() => {
        const current = latest.current;
        const next = ColorInputUtils.computeOutgoing(hsv, current.notation, current.value, current.isUnreadable);

        if (next === undefined) return;

        current.setValue(next);
        current.onInput?.(next);
    }, [hsv, latest]);

    const open = () => {
        if (isDisabled) return;

        setIsOpen(true);
    };

    const dismiss = () => {
        if (!isOpen) return;

        setIsOpen(false);
        fieldElement?.focus();
    };

    const setFieldRef = useCallback(
        (element: HTMLElement | null) => {
            setFieldElement(element ?? undefined);
            latestRef.current?.(element);
        },
        [latestRef],
    );

    const hsvState = [hsv, setHsv] as const;

    const renderSurface = () => (
        <>
            <ColorArea
                hsv={hsvState}
                sizing={"fill"}
                isDisabled={isDisabled}
                ariaLabel={props.areaLabel}
                axisLabels={props.areaAxisLabels}
                renderContent={props.renderArea}
            />

            <Range
                value={[hsv.h, (hue) => setHsv((previous) => ({ ...previous, h: hue }))]}
                sizing={"fill"}
                isDisabled={isDisabled}
                max={ColorInputUtils.HUE_MAX}
                step={ColorInputUtils.HUE_STEP}
                ariaLabel={props.hueLabel}
                renderContent={props.renderHue}
            />
        </>
    );

    const extraFlags: ColorInputRenderProps = { value, hsv, isOpen, isUnreadable };

    return (
        <>
            <InteractionWrapper<ColorInputRenderProps>
                {...props}
                hasError={(props.hasError ?? false) || isUnreadable}
                extraFlags={extraFlags}
                ref={setFieldRef}
                renderControl={(setElementRef, flags) => (
                    <ColorInputField
                        ref={setElementRef}
                        id={props.id}
                        ariaLabel={props.ariaLabel}
                        popupId={popupId}
                        isOpen={isOpen}
                        flags={flags}
                        renderContent={props.renderContent}
                        onToggle={() => (isOpen ? setIsOpen(false) : open())}
                        onMouseEnter={props.onMouseEnter}
                        onMouseLeave={props.onMouseLeave}
                    />
                )}
            />

            <Popover
                id={popupId}
                role={"dialog"}
                ariaAttributes={{ "aria-label": props.pickerLabel }}
                isOpen={isOpen}
                anchorRef={fieldElement}
                placement={props.placement ?? COLOR_INPUT_DEFAULTS.placement}
                offset={props.offset}
                transitionDurationMs={props.transitionDurationMs}
                hasAutoFocus={true}
                onDismiss={(reason) => (reason === "escape" ? dismiss() : setIsOpen(false))}
                renderContent={(visibilityTarget, transitionDurationMs) =>
                    props.renderPopup(renderSurface, hsvState, visibilityTarget, transitionDurationMs)
                }
            />
        </>
    );
};
