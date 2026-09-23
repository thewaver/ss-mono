import { createSignal } from "solid-js";

import { InteractionWrapper } from "../../Primitives/InteractionWrapper/InteractionWrapper";
import { access } from "../../Utils/propUtils";
import { LabelUtils } from "../Input/Label/Label.utils";
import { BUTTON_DEFAULTS } from "./Button.const";
import type { ButtonElementProps, ButtonFlags, ButtonProps } from "./Button.types";

import * as styles from "./Button.css";

const ButtonElement = (props: ButtonElementProps) => {
    const getAriaLabel = LabelUtils.resolveAriaLabel(
        props.ariaLabel === undefined ? undefined : () => access(props.ariaLabel)!,
    );

    const getIsDisabled = () => access(props.flags).isDisabled ?? false;

    const getIsPending = () => access(props.flags).isPending;

    const getIsRefusing = () => getIsDisabled() || getIsPending();

    return (
        <button
            id={access(props.id)}
            ref={(element) => props.ref?.(element)}
            type={access(props.type) ?? BUTTON_DEFAULTS.type}
            class={styles.buttonElement}
            aria-label={getAriaLabel()}
            aria-disabled={getIsDisabled() || undefined}
            aria-pressed={access(props.flags).isPressed}
            aria-busy={getIsPending() || undefined}
            onClick={(e) => {
                if (getIsRefusing()) {
                    e.preventDefault();

                    return;
                }

                void props.onClick?.(e);
            }}
            onPointerDown={(e) => {
                if (getIsRefusing()) return;

                void props.onPointerDown?.(e);
            }}
            onPointerUp={(e) => {
                if (getIsRefusing()) return;

                void props.onPointerUp?.(e);
            }}
            onPointerCancel={(e) => {
                if (getIsRefusing()) return;

                void props.onPointerUp?.(e);
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

export const Button = (props: ButtonProps) => {
    const [getIsPending, setIsPending] = createSignal(false);

    const handleClick = (e: MouseEvent | KeyboardEvent) => {
        const result = props.onClick?.(e);

        if (!(result instanceof Promise)) return;

        setIsPending(true);

        void result.finally(() => setIsPending(false));
    };

    return (
        <InteractionWrapper<ButtonFlags>
            {...props}
            extraFlags={() => ({ isPending: getIsPending() })}
            onActivation={
                props.onActivation &&
                ((activation) => {
                    if (getIsPending()) return;

                    props.onActivation?.(activation);
                })
            }
            renderControl={(setElementRef, getFlags) => (
                <ButtonElement
                    ref={setElementRef}
                    ariaLabel={props.ariaLabel}
                    type={props.type}
                    id={props.id}
                    flags={getFlags}
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
