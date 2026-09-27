import type { PropsWithChildren } from "react";

import * as styles from "@thewaver/ss-playground-core/App/PageComponents/ControlRow/ControlRow.css";

export const PageControlRow = (props: PropsWithChildren) => <div className={styles.controlRow}>{props.children}</div>;

export const PageControlColumn = (props: PropsWithChildren) => (
    <div className={styles.controlColumn}>{props.children}</div>
);

export const PageControlRowLabel = (props: PropsWithChildren) => (
    <div className={styles.controlRowLabel}>{props.children}</div>
);
