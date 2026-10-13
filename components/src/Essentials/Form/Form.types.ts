export type FormState = {
    isValid: boolean;
    hasSubmitted: boolean;
};

export type BaseFormValues = {
    /** Identifies the form, so a control outside it can say it belongs to it. */
    id?: string;
    /** The form's name. */
    name?: string;
    /** Names the form for assistive technology. */
    ariaLabel?: string;
    /** Points at the element whose text names the form, for a form that already shows its own heading. */
    ariaLabelledBy?: string;
};

export type BaseFormCbs = {
    /**
     * Runs when the form is submitted, whether or not any field reports an error — the library validates nothing, so
     * it does not decide that a form may not be sent. Once the display the submit causes has been updated, focus moves
     * to the first field then reporting an error, in the order the fields were first drawn, so the reader lands on
     * what needs fixing. That update includes whatever this callback set and whatever the fields read from
     * `hasSubmitted`, so an error that only shows once the form has been sent still counts. Validation that arrives
     * later, after a request comes back, moves nothing, and moving focus at that point is the consumer's to time. If
     * the first field in error has no control that handed it an element through the field's control registration,
     * focus stays where it was.
     */
    onSubmit?: () => void;
    /** Runs when the form is reset. */
    onReset?: () => void;
};

export type BaseFormProps = BaseFormValues & BaseFormCbs;
