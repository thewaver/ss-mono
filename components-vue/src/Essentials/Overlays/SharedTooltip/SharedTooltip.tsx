import { Fragment, type SlotsType, defineComponent, shallowRef } from "vue";

import type { SlotsContext } from "../../../Utils/typeUtils";
import { Tooltip } from "../Tooltip/Tooltip";
import type { TooltipSlots } from "../Tooltip/Tooltip.types";
import { provideSharedTooltipContext } from "./SharedTooltip.context";
import type { SharedTooltipClaim, SharedTooltipDefs } from "./SharedTooltip.context.types";
import type { SharedTooltipSlots } from "./SharedTooltip.types";

export const SharedTooltip = defineComponent(
    (_props: {}, { slots }: SlotsContext<SharedTooltipSlots>) => {
        const claim = shallowRef<SharedTooltipClaim>();
        const claimGeneration = shallowRef(0);

        let lastTooltipDefs: SharedTooltipDefs | undefined;

        provideSharedTooltipContext({
            claim: (next) => {
                if (next.anchorRef === claim.value?.anchorRef) return;

                claim.value = next;
                claimGeneration.value += 1;
            },
            release: (anchorRef) => {
                if (anchorRef === claim.value?.anchorRef) claim.value = undefined;
            },
        });

        return () => {
            const shown = claim.value;
            const currentTooltipDefs = shown?.getTooltipDefs();

            if (currentTooltipDefs) lastTooltipDefs = currentTooltipDefs;

            const tooltipDefs = lastTooltipDefs;
            const generation = claimGeneration.value;

            const renderTooltip = () => {
                if (!shown || !tooltipDefs) return null;

                const { renderContent, ...tooltipProps } = tooltipDefs;

                return (
                    <Tooltip {...tooltipProps} anchorRef={currentTooltipDefs ? shown.anchorRef : undefined}>
                        {
                            {
                                renderContent: (value) => <Fragment key={generation}>{renderContent(value)}</Fragment>,
                            } satisfies TooltipSlots
                        }
                    </Tooltip>
                );
            };

            return [slots.default?.(), renderTooltip()];
        };
    },
    {
        name: "SharedTooltip",
        slots: Object as SlotsType<SharedTooltipSlots>,
        props: [],
    },
);
