import type { ParentProps } from "solid-js";
import { Show, createResource } from "solid-js";

import { Collapsible, access } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/PageComponents/DocsExample/DocsExample.css";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";

import { PageAccordionHeader, PageAccordionPanel } from "../../StyledComponents/AccordionContent/AccordionContent";
import { PageCodeBox } from "../CodeBox/CodeBox";
import { PageLayer } from "../Layer/Layer";
import { usePreviewContext } from "../Preview/Preview.context";
import { PagePropsPanel } from "../PropsPanel/PropsPanel";
import { SourceViewUtils } from "../SourceView/SourceView.utils";
import type { PageDocsExampleProps } from "./DocsExampleSolid.types";

export const PageDocsExample = (props: ParentProps<PageDocsExampleProps>) => {
    const preview = usePreviewContext();

    if (preview) {
        return preview.claimDemo() ? (
            <div class={exampleStyles.exampleDemo} data-demo data-testid={access(props.path)}>
                {props.children}
            </div>
        ) : null;
    }

    const [getFile] = createResource(() => access(props.path), SourceViewUtils.loadFile);

    return (
        <div class={styles.docsExampleStack}>
            <div class={styles.docsExample} data-docs-example>
                <PageLayer level={1}>
                    <div class={styles.docsExampleSection}>
                        <div class={styles.docsExampleDemo} data-demo data-testid={access(props.path)}>
                            {props.children}
                        </div>

                        <Show when={props.renderKnobs}>
                            {(getRenderKnobs) => (
                                <>
                                    <div
                                        class={styles.docsExampleDivider}
                                        role={"separator"}
                                        aria-orientation={"vertical"}
                                    />

                                    <div class={styles.docsExampleKnobs}>
                                        <PagePropsPanel scope={"local"} hasReset={false}>
                                            {getRenderKnobs()()}
                                        </PagePropsPanel>
                                    </div>
                                </>
                            )}
                        </Show>
                    </div>
                </PageLayer>
            </div>

            <Show when={getFile()}>
                {(getLoadedFile) => (
                    <PageLayer level={1}>
                        <div class={styles.docsExampleCode}>
                            <Collapsible
                                sizing={"fill"}
                                isPanelBuiltOnExpand={true}
                                renderTrigger={(getFlags) => (
                                    <PageAccordionHeader flags={getFlags}>
                                        {getFlags().isExpanded ? "Hide code" : "Show code"}
                                    </PageAccordionHeader>
                                )}
                                renderPanel={(getVisibilityTarget, getTransitionDurationMs) => (
                                    <PageAccordionPanel
                                        visibilityTarget={getVisibilityTarget}
                                        transitionDurationMs={getTransitionDurationMs}
                                    >
                                        <PageCodeBox source={() => getLoadedFile().source} />
                                    </PageAccordionPanel>
                                )}
                            />
                        </div>
                    </PageLayer>
                )}
            </Show>
        </div>
    );
};
