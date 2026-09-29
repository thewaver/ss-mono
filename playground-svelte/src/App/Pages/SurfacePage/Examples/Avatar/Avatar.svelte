<script lang="ts">
    import { SVGDefsSamples, Surface } from "@thewaver/ss-components-svelte";
    import type { SurfaceProps } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/SurfacePage/Examples/Avatar/Avatar.css";
    import knight_profile from "@thewaver/ss-playground/App/knight_profile.webp";
    import { CSSUtils } from "@thewaver/ss-utils";

    const getConfig = (strokeId: string): SurfaceProps => ({
        borderRadii: CSSUtils.spreadRadius(styles.width * 0.5),
        borderWidths: CSSUtils.spreadWidth(4),
        computeStrokeDefs: (size, element) =>
            SVGDefsSamples.Gradient.Timed.toConfig({ family: "sweep_diag_async_4" }).computeSVGDefs(
                strokeId,
                undefined,
                element,
                {
                    getSize: () => size,
                    animationDurationMs: 4000,
                    colors: {
                        background: "#282420",
                        primary: "#FFFF00",
                        secondary: "#00FFFF",
                        tertiary: "#FF00FF",
                    },
                    blurWidth: 4,
                },
            ),
    });

    const strokeId = $props.id();
</script>

<div class={styles.root}>
    <Surface {...getConfig(strokeId)}>
        <img src={knight_profile} width="100%" />
    </Surface>
</div>
