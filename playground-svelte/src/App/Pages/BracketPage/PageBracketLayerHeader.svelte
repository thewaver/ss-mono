<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/Pages/BracketPage/BracketPage.css";

    let props: { names: string[]; layer: number } = $props();
</script>

<div class={styles.layerHeader}>{props.names[props.layer]}</div>
