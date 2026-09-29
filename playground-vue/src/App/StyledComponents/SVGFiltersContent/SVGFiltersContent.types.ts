import type { VNode } from "vue";

export type PageFilterStageProps = {
    filterId: string;
    label: string;
};

export type PageFilterStageSlots = {
    renderDefs: () => VNode[];
};
