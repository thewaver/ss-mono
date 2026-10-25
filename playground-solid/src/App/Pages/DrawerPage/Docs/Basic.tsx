import { For, createSignal } from "solid-js";

import { Button, Drawer, access } from "@thewaver/ss-components-solid";
import { FILLERS } from "@thewaver/ss-playground/App/Pages/DrawerPage/DrawerPage.const";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { PageDrawerPanel } from "../../../StyledComponents/DrawerPanel/DrawerPanel";
import { PageModalOverlay } from "../../../StyledComponents/ModalOverlay/ModalOverlay";
import type { DrawerBasicDocsExampleProps } from "../DrawerPageSolid.types";

type Props = DrawerBasicDocsExampleProps;

export const BasicDocsExample = (props: Props) => {
    const visibility = createSignal(false);

    const [, setIsOpen] = visibility;

    return (
        <>
            <Button
                id={"openDrawer"}
                renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Open drawer</PageButtonContent>}
                onClick={() => {
                    setIsOpen(true);
                }}
            />

            <Drawer
                visibility={visibility}
                edge={props.edge}
                transitionDurationMs={props.transitionDurationMs}
                ariaLabel={"Trees"}
                renderOverlay={(getVisibilityTarget, getTransitionDurationMs) => (
                    <PageModalOverlay
                        visibilityTarget={getVisibilityTarget}
                        transitionDurationMs={getTransitionDurationMs}
                    />
                )}
                renderContent={(getVisibilityTarget, getTransitionDurationMs) => (
                    <PageDrawerPanel
                        edge={props.edge}
                        visibilityTarget={getVisibilityTarget}
                        transitionDurationMs={getTransitionDurationMs}
                    >
                        <div>Attached to the {access(props.edge)} edge.</div>

                        <For each={["First", "Second"]}>
                            {(caption) => (
                                <Button
                                    renderContent={(getFlags) => (
                                        <PageButtonContent flags={getFlags}>{caption}</PageButtonContent>
                                    )}
                                />
                            )}
                        </For>

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
