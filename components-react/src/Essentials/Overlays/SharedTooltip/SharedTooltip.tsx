import { Fragment, useMemo, useState } from "react";

import { Tooltip } from "../Tooltip/Tooltip";
import { SharedTooltipContextProvider } from "./SharedTooltip.context";
import type { SharedTooltipClaim, SharedTooltipReactContextType } from "./SharedTooltip.context.types";
import type { SharedTooltipProps } from "./SharedTooltip.types";

type KeyedClaim = SharedTooltipClaim & { key: number; lastTooltipProps: SharedTooltipClaim["tooltipProps"] };

export const SharedTooltip = (props: SharedTooltipProps) => {
    const [claim, setClaim] = useState<KeyedClaim>();

    const context = useMemo(
        (): SharedTooltipReactContextType => ({
            claim: (next) =>
                setClaim((previous) =>
                    next.anchorRef === previous?.anchorRef
                        ? previous
                        : { ...next, key: (previous?.key ?? 0) + 1, lastTooltipProps: next.tooltipProps },
                ),
            update: (next) =>
                setClaim((previous) =>
                    next.anchorRef === previous?.anchorRef && next.tooltipProps !== previous.tooltipProps
                        ? {
                              ...previous,
                              tooltipProps: next.tooltipProps,
                              lastTooltipProps: next.tooltipProps ?? previous.lastTooltipProps,
                          }
                        : previous,
                ),
            release: (anchorRef) => setClaim((previous) => (anchorRef === previous?.anchorRef ? undefined : previous)),
        }),
        [],
    );

    const tooltipProps = claim?.lastTooltipProps;

    return (
        <SharedTooltipContextProvider value={context}>
            {props.children}

            {claim && tooltipProps && (
                <Tooltip
                    {...tooltipProps}
                    anchorRef={claim.tooltipProps ? claim.anchorRef : undefined}
                    renderContent={(visibilityTarget, transitionDurationMs, placement, arrowAim) => (
                        <Fragment key={claim.key}>
                            {tooltipProps.renderContent(visibilityTarget, transitionDurationMs, placement, arrowAim)}
                        </Fragment>
                    )}
                />
            )}
        </SharedTooltipContextProvider>
    );
};
