-- DropForeignKey
ALTER TABLE "Testimonial" DROP CONSTRAINT "Testimonial_category_id_fkey";

-- DropForeignKey
ALTER TABLE "Testimonial" DROP CONSTRAINT "Testimonial_member_id_fkey";

-- AlterTable
ALTER TABLE "Testimonial" ALTER COLUMN "title" DROP NOT NULL,
ALTER COLUMN "media_description" DROP NOT NULL,
ALTER COLUMN "slug" DROP NOT NULL,
ALTER COLUMN "published_at" DROP NOT NULL,
ALTER COLUMN "category_id" DROP NOT NULL,
ALTER COLUMN "member_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Testimonial" ADD CONSTRAINT "Testimonial_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Testimonial" ADD CONSTRAINT "Testimonial_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "Project_Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;
