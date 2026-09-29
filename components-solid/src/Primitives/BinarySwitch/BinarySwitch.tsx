import { createRenderEffect, createSignal } from "solid-js";

import { type BinarySwitchFlags, BinarySwitchUtils, BinarySwitchStyles as styles } from "@thewaver/ss-components";

import { FormFieldSolidUtils } from "../../Essentials/Input/FormField/FormFieldSolid.utils";
import { LabelSolidUtils } from "../../Essentials/Input/Label/LabelSolid.utils";
import { access } from "../../Utils/propUtils";
import { InteractionWrapper } from "../InteractionWrapper/InteractionWrapper";
import type { BinarySwitchElementProps, BinarySwitchProps } from "./BinarySwitchSolid.types";

const BinarySwitchElement = (props: BinarySwitchElementProps) => {
    const getAriaLabel = LabelSolidUtils.resolveAriaLabel(
        props.ariaLabel === undefined ? undefined : () => access(props.ariaLabel)!,
    );
    const getAriaDescribedBy = FormFieldSolidUtils.resolveAriaDescribedBy();

    const [getElementRef, setElementRef] = createSignal<HTMLInputElement>();

    FormFieldSolidUtils.registerControl(getElementRef);

    const getIsDisabled = () => access(props.flags).isDisabled ?? false;

    const getIsMixed = () => access(props.isMixed) ?? false;

    const getRole = () => BinarySwitchUtils.computeRole(access(props.isSwitch) ?? false, getIsMixed());

    const syncElement = (element: HTMLInputElement) =>
        BinarySwitchUtils.syncElement(element, access(props.isChecked), getIsMixed());

    createRenderEffect(() => {
        const element = getElementRef();

        if (!element) return;

        syncElement(element);
    });

    return (
        <>
            {props.renderContent(() => access(props.flags))}

            <input
                id={access(props.id)}
                ref={(element) => {
                    setElementRef(element);
                    props.ref?.(element);
                }}
                type={access(props.type)}
                name={access(props.name)}
                role={getRole()}
                class={styles.binarySwitchElement}
                aria-label={getAriaLabel()}
                aria-describedby={getAriaDescribedBy()}
                aria-disabled={getIsDisabled() || undefined}
                aria-required={access(props.isRequired) || undefined}
                aria-invalid={access(props.flags).hasError || undefined}
                onClick={(e) => {
                    if (getIsDisabled()) e.preventDefault();
                }}
                onChange={(e) => {
                    const element = e.currentTarget;

                    if (getIsDisabled()) return;

                    void props.onChange?.(element.checked);

                    syncElement(element);
                }}
                onMouseEnter={(e) => {
                    if (getIsDisabled()) return;

                    void props.onMouseEnter?.(e);
                }}
                onMouseLeave={(e) => {
                    if (getIsDisabled()) return;

                    void props.onMouseLeave?.(e);
                }}
            />
        </>
    );
};

export const BinarySwitch = (props: BinarySwitchProps) => {
    return (
        <InteractionWrapper
            {...props}
            extraFlags={(): BinarySwitchFlags => ({
                checkedState: BinarySwitchUtils.computeCheckedState(
                    access(props.isChecked),
                    access(props.isMixed) ?? false,
                ),
            })}
            renderControl={(setElementRef, getFlags) => (
                <BinarySwitchElement
                    ref={setElementRef}
                    id={props.id}
                    type={props.type}
                    isSwitch={props.isSwitch}
                    name={props.name}
                    ariaLabel={props.ariaLabel}
                    isRequired={props.isRequired}
                    flags={getFlags}
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
