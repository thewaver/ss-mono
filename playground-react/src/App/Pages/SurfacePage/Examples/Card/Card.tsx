import { useState } from "react";

import { Surface } from "@thewaver/ss-components-react";
import type { SurfaceProps } from "@thewaver/ss-components-react";
import { Preview } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/Pages/SurfacePage/Examples/Card/Card.css";
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
                        <img src={knight_profile} width="100%" />
                        <div className={styles.picContent}>
                            <div className={styles.name}>{"Sir Face"}</div>
                            <div className={styles.role}>
                                {"UI/UX Vanguard | 600+ Years Forging Pixel-Perfect Experiences"}
                            </div>
                        </div>
                    </div>
                    <div className={styles.surfaceCntent}>
                        <Preview
                            expandedState={expandedState}
                            collapsedHeight={COLLAPSED_HEIGHT}
                            renderContent={() => (
                                <div className={styles.bios}>
                                    <div className={styles.bio}>
                                        {
                                            "Greetings, travelers. I am Sir Face, and as my name implies, I am entirely dedicated to the presentation layer. For over six centuries, I’ve been defending users against terrible UI and slaying dragons in the DOM."
                                        }
                                    </div>
                                    <div className={styles.bio}>
                                        {
                                            "I began my career in the early 1400s, applying gold leaf to illuminated manuscripts—the original CSS. Since then, I've traded my broadsword for a mechanical keyboard, specializing in building robust, user-facing applications. I firmly believe that a user interface should be exactly like a good suit of plate armor: polished to a mirror shine, perfectly articulated, and capable of deflecting any critical errors."
                                        }
                                    </div>
                                    <div className={styles.bio}>
                                        {
                                            "Whether I'm aligning a flexbox or leading a cavalry charge against technical debt, I bring chivalry and pixel-perfection to every sprint."
                                        }
                                    </div>
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
