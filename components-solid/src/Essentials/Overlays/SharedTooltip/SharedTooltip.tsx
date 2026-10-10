import { Show, createMemo, createSignal } from "solid-js";

import { Tooltip } from "../Tooltip/Tooltip";
import { SharedTooltipContextProvider } from "./SharedTooltip.context";
import type { SharedTooltipClaim, SharedTooltipProps } from "./SharedTooltipSolid.types";

export const SharedTooltip = (props: SharedTooltipProps) => {
    const [getClaim, setClaim] = createSignal<SharedTooltipClaim>();

    const getTooltipProps = createMemo<ReturnType<SharedTooltipClaim["getTooltipProps"]>>((previous) => {
        const claim = getClaim();

        return claim && (claim.getTooltipProps() ?? previous);
    });

    return (
        <SharedTooltipContextProvider
            value={{
                claim: (claim) => {
                    if (claim.anchorRef !== getClaim()?.anchorRef) setClaim(claim);
                },
                release: (anchorRef) => {
                    if (anchorRef === getClaim()?.anchorRef) setClaim(undefined);
                },
            }}
        >
            {props.children}

            <Show when={getTooltipProps()}>
                {(getShownProps) => (
                    <Tooltip
                        {...getShownProps()}
                        anchorRef={() => {
                            const claim = getClaim();

                            return claim?.getTooltipProps() ? claim.anchorRef : undefined;
                        }}
                        renderContent={(getVisibilityTarget, getTransitionDurationMs, getPlacement, getArrowAim) => (
                            <Show when={getClaim()} keyed>
                                {(claim) =>
                                    claim
                                        .getTooltipProps()
                                        ?.renderContent(
                                            getVisibilityTarget,
                                            getTransitionDurationMs,
                                            getPlacement,
                                            getArrowAim,
                                        )
                                }
                            </Show>
                        )}
                    />
                )}
            </Show>
        </SharedTooltipContextProvider>
    );
};
