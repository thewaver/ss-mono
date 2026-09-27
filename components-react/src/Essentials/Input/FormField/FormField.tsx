import { useId, useLayoutEffect, useMemo, useRef, useState } from "react";

import {
    FORM_FIELD_DEFAULTS,
    type FormEntry,
    type FormFieldContextType,
    type FormFieldState,
    FormFieldStyles,
} from "@thewaver/ss-components";

import { useLatest } from "../../../Utils/refUtils";
import { useFormContext } from "../../Form/Form.context";
import { FormFieldContextProvider } from "./FormField.context";
import type { FormFieldProps } from "./FormField.types";

export const FormField = (props: FormFieldProps) => {
    const messageId = useId();
    const formContext = useFormContext();

    const controlRef = useRef<HTMLElement | undefined>(undefined);

    const hasError = props.hasError ?? false;
    const hasMessage = (props.message ?? "").length > 0;
    const isRequired = props.isRequired ?? false;

    const latestHasError = useLatest(hasError);

    const [entry] = useState((): FormEntry => ({
        getHasError: () => latestHasError.current,
        getFocusTarget: () => controlRef.current,
    }));

    const [control] = useState(() => ({
        registerControl: (element: HTMLElement) => {
            controlRef.current = element;
        },
        unregisterControl: (element: HTMLElement) => {
            if (controlRef.current === element) controlRef.current = undefined;
        },
    }));

    const register = formContext?.register;
    const unregister = formContext?.unregister;
    const reportChange = formContext?.reportChange;

    useLayoutEffect(() => {
        if (!register || !unregister) return;

        register(entry);

        return () => unregister(entry);
    }, [register, unregister, entry]);

    useLayoutEffect(() => reportChange?.(), [reportChange, hasError]);

    const descriptionId = hasMessage ? messageId : undefined;

    const fieldContext = useMemo(
        (): FormFieldContextType => ({ getDescriptionId: () => descriptionId, ...control }),
        [descriptionId, control],
    );

    const state: FormFieldState = { hasError, hasMessage, isRequired };

    return (
        <div
            className={FormFieldStyles.formFieldRoot}
            style={{
                flexDirection:
                    (props.orientation ?? FORM_FIELD_DEFAULTS.orientation) === "horizontal" ? "row" : "column",
                gap: `${props.gap ?? FORM_FIELD_DEFAULTS.gap}px`,
            }}
        >
            {props.renderCaption?.(state)}

            <FormFieldContextProvider value={fieldContext}>{props.renderControl(state)}</FormFieldContextProvider>

            {hasMessage && (
                <div id={messageId} role={hasError ? "alert" : undefined}>
                    {props.renderMessage?.(state) ?? props.message}
                </div>
            )}
        </div>
    );
};
