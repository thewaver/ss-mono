<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/DieContent/DieContent.css";

    import type { PageDieIconProps } from "./DieContentSvelte.types";
    import { ICON_SHARE } from "@thewaver/ss-playground/App/StyledComponents/DieContent/DieContent.const";

    let props: PageDieIconProps = $props();
</script>

<div
    class={styles.dieIcon}
    style:font-size={`${Math.min(props.state.size.width, props.state.size.height) * ICON_SHARE}px`}
    aria-hidden="true"
>
    {props.icon}
</div>
