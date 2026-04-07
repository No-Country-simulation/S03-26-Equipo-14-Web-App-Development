// common/decorators/org-roles.decorator.ts

import { SetMetadata } from '@nestjs/common';
import { OrganizationRole } from '@repo/api';


export const ORG_ROLES_KEY = 'org_roles';

export const OrgRoles = (...roles: OrganizationRole[]) => SetMetadata(ORG_ROLES_KEY, roles);