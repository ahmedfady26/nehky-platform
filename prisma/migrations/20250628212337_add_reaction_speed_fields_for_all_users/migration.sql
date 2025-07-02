-- CreateEnum
CREATE TYPE "AccountantRole" AS ENUM ('JUNIOR_ACCOUNTANT', 'SENIOR_ACCOUNTANT', 'AUDITOR', 'FINANCE_MANAGER');

-- CreateEnum
CREATE TYPE "ExpenseCategory" AS ENUM ('OPERATIONS', 'MARKETING', 'TAXES', 'SALARIES', 'RENT', 'UTILITIES', 'EQUIPMENT', 'SOFTWARE', 'LEGAL', 'CONSULTING', 'TRAVEL', 'ENTERTAINMENT', 'INSURANCE', 'MAINTENANCE', 'OTHER');

-- CreateEnum
CREATE TYPE "RevenueSource" AS ENUM ('SUBSCRIPTION', 'ADVERTISING', 'SPONSORED_VIDEO', 'SPONSORED_POST', 'PARTNERSHIP', 'COMMISSION', 'DONATION', 'MERCHANDISE', 'LICENSING', 'CONSULTATION', 'OTHER');

-- CreateEnum
CREATE TYPE "PeriodType" AS ENUM ('MONTHLY', 'QUARTERLY', 'SEMI_ANNUALLY', 'ANNUALLY', 'CUSTOM');

-- CreateEnum
CREATE TYPE "TaxReportType" AS ENUM ('VAT', 'INCOME_TAX', 'CORPORATE_TAX', 'WITHHOLDING_TAX', 'COMBINED');

-- CreateEnum
CREATE TYPE "TaxReportStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'PAID', 'APPROVED', 'REJECTED', 'UNDER_REVIEW');

-- CreateEnum
CREATE TYPE "PaymentGateway" AS ENUM ('FAWRY', 'PAYMOB', 'ACCEPT', 'VODAFONE_CASH', 'ORANGE_MONEY', 'ETISALAT_CASH', 'AMAN', 'MASARY', 'BANK_TRANSFER', 'CREDIT_CARD', 'DEBIT_CARD', 'DIGITAL_WALLET', 'INSTALLMENTS', 'OTHER');

-- CreateEnum
CREATE TYPE "PaymentMethodType" AS ENUM ('CARD', 'WALLET', 'BANK_ACCOUNT', 'MOBILE_PAYMENT', 'INSTALLMENT_PLAN');

-- CreateEnum
CREATE TYPE "CardType" AS ENUM ('VISA', 'MASTERCARD', 'AMERICAN_EXPRESS', 'MEEZA', 'OTHER');

-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('DRAFT', 'SENT', 'VIEWED', 'PAID', 'PARTIALLY_PAID', 'OVERDUE', 'CANCELLED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "PaymentProcessorStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED', 'REFUNDED', 'DISPUTED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "InfluencerContractType" AS ENUM ('PER_POST', 'PER_VIDEO', 'MONTHLY_RETAINER', 'CAMPAIGN_BASED', 'COMMISSION_BASED', 'PERFORMANCE_BASED', 'HYBRID');

-- CreateEnum
CREATE TYPE "ContractStatus" AS ENUM ('DRAFT', 'PENDING_APPROVAL', 'ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED', 'EXPIRED', 'TERMINATED');

-- CreateEnum
CREATE TYPE "InfluencerPaymentStatus" AS ENUM ('PENDING', 'APPROVED', 'PROCESSING', 'COMPLETED', 'FAILED', 'ON_HOLD', 'DISPUTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "InfluencerPaymentMethod" AS ENUM ('BANK_TRANSFER', 'MOBILE_WALLET', 'PAYPAL', 'WISE', 'WESTERN_UNION', 'VODAFONE_CASH', 'ORANGE_MONEY', 'FAWRY', 'CHECK', 'CASH', 'CRYPTO', 'OTHER');

-- CreateEnum
CREATE TYPE "CommissionType" AS ENUM ('FIXED_AMOUNT', 'PERCENTAGE', 'TIERED', 'BONUS_BASED', 'MIXED');

-- CreateEnum
CREATE TYPE "UserEngagementType" AS ENUM ('PASSIVE_VIEW', 'ACTIVE_VIEW', 'LIKE', 'COMMENT', 'SHARE', 'SAVE', 'CLICK_PROFILE', 'CLICK_HASHTAG', 'FULL_ENGAGEMENT');

-- CreateEnum
CREATE TYPE "AdvertiserType" AS ENUM ('INDIVIDUAL', 'BUSINESS', 'AGENCY');

-- CreateEnum
CREATE TYPE "CampaignType" AS ENUM ('BRAND_AWARENESS', 'TRAFFIC', 'ENGAGEMENT', 'LEAD_GENERATION', 'SALES', 'VIDEO_VIEWS', 'APP_INSTALL', 'OTHER');

-- CreateEnum
CREATE TYPE "CampaignGoal" AS ENUM ('IMPRESSIONS', 'CLICKS', 'CONVERSIONS', 'REACH', 'VIDEO_VIEWS', 'ENGAGEMENT', 'SALES', 'OTHER');

-- CreateEnum
CREATE TYPE "CampaignStatus" AS ENUM ('DRAFT', 'ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED', 'REJECTED');

-- CreateEnum
CREATE TYPE "SponsoredStatus" AS ENUM ('DRAFT', 'PENDING', 'ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED', 'REJECTED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "TargetingStrategy" AS ENUM ('BROAD', 'INTEREST', 'DEMOGRAPHIC', 'LOCATION', 'CUSTOM_AUDIENCE');

-- CreateEnum
CREATE TYPE "BidType" AS ENUM ('CPC', 'CPM', 'CPA', 'CPV');

-- CreateEnum
CREATE TYPE "BidStrategy" AS ENUM ('MANUAL', 'AUTOMATIC', 'TARGET_COST');

-- CreateEnum
CREATE TYPE "PacingType" AS ENUM ('STANDARD', 'ACCELERATED');

-- CreateEnum
CREATE TYPE "ScheduleType" AS ENUM ('CONTINUOUS', 'FIXED_DATES');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('CHARGE', 'REFUND', 'ADJUSTMENT');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CREDIT_CARD', 'BANK_TRANSFER', 'WALLET', 'PAYPAL', 'OTHER');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PriorityLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "SponsoredAdType" AS ENUM ('POST', 'VIDEO', 'BANNER');

-- CreateEnum
CREATE TYPE "BannerPosition" AS ENUM ('TOP', 'BOTTOM', 'SIDEBAR', 'INLINE', 'POPUP', 'OVERLAY');

-- AlterTable
ALTER TABLE "interactions" ADD COLUMN     "adjusted_points" INTEGER DEFAULT 0,
ADD COLUMN     "reaction_speed_multiplier" DOUBLE PRECISION DEFAULT 1.0;

-- CreateTable
CREATE TABLE "content_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT,
    "icon" TEXT,
    "parent_id" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "requires_approval" BOOLEAN NOT NULL DEFAULT false,
    "is_sensitive" BOOLEAN NOT NULL DEFAULT false,
    "posts_count" INTEGER NOT NULL DEFAULT 0,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "content_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_classifications" (
    "id" TEXT NOT NULL,
    "post_id" TEXT NOT NULL,
    "primary_category_id" TEXT NOT NULL,
    "secondary_category_id" TEXT,
    "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "quality_score" DOUBLE PRECISION,
    "aiKeywords" TEXT[],
    "aiTopics" TEXT[],
    "language_code" TEXT NOT NULL DEFAULT 'ar',
    "manual_override" BOOLEAN NOT NULL DEFAULT false,
    "reviewed_by" TEXT,
    "reviewed_at" TIMESTAMP(3),
    "review_notes" TEXT,
    "is_approved" BOOLEAN NOT NULL DEFAULT true,
    "needs_review" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "post_classifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_sentiment_analysis" (
    "id" TEXT NOT NULL,
    "post_classification_id" TEXT NOT NULL,
    "sentimentScore" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "positive_score" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "negative_score" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "neutral_score" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "toxicity_score" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "hate_score" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "threats_score" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "spam_score" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "positive_keywords" TEXT[],
    "negative_keywords" TEXT[],
    "trigger_words" TEXT[],
    "manual_review" BOOLEAN NOT NULL DEFAULT false,
    "reviewer_user_id" TEXT,
    "reviewer_notes" TEXT,
    "reviewed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "post_sentiment_analysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "moderation_rules" (
    "id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "keywords" TEXT[],
    "sentiment_min" DOUBLE PRECISION,
    "sentiment_max" DOUBLE PRECISION,
    "toxicity_max" DOUBLE PRECISION,
    "auto_execute" BOOLEAN NOT NULL DEFAULT false,
    "requires_human" BOOLEAN NOT NULL DEFAULT true,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "moderation_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_moderation_logs" (
    "id" TEXT NOT NULL,
    "post_id" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "rule_id" TEXT,
    "executed_by" TEXT,
    "is_automatic" BOOLEAN NOT NULL DEFAULT false,
    "before_status" TEXT,
    "after_status" TEXT,
    "metadata" JSONB,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "content_moderation_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_attractiveness" (
    "id" TEXT NOT NULL,
    "post_id" TEXT NOT NULL,
    "overall_score" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "visual_appeal" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "content_quality" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "engagement" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "virality" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "initial_response" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "peak_time" TIMESTAMP(3),
    "sustainability_score" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "audience_match" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "demographic_appeal" JSONB,
    "geographic_appeal" JSONB,
    "has_media" BOOLEAN NOT NULL DEFAULT false,
    "has_hashtags" BOOLEAN NOT NULL DEFAULT false,
    "post_length" INTEGER NOT NULL DEFAULT 0,
    "post_timing" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "sentiment_score" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "toxicity_score" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "clarity_score" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "creativity_score" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "trend_alignment" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "seasonal_factor" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "predicted_views" INTEGER NOT NULL DEFAULT 0,
    "predicted_likes" INTEGER NOT NULL DEFAULT 0,
    "predicted_shares" INTEGER NOT NULL DEFAULT 0,
    "confidence_level" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "calculation_method" TEXT NOT NULL DEFAULT 'ai_analysis_v1',
    "last_calculated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "needs_recalculation" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "post_attractiveness_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_post_interest_mapping" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "post_id" TEXT NOT NULL,
    "related_interests" TEXT[],
    "interest_scores" JSONB NOT NULL,
    "category_match" TEXT,
    "match_score" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "personal_relevance" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "discoverability_score" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "view_time" INTEGER,
    "interaction_delay" INTEGER,
    "engagement_type" "UserEngagementType",
    "engagement_intensity" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "affected_interests" TEXT[],
    "interest_weight_changes" JSONB,
    "profile_impact_score" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "analysis_method" TEXT NOT NULL DEFAULT 'behavioral_analysis',
    "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "needs_update" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_post_interest_mapping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_insights" (
    "id" TEXT NOT NULL,
    "insight_date" TIMESTAMP(3) NOT NULL,
    "category_id" TEXT NOT NULL,
    "posts_count" INTEGER NOT NULL DEFAULT 0,
    "views_count" INTEGER NOT NULL DEFAULT 0,
    "likes_count" INTEGER NOT NULL DEFAULT 0,
    "comments_count" INTEGER NOT NULL DEFAULT 0,
    "shares_count" INTEGER NOT NULL DEFAULT 0,
    "positive_count" INTEGER NOT NULL DEFAULT 0,
    "negative_count" INTEGER NOT NULL DEFAULT 0,
    "neutral_count" INTEGER NOT NULL DEFAULT 0,
    "avg_sentiment" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "avg_quality_score" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "avg_toxicity_score" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "moderated_count" INTEGER NOT NULL DEFAULT 0,
    "flagged_count" INTEGER NOT NULL DEFAULT 0,
    "trend_score" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "engagement_rate" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "content_insights_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Campaign" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "advertiserId" TEXT NOT NULL,
    "advertiserType" "AdvertiserType" NOT NULL DEFAULT 'INDIVIDUAL',
    "type" "CampaignType" NOT NULL,
    "goal" "CampaignGoal" NOT NULL,
    "status" "CampaignStatus" NOT NULL DEFAULT 'DRAFT',
    "budget" DOUBLE PRECISION NOT NULL,
    "dailyBudget" DOUBLE PRECISION,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SponsoredAd" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "type" "SponsoredAdType" NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "mediaUrl" TEXT,
    "targetUrl" TEXT,
    "status" "SponsoredStatus" NOT NULL DEFAULT 'DRAFT',
    "impressions" INTEGER NOT NULL DEFAULT 0,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "cost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "bidType" "BidType" NOT NULL DEFAULT 'CPC',
    "bidAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "bidStrategy" "BidStrategy" NOT NULL DEFAULT 'AUTOMATIC',
    "pacingType" "PacingType" NOT NULL DEFAULT 'STANDARD',
    "scheduleType" "ScheduleType" NOT NULL DEFAULT 'CONTINUOUS',
    "priority" "PriorityLevel" NOT NULL DEFAULT 'MEDIUM',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SponsoredAd_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sponsored_targeting" (
    "id" TEXT NOT NULL,
    "campaign_id" TEXT NOT NULL,
    "sponsored_ad_id" TEXT NOT NULL,
    "strategy" "TargetingStrategy" NOT NULL DEFAULT 'BROAD',
    "ageMin" INTEGER,
    "ageMax" INTEGER,
    "genders" TEXT[],
    "locations" TEXT[],
    "interests" TEXT[],
    "customAudience" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sponsored_targeting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SponsoredUserTarget" (
    "id" TEXT NOT NULL,
    "targetingId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "matchedScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isReached" BOOLEAN NOT NULL DEFAULT false,
    "isClicked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SponsoredUserTarget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SponsoredPerformance" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "sponsoredAdId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "impressions" INTEGER NOT NULL DEFAULT 0,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "ctr" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "conversions" INTEGER NOT NULL DEFAULT 0,
    "spend" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "cpc" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "cpm" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "cpa" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "cpv" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SponsoredPerformance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SponsoredBid" (
    "id" TEXT NOT NULL,
    "sponsoredAdId" TEXT NOT NULL,
    "bidType" "BidType" NOT NULL DEFAULT 'CPC',
    "amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "strategy" "BidStrategy" NOT NULL DEFAULT 'AUTOMATIC',
    "status" "SponsoredStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SponsoredBid_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SponsoredInsight" (
    "id" TEXT NOT NULL,
    "sponsoredAdId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "impressions" INTEGER NOT NULL DEFAULT 0,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "ctr" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "conversions" INTEGER NOT NULL DEFAULT 0,
    "spend" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "reach" INTEGER NOT NULL DEFAULT 0,
    "frequency" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "avgViewTime" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "engagement" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SponsoredInsight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sponsored_posts" (
    "id" TEXT NOT NULL,
    "sponsored_ad_id" TEXT NOT NULL,
    "post_id" TEXT NOT NULL,
    "is_promoted" BOOLEAN NOT NULL DEFAULT true,
    "promotion_start" TIMESTAMP(3),
    "promotion_end" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sponsored_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sponsored_videos" (
    "id" TEXT NOT NULL,
    "sponsored_ad_id" TEXT NOT NULL,
    "video_id" TEXT NOT NULL,
    "skipable_after" INTEGER,
    "max_duration" INTEGER,
    "auto_play" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sponsored_videos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sponsored_banners" (
    "id" TEXT NOT NULL,
    "sponsoredAdId" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "link_url" TEXT,
    "alt_text" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "position" "BannerPosition" NOT NULL DEFAULT 'TOP',
    "open_in_new_tab" BOOLEAN NOT NULL DEFAULT true,
    "track_clicks" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sponsored_banners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sponsored_transactions" (
    "id" TEXT NOT NULL,
    "campaign_id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "type" "TransactionType" NOT NULL DEFAULT 'CHARGE',
    "method" "PaymentMethod" NOT NULL DEFAULT 'CREDIT_CARD',
    "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING',
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "reference" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sponsored_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accountants" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "AccountantRole" NOT NULL DEFAULT 'JUNIOR_ACCOUNTANT',
    "access_level" "AccountantRole" NOT NULL DEFAULT 'JUNIOR_ACCOUNTANT',
    "full_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "national_id" TEXT NOT NULL,
    "criminal_record_file" TEXT,
    "profile_picture" TEXT,
    "id_card_image" TEXT,
    "address" TEXT,
    "date_of_birth" TIMESTAMP(3),
    "gender" "Gender",
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "last_login" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accountants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "expenses" (
    "expense_id" TEXT NOT NULL,
    "category" "ExpenseCategory" NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "description" TEXT,
    "payment_method" "PaymentMethod" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT NOT NULL,
    "invoice_number" TEXT,
    "tax_applicable" BOOLEAN NOT NULL DEFAULT false,
    "tax_rate" DECIMAL(5,4) DEFAULT 0.14,
    "vat_included" BOOLEAN NOT NULL DEFAULT false,
    "tax_amount" DECIMAL(15,2),
    "net_amount" DECIMAL(15,2),
    "vendor_name" TEXT,
    "vendor_tax_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "expenses_pkey" PRIMARY KEY ("expense_id")
);

-- CreateTable
CREATE TABLE "revenues" (
    "revenue_id" TEXT NOT NULL,
    "source" "RevenueSource" NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "received_date" TIMESTAMP(3) NOT NULL,
    "received_by" TEXT NOT NULL,
    "payer_info" TEXT,
    "tax_collected" DECIMAL(15,2) DEFAULT 0,
    "tax_rate" DECIMAL(5,4) DEFAULT 0.14,
    "vat_applicable" BOOLEAN NOT NULL DEFAULT true,
    "net_amount" DECIMAL(15,2),
    "gross_amount" DECIMAL(15,2),
    "client_name" TEXT,
    "client_tax_id" TEXT,
    "invoice_number" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "revenues_pkey" PRIMARY KEY ("revenue_id")
);

-- CreateTable
CREATE TABLE "profit_loss_summary" (
    "id" TEXT NOT NULL,
    "period_type" "PeriodType" NOT NULL,
    "period_start" TIMESTAMP(3) NOT NULL,
    "period_end" TIMESTAMP(3) NOT NULL,
    "total_revenue" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "total_expenses" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "total_tax_paid" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "total_tax_collected" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "net_profit" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "vat_paid" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "vat_collected" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "net_vat_due" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "taxable_income" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "income_tax_due" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "created_by" TEXT NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profit_loss_summary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tax_reports" (
    "tax_report_id" TEXT NOT NULL,
    "report_type" "TaxReportType" NOT NULL,
    "period" TEXT NOT NULL,
    "period_start" TIMESTAMP(3) NOT NULL,
    "period_end" TIMESTAMP(3) NOT NULL,
    "taxable_revenue" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "tax_collected" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "tax_paid" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "vat_base" DECIMAL(15,2) DEFAULT 0,
    "vat_rate" DECIMAL(5,4) DEFAULT 0.14,
    "vat_amount" DECIMAL(15,2) DEFAULT 0,
    "gross_income" DECIMAL(15,2) DEFAULT 0,
    "allowable_deductions" DECIMAL(15,2) DEFAULT 0,
    "net_taxable_income" DECIMAL(15,2) DEFAULT 0,
    "income_tax_rate" DECIMAL(5,4),
    "income_tax_amount" DECIMAL(15,2) DEFAULT 0,
    "report_status" "TaxReportStatus" NOT NULL DEFAULT 'DRAFT',
    "submitted_by" TEXT,
    "submitted_at" TIMESTAMP(3),
    "tax_authority" TEXT,
    "reference_number" TEXT,
    "due_date" TIMESTAMP(3),
    "penalty_amount" DECIMAL(15,2) DEFAULT 0,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tax_reports_pkey" PRIMARY KEY ("tax_report_id")
);

-- CreateTable
CREATE TABLE "user_payment_methods" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "method_type" "PaymentMethodType" NOT NULL,
    "gateway" "PaymentGateway" NOT NULL,
    "card_type" "CardType",
    "last_four_digits" TEXT,
    "card_holder_name" TEXT,
    "expiry_month" INTEGER,
    "expiry_year" INTEGER,
    "wallet_phone" TEXT,
    "wallet_email" TEXT,
    "bank_name" TEXT,
    "account_number" TEXT,
    "iban" TEXT,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "token_reference" TEXT,
    "fingerprint" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "last_used_at" TIMESTAMP(3),

    CONSTRAINT "user_payment_methods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sponsored_ad_invoices" (
    "id" TEXT NOT NULL,
    "campaign_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "invoice_number" TEXT NOT NULL,
    "subtotal" DECIMAL(10,2) NOT NULL,
    "tax_rate" DECIMAL(5,4) NOT NULL DEFAULT 0.14,
    "tax_amount" DECIMAL(10,2) NOT NULL,
    "discount_amount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "total_amount" DECIMAL(10,2) NOT NULL,
    "ad_duration" INTEGER NOT NULL,
    "target_audience" INTEGER NOT NULL,
    "ad_type" "SponsoredAdType" NOT NULL,
    "status" "InvoiceStatus" NOT NULL DEFAULT 'DRAFT',
    "due_date" TIMESTAMP(3) NOT NULL,
    "paid_date" TIMESTAMP(3),
    "description" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sponsored_ad_invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "online_payments" (
    "id" TEXT NOT NULL,
    "invoice_id" TEXT NOT NULL,
    "payment_method_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'EGP',
    "gateway" "PaymentGateway" NOT NULL,
    "processor_status" "PaymentProcessorStatus" NOT NULL DEFAULT 'PENDING',
    "gateway_reference" TEXT,
    "transaction_id" TEXT,
    "authorization_code" TEXT,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "failure_reason" TEXT,
    "retry_count" INTEGER NOT NULL DEFAULT 0,
    "processed_at" TIMESTAMP(3),
    "failed_at" TIMESTAMP(3),
    "refunded_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "online_payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_refunds" (
    "id" TEXT NOT NULL,
    "payment_id" TEXT NOT NULL,
    "refund_amount" DECIMAL(10,2) NOT NULL,
    "refund_reason" TEXT NOT NULL,
    "refund_reference" TEXT,
    "status" "PaymentProcessorStatus" NOT NULL DEFAULT 'PENDING',
    "processed_at" TIMESTAMP(3),
    "notes" TEXT,
    "processed_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_refunds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_gateway_configs" (
    "id" TEXT NOT NULL,
    "gateway" "PaymentGateway" NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "is_test_mode" BOOLEAN NOT NULL DEFAULT true,
    "public_key" TEXT,
    "private_key" TEXT,
    "merchant_id" TEXT,
    "webhook_url" TEXT,
    "supported_currencies" TEXT[],
    "fixed_fee" DECIMAL(10,2) DEFAULT 0,
    "percentage_fee" DECIMAL(5,4) DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_gateway_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "influencer_contracts" (
    "id" TEXT NOT NULL,
    "influencer_id" TEXT NOT NULL,
    "company_id" TEXT,
    "contract_type" "InfluencerContractType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "ContractStatus" NOT NULL DEFAULT 'DRAFT',
    "base_rate" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'EGP',
    "commission_type" "CommissionType" NOT NULL,
    "commission_rate" DECIMAL(5,4),
    "bonus_structure" JSONB,
    "minimum_posts" INTEGER,
    "exclusivity" BOOLEAN NOT NULL DEFAULT false,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3),
    "renewal_date" TIMESTAMP(3),
    "payment_terms" TEXT,
    "payment_cycle" TEXT NOT NULL DEFAULT 'monthly',
    "notes" TEXT,
    "contract_file" TEXT,
    "signed_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "influencer_contracts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "influencer_earnings" (
    "id" TEXT NOT NULL,
    "influencer_id" TEXT NOT NULL,
    "contract_id" TEXT,
    "post_id" TEXT,
    "campaign_id" TEXT,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'EGP',
    "earned_date" TIMESTAMP(3) NOT NULL,
    "earningType" TEXT NOT NULL,
    "description" TEXT,
    "views" INTEGER DEFAULT 0,
    "likes" INTEGER DEFAULT 0,
    "shares" INTEGER DEFAULT 0,
    "clicks" INTEGER DEFAULT 0,
    "conversions" INTEGER DEFAULT 0,
    "metrics" JSONB,
    "notes" TEXT,
    "is_paid" BOOLEAN NOT NULL DEFAULT false,
    "paid_date" TIMESTAMP(3),
    "payment_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "influencer_earnings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "influencer_payment_info" (
    "id" TEXT NOT NULL,
    "influencer_id" TEXT NOT NULL,
    "preferred_method" "InfluencerPaymentMethod" NOT NULL,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "bank_name" TEXT,
    "account_number" TEXT,
    "account_holder_name" TEXT,
    "iban" TEXT,
    "swift_code" TEXT,
    "wallet_phone" TEXT,
    "wallet_email" TEXT,
    "wallet_id" TEXT,
    "paypal_email" TEXT,
    "wise_email" TEXT,
    "crypto_address" TEXT,
    "crypto_type" TEXT,
    "mailing_address" TEXT,
    "tax_id" TEXT,
    "tax_document" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "influencer_payment_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "influencer_payments" (
    "id" TEXT NOT NULL,
    "influencer_id" TEXT NOT NULL,
    "contract_id" TEXT,
    "payment_info_id" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'EGP',
    "exchange_rate" DECIMAL(10,6),
    "net_amount" DECIMAL(10,2),
    "tax_amount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "fee_amount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "payment_method" "InfluencerPaymentMethod" NOT NULL,
    "status" "InfluencerPaymentStatus" NOT NULL DEFAULT 'PENDING',
    "payment_reference" TEXT,
    "transaction_id" TEXT,
    "processed_by" TEXT,
    "scheduled_date" TIMESTAMP(3) NOT NULL,
    "processed_date" TIMESTAMP(3),
    "completed_date" TIMESTAMP(3),
    "period_start" TIMESTAMP(3),
    "period_end" TIMESTAMP(3),
    "description" TEXT,
    "notes" TEXT,
    "receipt_file" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "influencer_payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "influencer_performance" (
    "id" TEXT NOT NULL,
    "influencer_id" TEXT NOT NULL,
    "report_month" INTEGER NOT NULL,
    "report_year" INTEGER NOT NULL,
    "total_posts" INTEGER NOT NULL DEFAULT 0,
    "total_views" INTEGER NOT NULL DEFAULT 0,
    "total_likes" INTEGER NOT NULL DEFAULT 0,
    "total_shares" INTEGER NOT NULL DEFAULT 0,
    "total_comments" INTEGER NOT NULL DEFAULT 0,
    "total_clicks" INTEGER NOT NULL DEFAULT 0,
    "total_conversions" INTEGER NOT NULL DEFAULT 0,
    "total_earnings" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "total_paid" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "pending_amount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "engagement_rate" DECIMAL(5,4),
    "conversion_rate" DECIMAL(5,4),
    "average_cpm" DECIMAL(10,2),
    "average_cpc" DECIMAL(10,2),
    "top_performing_post" TEXT,
    "metrics" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "influencer_performance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "egyptian_payment_methods" (
    "id" TEXT NOT NULL,
    "method" "InfluencerPaymentMethod" NOT NULL,
    "name_ar" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "description" TEXT,
    "min_amount" DECIMAL(10,2) NOT NULL,
    "max_amount" DECIMAL(10,2) NOT NULL,
    "daily_limit" DECIMAL(10,2) NOT NULL,
    "fixed_fee" DECIMAL(10,2),
    "percentage_fee" DECIMAL(5,4),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_for_influencers" BOOLEAN NOT NULL DEFAULT true,
    "processing_time" TEXT,
    "customer_service" TEXT,
    "website" TEXT,
    "mobile_app" TEXT,
    "requires_kyc" BOOLEAN NOT NULL DEFAULT false,
    "requires_phone" BOOLEAN NOT NULL DEFAULT true,
    "requires_bank_account" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "egyptian_payment_methods_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "content_categories_name_key" ON "content_categories"("name");

-- CreateIndex
CREATE INDEX "content_categories_name_idx" ON "content_categories"("name");

-- CreateIndex
CREATE INDEX "content_categories_parent_id_idx" ON "content_categories"("parent_id");

-- CreateIndex
CREATE INDEX "content_categories_is_active_idx" ON "content_categories"("is_active");

-- CreateIndex
CREATE INDEX "content_categories_priority_idx" ON "content_categories"("priority");

-- CreateIndex
CREATE INDEX "post_classifications_primary_category_id_idx" ON "post_classifications"("primary_category_id");

-- CreateIndex
CREATE INDEX "post_classifications_confidence_idx" ON "post_classifications"("confidence");

-- CreateIndex
CREATE INDEX "post_classifications_is_approved_idx" ON "post_classifications"("is_approved");

-- CreateIndex
CREATE INDEX "post_classifications_needs_review_idx" ON "post_classifications"("needs_review");

-- CreateIndex
CREATE INDEX "post_classifications_language_code_idx" ON "post_classifications"("language_code");

-- CreateIndex
CREATE UNIQUE INDEX "post_classifications_post_id_key" ON "post_classifications"("post_id");

-- CreateIndex
CREATE UNIQUE INDEX "post_sentiment_analysis_post_classification_id_key" ON "post_sentiment_analysis"("post_classification_id");

-- CreateIndex
CREATE INDEX "post_sentiment_analysis_sentimentScore_idx" ON "post_sentiment_analysis"("sentimentScore");

-- CreateIndex
CREATE INDEX "post_sentiment_analysis_toxicity_score_idx" ON "post_sentiment_analysis"("toxicity_score");

-- CreateIndex
CREATE INDEX "moderation_rules_category_id_idx" ON "moderation_rules"("category_id");

-- CreateIndex
CREATE INDEX "moderation_rules_is_active_idx" ON "moderation_rules"("is_active");

-- CreateIndex
CREATE INDEX "moderation_rules_priority_idx" ON "moderation_rules"("priority");

-- CreateIndex
CREATE INDEX "content_moderation_logs_post_id_idx" ON "content_moderation_logs"("post_id");

-- CreateIndex
CREATE INDEX "content_moderation_logs_executed_by_idx" ON "content_moderation_logs"("executed_by");

-- CreateIndex
CREATE INDEX "content_moderation_logs_is_automatic_idx" ON "content_moderation_logs"("is_automatic");

-- CreateIndex
CREATE INDEX "content_moderation_logs_created_at_idx" ON "content_moderation_logs"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "post_attractiveness_post_id_key" ON "post_attractiveness"("post_id");

-- CreateIndex
CREATE INDEX "post_attractiveness_post_id_idx" ON "post_attractiveness"("post_id");

-- CreateIndex
CREATE INDEX "post_attractiveness_overall_score_idx" ON "post_attractiveness"("overall_score");

-- CreateIndex
CREATE INDEX "post_attractiveness_engagement_idx" ON "post_attractiveness"("engagement");

-- CreateIndex
CREATE INDEX "post_attractiveness_virality_idx" ON "post_attractiveness"("virality");

-- CreateIndex
CREATE INDEX "post_attractiveness_last_calculated_idx" ON "post_attractiveness"("last_calculated");

-- CreateIndex
CREATE INDEX "post_attractiveness_audience_match_idx" ON "post_attractiveness"("audience_match");

-- CreateIndex
CREATE INDEX "post_attractiveness_trend_alignment_idx" ON "post_attractiveness"("trend_alignment");

-- CreateIndex
CREATE INDEX "user_post_interest_mapping_user_id_idx" ON "user_post_interest_mapping"("user_id");

-- CreateIndex
CREATE INDEX "user_post_interest_mapping_post_id_idx" ON "user_post_interest_mapping"("post_id");

-- CreateIndex
CREATE INDEX "user_post_interest_mapping_match_score_idx" ON "user_post_interest_mapping"("match_score");

-- CreateIndex
CREATE INDEX "user_post_interest_mapping_personal_relevance_idx" ON "user_post_interest_mapping"("personal_relevance");

-- CreateIndex
CREATE INDEX "user_post_interest_mapping_engagement_type_idx" ON "user_post_interest_mapping"("engagement_type");

-- CreateIndex
CREATE INDEX "user_post_interest_mapping_created_at_idx" ON "user_post_interest_mapping"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "user_post_interest_mapping_user_id_post_id_key" ON "user_post_interest_mapping"("user_id", "post_id");

-- CreateIndex
CREATE INDEX "content_insights_insight_date_idx" ON "content_insights"("insight_date");

-- CreateIndex
CREATE INDEX "content_insights_category_id_idx" ON "content_insights"("category_id");

-- CreateIndex
CREATE INDEX "content_insights_trend_score_idx" ON "content_insights"("trend_score");

-- CreateIndex
CREATE UNIQUE INDEX "content_insights_insight_date_category_id_key" ON "content_insights"("insight_date", "category_id");

-- CreateIndex
CREATE INDEX "sponsored_targeting_campaign_id_idx" ON "sponsored_targeting"("campaign_id");

-- CreateIndex
CREATE INDEX "sponsored_targeting_sponsored_ad_id_idx" ON "sponsored_targeting"("sponsored_ad_id");

-- CreateIndex
CREATE UNIQUE INDEX "sponsored_posts_sponsored_ad_id_key" ON "sponsored_posts"("sponsored_ad_id");

-- CreateIndex
CREATE INDEX "sponsored_posts_sponsored_ad_id_idx" ON "sponsored_posts"("sponsored_ad_id");

-- CreateIndex
CREATE INDEX "sponsored_posts_post_id_idx" ON "sponsored_posts"("post_id");

-- CreateIndex
CREATE INDEX "sponsored_posts_is_promoted_idx" ON "sponsored_posts"("is_promoted");

-- CreateIndex
CREATE UNIQUE INDEX "sponsored_videos_sponsored_ad_id_key" ON "sponsored_videos"("sponsored_ad_id");

-- CreateIndex
CREATE INDEX "sponsored_videos_sponsored_ad_id_idx" ON "sponsored_videos"("sponsored_ad_id");

-- CreateIndex
CREATE INDEX "sponsored_videos_video_id_idx" ON "sponsored_videos"("video_id");

-- CreateIndex
CREATE INDEX "sponsored_videos_auto_play_idx" ON "sponsored_videos"("auto_play");

-- CreateIndex
CREATE UNIQUE INDEX "sponsored_banners_sponsoredAdId_key" ON "sponsored_banners"("sponsoredAdId");

-- CreateIndex
CREATE INDEX "sponsored_banners_sponsoredAdId_idx" ON "sponsored_banners"("sponsoredAdId");

-- CreateIndex
CREATE INDEX "sponsored_banners_position_idx" ON "sponsored_banners"("position");

-- CreateIndex
CREATE INDEX "sponsored_transactions_campaign_id_idx" ON "sponsored_transactions"("campaign_id");

-- CreateIndex
CREATE INDEX "sponsored_transactions_status_idx" ON "sponsored_transactions"("status");

-- CreateIndex
CREATE INDEX "sponsored_transactions_paymentStatus_idx" ON "sponsored_transactions"("paymentStatus");

-- CreateIndex
CREATE INDEX "sponsored_transactions_type_idx" ON "sponsored_transactions"("type");

-- CreateIndex
CREATE UNIQUE INDEX "accountants_username_key" ON "accountants"("username");

-- CreateIndex
CREATE UNIQUE INDEX "accountants_email_key" ON "accountants"("email");

-- CreateIndex
CREATE UNIQUE INDEX "accountants_phone_key" ON "accountants"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "accountants_national_id_key" ON "accountants"("national_id");

-- CreateIndex
CREATE INDEX "accountants_username_idx" ON "accountants"("username");

-- CreateIndex
CREATE INDEX "accountants_email_idx" ON "accountants"("email");

-- CreateIndex
CREATE INDEX "accountants_national_id_idx" ON "accountants"("national_id");

-- CreateIndex
CREATE INDEX "accountants_role_idx" ON "accountants"("role");

-- CreateIndex
CREATE INDEX "accountants_is_active_idx" ON "accountants"("is_active");

-- CreateIndex
CREATE INDEX "accountants_is_verified_idx" ON "accountants"("is_verified");

-- CreateIndex
CREATE INDEX "accountants_created_at_idx" ON "accountants"("created_at");

-- CreateIndex
CREATE INDEX "expenses_category_idx" ON "expenses"("category");

-- CreateIndex
CREATE INDEX "expenses_date_idx" ON "expenses"("date");

-- CreateIndex
CREATE INDEX "expenses_created_by_idx" ON "expenses"("created_by");

-- CreateIndex
CREATE INDEX "expenses_tax_applicable_idx" ON "expenses"("tax_applicable");

-- CreateIndex
CREATE INDEX "expenses_invoice_number_idx" ON "expenses"("invoice_number");

-- CreateIndex
CREATE INDEX "expenses_amount_idx" ON "expenses"("amount");

-- CreateIndex
CREATE INDEX "expenses_created_at_idx" ON "expenses"("created_at");

-- CreateIndex
CREATE INDEX "revenues_source_idx" ON "revenues"("source");

-- CreateIndex
CREATE INDEX "revenues_received_date_idx" ON "revenues"("received_date");

-- CreateIndex
CREATE INDEX "revenues_received_by_idx" ON "revenues"("received_by");

-- CreateIndex
CREATE INDEX "revenues_amount_idx" ON "revenues"("amount");

-- CreateIndex
CREATE INDEX "revenues_tax_collected_idx" ON "revenues"("tax_collected");

-- CreateIndex
CREATE INDEX "revenues_client_tax_id_idx" ON "revenues"("client_tax_id");

-- CreateIndex
CREATE INDEX "revenues_created_at_idx" ON "revenues"("created_at");

-- CreateIndex
CREATE INDEX "profit_loss_summary_period_type_idx" ON "profit_loss_summary"("period_type");

-- CreateIndex
CREATE INDEX "profit_loss_summary_period_start_idx" ON "profit_loss_summary"("period_start");

-- CreateIndex
CREATE INDEX "profit_loss_summary_period_end_idx" ON "profit_loss_summary"("period_end");

-- CreateIndex
CREATE INDEX "profit_loss_summary_created_by_idx" ON "profit_loss_summary"("created_by");

-- CreateIndex
CREATE INDEX "profit_loss_summary_net_profit_idx" ON "profit_loss_summary"("net_profit");

-- CreateIndex
CREATE INDEX "profit_loss_summary_created_at_idx" ON "profit_loss_summary"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "profit_loss_summary_period_type_period_start_period_end_key" ON "profit_loss_summary"("period_type", "period_start", "period_end");

-- CreateIndex
CREATE INDEX "tax_reports_report_type_idx" ON "tax_reports"("report_type");

-- CreateIndex
CREATE INDEX "tax_reports_period_idx" ON "tax_reports"("period");

-- CreateIndex
CREATE INDEX "tax_reports_period_start_idx" ON "tax_reports"("period_start");

-- CreateIndex
CREATE INDEX "tax_reports_period_end_idx" ON "tax_reports"("period_end");

-- CreateIndex
CREATE INDEX "tax_reports_report_status_idx" ON "tax_reports"("report_status");

-- CreateIndex
CREATE INDEX "tax_reports_submitted_by_idx" ON "tax_reports"("submitted_by");

-- CreateIndex
CREATE INDEX "tax_reports_due_date_idx" ON "tax_reports"("due_date");

-- CreateIndex
CREATE INDEX "tax_reports_created_at_idx" ON "tax_reports"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "tax_reports_report_type_period_key" ON "tax_reports"("report_type", "period");

-- CreateIndex
CREATE INDEX "user_payment_methods_user_id_idx" ON "user_payment_methods"("user_id");

-- CreateIndex
CREATE INDEX "user_payment_methods_gateway_idx" ON "user_payment_methods"("gateway");

-- CreateIndex
CREATE INDEX "user_payment_methods_method_type_idx" ON "user_payment_methods"("method_type");

-- CreateIndex
CREATE INDEX "user_payment_methods_is_default_idx" ON "user_payment_methods"("is_default");

-- CreateIndex
CREATE INDEX "user_payment_methods_is_active_idx" ON "user_payment_methods"("is_active");

-- CreateIndex
CREATE INDEX "user_payment_methods_fingerprint_idx" ON "user_payment_methods"("fingerprint");

-- CreateIndex
CREATE UNIQUE INDEX "sponsored_ad_invoices_invoice_number_key" ON "sponsored_ad_invoices"("invoice_number");

-- CreateIndex
CREATE INDEX "sponsored_ad_invoices_campaign_id_idx" ON "sponsored_ad_invoices"("campaign_id");

-- CreateIndex
CREATE INDEX "sponsored_ad_invoices_user_id_idx" ON "sponsored_ad_invoices"("user_id");

-- CreateIndex
CREATE INDEX "sponsored_ad_invoices_invoice_number_idx" ON "sponsored_ad_invoices"("invoice_number");

-- CreateIndex
CREATE INDEX "sponsored_ad_invoices_status_idx" ON "sponsored_ad_invoices"("status");

-- CreateIndex
CREATE INDEX "sponsored_ad_invoices_due_date_idx" ON "sponsored_ad_invoices"("due_date");

-- CreateIndex
CREATE INDEX "sponsored_ad_invoices_total_amount_idx" ON "sponsored_ad_invoices"("total_amount");

-- CreateIndex
CREATE INDEX "sponsored_ad_invoices_created_at_idx" ON "sponsored_ad_invoices"("created_at");

-- CreateIndex
CREATE INDEX "online_payments_invoice_id_idx" ON "online_payments"("invoice_id");

-- CreateIndex
CREATE INDEX "online_payments_payment_method_id_idx" ON "online_payments"("payment_method_id");

-- CreateIndex
CREATE INDEX "online_payments_user_id_idx" ON "online_payments"("user_id");

-- CreateIndex
CREATE INDEX "online_payments_processor_status_idx" ON "online_payments"("processor_status");

-- CreateIndex
CREATE INDEX "online_payments_gateway_idx" ON "online_payments"("gateway");

-- CreateIndex
CREATE INDEX "online_payments_transaction_id_idx" ON "online_payments"("transaction_id");

-- CreateIndex
CREATE INDEX "online_payments_gateway_reference_idx" ON "online_payments"("gateway_reference");

-- CreateIndex
CREATE INDEX "online_payments_created_at_idx" ON "online_payments"("created_at");

-- CreateIndex
CREATE INDEX "payment_refunds_payment_id_idx" ON "payment_refunds"("payment_id");

-- CreateIndex
CREATE INDEX "payment_refunds_status_idx" ON "payment_refunds"("status");

-- CreateIndex
CREATE INDEX "payment_refunds_processed_at_idx" ON "payment_refunds"("processed_at");

-- CreateIndex
CREATE INDEX "payment_refunds_created_at_idx" ON "payment_refunds"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "payment_gateway_configs_gateway_key" ON "payment_gateway_configs"("gateway");

-- CreateIndex
CREATE INDEX "payment_gateway_configs_is_active_idx" ON "payment_gateway_configs"("is_active");

-- CreateIndex
CREATE INDEX "payment_gateway_configs_is_test_mode_idx" ON "payment_gateway_configs"("is_test_mode");

-- CreateIndex
CREATE INDEX "influencer_contracts_influencer_id_idx" ON "influencer_contracts"("influencer_id");

-- CreateIndex
CREATE INDEX "influencer_contracts_contract_type_idx" ON "influencer_contracts"("contract_type");

-- CreateIndex
CREATE INDEX "influencer_contracts_status_idx" ON "influencer_contracts"("status");

-- CreateIndex
CREATE INDEX "influencer_contracts_start_date_idx" ON "influencer_contracts"("start_date");

-- CreateIndex
CREATE INDEX "influencer_contracts_end_date_idx" ON "influencer_contracts"("end_date");

-- CreateIndex
CREATE INDEX "influencer_contracts_created_at_idx" ON "influencer_contracts"("created_at");

-- CreateIndex
CREATE INDEX "influencer_earnings_influencer_id_idx" ON "influencer_earnings"("influencer_id");

-- CreateIndex
CREATE INDEX "influencer_earnings_contract_id_idx" ON "influencer_earnings"("contract_id");

-- CreateIndex
CREATE INDEX "influencer_earnings_post_id_idx" ON "influencer_earnings"("post_id");

-- CreateIndex
CREATE INDEX "influencer_earnings_campaign_id_idx" ON "influencer_earnings"("campaign_id");

-- CreateIndex
CREATE INDEX "influencer_earnings_earned_date_idx" ON "influencer_earnings"("earned_date");

-- CreateIndex
CREATE INDEX "influencer_earnings_is_paid_idx" ON "influencer_earnings"("is_paid");

-- CreateIndex
CREATE INDEX "influencer_earnings_amount_idx" ON "influencer_earnings"("amount");

-- CreateIndex
CREATE INDEX "influencer_earnings_created_at_idx" ON "influencer_earnings"("created_at");

-- CreateIndex
CREATE INDEX "influencer_payment_info_influencer_id_idx" ON "influencer_payment_info"("influencer_id");

-- CreateIndex
CREATE INDEX "influencer_payment_info_preferred_method_idx" ON "influencer_payment_info"("preferred_method");

-- CreateIndex
CREATE INDEX "influencer_payment_info_is_default_idx" ON "influencer_payment_info"("is_default");

-- CreateIndex
CREATE INDEX "influencer_payment_info_is_active_idx" ON "influencer_payment_info"("is_active");

-- CreateIndex
CREATE INDEX "influencer_payments_influencer_id_idx" ON "influencer_payments"("influencer_id");

-- CreateIndex
CREATE INDEX "influencer_payments_contract_id_idx" ON "influencer_payments"("contract_id");

-- CreateIndex
CREATE INDEX "influencer_payments_payment_info_id_idx" ON "influencer_payments"("payment_info_id");

-- CreateIndex
CREATE INDEX "influencer_payments_status_idx" ON "influencer_payments"("status");

-- CreateIndex
CREATE INDEX "influencer_payments_payment_method_idx" ON "influencer_payments"("payment_method");

-- CreateIndex
CREATE INDEX "influencer_payments_scheduled_date_idx" ON "influencer_payments"("scheduled_date");

-- CreateIndex
CREATE INDEX "influencer_payments_processed_date_idx" ON "influencer_payments"("processed_date");

-- CreateIndex
CREATE INDEX "influencer_payments_amount_idx" ON "influencer_payments"("amount");

-- CreateIndex
CREATE INDEX "influencer_payments_created_at_idx" ON "influencer_payments"("created_at");

-- CreateIndex
CREATE INDEX "influencer_performance_influencer_id_idx" ON "influencer_performance"("influencer_id");

-- CreateIndex
CREATE INDEX "influencer_performance_report_year_idx" ON "influencer_performance"("report_year");

-- CreateIndex
CREATE INDEX "influencer_performance_report_month_idx" ON "influencer_performance"("report_month");

-- CreateIndex
CREATE INDEX "influencer_performance_total_earnings_idx" ON "influencer_performance"("total_earnings");

-- CreateIndex
CREATE INDEX "influencer_performance_engagement_rate_idx" ON "influencer_performance"("engagement_rate");

-- CreateIndex
CREATE INDEX "influencer_performance_created_at_idx" ON "influencer_performance"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "influencer_performance_influencer_id_report_month_report_ye_key" ON "influencer_performance"("influencer_id", "report_month", "report_year");

-- CreateIndex
CREATE UNIQUE INDEX "egyptian_payment_methods_method_key" ON "egyptian_payment_methods"("method");

-- CreateIndex
CREATE INDEX "egyptian_payment_methods_is_active_idx" ON "egyptian_payment_methods"("is_active");

-- CreateIndex
CREATE INDEX "egyptian_payment_methods_is_for_influencers_idx" ON "egyptian_payment_methods"("is_for_influencers");

-- CreateIndex
CREATE INDEX "egyptian_payment_methods_method_idx" ON "egyptian_payment_methods"("method");

-- AddForeignKey
ALTER TABLE "content_categories" ADD CONSTRAINT "content_categories_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "content_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_classifications" ADD CONSTRAINT "post_classifications_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_classifications" ADD CONSTRAINT "post_classifications_primary_category_id_fkey" FOREIGN KEY ("primary_category_id") REFERENCES "content_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_classifications" ADD CONSTRAINT "post_classifications_secondary_category_id_fkey" FOREIGN KEY ("secondary_category_id") REFERENCES "content_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_sentiment_analysis" ADD CONSTRAINT "post_sentiment_analysis_post_classification_id_fkey" FOREIGN KEY ("post_classification_id") REFERENCES "post_classifications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "moderation_rules" ADD CONSTRAINT "moderation_rules_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "content_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_attractiveness" ADD CONSTRAINT "post_attractiveness_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_post_interest_mapping" ADD CONSTRAINT "user_post_interest_mapping_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_post_interest_mapping" ADD CONSTRAINT "user_post_interest_mapping_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_advertiserId_fkey" FOREIGN KEY ("advertiserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SponsoredAd" ADD CONSTRAINT "SponsoredAd_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sponsored_targeting" ADD CONSTRAINT "sponsored_targeting_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sponsored_targeting" ADD CONSTRAINT "sponsored_targeting_sponsored_ad_id_fkey" FOREIGN KEY ("sponsored_ad_id") REFERENCES "SponsoredAd"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SponsoredUserTarget" ADD CONSTRAINT "SponsoredUserTarget_targetingId_fkey" FOREIGN KEY ("targetingId") REFERENCES "sponsored_targeting"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SponsoredUserTarget" ADD CONSTRAINT "SponsoredUserTarget_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SponsoredPerformance" ADD CONSTRAINT "SponsoredPerformance_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SponsoredPerformance" ADD CONSTRAINT "SponsoredPerformance_sponsoredAdId_fkey" FOREIGN KEY ("sponsoredAdId") REFERENCES "SponsoredAd"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SponsoredBid" ADD CONSTRAINT "SponsoredBid_sponsoredAdId_fkey" FOREIGN KEY ("sponsoredAdId") REFERENCES "SponsoredAd"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SponsoredInsight" ADD CONSTRAINT "SponsoredInsight_sponsoredAdId_fkey" FOREIGN KEY ("sponsoredAdId") REFERENCES "SponsoredAd"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sponsored_posts" ADD CONSTRAINT "sponsored_posts_sponsored_ad_id_fkey" FOREIGN KEY ("sponsored_ad_id") REFERENCES "SponsoredAd"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sponsored_posts" ADD CONSTRAINT "sponsored_posts_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sponsored_videos" ADD CONSTRAINT "sponsored_videos_sponsored_ad_id_fkey" FOREIGN KEY ("sponsored_ad_id") REFERENCES "SponsoredAd"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sponsored_videos" ADD CONSTRAINT "sponsored_videos_video_id_fkey" FOREIGN KEY ("video_id") REFERENCES "videos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sponsored_banners" ADD CONSTRAINT "sponsored_banners_sponsoredAdId_fkey" FOREIGN KEY ("sponsoredAdId") REFERENCES "SponsoredAd"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sponsored_transactions" ADD CONSTRAINT "sponsored_transactions_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "accountants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "revenues" ADD CONSTRAINT "revenues_received_by_fkey" FOREIGN KEY ("received_by") REFERENCES "accountants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profit_loss_summary" ADD CONSTRAINT "profit_loss_summary_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "accountants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tax_reports" ADD CONSTRAINT "tax_reports_submitted_by_fkey" FOREIGN KEY ("submitted_by") REFERENCES "accountants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_payment_methods" ADD CONSTRAINT "user_payment_methods_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sponsored_ad_invoices" ADD CONSTRAINT "sponsored_ad_invoices_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sponsored_ad_invoices" ADD CONSTRAINT "sponsored_ad_invoices_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "online_payments" ADD CONSTRAINT "online_payments_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "sponsored_ad_invoices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "online_payments" ADD CONSTRAINT "online_payments_payment_method_id_fkey" FOREIGN KEY ("payment_method_id") REFERENCES "user_payment_methods"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "online_payments" ADD CONSTRAINT "online_payments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_refunds" ADD CONSTRAINT "payment_refunds_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "online_payments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "influencer_contracts" ADD CONSTRAINT "influencer_contracts_influencer_id_fkey" FOREIGN KEY ("influencer_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "influencer_earnings" ADD CONSTRAINT "influencer_earnings_influencer_id_fkey" FOREIGN KEY ("influencer_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "influencer_earnings" ADD CONSTRAINT "influencer_earnings_contract_id_fkey" FOREIGN KEY ("contract_id") REFERENCES "influencer_contracts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "influencer_earnings" ADD CONSTRAINT "influencer_earnings_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "influencer_earnings" ADD CONSTRAINT "influencer_earnings_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "influencer_payments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "influencer_payment_info" ADD CONSTRAINT "influencer_payment_info_influencer_id_fkey" FOREIGN KEY ("influencer_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "influencer_payments" ADD CONSTRAINT "influencer_payments_influencer_id_fkey" FOREIGN KEY ("influencer_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "influencer_payments" ADD CONSTRAINT "influencer_payments_contract_id_fkey" FOREIGN KEY ("contract_id") REFERENCES "influencer_contracts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "influencer_payments" ADD CONSTRAINT "influencer_payments_payment_info_id_fkey" FOREIGN KEY ("payment_info_id") REFERENCES "influencer_payment_info"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "influencer_performance" ADD CONSTRAINT "influencer_performance_influencer_id_fkey" FOREIGN KEY ("influencer_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
