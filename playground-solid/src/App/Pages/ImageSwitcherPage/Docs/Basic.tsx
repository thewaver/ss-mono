import { createSignal } from "solid-js";

import { ImageSwitcher } from "@thewaver/ss-components-solid";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import * as styles from "@thewaver/ss-playground/App/Pages/ImageSwitcherPage/ImageSwitcherPage.css";

import type { ImageSwitcherBasicDocsExampleProps } from "../ImageSwitcherPageSolid.types";

type Props = ImageSwitcherBasicDocsExampleProps;

export const BasicDocsExample = (props: Props) => {
    const [getLoadCount, setLoadCount] = createSignal(0);
    const [getLoadedName, setLoadedName] = createSignal<string>();

    return (
        <>
            <div class={styles.docsFrame}>
                <ImageSwitcher
                    src={props.src}
                    alt={props.alt}
                    transitionDurationMs={props.transitionDurationMs}
                    onLoad={(e) => {
                        const loaded = (e.target as HTMLImageElement).src;

                        setLoadCount((count) => count + 1);
                        setLoadedName(loaded.slice(loaded.lastIndexOf("/") + 1));
                    }}
                />
            </div>

            <div class={exampleStyles.exampleReadout} data-readout>
                {`Loads: ${getLoadCount()} · last loaded: ${getLoadedName() ?? "nothing yet"}`}
            </div>
        </>
    );
};
