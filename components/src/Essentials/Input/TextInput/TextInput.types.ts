export type BaseTextInputValues<T> = {
    /** Names the list of suggestions for assistive technology. A listbox has to be named, so it cannot be left out. */
    suggestionsAriaLabel: string;
    /**
     * What the field suggests as the reader types. Passing it turns the field into a combobox: typing and the down
     * arrow open the list, the arrows walk it, Enter writes the highlighted suggestion's text into the field and
     * Escape closes it. The value stays whatever text is in the field, and nothing is highlighted until the reader
     * moves into the list, so Enter on typed text still means that text. The consumer narrows the list; the field
     * never decides what matches, and the list closes by itself while there is nothing to show.
     */
    suggestions: T[];
};

export type BaseTextInputCbs<T> = {
    /**
     * The text a picked suggestion writes into the field. Left out, it is the suggestion's text as a screen reader
     * would read it, which skips anything the painter marked `aria-hidden`.
     */
    computeCustomSuggestionText?: (suggestion: T) => string;
    /** Runs when a suggestion is picked, after its text has been written into the field. */
    onSuggestionPick?: (suggestion: T) => void;
};

export type BaseTextInputProps<T> = BaseTextInputValues<T> & BaseTextInputCbs<T>;
