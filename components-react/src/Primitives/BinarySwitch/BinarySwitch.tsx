import { useCallback, useLayoutEffect, useRef } from "react";

import { type BinarySwitchFlags, BinarySwitchStyles, BinarySwitchUtils } from "@thewaver/ss-components";

import { FormFieldReactUtils } from "../../Essentials/Input/FormField/FormFieldReact.utils";
import { LabelReactUtils } from "../../Essentials/Input/Label/LabelReact.utils";
import { useLatest } from "../../Utils/refUtils";
import { InteractionWrapper } from "../InteractionWrapper/InteractionWrapper";
import type { BinarySwitchElementProps, BinarySwitchProps } from "./BinarySwitch.types";

const BinarySwitchElement = (props: BinarySwitchElementProps) => {
    const ariaLabel = LabelReactUtils.useAriaLabel(props.ariaLabel);
    const ariaDescribedBy = FormFieldReactUtils.useAriaDescribedBy();

    const elementRef = useRef<HTMLInputElement | null>(null);
    const latestRef = useLatest(props.ref);

    FormFieldReactUtils.useRegisterControl(elementRef);

    const isDisabled = props.flags.isDisabled ?? false;
    const isMixed = props.isMixed ?? false;

    useLayoutEffect(() => {
        if (elementRef.current) BinarySwitchUtils.syncElement(elementRef.current, props.isChecked, isMixed);
    });

    const setRef = useCallback(
        (element: HTMLInputElement | null) => {
            elementRef.current = element;
            latestRef.current?.(element);
        },
        [latestRef],
    );

    return (
        <>
            {props.renderContent(props.flags)}

            <input
                id={props.id}
                ref={setRef}
                type={props.type}
                name={props.name}
                role={BinarySwitchUtils.computeRole(props.isSwitch ?? false, isMixed)}
                className={BinarySwitchStyles.binarySwitchElement}
                aria-label={ariaLabel}
                aria-describedby={ariaDescribedBy}
                aria-disabled={isDisabled || undefined}
                aria-required={props.isRequired || undefined}
                aria-invalid={props.flags.hasError || undefined}
                onClick={(e) => {
                    if (isDisabled) e.preventDefault();
                }}
                onChange={(e) => {
                    const element = e.currentTarget;

                    if (isDisabled) return;

                    props.onChange?.(element.checked);

                    BinarySwitchUtils.syncElement(element, props.isChecked, isMixed);
                }}
                onMouseEnter={(e) => {
                    if (isDisabled) return;

                    props.onMouseEnter?.(e);
                }}
                onMouseLeave={(e) => {
                    if (isDisabled) return;

                    props.onMouseLeave?.(e);
                }}
            />
        </>
    );
};

export const BinarySwitch = (props: BinarySwitchProps) => {
    const extraFlags: BinarySwitchFlags = {
        checkedState: BinarySwitchUtils.computeCheckedState(props.isChecked, props.isMixed ?? false),
    };

    return (
        <InteractionWrapper<BinarySwitchFlags>
            {...props}
            extraFlags={extraFlags}
            renderControl={(setElementRef, flags) => (
                <BinarySwitchElement
                    ref={setElementRef}
                    id={props.id}
                    type={props.type}
                    isSwitch={props.isSwitch}
                    name={props.name}
                    ariaLabel={props.ariaLabel}
                    isRequired={props.isRequired}
                    flags={flags}
                    isChecked={props.isChecked}
                    isMixed={props.isMixed}
                    renderContent={props.renderContent}
                    onChange={props.onChange}
                    onMouseEnter={props.onMouseEnter}
                    onMouseLeave={props.onMouseLeave}
                />
            )}
        />
    );
};
