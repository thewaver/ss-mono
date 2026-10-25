import { createSignal } from "solid-js";

import { Button, Modal, Select } from "@thewaver/ss-components-solid";
import type { SelectOption } from "@thewaver/ss-components-solid";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater";
import { PageModalOverlay } from "../../../StyledComponents/ModalOverlay/ModalOverlay";
import { PageModalPanel } from "../../../StyledComponents/ModalPanel/ModalPanel";
import { PagePopoverSurface } from "../../../StyledComponents/PopoverSurface/PopoverSurface";
import { PageSelectContent } from "../../../StyledComponents/SelectContent/SelectContent";
import { PageSelectOptionContent } from "../../../StyledComponents/SelectOptionContent/SelectOptionContent";

const LAYERED_TITLE_ID = "modal-page-layered-title";

const COUNTRIES: SelectOption<string>[] = [{ value: "Denmark" }, { value: "Portugal" }, { value: "Sweden" }];

export const LayeredDocsExample = () => {
    const visibility = createSignal(false);
    const countrySignal = createSignal<string | undefined>();

    const [, setIsOpen] = visibility;

    return (
        <>
            <Button
                id={"openLayers"}
                renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Open layers</PageButtonContent>}
                onClick={() => {
                    setIsOpen(true);
                }}
            />

            <Modal
                visibility={visibility}
                ariaLabelledBy={LAYERED_TITLE_ID}
                renderOverlay={(getVisibilityTarget, getTransitionDurationMs) => (
                    <PageModalOverlay
                        visibilityTarget={getVisibilityTarget}
                        transitionDurationMs={getTransitionDurationMs}
                    />
                )}
                renderContent={(getVisibilityTarget, getTransitionDurationMs) => (
                    <PageModalPanel
                        visibilityTarget={getVisibilityTarget}
                        transitionDurationMs={getTransitionDurationMs}
                    >
                        <div id={LAYERED_TITLE_ID}>Where are you flying from?</div>

                        <Select
                            renderHighlightFloater={renderPageHighlightFloater}
                            value={countrySignal}
                            options={COUNTRIES}
                            ariaLabel={"Country"}
                            renderContent={(getSelectedOption, getFlags) => (
                                <PageSelectContent flags={getFlags}>
                                    {getSelectedOption()?.value ?? "Pick one"}
                                </PageSelectContent>
                            )}
                            renderOption={(getOption, getFlags) => (
                                <PageSelectOptionContent isGliding flags={getFlags}>
                                    {getOption().value}
                                </PageSelectOptionContent>
                            )}
                            renderPopup={(
                                renderOptions,
                                getPopupVisibilityTarget,
                                getPopupTransitionDurationMs,
                                getPlacement,
                            ) => (
                                <PagePopoverSurface
                                    visibilityTarget={getPopupVisibilityTarget}
                                    transitionDurationMs={getPopupTransitionDurationMs}
                                    placement={getPlacement}
                                >
                                    {renderOptions()}
                                </PagePopoverSurface>
                            )}
                        />
                    </PageModalPanel>
                )}
            />
        </>
    );
};
