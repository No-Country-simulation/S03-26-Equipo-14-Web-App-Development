/*
  Warnings:

  - The primary key for the `Testimonial_Tag` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Testimonial_Tag` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Tag` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Testimonial_Tag" DROP CONSTRAINT "Testimonial_Tag_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Testimonial_Tag_pkey" PRIMARY KEY ("tag_id", "testimonial_id");

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "resetToken" TEXT,
ADD COLUMN     "resetTokenExpires" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");
