<script lang="ts">
    import { Button, HoverCard } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/HoverCardPage/HoverCardPage.css";
    import knightProfile from "@thewaver/ss-playground/App/knight_profile.webp";

    import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import PageHoverCardContent from "../../../StyledComponents/HoverCardContent/HoverCardContent.svelte";
    import type { HoverCardExampleProps } from "../HoverCardPage.types";

    type Props = HoverCardExampleProps;

    let { visibility = $bindable(), following = $bindable(), ...props }: Props = $props();

    const nameId = $props.id();

    let anchorRef = $state<HTMLElement>();
</script>

<div class={styles.sentence}>
    {"Posted by "}

    <button bind:this={anchorRef} type={"button"} class={styles.handle}>@sir.aldric</button>

    {" to the masons' guild, two hours ago."}

    <HoverCard
        {anchorRef}
        ariaLabelledBy={nameId}
        bind:visibility
        offset={props.offset}
        transitionDurationMs={props.transitionDurationMs}
        focusShowDelayMs={props.focusShowDelayMs}
        hoverShowDelayMs={props.hoverShowDelayMs}
        skipDelayWindowMs={props.skipDelayWindowMs}
    >
        {#snippet renderContent(visibilityTarget, transitionDurationMs)}
            <PageHoverCardContent {visibilityTarget} {transitionDurationMs}>
                <div class={styles.profileHeader}>
                    <img src={knightProfile} alt={""} class={styles.avatar} />

                    <div>
                        <div id={nameId} class={styles.profileName}>Sir Aldric of the East Gate</div>

                        <div class={styles.profileHandle}>@sir.aldric</div>
                    </div>
                </div>

                <div class={styles.profileBio}>
                    Keeps the east gate and the accounts of the masons who rebuilt it. Writes about lime mortar, horses
                    and the price of oats.
                </div>

                <div class={styles.profileActions}>
                    <Button
                        onClick={() => {
                            following = !following;
                        }}
                    >
                        {#snippet renderContent(flags)}
                            <PageButtonContent {flags}>
                                {following ? "Unfollow" : "Follow"}
                            </PageButtonContent>
                        {/snippet}
                    </Button>

                    <a href={"#sir-aldric"}>View profile</a>
                </div>
            </PageHoverCardContent>
        {/snippet}
    </HoverCard>
</div>
