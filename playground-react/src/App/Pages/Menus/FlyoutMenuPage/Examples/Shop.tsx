import { FlyoutMenu } from "@thewaver/ss-components-react";
import { OVERFLOW_CAPTION } from "@thewaver/ss-playground/App/Pages/Menus/FlyoutMenuPage/FlyoutMenuPage.const";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/FlyoutMenuContent/FlyoutMenuContent.css";

import { PageLayer } from "../../../../PageComponents/Layer/Layer";
import {
    PageFlyoutMenuLink,
    PageFlyoutMenuOverflowToggle,
    PageFlyoutMenuToggle,
} from "../../../../StyledComponents/FlyoutMenuContent/FlyoutMenuContent";
import { PagePopoverSurface } from "../../../../StyledComponents/PopoverSurface/PopoverSurface";
import type { FlyoutMenuExampleProps } from "../FlyoutMenuPageReact.types";

const OFFSET = { x: 0, y: 6 };

type Props = FlyoutMenuExampleProps;

export const ShopExample = (props: Props) => (
    <FlyoutMenu
        entries={props.entries}
        ariaLabel={"Shop"}
        offset={OFFSET}
        hoverShowDelayMs={props.hoverShowDelayMs}
        transitionDurationMs={props.transitionDurationMs}
        computeToggleLabel={(value) => `${value} submenu`}
        renderLink={(link, flags) => <PageFlyoutMenuLink flags={flags}>{link.value}</PageFlyoutMenuLink>}
        renderToggle={(_entry, flags) => <PageFlyoutMenuToggle flags={flags} />}
        renderOverflowToggle={(flags) => (
            <PageFlyoutMenuOverflowToggle flags={flags}>{OVERFLOW_CAPTION}</PageFlyoutMenuOverflowToggle>
        )}
        renderPanel={(renderLinks, visibilityTarget, transitionDurationMs, placement, size) => (
            <PageLayer level={2}>
                <PagePopoverSurface
                    visibilityTarget={visibilityTarget}
                    transitionDurationMs={transitionDurationMs}
                    placement={placement}
                >
                    <div
                        className={styles.flyoutMenuPanelBody}
                        style={{
                            width: size ? `${size.width}px` : undefined,
                            height: size ? `${size.height}px` : undefined,
                            transition: `width ${transitionDurationMs}ms ease, height ${transitionDurationMs}ms ease`,
                        }}
                    >
                        {renderLinks()}
                    </div>
                </PagePopoverSurface>
            </PageLayer>
        )}
    />
);
