import { useState } from "react";

import { Button, Drawer } from "@thewaver/ss-components-react";
import { FILLERS } from "@thewaver/ss-playground/App/Pages/DrawerPage/DrawerPage.const";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { PageDrawerPanel } from "../../../StyledComponents/DrawerPanel/DrawerPanel";
import { PageModalOverlay } from "../../../StyledComponents/ModalOverlay/ModalOverlay";
import type { DrawerSwipeDocsExampleProps } from "../DrawerPageReact.types";

type Props = DrawerSwipeDocsExampleProps;

export const SwipeDocsExample = (props: Props) => {
    const visibility = useState(false);

    const [, setIsOpen] = visibility;

    return (
        <>
            <Button
                id={"openSheet"}
                renderContent={(flags) => <PageButtonContent flags={flags}>Open sheet</PageButtonContent>}
                onClick={() => {
                    setIsOpen(true);
                }}
            />

            <Drawer
                visibility={visibility}
                edge={"bottom"}
                isDismissableOnOverlayClick={props.isDismissableOnOverlayClick}
                ariaLabel={"Trees"}
                renderOverlay={(visibilityTarget, transitionDurationMs) => (
                    <PageModalOverlay visibilityTarget={visibilityTarget} transitionDurationMs={transitionDurationMs} />
                )}
                renderContent={(visibilityTarget, transitionDurationMs) => (
                    <PageDrawerPanel
                        edge={"bottom"}
                        visibilityTarget={visibilityTarget}
                        transitionDurationMs={transitionDurationMs}
                    >
                        <div>Attached to the bottom edge.</div>

                        <Button
                            renderContent={(flags) => <PageButtonContent flags={flags}>Close</PageButtonContent>}
                            onClick={() => {
                                setIsOpen(false);
                            }}
                        />

                        {FILLERS.map((caption, index) => (
                            <div key={index}>{caption}</div>
                        ))}
                    </PageDrawerPanel>
                )}
            />
        </>
    );
};
