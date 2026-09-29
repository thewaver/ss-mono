import { useLayoutEffect, useMemo, useState } from "react";

import { type FormEntry, type FormState, FormUtils } from "@thewaver/ss-components";

import { useLatest } from "../../Utils/refUtils";
import { FormContextProvider } from "./Form.context";
import type { FormReactContextType } from "./Form.context.types";
import type { FormProps } from "./Form.types";

export const Form = (props: FormProps) => {
    const [entries, setEntries] = useState<FormEntry[]>([]);
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [focusRequest, setFocusRequest] = useState(0);
    const [, setVersion] = useState(0);

    const latestEntries = useLatest(entries);

    const [registry] = useState(() => ({
        register: (entry: FormEntry) => setEntries((prev) => [...prev, entry]),
        unregister: (entry: FormEntry) => setEntries((prev) => prev.filter((held) => held !== entry)),
        reportChange: () => setVersion((version) => version + 1),
    }));

    const isValid = FormUtils.computeIsValid(entries);

    const context = useMemo(
        (): FormReactContextType => ({
            ...registry,
            getIsValid: () => isValid,
            getHasSubmitted: () => hasSubmitted,
        }),
        [registry, isValid, hasSubmitted],
    );

    useLayoutEffect(() => {
        if (focusRequest < 1) return;

        FormUtils.findErrorFocusTarget(latestEntries.current)?.focus();
    }, [focusRequest, latestEntries]);

    const state: FormState = { isValid, hasSubmitted };

    return (
        <form
            id={props.id}
            name={props.name}
            aria-label={props.ariaLabel}
            aria-labelledby={props.ariaLabelledBy}
            noValidate
            onSubmit={(e) => {
                e.preventDefault();

                setHasSubmitted(true);
                setFocusRequest((count) => count + 1);

                props.onSubmit?.();
            }}
            onReset={(e) => {
                e.preventDefault();

                setHasSubmitted(false);

                props.onReset?.();
            }}
        >
            <FormContextProvider value={context}>{props.renderContent(state)}</FormContextProvider>
        </form>
    );
};
