import { useState } from "react";

import { BUTTON_DEFAULTS, type ButtonFlags, ButtonStyles } from "@thewaver/ss-components";

import { InteractionWrapper } from "../../Primitives/InteractionWrapper/InteractionWrapper";
import { LabelReactUtils } from "../Input/Label/LabelReact.utils";
import type { ButtonElementProps, ButtonProps } from "./Button.types";

const ButtonElement = (props: ButtonElementProps) => {
    const ariaLabel = LabelReactUtils.useAriaLabel(props.ariaLabel);

    const isDisabled = props.flags.isDisabled ?? false;
    const isPending = props.flags.isPending;
    const isRefusing = isDisabled || isPending;

    return (
        <button
            id={props.id}
            ref={props.ref}
            type={props.type ?? BUTTON_DEFAULTS.type}
            className={ButtonStyles.buttonElement}
            aria-label={ariaLabel}
            aria-disabled={isDisabled || undefined}
            aria-pressed={props.flags.isPressed}
            aria-busy={isPending || undefined}
            onClick={(e) => {
                if (isRefusing) {
                    e.preventDefault();

                    return;
                }

                void props.onClick?.(e);
            }}
            onPointerDown={(e) => {
                if (isRefusing) return;

                props.onPointerDown?.(e);
            }}
            onPointerUp={(e) => {
                if (isRefusing) return;

                props.onPointerUp?.(e);
            }}
            onPointerCancel={(e) => {
                if (isRefusing) return;

                props.onPointerUp?.(e);
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

export const Button = (props: ButtonProps) => {
    const [isPending, setIsPending] = useState(false);

    const handleClick: ButtonProps["onClick"] = (e) => {
        const result = props.onClick?.(e);

        if (!(result instanceof Promise)) return;

        setIsPending(true);

        void result.finally(() => setIsPending(false));
    };

    return (
        <InteractionWrapper<ButtonFlags>
            {...props}
            extraFlags={{ isPending }}
            onActivation={
                props.onActivation &&
                ((activation) => {
                    if (isPending) return;

                    props.onActivation?.(activation);
                })
            }
            renderControl={(setElementRef, flags) => (
                <ButtonElement
                    ref={setElementRef}
                    ariaLabel={props.ariaLabel}
                    type={props.type}
                    id={props.id}
                    flags={flags}
                    renderContent={props.renderContent}
                    onClick={handleClick}
                    onPointerDown={props.onPointerDown}
                    onPointerUp={props.onPointerUp}
                    onMouseEnter={props.onMouseEnter}
                    onMouseLeave={props.onMouseLeave}
                />
            )}
        />
    );
};
