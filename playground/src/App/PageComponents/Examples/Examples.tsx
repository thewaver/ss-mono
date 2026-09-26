import type { JSX } from "solid-js";
import { For, Show, createMemo, createSignal } from "solid-js";

import { Button, Modal, access } from "@thewaver/ss-components";
import { CSSUtils } from "@thewaver/ss-utils";

import { PageModalOverlay } from "../../StyledComponents/ModalOverlay/ModalOverlay";
import { PageModalPanel } from "../../StyledComponents/ModalPanel/ModalPanel";
import { PageTooltipContent } from "../../StyledComponents/TooltipContent/TooltipContent";
import { PageExampleKnobsButton } from "../ExampleKnobs/ExampleKnobs";
import { ExampleKnobsContextProvider } from "../ExampleKnobs/ExampleKnobs.context";
import { PageLayer } from "../Layer/Layer";
import { PageSourceView } from "../SourceView/SourceView";
import type { ExamplesProps } from "./Examples.types";

import * as styles from "./Examples.css";

const DEFAULT_LAYOUT = "grid" as const;
const DEFAULT_MIN_COLUMN_WIDTH = 320;
const SINGLE_SPAN = 1;
const PERCENT = 100;

export const PageExamples = (props: ExamplesProps) => {
    const [getActiveIndex, setActiveIndex] = createSignal(0);
    const modalVisibility = createSignal(false);
    const [, setIsModalOpen] = modalVisibility;

    const getWidestSpan = createMemo(() =>
        access(props.items).reduce((widest, example) => Math.max(widest, example.span ?? SINGLE_SPAN), SINGLE_SPAN),
    );

    const getLayout = () => access(props.layout) ?? DEFAULT_LAYOUT;

    const getMinColumnWidth = () => access(props.minColumnWidth) ?? DEFAULT_MIN_COLUMN_WIDTH;

    const getColumns = () =>
        getLayout() === "grid"
            ? `repeat(auto-fill, minmax(min(${PERCENT / getWidestSpan()}%, ${getMinColumnWidth()}px), 1fr))`
            : undefined;

    return (
        <>
            <div class={styles.examplesRootVariants[getLayout()]} style={{ "grid-template-columns": getColumns() }}>
                <For each={access(props.items)}>
                    {(example, getExampleIndex) => {
                        const [getRenderKnobs, setRenderKnobs] = createSignal<() => JSX.Element>();

                        return (
                            <div
                                class={styles.exampleContainer}
                                style={{ "grid-column": `span ${example.span ?? SINGLE_SPAN}` }}
                                data-example
                                data-testid={example.key}
                            >
                                <PageLayer level={1}>
                                    <div class={styles.exampleTitle}>
                                        {`${example.name}:`}
                                        <div class={styles.exampleActions}>
                                            {example.path && (
                                                <Button
                                                    id={() => `${example.key}Source`}
                                                    tooltipDefs={() => ({
                                                        placement: () => ({ x: "center", y: "top-out" }),
                                                        offset: () => ({ x: 0, y: 10 }),
                                                        renderContent: (
                                                            getVisibilityTarget,
                                                            getTransitionDurationMs,
                                                        ) => (
                                                            <PageTooltipContent
                                                                visibilityTarget={getVisibilityTarget}
                                                                transitionDurationMs={getTransitionDurationMs}
                                                            >
                                                                View source code
                                                            </PageTooltipContent>
                                                        ),
                                                    })}
                                                    onClick={async () => {
                                                        setActiveIndex(getExampleIndex());
                                                        setIsModalOpen(true);
                                                    }}
                                                    renderContent={() => "</>"}
                                                />
                                            )}

                                            <Show when={getRenderKnobs()}>
                                                {(getKnobs) => (
                                                    <PageExampleKnobsButton
                                                        exampleKey={example.key}
                                                        exampleName={example.name}
                                                        renderKnobs={getKnobs()}
                                                    />
                                                )}
                                            </Show>
                                        </div>
                                    </div>

                                    <div class={styles.exampleDemo} data-demo>
                                        <ExampleKnobsContextProvider
                                            value={{ setRenderKnobs: (render) => setRenderKnobs(() => render) }}
                                        >
                                            {example.component()}
                                        </ExampleKnobsContextProvider>
                                    </div>

                                    {example.readout && (
                                        <div class={styles.exampleReadout} data-readout>
                                            {example.readout()}
                                        </div>
                                    )}
                                </PageLayer>
                            </div>
                        );
                    }}
                </For>
            </div>

            <Modal
                margins={() => CSSUtils.spreadMargin(40)}
                visibilitySignal={modalVisibility}
                ariaLabel={() => `${access(props.items)[getActiveIndex()].name} source code`}
                renderOverlay={(getVisibilityTarget, getTransitionDurationMs) => (
                    <PageModalOverlay
                        visibilityTarget={getVisibilityTarget}
                        transitionDurationMs={getTransitionDurationMs}
                    />
                )}
                renderContent={(getVisibilityTarget, getTransitionDurationMs) => (
                    <PageModalPanel
                        visibilityTarget={getVisibilityTarget}
                        transitionDurationMs={getTransitionDurationMs}
                        padding={"0"}
                    >
                        <PageSourceView path={() => access(props.items)[getActiveIndex()].path!} />
                    </PageModalPanel>
                )}
            />
        </>
    );
};
