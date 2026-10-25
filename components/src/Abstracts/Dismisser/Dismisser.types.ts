export type DismisserReason = "press" | "focus" | "escape" | "anchor_gone";

export type DismisserLayerDefs = {
    getRoots: () => (HTMLElement | null | undefined)[];
    onDismiss: (reason: DismisserReason) => void;
    isPassive?: boolean;
    group?: string;
};
