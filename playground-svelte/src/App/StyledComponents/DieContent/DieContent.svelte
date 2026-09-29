<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/DieContent/DieContent.css";

    import type { PageDieFaceProps } from "./DieContent.types";

    const LABEL_SHARE = 0.35;

    let props: PageDieFaceProps = $props();
</script>

<div
    class={[styles.dieFace, props.state.isShowing && styles.dieFaceShowing]}
    style:font-size={`${Math.min(props.state.size.width, props.state.size.height) * LABEL_SHARE}px`}
    aria-hidden="true"
>
    {props.label}
</div>
