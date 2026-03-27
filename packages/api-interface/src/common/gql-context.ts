// File: packages/api-interface/src/common/gql-context.ts
import { JwtPayloadUser } from '../auth/auth.types';

export interface GqlContext {
  req: {
    user?: JwtPayloadUser;
    headers: Record<string, string>;
  };
}
