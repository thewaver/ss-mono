export type DismisserReason = "press" | "focus" | "escape";

export type DismisserLayerDefs = {
    getRoots: () => (HTMLElement | null | undefined)[];
    onDismiss: (reason: DismisserReason) => void;
};
