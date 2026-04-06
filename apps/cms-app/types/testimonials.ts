import { Category, TestimonialType, TestimonialStatus } from '../model/model'

export interface Testimonial {
    id: string,
    category:Category,
    memberId: string,
    proyectId: string,
    type: TestimonialType,
    title: string,
    content: string,
    author: string,
    authorRole: string,
    mediaUrl: string,
    mediaDescription: string,
    status: TestimonialStatus,
    rating: number,
    createdAt: string,
    updatedAt: string,
    publishedAt: string,
    rejectReason: string,
}

export interface Project {
    id: string,
    value: string,
    title: string,
    testimonials?: Testimonial[]
}