<script lang="ts">
    import { Radio } from "@thewaver/ss-components-svelte";
    import {
        THEME_SWATCH_FAMILIES,
        THEME_SWATCH_SHADES,
        computeThemeRowId,
    } from "@thewaver/ss-playground/App/Pages/AppearancePage/AppearancePage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/AppearancePage/AppearancePage.css";
    import { PLAYGROUND_THEMES } from "@thewaver/ss-playground/App/Theme.css";

    import PageRadioContent from "../../StyledComponents/RadioContent/RadioContent.svelte";
    import type { ThemeRowProps } from "./AppearancePage.types";

    let props: ThemeRowProps = $props();
</script>

<Radio value={props.theme} ariaLabel={props.label} sizing={"fill"}>
    {#snippet renderContent(flags)}
        <div id={computeThemeRowId(props.theme)} class={[styles.skinRow, PLAYGROUND_THEMES[props.theme]]}>
            <div class={styles.skinSamples}>
                <PageRadioContent {flags}>{props.label}</PageRadioContent>

                <div class={styles.themeGrid} inert aria-hidden="true">
                    <span></span>

                    {#each THEME_SWATCH_FAMILIES as family (family)}
                        <span class={styles.skinColumnName}>{family}</span>
                    {/each}

                    {#each THEME_SWATCH_SHADES as shade (shade)}
                        <span class={styles.skinColumnName}>{shade}</span>

                        {#each THEME_SWATCH_FAMILIES as family (family)}
                            <div class={styles.themeSwatches[family][shade]}></div>
                        {/each}
                    {/each}
                </div>
            </div>
        </div>
    {/snippet}
</Radio>
