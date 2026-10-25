import type { VNodeChild } from "vue";

export type CommandPalettePanelProps = {
    renderField: () => VNodeChild;
    renderOptions: () => VNodeChild;
    visibilityTarget: 0 | 1;
    transitionDurationMs: number;
    isEmpty: boolean;
};
