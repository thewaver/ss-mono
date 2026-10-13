import type { BaseProximityTextCbs, BaseProximityTextValues } from "@thewaver/ss-components";

import type { AccessorValues } from "../../../Utils/typeUtils";

export type ProximityTextProps = AccessorValues<BaseProximityTextValues> & BaseProximityTextCbs;
