import { createSignal, createUniqueId } from "solid-js";

import { Button, HoverCard } from "@thewaver/ss-components";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { PageHoverCardContent } from "../../../StyledComponents/HoverCardContent/HoverCardContent";
import knightProfile from "../../../knight_profile.webp";
import type { HoverCardExampleProps } from "../HoverCardPage.types";

import * as styles from "../HoverCardPage.css";

type Props = HoverCardExampleProps;

export const ProfileExample = (props: Props) => {
    const nameId = createUniqueId();

    const [getAnchorRef, setAnchorRef] = createSignal<HTMLElement>();

    const [getIsFollowing, setIsFollowing] = props.followingSignal;

    return (
        <div class={styles.sentence}>
            {"Posted by "}

            <button ref={setAnchorRef} type={"button"} class={styles.handle}>
                @sir.aldric
            </button>

            {" to the masons' guild, two hours ago."}

            <HoverCard
                anchorRef={getAnchorRef}
                ariaLabelledBy={() => nameId}
                visibilitySignal={props.visibilitySignal}
                offset={props.offset}
                transitionDurationMs={props.transitionDurationMs}
                focusShowDelayMs={props.focusShowDelayMs}
                hoverShowDelayMs={props.hoverShowDelayMs}
                skipDelayWindowMs={props.skipDelayWindowMs}
                renderContent={(getVisibilityTarget, getTransitionDurationMs) => (
                    <PageHoverCardContent
                        visibilityTarget={getVisibilityTarget}
                        transitionDurationMs={getTransitionDurationMs}
                    >
                        <div class={styles.profileHeader}>
                            <img src={knightProfile} alt={""} class={styles.avatar} />

                            <div>
                                <div id={nameId} class={styles.profileName}>
                                    Sir Aldric of the East Gate
                                </div>

                                <div class={styles.profileHandle}>@sir.aldric</div>
                            </div>
                        </div>

                        <div class={styles.profileBio}>
                            Keeps the east gate and the accounts of the masons who rebuilt it. Writes about lime mortar,
                            horses and the price of oats.
                        </div>

                        <div class={styles.profileActions}>
                            <Button
                                renderContent={(getFlags) => (
                                    <PageButtonContent flags={getFlags}>
                                        {getIsFollowing() ? "Unfollow" : "Follow"}
                                    </PageButtonContent>
                                )}
                                onClick={() => {
                                    setIsFollowing((isFollowing) => !isFollowing);
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
