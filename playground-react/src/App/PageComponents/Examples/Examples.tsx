import type { ReactNode } from "react";
import { useMemo, useState } from "react";

import { Button, Modal } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import { CSSUtils } from "@thewaver/ss-utils";

import { PageModalOverlay } from "../../StyledComponents/ModalOverlay/ModalOverlay";
import { PageModalPanel } from "../../StyledComponents/ModalPanel/ModalPanel";
import { PageTooltipContent } from "../../StyledComponents/TooltipContent/TooltipContent";
import { PageExampleKnobsButton } from "../ExampleKnobs/ExampleKnobs";
import { ExampleKnobsContextProvider } from "../ExampleKnobs/ExampleKnobs.context";
import { PageLayer } from "../Layer/Layer";
import { PageSourceView } from "../SourceView/SourceView";
import type { ExampleProps, ExamplesProps } from "./Examples.types";

const DEFAULT_LAYOUT = "grid" as const;
const DEFAULT_MIN_COLUMN_WIDTH = 320;
const SINGLE_SPAN = 1;
const PERCENT = 100;

const PageExample = (props: ExampleProps) => {
    const [renderKnobs, setRenderKnobs] = useState<() => ReactNode>();

    const knobsContext = useMemo(
        () => ({ setRenderKnobs: (render: (() => ReactNode) | undefined) => setRenderKnobs(() => render) }),
        [],
    );

    const demo = useMemo(() => props.example.component(), [props.example]);

    return (
        <div
            className={styles.exampleContainer}
            style={{ gridColumn: `span ${props.example.span ?? SINGLE_SPAN}` }}
            data-example=""
            data-testid={props.example.key}
        >
            <PageLayer level={1}>
                <div className={styles.exampleTitle}>
                    {`${props.example.name}:`}
                    <div className={styles.exampleActions}>
                        {props.example.path && (
                            <Button
                                id={`${props.example.key}Source`}
                                tooltipDefs={{
                                    placement: { x: "center", y: "top-out" },
                                    offset: { x: 0, y: 10 },
                                    renderContent: (visibilityTarget, transitionDurationMs) => (
                                        <PageTooltipContent
                                            visibilityTarget={visibilityTarget}
                                            transitionDurationMs={transitionDurationMs}
                                        >
                                            View source code
                                        </PageTooltipContent>
                                    ),
                                }}
                                onClick={async () => {
                                    props.onViewSource();
                                }}
                                renderContent={() => "</>"}
                            />
                        )}

                        {renderKnobs && (
                            <PageExampleKnobsButton
                                exampleKey={props.example.key}
                                exampleName={props.example.name}
                                renderKnobs={renderKnobs}
                            />
                        )}
                    </div>
                </div>

                <div className={styles.exampleDemo} data-demo="">
                    <ExampleKnobsContextProvider value={knobsContext}>{demo}</ExampleKnobsContextProvider>
                </div>

                {props.example.readout && (
                    <div className={styles.exampleReadout} data-readout="">
                        {props.example.readout()}
                    </div>
                )}
            </PageLayer>
        </div>
    );
};

export const PageExamples = (props: ExamplesProps) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const modalVisibility = useState(false);
    const [, setIsModalOpen] = modalVisibility;

    const widestSpan = useMemo(
        () => props.items.reduce((widest, example) => Math.max(widest, example.span ?? SINGLE_SPAN), SINGLE_SPAN),
        [props.items],
    );

    const layout = props.layout ?? DEFAULT_LAYOUT;

    const minColumnWidth = props.minColumnWidth ?? DEFAULT_MIN_COLUMN_WIDTH;

    const columns =
        layout === "grid"
            ? `repeat(auto-fill, minmax(min(${PERCENT / widestSpan}%, ${minColumnWidth}px), 1fr))`
            : undefined;

    return (
        <>
            <div className={styles.examplesRootVariants[layout]} style={{ gridTemplateColumns: columns }}>
                {props.items.map((example, exampleIndex) => (
                    <PageExample
                        key={example.key}
                        example={example}
                        onViewSource={() => {
                            setActiveIndex(exampleIndex);
                            setIsModalOpen(true);
                        }}
                    />
                ))}
            </div>

            <Modal
                margins={CSSUtils.spreadMargin(40)}
                visibilityState={modalVisibility}
                ariaLabel={`${props.items[activeIndex].name} source code`}
                renderOverlay={(visibilityTarget, transitionDurationMs) => (
                    <PageModalOverlay visibilityTarget={visibilityTarget} transitionDurationMs={transitionDurationMs} />
                )}
                renderContent={(visibilityTarget, transitionDurationMs) => (
                    <PageModalPanel
                        visibilityTarget={visibilityTarget}
                        transitionDurationMs={transitionDurationMs}
                        padding={"0"}
                    >
                        <PageSourceView path={props.items[activeIndex].path!} />
                    </PageModalPanel>
                )}
            />
        </>
    );
};
