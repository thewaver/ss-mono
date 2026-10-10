import { Fragment, useMemo, useState } from "react";

import { Tooltip } from "../Tooltip/Tooltip";
import { SharedTooltipContextProvider } from "./SharedTooltip.context";
import type { SharedTooltipClaim, SharedTooltipReactContextType } from "./SharedTooltip.context.types";
import type { SharedTooltipProps } from "./SharedTooltip.types";

type KeyedClaim = SharedTooltipClaim & { key: number };

export const SharedTooltip = (props: SharedTooltipProps) => {
    const [claim, setClaim] = useState<KeyedClaim>();

    const context = useMemo(
        (): SharedTooltipReactContextType => ({
            claim: (next) =>
                setClaim((previous) =>
                    next.anchorRef === previous?.anchorRef ? previous : { ...next, key: (previous?.key ?? 0) + 1 },
                ),
            update: (next) =>
                setClaim((previous) =>
                    next.anchorRef === previous?.anchorRef && next.tooltipProps !== previous.tooltipProps
                        ? { ...previous, tooltipProps: next.tooltipProps }
                        : previous,
                ),
            release: (anchorRef) => setClaim((previous) => (anchorRef === previous?.anchorRef ? undefined : previous)),
        }),
        [],
    );

    const tooltipProps = claim?.tooltipProps;

    return (
        <SharedTooltipContextProvider value={context}>
            {props.children}

            {claim && tooltipProps && (
                <Tooltip
                    {...tooltipProps}
                    anchorRef={claim.anchorRef}
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
