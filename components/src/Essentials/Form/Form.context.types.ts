export type FormEntry = {
    getHasError: () => boolean;
    getFocusTarget?: () => HTMLElement | undefined;
};

export type FormContextType = {
    register: (entry: FormEntry) => void;
    unregister: (entry: FormEntry) => void;
    getIsValid: () => boolean;
    getHasSubmitted: () => boolean;
};
