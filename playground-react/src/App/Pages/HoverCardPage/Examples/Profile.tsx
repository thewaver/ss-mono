import { useId, useState } from "react";

import { Button, HoverCard } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground-core/App/Pages/HoverCardPage/HoverCardPage.css";
import knightProfile from "@thewaver/ss-playground-core/App/knight_profile.webp";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { PageHoverCardContent } from "../../../StyledComponents/HoverCardContent/HoverCardContent";
import type { HoverCardExampleProps } from "../HoverCardPage.types";

type Props = HoverCardExampleProps;

export const ProfileExample = (props: Props) => {
    const nameId = useId();

    const [anchorRef, setAnchorRef] = useState<HTMLElement>();

    const [isFollowing, setIsFollowing] = props.followingState;

    return (
        <div className={styles.sentence}>
            {"Posted by "}

            <button ref={(element) => setAnchorRef(element ?? undefined)} type={"button"} className={styles.handle}>
                @sir.aldric
            </button>

            {" to the masons' guild, two hours ago."}

            <HoverCard
                anchorRef={anchorRef}
                ariaLabelledBy={nameId}
                visibilityState={props.visibilityState}
                offset={props.offset}
                transitionDurationMs={props.transitionDurationMs}
                focusShowDelayMs={props.focusShowDelayMs}
                hoverShowDelayMs={props.hoverShowDelayMs}
                skipDelayWindowMs={props.skipDelayWindowMs}
                renderContent={(visibilityTarget, transitionDurationMs) => (
                    <PageHoverCardContent
                        visibilityTarget={visibilityTarget}
                        transitionDurationMs={transitionDurationMs}
                    >
                        <div className={styles.profileHeader}>
                            <img src={knightProfile} alt={""} className={styles.avatar} />

                            <div>
                                <div id={nameId} className={styles.profileName}>
                                    Sir Aldric of the East Gate
                                </div>

                                <div className={styles.profileHandle}>@sir.aldric</div>
                            </div>
                        </div>

                        <div className={styles.profileBio}>
                            Keeps the east gate and the accounts of the masons who rebuilt it. Writes about lime mortar,
                            horses and the price of oats.
                        </div>

                        <div className={styles.profileActions}>
                            <Button
                                renderContent={(flags) => (
                                    <PageButtonContent flags={flags}>
                                        {isFollowing ? "Unfollow" : "Follow"}
                                    </PageButtonContent>
                                )}
                                onClick={() => {
                                    setIsFollowing(!isFollowing);
                                }}
                            />

                            <a href={"#sir-aldric"}>View profile</a>
                        </div>
                    </PageHoverCardContent>
                )}
            />
        </div>
    );
};
