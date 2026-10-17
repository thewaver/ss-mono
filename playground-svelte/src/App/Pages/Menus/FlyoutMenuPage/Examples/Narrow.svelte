<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/Pages/Menus/FlyoutMenuPage/FlyoutMenuPage.css";

    import type { FlyoutMenuExampleProps } from "../FlyoutMenuPageSvelte.types";
    import ShopExample from "./Shop.svelte";

    let props: FlyoutMenuExampleProps = $props();
</script>

<div class={styles.narrowFrame}>
    <ShopExample {...props} />
</div>
