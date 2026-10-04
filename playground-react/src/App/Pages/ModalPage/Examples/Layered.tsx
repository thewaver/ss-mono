import { Button, Modal, Select } from "@thewaver/ss-components-react";
import type { SelectOption } from "@thewaver/ss-components-react";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater";
import { PageModalOverlay } from "../../../StyledComponents/ModalOverlay/ModalOverlay";
import { PageModalPanel } from "../../../StyledComponents/ModalPanel/ModalPanel";
import { PagePopoverSurface } from "../../../StyledComponents/PopoverSurface/PopoverSurface";
import { PageSelectContent } from "../../../StyledComponents/SelectContent/SelectContent";
import { PageSelectOptionContent } from "../../../StyledComponents/SelectOptionContent/SelectOptionContent";
import type { ModalLayeredExampleProps } from "../ModalPage.types";

const LAYERED_TITLE_ID = "modal-page-layered-title";

const COUNTRIES: SelectOption<string>[] = [{ value: "Denmark" }, { value: "Portugal" }, { value: "Sweden" }];

type Props = ModalLayeredExampleProps;

export const LayeredExample = (props: Props) => (
    <>
        <Button
            id={"openLayers"}
            renderContent={(flags) => <PageButtonContent flags={flags}>Open layers</PageButtonContent>}
            onClick={() => {
                props.visibility[1](true);
            }}
        />

        <Modal
            visibility={props.visibility}
            ariaLabelledBy={LAYERED_TITLE_ID}
            renderOverlay={(visibilityTarget, transitionDurationMs) => (
                <PageModalOverlay visibilityTarget={visibilityTarget} transitionDurationMs={transitionDurationMs} />
            )}
            renderContent={(visibilityTarget, transitionDurationMs) => (
                <PageModalPanel visibilityTarget={visibilityTarget} transitionDurationMs={transitionDurationMs}>
                    <div id={LAYERED_TITLE_ID}>Where are you flying from?</div>

                    <Select
                        renderHighlightFloater={renderPageHighlightFloater}
                        value={props.value}
                        options={COUNTRIES}
                        ariaLabel={"Country"}
                        renderContent={(selectedOption, flags) => (
                            <PageSelectContent flags={flags}>{selectedOption?.value ?? "Pick one"}</PageSelectContent>
                        )}
                        renderOption={(option, flags) => (
                            <PageSelectOptionContent isGliding flags={flags}>
                                {option.value}
                            </PageSelectOptionContent>
                        )}
                        renderPopup={(renderOptions, popupVisibilityTarget, popupTransitionDurationMs, placement) => (
                            <PagePopoverSurface
                                visibilityTarget={popupVisibilityTarget}
                                transitionDurationMs={popupTransitionDurationMs}
                                placement={placement}
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
