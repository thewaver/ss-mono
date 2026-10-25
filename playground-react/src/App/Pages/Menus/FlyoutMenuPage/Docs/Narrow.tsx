import { useMemo } from "react";
import { useLocation } from "react-router";

import { FlyoutMenu } from "@thewaver/ss-components-react";
import type { FlyoutMenuEntryRecord } from "@thewaver/ss-components-react";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import {
    NOTHING_FOLLOWED,
    OVERFLOW_CAPTION,
    SHOP_ENTRIES,
} from "@thewaver/ss-playground/App/Pages/Menus/FlyoutMenuPage/FlyoutMenuPage.const";
import * as pageStyles from "@thewaver/ss-playground/App/Pages/Menus/FlyoutMenuPage/FlyoutMenuPage.css";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/FlyoutMenuContent/FlyoutMenuContent.css";

import { PageLayer } from "../../../../PageComponents/Layer/Layer";
import {
    PageFlyoutMenuLink,
    PageFlyoutMenuOverflowToggle,
    PageFlyoutMenuToggle,
} from "../../../../StyledComponents/FlyoutMenuContent/FlyoutMenuContent";
import { renderPageHighlightFloater } from "../../../../StyledComponents/GlideFloater/GlideFloater";
import { PagePopoverSurface } from "../../../../StyledComponents/PopoverSurface/PopoverSurface";

const OFFSET = { x: 0, y: 6 };

export const NarrowDocsExample = () => {
    const location = useLocation();

    const entries = useMemo(
        (): FlyoutMenuEntryRecord<string>[] =>
            SHOP_ENTRIES.map((entry) => ({
                ...entry,
                isCurrent: entry.href === location.hash,
                links: entry.links?.map((link) => ({ ...link, isCurrent: link.href === location.hash })),
            })),
        [location.hash],
    );

    return (
        <>
            <div className={pageStyles.narrowFrame}>
                <FlyoutMenu
                    entries={entries}
                    ariaLabel={"Narrow shop"}
                    offset={OFFSET}
                    computeToggleLabel={(value) => `${value} submenu`}
                    renderLink={(link, flags) => <PageFlyoutMenuLink flags={flags}>{link.value}</PageFlyoutMenuLink>}
                    renderToggle={(_entry, flags) => <PageFlyoutMenuToggle flags={flags} />}
                    renderOverflowToggle={(flags) => (
                        <PageFlyoutMenuOverflowToggle flags={flags}>{OVERFLOW_CAPTION}</PageFlyoutMenuOverflowToggle>
                    )}
                    renderHighlightFloater={renderPageHighlightFloater}
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
            </div>

            <div
                className={exampleStyles.exampleReadout}
                data-readout
            >{`Followed: ${location.hash || NOTHING_FOLLOWED}`}</div>
        </>
    );
};
