<script lang="ts">
    import { Surface } from "@thewaver/ss-components-svelte";
    import type { SurfaceProps } from "@thewaver/ss-components-svelte";
    import { Preview } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/SurfacePage/Examples/Card/Card.css";
    import { themeVars } from "@thewaver/ss-playground/App/Theme.css";
    import knight_profile from "@thewaver/ss-playground/App/knight_profile.webp";
    import { CSSUtils } from "@thewaver/ss-utils";

    import PageButtonContent from "../../../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import { UI_UX_VANGUARD_600_TEXT, GREETINGS_TRAVELERS_I_AM_TEXT, I_BEGAN_MY_CAREER_TEXT, WHETHER_I_M_ALIGNING_TEXT } from "@thewaver/ss-playground/App/Pages/SurfacePage/SurfacePage.const";

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

    let expanded = $state(false);
</script>

<div class={styles.root}>
    <Surface {...config}>
        <div class={styles.surfaceRoot}>
            <div class={styles.pic}>
                <img src={knight_profile} width="100%" />
                <div class={styles.picContent}>
                    <div class={styles.name}>{"Sir Face"}</div>
                    <div class={styles.role}>
                        {UI_UX_VANGUARD_600_TEXT}
                    </div>
                </div>
            </div>
            <div class={styles.surfaceCntent}>
                <Preview bind:expanded collapsedHeight={COLLAPSED_HEIGHT}>
                    {#snippet renderContent()}
                        <div class={styles.bios}>
                            <div class={styles.bio}>
                                {GREETINGS_TRAVELERS_I_AM_TEXT}
                            </div>
                            <div class={styles.bio}>
                                {I_BEGAN_MY_CAREER_TEXT}
                            </div>
                            <div class={styles.bio}>
                                {WHETHER_I_M_ALIGNING_TEXT}
                            </div>
                        </div>
                    {/snippet}

                    {#snippet renderOverlay(visibilityTarget, transitionDurationMs)}
                        <div
                            class={styles.bioFade}
                            style:opacity={visibilityTarget}
                            style:transition={`opacity ${transitionDurationMs}ms`}
                        ></div>
                    {/snippet}

                    {#snippet renderTrigger(flags)}
                        <PageButtonContent {flags}>{flags.isExpanded ? "Show less" : "Read more"}</PageButtonContent>
                    {/snippet}
                </Preview>
            </div>
        </div>
    </Surface>
</div>
