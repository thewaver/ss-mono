export type AccordionSizing = "fit-content" | "fill";

export type AccordionItem<T> = {
    value: T;
    isDisabled?: boolean;
    /**
     * Keeps this section's header in the tab order and the arrow-key walk while it is disabled, so focus can land on it
     * and a reader hears its name and that it is unavailable. It still cannot be opened or closed.
     */
    isReachableWhenDisabled?: boolean;
};
