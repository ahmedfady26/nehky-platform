/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `SponsoredAd` table. All the data in the column will be lost.
  - You are about to drop the `accountants` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `egyptian_payment_methods` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `expenses` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `influencer_contracts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `influencer_earnings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `influencer_payment_info` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `influencer_payments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `influencer_performance` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `online_payments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `payment_gateway_configs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `payment_refunds` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `profit_loss_summary` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `revenues` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sponsored_ad_invoices` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tax_reports` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_payment_methods` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "expenses" DROP CONSTRAINT "expenses_created_by_fkey";

-- DropForeignKey
ALTER TABLE "influencer_contracts" DROP CONSTRAINT "influencer_contracts_influencer_id_fkey";

-- DropForeignKey
ALTER TABLE "influencer_earnings" DROP CONSTRAINT "influencer_earnings_contract_id_fkey";

-- DropForeignKey
ALTER TABLE "influencer_earnings" DROP CONSTRAINT "influencer_earnings_influencer_id_fkey";

-- DropForeignKey
ALTER TABLE "influencer_earnings" DROP CONSTRAINT "influencer_earnings_payment_id_fkey";

-- DropForeignKey
ALTER TABLE "influencer_earnings" DROP CONSTRAINT "influencer_earnings_post_id_fkey";

-- DropForeignKey
ALTER TABLE "influencer_payment_info" DROP CONSTRAINT "influencer_payment_info_influencer_id_fkey";

-- DropForeignKey
ALTER TABLE "influencer_payments" DROP CONSTRAINT "influencer_payments_contract_id_fkey";

-- DropForeignKey
ALTER TABLE "influencer_payments" DROP CONSTRAINT "influencer_payments_influencer_id_fkey";

-- DropForeignKey
ALTER TABLE "influencer_payments" DROP CONSTRAINT "influencer_payments_payment_info_id_fkey";

-- DropForeignKey
ALTER TABLE "influencer_performance" DROP CONSTRAINT "influencer_performance_influencer_id_fkey";

-- DropForeignKey
ALTER TABLE "online_payments" DROP CONSTRAINT "online_payments_invoice_id_fkey";

-- DropForeignKey
ALTER TABLE "online_payments" DROP CONSTRAINT "online_payments_payment_method_id_fkey";

-- DropForeignKey
ALTER TABLE "online_payments" DROP CONSTRAINT "online_payments_user_id_fkey";

-- DropForeignKey
ALTER TABLE "payment_refunds" DROP CONSTRAINT "payment_refunds_payment_id_fkey";

-- DropForeignKey
ALTER TABLE "profit_loss_summary" DROP CONSTRAINT "profit_loss_summary_created_by_fkey";

-- DropForeignKey
ALTER TABLE "revenues" DROP CONSTRAINT "revenues_received_by_fkey";

-- DropForeignKey
ALTER TABLE "sponsored_ad_invoices" DROP CONSTRAINT "sponsored_ad_invoices_campaign_id_fkey";

-- DropForeignKey
ALTER TABLE "sponsored_ad_invoices" DROP CONSTRAINT "sponsored_ad_invoices_user_id_fkey";

-- DropForeignKey
ALTER TABLE "tax_reports" DROP CONSTRAINT "tax_reports_submitted_by_fkey";

-- DropForeignKey
ALTER TABLE "user_payment_methods" DROP CONSTRAINT "user_payment_methods_user_id_fkey";

-- AlterTable
ALTER TABLE "SponsoredAd" DROP COLUMN "updatedAt",
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "sponsored_transactions" ALTER COLUMN "amount" SET DEFAULT 0,
ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "device_fingerprint" TEXT,
ADD COLUMN     "fake_score" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "last_otp_sent_at" TIMESTAMP(3),
ADD COLUMN     "otp_attempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "otp_code" TEXT,
ADD COLUMN     "otp_expires_at" TIMESTAMP(3),
ADD COLUMN     "phone_verified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "referrer_id" TEXT,
ADD COLUMN     "registration_geo" TEXT,
ADD COLUMN     "registration_ip" TEXT,
ADD COLUMN     "registration_user_agent" TEXT;

-- AlterTable
ALTER TABLE "video_channels" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "accountants";

-- DropTable
DROP TABLE "egyptian_payment_methods";

-- DropTable
DROP TABLE "expenses";

-- DropTable
DROP TABLE "influencer_contracts";

-- DropTable
DROP TABLE "influencer_earnings";

-- DropTable
DROP TABLE "influencer_payment_info";

-- DropTable
DROP TABLE "influencer_payments";

-- DropTable
DROP TABLE "influencer_performance";

-- DropTable
DROP TABLE "online_payments";

-- DropTable
DROP TABLE "payment_gateway_configs";

-- DropTable
DROP TABLE "payment_refunds";

-- DropTable
DROP TABLE "profit_loss_summary";

-- DropTable
DROP TABLE "revenues";

-- DropTable
DROP TABLE "sponsored_ad_invoices";

-- DropTable
DROP TABLE "tax_reports";

-- DropTable
DROP TABLE "user_payment_methods";

-- CreateTable
CREATE TABLE "referral_audit_logs" (
    "id" TEXT NOT NULL,
    "referred_user_id" TEXT NOT NULL,
    "referrer_id" TEXT NOT NULL,
    "ip_address" TEXT NOT NULL,
    "device_fingerprint" TEXT NOT NULL,
    "user_agent" TEXT,
    "geo_location" TEXT,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "phone_verified" BOOLEAN NOT NULL DEFAULT false,
    "behavior_verified" BOOLEAN NOT NULL DEFAULT false,
    "fake_score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "suspicious_factors" TEXT[],
    "reward_granted" BOOLEAN NOT NULL DEFAULT false,
    "reward_amount" DOUBLE PRECISION,
    "reward_type" TEXT,
    "user_first_action" TIMESTAMP(3),
    "active_days" INTEGER NOT NULL DEFAULT 0,
    "total_interactions" INTEGER NOT NULL DEFAULT 0,
    "review_status" TEXT NOT NULL DEFAULT 'pending',
    "reviewed_by" TEXT,
    "reviewed_at" TIMESTAMP(3),
    "review_notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "referral_audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "referral_audit_logs_referrer_id_idx" ON "referral_audit_logs"("referrer_id");

-- CreateIndex
CREATE INDEX "referral_audit_logs_ip_address_idx" ON "referral_audit_logs"("ip_address");

-- CreateIndex
CREATE INDEX "referral_audit_logs_device_fingerprint_idx" ON "referral_audit_logs"("device_fingerprint");

-- CreateIndex
CREATE INDEX "referral_audit_logs_fake_score_idx" ON "referral_audit_logs"("fake_score");

-- CreateIndex
CREATE INDEX "referral_audit_logs_review_status_idx" ON "referral_audit_logs"("review_status");

-- CreateIndex
CREATE INDEX "referral_audit_logs_reward_granted_idx" ON "referral_audit_logs"("reward_granted");

-- CreateIndex
CREATE INDEX "referral_audit_logs_created_at_idx" ON "referral_audit_logs"("created_at");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_referrer_id_fkey" FOREIGN KEY ("referrer_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referral_audit_logs" ADD CONSTRAINT "referral_audit_logs_referred_user_id_fkey" FOREIGN KEY ("referred_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referral_audit_logs" ADD CONSTRAINT "referral_audit_logs_referrer_id_fkey" FOREIGN KEY ("referrer_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
