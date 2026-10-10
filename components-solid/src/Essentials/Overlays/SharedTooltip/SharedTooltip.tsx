import { Show, createSignal } from "solid-js";

import { Tooltip } from "../Tooltip/Tooltip";
import { SharedTooltipContextProvider } from "./SharedTooltip.context";
import type { SharedTooltipClaim, SharedTooltipProps } from "./SharedTooltipSolid.types";

export const SharedTooltip = (props: SharedTooltipProps) => {
    const [getClaim, setClaim] = createSignal<SharedTooltipClaim>();

    const getTooltipProps = () => getClaim()?.getTooltipProps();

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
                        anchorRef={() => getClaim()?.anchorRef}
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
