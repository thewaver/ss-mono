import { For, createSignal } from "solid-js";

import { Button, Drawer } from "@thewaver/ss-components-solid";
import { FILLERS } from "@thewaver/ss-playground/App/Pages/DrawerPage/DrawerPage.const";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { PageDrawerPanel } from "../../../StyledComponents/DrawerPanel/DrawerPanel";
import { PageModalOverlay } from "../../../StyledComponents/ModalOverlay/ModalOverlay";
import type { DrawerSwipeDocsExampleProps } from "../DrawerPageSolid.types";

type Props = DrawerSwipeDocsExampleProps;

export const SwipeDocsExample = (props: Props) => {
    const visibility = createSignal(false);

    const [, setIsOpen] = visibility;

    return (
        <>
            <Button
                id={"openSheet"}
                renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Open sheet</PageButtonContent>}
                onClick={() => {
                    setIsOpen(true);
                }}
            />

            <Drawer
                visibility={visibility}
                edge={"bottom"}
                isDismissableOnOverlayClick={props.isDismissableOnOverlayClick}
                ariaLabel={"Trees"}
                renderOverlay={(getVisibilityTarget, getTransitionDurationMs) => (
                    <PageModalOverlay
                        visibilityTarget={getVisibilityTarget}
                        transitionDurationMs={getTransitionDurationMs}
                    />
                )}
                renderContent={(getVisibilityTarget, getTransitionDurationMs) => (
                    <PageDrawerPanel
                        edge={"bottom"}
                        visibilityTarget={getVisibilityTarget}
                        transitionDurationMs={getTransitionDurationMs}
                    >
                        <div>Attached to the bottom edge.</div>

                        <Button
                            renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Close</PageButtonContent>}
                            onClick={() => {
                                setIsOpen(false);
                            }}
                        />

                        <For each={FILLERS}>{(caption) => <div>{caption}</div>}</For>
                    </PageDrawerPanel>
                )}
            />
        </>
    );
};
