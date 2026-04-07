export interface createOrganizationInput {
    name: string
    description?: string
    user_id: string
}

export interface searchOrganizationInput{
    name?: string
    description?: string
    user_id: string
}