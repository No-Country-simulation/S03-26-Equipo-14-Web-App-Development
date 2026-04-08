-- DropForeignKey
ALTER TABLE "Organization_Member" DROP CONSTRAINT "Organization_Member_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "Project_Member" DROP CONSTRAINT "Project_Member_organization_member_id_fkey";

-- DropForeignKey
ALTER TABLE "Project_Member" DROP CONSTRAINT "Project_Member_project_id_fkey";

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Organization_Member" ADD CONSTRAINT "Organization_Member_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project_Member" ADD CONSTRAINT "Project_Member_organization_member_id_fkey" FOREIGN KEY ("organization_member_id") REFERENCES "Organization_Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project_Member" ADD CONSTRAINT "Project_Member_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
