export interface createOrganizationInput {
    name: string
    description?: string
    user_id: string
}

export interface updateOrganizationInput {
    name?:string,
    description?:string
}

export interface searchOrganizationInput{
    name?: string
    description?: string
    user_id: string
}