/*
  Warnings:

  - Added the required column `first_name` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_name` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- أولاً، إضافة الأعمدة الجديدة كاختيارية
ALTER TABLE "users" ADD COLUMN "first_name" TEXT;
ALTER TABLE "users" ADD COLUMN "last_name" TEXT;
ALTER TABLE "users" ADD COLUMN "second_name" TEXT;
ALTER TABLE "users" ADD COLUMN "third_name" TEXT;

-- تحديث البيانات الموجودة بتقسيم full_name
UPDATE "users" 
SET 
  "first_name" = CASE 
    WHEN array_length(string_to_array("full_name", ' '), 1) >= 1 
    THEN trim(split_part("full_name", ' ', 1))
    ELSE "full_name"
  END,
  "last_name" = CASE 
    WHEN array_length(string_to_array("full_name", ' '), 1) >= 2 
    THEN trim(split_part("full_name", ' ', array_length(string_to_array("full_name", ' '), 1)))
    ELSE 'غير محدد'
  END,
  "second_name" = CASE 
    WHEN array_length(string_to_array("full_name", ' '), 1) >= 3 
    THEN trim(split_part("full_name", ' ', 2))
    ELSE NULL
  END,
  "third_name" = CASE 
    WHEN array_length(string_to_array("full_name", ' '), 1) >= 4 
    THEN trim(split_part("full_name", ' ', 3))
    ELSE NULL
  END
WHERE "first_name" IS NULL OR "last_name" IS NULL;

-- جعل first_name و last_name مطلوبين
ALTER TABLE "users" ALTER COLUMN "first_name" SET NOT NULL;
ALTER TABLE "users" ALTER COLUMN "last_name" SET NOT NULL;
