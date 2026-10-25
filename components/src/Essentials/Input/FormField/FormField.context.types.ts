export type FormFieldContextType = {
    getDescriptionId: () => string | undefined;
    getCaptionId: () => string | undefined;
    registerControl: (element: HTMLElement) => void;
    unregisterControl: (element: HTMLElement) => void;
};
