export type FormFieldContextType = {
    getDescriptionId: () => string | undefined;
    registerControl: (element: HTMLElement) => void;
    unregisterControl: (element: HTMLElement) => void;
};
