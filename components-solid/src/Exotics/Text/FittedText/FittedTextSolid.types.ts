import type { BaseFittedTextCbs, BaseFittedTextValues } from "@thewaver/ss-components";

import type { AccessorValues } from "../../../Utils/typeUtils";

export type FittedTextProps = AccessorValues<BaseFittedTextValues> & BaseFittedTextCbs;
