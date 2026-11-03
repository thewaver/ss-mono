<script lang="ts">
    import { toStyle } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/Icon/Icon.css";
    import { assignInlineVars } from "@vanilla-extract/dynamic";

    import type { IconProps } from "./IconSvelte.types";

    let props: IconProps = $props();
</script>

<span
    class={styles.icon}
    style={toStyle(assignInlineVars({ [styles.iconSource]: `url("${props.src}")` }))}
    aria-hidden="true"
></span>
