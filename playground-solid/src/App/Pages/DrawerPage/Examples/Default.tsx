import { For } from "solid-js";

import { Button, Drawer, access } from "@thewaver/ss-components-solid";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { PageDrawerPanel } from "../../../StyledComponents/DrawerPanel/DrawerPanel";
import { PageModalOverlay } from "../../../StyledComponents/ModalOverlay/ModalOverlay";
import type { DrawerExampleProps } from "../DrawerPage.types";

type Props = DrawerExampleProps;

export const DefaultExample = (props: Props) => {
    return (
        <>
            <Button
                renderContent={(getFlags) => (
                    <PageButtonContent flags={getFlags}>Open {access(props.edge)}</PageButtonContent>
                )}
                onClick={() => {
                    props.visibility[1](true);
                }}
            />

            <Drawer
                visibility={props.visibility}
                edge={props.edge}
                ariaLabel={() => `${access(props.edge)} drawer`}
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
                                props.visibility[1](false);
                            }}
                        />

                        <For each={access(props.fillers)}>{(caption) => <div>{caption}</div>}</For>
                    </PageDrawerPanel>
                )}
            />
        </>
    );
};
