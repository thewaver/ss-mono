import { useState } from "react";

import { Button, Menu } from "@thewaver/ss-components-react";

import { PageButtonContent } from "../../../../StyledComponents/ButtonContent/ButtonContent";
import { PageMenuTriggerContent } from "../../../../StyledComponents/MenuTriggerContent/MenuTriggerContent";
import { ACTIONS, renderMenuItem, renderMenuPopup } from "../MenuPage.const";
import type { MenuDrivenExampleProps } from "../MenuPage.types";

type Props = MenuDrivenExampleProps;

export const DrivenExample = (props: Props) => {
    const [anchorRef, setAnchorRef] = useState<HTMLElement>();

    const [isOpen, setIsOpen] = props.visibilityState;

    return (
        <>
            <Menu
                visibilityState={props.visibilityState}
                anchorRef={anchorRef}
                items={ACTIONS}
                ariaLabel={"Edit actions"}
                renderContent={(flags) => <PageMenuTriggerContent flags={flags}>Edit</PageMenuTriggerContent>}
                renderItem={renderMenuItem}
                renderPopup={renderMenuPopup}
                onActivate={props.onActivate}
            />

            <Button
                ref={(element) => setAnchorRef(element ?? undefined)}
                id={"menuToggle"}
                ariaLabel={"Toggle the menu from outside"}
                renderContent={(flags) => (
                    <PageButtonContent flags={flags}>{isOpen ? "Close it" : "Open it"}</PageButtonContent>
                )}
                onClick={() => {
                    setIsOpen(!isOpen);
                }}
            />
        </>
    );
};
