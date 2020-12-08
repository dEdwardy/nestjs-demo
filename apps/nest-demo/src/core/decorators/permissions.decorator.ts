import { SetMetadata } from "@nestjs/common";
import { PermissionInterface } from "../interfaces/permission.interface";

export const Permissions = (
    ...permissions:Partial<PermissionInterface>[]
    ) => SetMetadata('permissions', permissions)