import type { VNodeChild } from "vue";

export type PageExampleKnobsButtonProps = {
    exampleKey: string;
    exampleName: string;
};

export type PageExampleKnobsButtonSlots = {
    renderKnobs: () => VNodeChild;
};
