import type { PropsWithChildren } from "react";
import { useEffect, useId, useState } from "react";

import { Collapsible } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/PageComponents/DocsExample/DocsExample.css";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";

import { PageAccordionHeader, PageAccordionPanel } from "../../StyledComponents/AccordionContent/AccordionContent";
import { PageCodeBox } from "../CodeBox/CodeBox";
import { PageLayer } from "../Layer/Layer";
import { usePreviewContext } from "../Preview/Preview.context";
import { PagePropsPanel } from "../PropsPanel/PropsPanel";
import { SourceViewUtils } from "../SourceView/SourceView.utils";
import type { SourceFile } from "../SourceView/SourceViewReact.types";
import type { PageDocsExampleProps } from "./DocsExampleReact.types";

export const PageDocsExample = (props: PropsWithChildren<PageDocsExampleProps>) => {
    const preview = usePreviewContext();
    const demoId = useId();
    const [file, setFile] = useState<SourceFile>();

    useEffect(() => {
        if (preview) return;

        let isCurrent = true;

        setFile(undefined);
        void SourceViewUtils.loadFile(props.path).then((loaded) => {
            if (isCurrent) setFile(loaded);
        });

        return () => {
            isCurrent = false;
        };
    }, [preview, props.path]);

    if (preview) {
        return preview.claimDemo(demoId) ? (
            <div className={exampleStyles.exampleDemo} data-demo data-testid={props.path}>
                {props.children}
            </div>
        ) : null;
    }

    return (
        <div className={styles.docsExampleStack}>
            <div className={styles.docsExample} data-docs-example>
                <PageLayer level={1}>
                    <div className={styles.docsExampleSection}>
                        <div className={styles.docsExampleDemo} data-demo data-testid={props.path}>
                            {props.children}
                        </div>

                        {props.renderKnobs && (
                            <>
                                <div
                                    className={styles.docsExampleDivider}
                                    role={"separator"}
                                    aria-orientation={"vertical"}
                                />

                                <div className={styles.docsExampleKnobs}>
                                    <PagePropsPanel scope={"local"} hasReset={false}>
                                        {props.renderKnobs()}
                                    </PagePropsPanel>
                                </div>
                            </>
                        )}
                    </div>
                </PageLayer>
            </div>

            {file && (
                <PageLayer level={1}>
                    <div className={styles.docsExampleCode}>
                        <Collapsible
                            sizing={"fill"}
                            isPanelBuiltOnExpand={true}
                            renderTrigger={(flags) => (
                                <PageAccordionHeader flags={flags}>
                                    {flags.isExpanded ? "Hide code" : "Show code"}
                                </PageAccordionHeader>
                            )}
                            renderPanel={(visibilityTarget, transitionDurationMs) => (
                                <PageAccordionPanel
                                    visibilityTarget={visibilityTarget}
                                    transitionDurationMs={transitionDurationMs}
                                >
                                    <PageCodeBox source={file.source} />
                                </PageAccordionPanel>
                            )}
                        />
                    </div>
                </PageLayer>
            )}
        </div>
    );
};
