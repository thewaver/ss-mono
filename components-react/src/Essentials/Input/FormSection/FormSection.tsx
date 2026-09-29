import { useId, useLayoutEffect, useMemo, useState } from "react";

import {
    FORM_SECTION_DEFAULTS,
    type FormEntry,
    type FormSectionState,
    FormSectionStyles,
    FormUtils,
} from "@thewaver/ss-components";

import { useLatest } from "../../../Utils/refUtils";
import { FormContextProvider, useFormContext } from "../../Form/Form.context";
import type { FormReactContextType } from "../../Form/Form.context.types";
import type { FormSectionProps } from "./FormSection.types";

export const FormSection = (props: FormSectionProps) => {
    const messageId = useId();
    const outerContext = useFormContext();

    const [entries, setEntries] = useState<FormEntry[]>([]);
    const [, setVersion] = useState(0);

    const hasError = props.hasError ?? false;
    const hasMessage = (props.message ?? "").length > 0;
    const isValid = !hasError && FormUtils.computeIsValid(entries);
    const hasSubmitted = outerContext?.getHasSubmitted() ?? false;

    const latest = useLatest({ hasError, entries, reportOuterChange: outerContext?.reportChange });

    const [entry] = useState((): FormEntry => ({
        getHasError: () => latest.current.hasError || !FormUtils.computeIsValid(latest.current.entries),
        getFocusTarget: () => FormUtils.findSectionFocusTarget(latest.current.entries),
    }));

    const [registry] = useState(() => ({
        register: (held: FormEntry) => setEntries((prev) => [...prev, held]),
        unregister: (held: FormEntry) => setEntries((prev) => prev.filter((other) => other !== held)),
        reportChange: () => {
            setVersion((version) => version + 1);
            latest.current.reportOuterChange?.();
        },
    }));

    const register = outerContext?.register;
    const unregister = outerContext?.unregister;
    const reportOuterChange = outerContext?.reportChange;

    useLayoutEffect(() => {
        if (!register || !unregister) return;

        register(entry);

        return () => unregister(entry);
    }, [register, unregister, entry]);

    useLayoutEffect(() => reportOuterChange?.(), [reportOuterChange, hasError, entries]);

    const context = useMemo(
        (): FormReactContextType => ({
            ...registry,
            getIsValid: () => isValid,
            getHasSubmitted: () => hasSubmitted,
        }),
        [registry, isValid, hasSubmitted],
    );

    const state: FormSectionState = { isValid, hasError, hasMessage };

    return (
        <fieldset
            className={FormSectionStyles.formSectionRoot}
            style={{
                flexDirection:
                    (props.orientation ?? FORM_SECTION_DEFAULTS.orientation) === "horizontal" ? "row" : "column",
                gap: `${props.gap ?? FORM_SECTION_DEFAULTS.gap}px`,
            }}
            aria-label={props.ariaLabel}
            aria-describedby={hasMessage ? messageId : undefined}
        >
            {props.renderCaption && (
                <legend className={FormSectionStyles.formSectionCaption}>{props.renderCaption(state)}</legend>
            )}

            <FormContextProvider value={context}>{props.renderContent(state)}</FormContextProvider>

            {hasMessage && (
                <div id={messageId} role={hasError ? "alert" : undefined}>
                    {props.renderMessage?.(state) ?? props.message}
                </div>
            )}
        </fieldset>
    );
};
