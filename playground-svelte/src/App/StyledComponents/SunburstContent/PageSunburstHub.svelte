<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/SunburstContent/SunburstContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { PageSunburstHubProps } from "./SunburstContent.types";

    let props: PageSunburstHubProps = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div
    class={[
        styles.sunburstHub,
        layerClass,
        props.flags.isHovered && styles.sunburstHubHovered,
        props.flags.isDisabled && styles.sunburstHubAtRoot,
    ]}
>
    <span class={styles.sunburstHubName}>{props.name}</span><span class={styles.sunburstHubWeight}>{props.weight}</span>
</div>
