import type { PropsWithChildren } from "react";
import { useMemo, useState } from "react";

import { Button } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground-core/App/PageComponents/PropsPanel/PropsPanel.css";

import { PageButtonContent } from "../../StyledComponents/ButtonContent/ButtonContent";
import type { FieldResetRegistry } from "../Field/Field.context";
import { FieldResetProvider } from "../Field/Field.context";
import { PageProp } from "../Prop/Prop";
import { PropsPanelContextProvider } from "./PropsPanel.context";
import type { PagePropsPanelProps } from "./PropsPanel.types";

const NOTHING_TO_RESET = 0;
const SAMPLE_SELECTOR_ALONE = 1;

export const PagePropsGroups = (props: PropsWithChildren) => <div className={styles.propsGroups}>{props.children}</div>;

export const PagePropsPanel = (props: PropsWithChildren<PagePropsPanelProps>) => {
    const [resets, setResets] = useState<(() => void)[]>([]);

    const [resetRegistry] = useState<FieldResetRegistry>(() => ({
        register: (reset) => {
            setResets((list) => [...list, reset]);

            return () => setResets((list) => list.filter((entry) => entry !== reset));
        },
    }));

    const scopeContext = useMemo(() => ({ scope: props.scope }), [props.scope]);

    const isSampleScope = props.scope === "sample";

    const leastToReset = isSampleScope ? SAMPLE_SELECTOR_ALONE : NOTHING_TO_RESET;

    const resettable = isSampleScope ? resets.slice(SAMPLE_SELECTOR_ALONE) : resets;

    return (
        <div className={styles.propsPanelScopeVariants[props.scope]} data-panel={props.scope}>
            <FieldResetProvider value={resetRegistry}>
                <PropsPanelContextProvider value={scopeContext}>
                    {props.children}

                    {resets.length > leastToReset && (
                        <PageProp
                            itemKey={"resetPanel"}
                            label={"These controls"}
                            hint={"Puts every control in this panel back to the value it started at."}
                        >
                            <Button
                                renderContent={(flags) => <PageButtonContent flags={flags}>Reset</PageButtonContent>}
                                onClick={() => {
                                    resettable.forEach((reset) => reset());
                                }}
                            />
                        </PageProp>
                    )}
                </PropsPanelContextProvider>
            </FieldResetProvider>
        </div>
    );
};

export const PagePropsDivider = () => <div className={styles.propsPanelDivider} role={"separator"} />;
