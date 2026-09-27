import type { ReactNode } from "react";

export type PageFilterStageProps = {
    filterId: string;
    label: string;
    renderDefs: () => ReactNode | undefined;
};
