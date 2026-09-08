export type DismisserReason = "press" | "focus" | "escape" | "anchorGone";

export type DismisserLayerDefs = {
    getRoots: () => (HTMLElement | null | undefined)[];
    onDismiss: (reason: DismisserReason) => void;
};
