import { useState } from "react";

import { Button, Drawer } from "@thewaver/ss-components-react";
import { FILLERS } from "@thewaver/ss-playground/App/Pages/DrawerPage/DrawerPage.const";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { PageDrawerPanel } from "../../../StyledComponents/DrawerPanel/DrawerPanel";
import { PageModalOverlay } from "../../../StyledComponents/ModalOverlay/ModalOverlay";
import type { DrawerBasicDocsExampleProps } from "../DrawerPageReact.types";

type Props = DrawerBasicDocsExampleProps;

export const BasicDocsExample = (props: Props) => {
    const visibility = useState(false);

    const [, setIsOpen] = visibility;

    return (
        <>
            <Button
                id={"openDrawer"}
                renderContent={(flags) => <PageButtonContent flags={flags}>Open drawer</PageButtonContent>}
                onClick={() => {
                    setIsOpen(true);
                }}
            />

            <Drawer
                visibility={visibility}
                edge={props.edge}
                transitionDurationMs={props.transitionDurationMs}
                ariaLabel={"Trees"}
                renderOverlay={(visibilityTarget, transitionDurationMs) => (
                    <PageModalOverlay visibilityTarget={visibilityTarget} transitionDurationMs={transitionDurationMs} />
                )}
                renderContent={(visibilityTarget, transitionDurationMs) => (
                    <PageDrawerPanel
                        edge={props.edge}
                        visibilityTarget={visibilityTarget}
                        transitionDurationMs={transitionDurationMs}
                    >
                        <div>Attached to the {props.edge} edge.</div>

                        {["First", "Second"].map((caption) => (
                            <Button
                                key={caption}
                                renderContent={(flags) => (
                                    <PageButtonContent flags={flags}>{caption}</PageButtonContent>
                                )}
                            />
                        ))}

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
