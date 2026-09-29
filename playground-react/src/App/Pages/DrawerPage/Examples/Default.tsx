import { Button, Drawer } from "@thewaver/ss-components-react";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { PageDrawerPanel } from "../../../StyledComponents/DrawerPanel/DrawerPanel";
import { PageModalOverlay } from "../../../StyledComponents/ModalOverlay/ModalOverlay";
import type { DrawerExampleProps } from "../DrawerPage.types";

type Props = DrawerExampleProps;

export const DefaultExample = (props: Props) => {
    return (
        <>
            <Button
                renderContent={(flags) => <PageButtonContent flags={flags}>Open {props.edge}</PageButtonContent>}
                onClick={() => {
                    props.visibility[1](true);
                }}
            />

            <Drawer
                visibility={props.visibility}
                edge={props.edge}
                ariaLabel={`${props.edge} drawer`}
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
                                props.visibility[1](false);
                            }}
                        />

                        {props.fillers.map((caption) => (
                            <div key={caption}>{caption}</div>
                        ))}
                    </PageDrawerPanel>
                )}
            />
        </>
    );
};
