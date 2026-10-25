import { useState } from "react";

import { ImageSwitcher } from "@thewaver/ss-components-react";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import * as styles from "@thewaver/ss-playground/App/Pages/ImageSwitcherPage/ImageSwitcherPage.css";

import type { ImageSwitcherBasicDocsExampleProps } from "../ImageSwitcherPageReact.types";

type Props = ImageSwitcherBasicDocsExampleProps;

export const BasicDocsExample = (props: Props) => {
    const [loadCount, setLoadCount] = useState(0);
    const [loadedName, setLoadedName] = useState<string>();

    return (
        <>
            <div className={styles.docsFrame}>
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

            <div className={exampleStyles.exampleReadout} data-readout>
                {`Loads: ${loadCount} · last loaded: ${loadedName ?? "nothing yet"}`}
            </div>
        </>
    );
};
