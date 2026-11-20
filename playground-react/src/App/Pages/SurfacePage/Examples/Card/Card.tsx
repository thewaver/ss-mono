import { useState } from "react";

import { Surface } from "@thewaver/ss-components-react";
import type { SurfaceProps } from "@thewaver/ss-components-react";
import { Preview } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/Pages/SurfacePage/Examples/Card/Card.css";
import {
    GREETINGS_TRAVELERS_I_AM_TEXT,
    I_BEGAN_MY_CAREER_TEXT,
    UI_UX_VANGUARD_600_TEXT,
    WHETHER_I_M_ALIGNING_TEXT,
} from "@thewaver/ss-playground/App/Pages/SurfacePage/SurfacePage.const";
import { themeVars } from "@thewaver/ss-playground/App/Theme.css";
import knight_profile from "@thewaver/ss-playground/App/knight_profile.webp";
import { CSSUtils } from "@thewaver/ss-utils";

import { PageButtonContent } from "../../../../StyledComponents/ButtonContent/ButtonContent";

const COLLAPSED_HEIGHT = 200;

const config: SurfaceProps = {
    borderRadii: CSSUtils.spreadRadius(styles.borderRadius),
    borderWidths: CSSUtils.spreadWidth(2),
    computeStrokeDefs: () => [
        {
            color: themeVars.color.primary.main,
            opacity: 0.5,
        },
    ],
    computeFillDefs: () => [
        {
            color: themeVars.color.primary.contrast,
        },
    ],
};

export const CardExample = () => {
    const expandedState = useState(false);

    return (
        <div className={styles.root}>
            <Surface {...config}>
                <div className={styles.surfaceRoot}>
                    <div className={styles.pic}>
                        <img src={knight_profile} width="100%" alt="" />
                        <div className={styles.picContent}>
                            <div className={styles.name}>{"Sir Face"}</div>
                            <div className={styles.role}>{UI_UX_VANGUARD_600_TEXT}</div>
                        </div>
                    </div>
                    <div className={styles.surfaceCntent}>
                        <Preview
                            expanded={expandedState}
                            collapsedHeight={COLLAPSED_HEIGHT}
                            renderContent={() => (
                                <div className={styles.bios}>
                                    <div className={styles.bio}>{GREETINGS_TRAVELERS_I_AM_TEXT}</div>
                                    <div className={styles.bio}>{I_BEGAN_MY_CAREER_TEXT}</div>
                                    <div className={styles.bio}>{WHETHER_I_M_ALIGNING_TEXT}</div>
                                </div>
                            )}
                            renderOverlay={(visibilityTarget, transitionDurationMs) => (
                                <div
                                    className={styles.bioFade}
                                    style={{
                                        opacity: visibilityTarget,
                                        transition: `opacity ${transitionDurationMs}ms`,
                                    }}
                                />
                            )}
                            renderTrigger={(flags) => (
                                <PageButtonContent flags={flags}>
                                    {flags.isExpanded ? "Show less" : "Read more"}
                                </PageButtonContent>
                            )}
                        />
                    </div>
                </div>
            </Surface>
        </div>
    );
};
