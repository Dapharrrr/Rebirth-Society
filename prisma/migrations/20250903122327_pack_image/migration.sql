/*
  Warnings:

  - A unique constraint covering the columns `[image]` on the table `Pack` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `image` to the `Pack` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Pack" ADD COLUMN     "image" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Pack_image_key" ON "public"."Pack"("image");
