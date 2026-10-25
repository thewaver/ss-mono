<script lang="ts">
    import { ImageSwitcher } from "@thewaver/ss-components-svelte";
    import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
    import * as styles from "@thewaver/ss-playground/App/Pages/ImageSwitcherPage/ImageSwitcherPage.css";

    import type { ImageSwitcherBasicDocsExampleProps } from "../ImageSwitcherPageSvelte.types";

    type Props = ImageSwitcherBasicDocsExampleProps;

    let props: Props = $props();

    let loadCount = $state(0);
    let loadedName = $state<string>();
</script>

<div class={styles.docsFrame}>
    <ImageSwitcher
        src={props.src}
        alt={props.alt}
        transitionDurationMs={props.transitionDurationMs}
        onLoad={(e) => {
            const loaded = (e.target as HTMLImageElement).src;

            loadCount += 1;
            loadedName = loaded.slice(loaded.lastIndexOf("/") + 1);
        }}
    />
</div>

<div class={exampleStyles.exampleReadout} data-readout>
    {`Loads: ${loadCount} · last loaded: ${loadedName ?? "nothing yet"}`}
</div>
