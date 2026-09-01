import type { JSX } from "solid-js";
import { createSignal } from "solid-js";

import type { AnchorPlacement } from "@thewaver/ss-components";
import {
    Checkbox,
    ColorInput,
    FileInput,
    NumberInput,
    Select,
    SignalMirror,
    TextInput,
    access,
} from "@thewaver/ss-components";

import { PageCheckboxContent } from "../CheckboxContent/CheckboxContent";
import { pageColorPickerSlots } from "../ColorAreaContent/ColorAreaContent";
import { PageColorInputContent } from "../ColorInputContent/ColorInputContent";
import { PageFileInputContent } from "../FileInputContent/FileInputContent";
import { PageNumberInputStepper } from "../NumberInputStepper/NumberInputStepper";
import { PagePopoverSurface } from "../PopoverSurface/PopoverSurface";
import { PageSelectContent } from "../SelectContent/SelectContent";
import { PageSelectGroupContent } from "../SelectGroupContent/SelectGroupContent";
import { PageSelectOptionContent } from "../SelectOptionContent/SelectOptionContent";
import { PageTextFieldContent, computePageTextFieldTextStyle } from "../TextFieldContent/TextFieldContent";
import { PageTextFieldPlaceholder } from "../TextFieldPlaceholder/TextFieldPlaceholder";
import type {
    PageCheckFieldProps,
    PageColorFieldProps,
    PageFileFieldProps,
    PageGroupedSelectFieldProps,
    PageNumberFieldProps,
    PageSelectFieldProps,
    PageTextFieldProps,
} from "./Field.types";

import { FIELD_GAP, FIELD_PADDING, FIELD_STEPPER_PADDING } from "../TextFieldContent/TextFieldContent.css";

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
    const valueSignal = SignalMirror.createValueMirror<number | undefined>(
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
    return (
        <Checkbox
            checkedSignal={[() => access(props.value), props.onChange]}
            isDisabled={props.isDisabled}
            ariaLabel={props.ariaLabel}
            renderContent={(getFlags) => <PageCheckboxContent flags={getFlags} />}
        />
    );
};

export const PageColorField = (props: PageColorFieldProps) => {
    return (
        <ColorInput
            valueSignal={[() => access(props.value), props.onInput]}
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
