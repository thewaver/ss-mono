import type { JSX } from "solid-js";
import { createSignal } from "solid-js";

import type { AnchorPlacement } from "@thewaver/ss-components";
import {
    ColorInput,
    FileInput,
    NumberInput,
    Select,
    SignalMirrorUtils,
    TextInput,
    Toggle,
    access,
} from "@thewaver/ss-components";

import { PageColorInputContent } from "../../StyledComponents/ColorInputContent/ColorInputContent";
import { PageFileInputContent } from "../../StyledComponents/FileInputContent/FileInputContent";
import { PagePopoverSurface } from "../../StyledComponents/PopoverSurface/PopoverSurface";
import { PageSelectContent } from "../../StyledComponents/SelectContent/SelectContent";
import { PageSelectGroupContent } from "../../StyledComponents/SelectGroupContent/SelectGroupContent";
import { PageSelectOptionContent } from "../../StyledComponents/SelectOptionContent/SelectOptionContent";
import {
    PageTextFieldContent,
    computePageTextFieldTextStyle,
} from "../../StyledComponents/TextFieldContent/TextFieldContent";
import { PageTextFieldPlaceholder } from "../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder";
import { PageToggleContent } from "../../StyledComponents/ToggleContent/ToggleContent";
import { COLOR_INPUT_LABELS } from "../Announcements/Announcements.const";
import { pageColorPickerSlots } from "../ColorPicker/ColorPicker";
import { PageNumberInputStepper } from "../NumberInputStepper/NumberInputStepper";
import { useFieldReset } from "./Field.context";
import type {
    PageCheckFieldProps,
    PageColorFieldProps,
    PageFileFieldProps,
    PageGroupedSelectFieldProps,
    PageNumberFieldProps,
    PageSelectFieldProps,
    PageTextFieldProps,
} from "./Field.types";

import {
    FIELD_GAP,
    FIELD_PADDING,
    FIELD_STEPPER_PADDING,
} from "../../StyledComponents/TextFieldContent/TextFieldContent.css";

const DEFAULT_NUMBER_FIELD_WIDTH = 100;
const DEFAULT_SELECT_FIELD_WIDTH = 150;
const EMPTY_TEXT = "";

const renderFieldPopup = (
    renderOptions: () => JSX.Element,
    getVisibilityTarget: () => 0 | 1,
    getTransitionDurationMs: () => number,
    getPlacement: () => AnchorPlacement,
) => (
    <PagePopoverSurface
        visibilityTarget={getVisibilityTarget}
        transitionDurationMs={getTransitionDurationMs}
        placement={getPlacement}
    >
        {renderOptions()}
    </PagePopoverSurface>
);

export const PageNumberField = (props: PageNumberFieldProps) => {
    useFieldReset(
        () => access(props.value),
        (value) => props.onInput(value),
    );

    const valueSignal = SignalMirrorUtils.createValueMirror<number | undefined>(
        () => access(props.value),
        (value) => {
            if (value === undefined) return;

            props.onInput(value);
        },
    );

    return (
        <NumberInput
            valueSignal={valueSignal}
            id={props.id}
            min={props.min}
            max={props.max}
            step={props.step}
            isDisabled={props.isDisabled}
            ariaLabel={props.ariaLabel}
            padding={() => FIELD_STEPPER_PADDING}
            gap={() => FIELD_GAP}
            computeTextStyle={computePageTextFieldTextStyle}
            renderContent={(getFlags) => (
                <PageTextFieldContent
                    flags={getFlags}
                    width={() => access(props.width) ?? DEFAULT_NUMBER_FIELD_WIDTH}
                />
            )}
            renderTrailing={(getFlags, stepper) => <PageNumberInputStepper flags={getFlags} stepper={stepper} />}
        />
    );
};

export const PageTextField = (props: PageTextFieldProps) => {
    useFieldReset(
        () => access(props.value),
        (value) => props.onInput(value),
    );

    return (
        <TextInput
            valueSignal={[() => access(props.value), props.onInput]}
            isDisabled={props.isDisabled}
            ariaLabel={props.ariaLabel}
            padding={() => FIELD_PADDING}
            gap={() => FIELD_GAP}
            computeTextStyle={computePageTextFieldTextStyle}
            renderContent={(getFlags) => <PageTextFieldContent flags={getFlags} width={props.width} />}
            renderPlaceholder={
                props.placeholder === undefined
                    ? undefined
                    : (getFlags) => (
                          <PageTextFieldPlaceholder flags={getFlags}>
                              {access(props.placeholder)}
                          </PageTextFieldPlaceholder>
                      )
            }
        />
    );
};

export const PageSelectField = <T,>(props: PageSelectFieldProps<T>) => {
    const getValue = () => access(props.value);

    useFieldReset(getValue, (value) => props.onChange(value));

    const setValue = (value: T | undefined) => {
        if (value === undefined) return;

        props.onChange(value);
    };

    return (
        <Select
            valueSignal={[getValue, setValue]}
            options={() => access(props.values).map((value) => ({ value }))}
            isDisabled={props.isDisabled}
            ariaLabel={props.ariaLabel}
            renderContent={(getSelectedOption, getFlags) => (
                <PageSelectContent flags={getFlags} width={() => access(props.width) ?? DEFAULT_SELECT_FIELD_WIDTH}>
                    {getSelectedOption() !== undefined
                        ? (props.computeLabel?.(getSelectedOption()!.value) ?? String(getSelectedOption()!.value))
                        : EMPTY_TEXT}
                </PageSelectContent>
            )}
            renderOption={(getOption, getFlags) => (
                <PageSelectOptionContent flags={getFlags}>
                    {props.computeLabel?.(getOption().value) ?? String(getOption().value)}
                </PageSelectOptionContent>
            )}
            renderPopup={renderFieldPopup}
        />
    );
};

export const PageGroupedSelectField = <T,>(props: PageGroupedSelectFieldProps<T>) => {
    const getValue = () => access(props.value);

    useFieldReset(getValue, (value) => props.onChange(value));

    const setValue = (value: T | undefined) => {
        if (value === undefined) return;

        props.onChange(value);
    };

    return (
        <Select
            valueSignal={[getValue, setValue]}
            options={() =>
                access(props.groups).map(([label, values]) => ({ label, options: values.map((value) => ({ value })) }))
            }
            isDisabled={props.isDisabled}
            ariaLabel={props.ariaLabel}
            renderContent={(getSelectedOption, getFlags) => (
                <PageSelectContent flags={getFlags} width={() => access(props.width) ?? DEFAULT_SELECT_FIELD_WIDTH}>
                    {getSelectedOption() !== undefined
                        ? (props.computeLabel?.(getSelectedOption()!.value) ?? String(getSelectedOption()!.value))
                        : EMPTY_TEXT}
                </PageSelectContent>
            )}
            renderGroup={(getGroup) => <PageSelectGroupContent>{getGroup().label}</PageSelectGroupContent>}
            renderOption={(getOption, getFlags) => (
                <PageSelectOptionContent flags={getFlags}>
                    {props.computeLabel?.(getOption().value) ?? String(getOption().value)}
                </PageSelectOptionContent>
            )}
            renderPopup={renderFieldPopup}
        />
    );
};

export const PageCheckField = (props: PageCheckFieldProps) => {
    useFieldReset(
        () => access(props.value),
        (value) => props.onChange(value),
    );

    return (
        <Toggle
            checkedSignal={[() => access(props.value), props.onChange]}
            isDisabled={props.isDisabled}
            ariaLabel={props.ariaLabel}
            renderContent={(getFlags) => <PageToggleContent flags={getFlags} />}
        />
    );
};

export const PageColorField = (props: PageColorFieldProps) => {
    useFieldReset(
        () => access(props.value),
        (value) => props.onInput(value),
    );

    return (
        <ColorInput
            valueSignal={[() => access(props.value), props.onInput]}
            {...COLOR_INPUT_LABELS}
            isDisabled={props.isDisabled}
            ariaLabel={props.ariaLabel}
            renderContent={(getRenderProps) => <PageColorInputContent renderProps={getRenderProps} isCompact={true} />}
            {...pageColorPickerSlots}
        />
    );
};

export const PageFileField = (props: PageFileFieldProps) => {
    const filesSignal = createSignal<File[]>([]);

    return (
        <FileInput
            filesSignal={filesSignal}
            accept={props.accept}
            isDisabled={props.isDisabled}
            ariaLabel={props.ariaLabel}
            renderContent={(getRenderProps) => <PageFileInputContent renderProps={getRenderProps} />}
            onChange={(files) => {
                if (!files.length) return;

                props.onPick(files[0]);
            }}
        />
    );
};
