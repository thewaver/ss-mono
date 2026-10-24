<script lang="ts">
    import type { Snippet } from "svelte";

    import * as styles from "@thewaver/ss-playground/App/Pages/ButtonPage/ButtonPage.css";

    import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import type { ButtonContentProps } from "../../../StyledComponents/ButtonContent/ButtonContentSvelte.types";

    let props: ButtonContentProps & { children?: Snippet } = $props();
</script>

<div class={[styles.pressedContent, props.flags.isPressed && styles.isPressed]}>
    <PageButtonContent flags={props.flags}>{@render props.children?.()}</PageButtonContent>
</div>
