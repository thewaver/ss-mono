import type { ReactNode } from "react";
import { useMemo, useState } from "react";

import type { AnchorPlacement } from "@thewaver/ss-components-react";
import {
    ColorInput,
    FileInput,
    NumberInput,
    Select,
    SignalMirrorReactUtils,
    TextInput,
    Toggle,
} from "@thewaver/ss-components-react";
import { COLOR_INPUT_LABELS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import {
    FIELD_GAP,
    FIELD_PADDING,
    FIELD_STEPPER_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

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

const DEFAULT_NUMBER_FIELD_WIDTH = 100;
const DEFAULT_SELECT_FIELD_WIDTH = 150;
const EMPTY_TEXT = "";

const renderFieldPopup = (
    renderOptions: () => ReactNode,
    visibilityTarget: 0 | 1,
    transitionDurationMs: number,
    placement: AnchorPlacement,
) => (
    <PagePopoverSurface
        visibilityTarget={visibilityTarget}
        transitionDurationMs={transitionDurationMs}
        placement={placement}
    >
        {renderOptions()}
    </PagePopoverSurface>
);

export const PageNumberField = (props: PageNumberFieldProps) => {
    useFieldReset(props.value, (value) => props.onInput(value));

    const valueState = SignalMirrorReactUtils.useValueMirror<number | undefined>(props.value, (value) => {
        if (value === undefined) return;

        props.onInput(value);
    });

    return (
        <NumberInput
            valueState={valueState}
            id={props.id}
            min={props.min}
            max={props.max}
            step={props.step}
            isDisabled={props.isDisabled}
            ariaLabel={props.ariaLabel}
            padding={FIELD_STEPPER_PADDING}
            gap={FIELD_GAP}
            computeTextStyle={computePageTextFieldTextStyle}
            renderContent={(flags) => (
                <PageTextFieldContent flags={flags} width={props.width ?? DEFAULT_NUMBER_FIELD_WIDTH} />
            )}
            renderTrailing={(flags, stepper) => <PageNumberInputStepper flags={flags} stepper={stepper} />}
        />
    );
};

export const PageTextField = (props: PageTextFieldProps) => {
    useFieldReset(props.value, (value) => props.onInput(value));

    return (
        <TextInput
            valueState={[props.value, props.onInput]}
            isDisabled={props.isDisabled}
            ariaLabel={props.ariaLabel}
            padding={FIELD_PADDING}
            gap={FIELD_GAP}
            computeTextStyle={computePageTextFieldTextStyle}
            renderContent={(flags) => <PageTextFieldContent flags={flags} width={props.width} />}
            renderPlaceholder={
                props.placeholder === undefined
                    ? undefined
                    : (flags) => <PageTextFieldPlaceholder flags={flags}>{props.placeholder}</PageTextFieldPlaceholder>
            }
        />
    );
};

export const PageSelectField = <T,>(props: PageSelectFieldProps<T>) => {
    useFieldReset(props.value, (value) => props.onChange(value));

    const options = useMemo(() => props.values.map((value) => ({ value })), [props.values]);

    const setValue = (value: T | undefined) => {
        if (value === undefined) return;

        props.onChange(value);
    };

    return (
        <Select
            valueState={[props.value, setValue]}
            options={options}
            isDisabled={props.isDisabled}
            ariaLabel={props.ariaLabel}
            renderContent={(selectedOption, flags) => (
                <PageSelectContent flags={flags} width={props.width ?? DEFAULT_SELECT_FIELD_WIDTH}>
                    {selectedOption !== undefined
                        ? (props.computeLabel?.(selectedOption.value) ?? String(selectedOption.value))
                        : EMPTY_TEXT}
                </PageSelectContent>
            )}
            renderOption={(option, flags) => (
                <PageSelectOptionContent flags={flags}>
                    {props.computeLabel?.(option.value) ?? String(option.value)}
                </PageSelectOptionContent>
            )}
            renderPopup={renderFieldPopup}
        />
    );
};

export const PageGroupedSelectField = <T,>(props: PageGroupedSelectFieldProps<T>) => {
    useFieldReset(props.value, (value) => props.onChange(value));

    const options = useMemo(
        () => props.groups.map(([label, values]) => ({ label, options: values.map((value) => ({ value })) })),
        [props.groups],
    );

    const setValue = (value: T | undefined) => {
        if (value === undefined) return;

        props.onChange(value);
    };

    return (
        <Select
            valueState={[props.value, setValue]}
            options={options}
            isDisabled={props.isDisabled}
            ariaLabel={props.ariaLabel}
            renderContent={(selectedOption, flags) => (
                <PageSelectContent flags={flags} width={props.width ?? DEFAULT_SELECT_FIELD_WIDTH}>
                    {selectedOption !== undefined
                        ? (props.computeLabel?.(selectedOption.value) ?? String(selectedOption.value))
                        : EMPTY_TEXT}
                </PageSelectContent>
            )}
            renderGroup={(group) => <PageSelectGroupContent>{group.label}</PageSelectGroupContent>}
            renderOption={(option, flags) => (
                <PageSelectOptionContent flags={flags}>
                    {props.computeLabel?.(option.value) ?? String(option.value)}
                </PageSelectOptionContent>
            )}
            renderPopup={renderFieldPopup}
        />
    );
};

export const PageCheckField = (props: PageCheckFieldProps) => {
    useFieldReset(props.value, (value) => props.onChange(value));

    return (
        <Toggle
            checkedState={[props.value, props.onChange]}
            isDisabled={props.isDisabled}
            ariaLabel={props.ariaLabel}
            renderContent={(flags) => <PageToggleContent flags={flags} />}
        />
    );
};

export const PageColorField = (props: PageColorFieldProps) => {
    useFieldReset(props.value, (value) => props.onInput(value));

    return (
        <ColorInput
            valueState={[props.value, props.onInput]}
            {...COLOR_INPUT_LABELS}
            isDisabled={props.isDisabled}
            ariaLabel={props.ariaLabel}
            renderContent={(renderProps) => <PageColorInputContent renderProps={renderProps} isCompact={true} />}
            {...pageColorPickerSlots}
        />
    );
};

export const PageFileField = (props: PageFileFieldProps) => {
    const filesState = useState<File[]>([]);

    return (
        <FileInput
            filesState={filesState}
            accept={props.accept}
            isDisabled={props.isDisabled}
            ariaLabel={props.ariaLabel}
            renderContent={(renderProps) => <PageFileInputContent renderProps={renderProps} />}
            onChange={(files) => {
                if (!files.length) return;

                props.onPick(files[0]);
            }}
        />
    );
};
