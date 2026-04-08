-- DropForeignKey
ALTER TABLE "Organization_Member" DROP CONSTRAINT "Organization_Member_user_id_fkey";

-- AddForeignKey
ALTER TABLE "Organization_Member" ADD CONSTRAINT "Organization_Member_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
