-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('NORMAL', 'INFLUENCER', 'ADMIN');

-- CreateEnum
CREATE TYPE "ExternalPlatform" AS ENUM ('INSTAGRAM', 'TIKTOK', 'YOUTUBE', 'TWITTER', 'FACEBOOK', 'SNAPCHAT', 'LINKEDIN', 'TELEGRAM', 'WHATSAPP', 'CLUBHOUSE', 'PINTEREST', 'REDDIT', 'TWITCH', 'OTHER');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'VIDEO', 'AUDIO', 'DOCUMENT', 'GIF');

-- CreateEnum
CREATE TYPE "PostVisibility" AS ENUM ('PUBLIC', 'FRIENDS', 'PRIVATE');

-- CreateEnum
CREATE TYPE "InteractionType" AS ENUM ('LIKE', 'COMMENT', 'SHARE', 'VIEW', 'SAVE');

-- CreateEnum
CREATE TYPE "SpeedCategory" AS ENUM ('FAST', 'MEDIUM', 'SLOW');

-- CreateEnum
CREATE TYPE "NominationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "ConversationType" AS ENUM ('PRIVATE', 'GROUP');

-- CreateEnum
CREATE TYPE "MemberRole" AS ENUM ('ADMIN', 'MODERATOR', 'MEMBER');

-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('TEXT', 'IMAGE', 'VIDEO', 'FILE', 'VOICE', 'STICKER', 'GIF');

-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'MODERATOR');

-- CreateEnum
CREATE TYPE "AdminSection" AS ENUM ('USERS', 'CONTENT', 'VIDEOS', 'ANALYTICS', 'MESSAGING', 'REPORTS', 'NOMINATIONS', 'SETTINGS');

-- CreateEnum
CREATE TYPE "DeviceType" AS ENUM ('DESKTOP', 'MOBILE', 'TABLET', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "TrendType" AS ENUM ('HASHTAG', 'KEYWORD', 'TOPIC', 'USER', 'POST');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('LIKE', 'COMMENT', 'SHARE', 'FOLLOW', 'NOMINATION', 'MESSAGE', 'MENTION', 'SYSTEM', 'SECURITY', 'PROMOTION', 'TREND', 'ACHIEVEMENT');

-- CreateEnum
CREATE TYPE "NotificationPriority" AS ENUM ('LOW', 'NORMAL', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "ReportTargetType" AS ENUM ('POST', 'COMMENT', 'USER', 'VIDEO', 'MESSAGE', 'CHANNEL', 'PLAYLIST');

-- CreateEnum
CREATE TYPE "ReportReason" AS ENUM ('SPAM', 'HARASSMENT', 'HATE_SPEECH', 'VIOLENCE', 'INAPPROPRIATE_CONTENT', 'COPYRIGHT', 'FAKE_NEWS', 'IMPERSONATION', 'PRIVACY_VIOLATION', 'NUDITY', 'TERRORISM', 'DRUGS', 'SELF_HARM', 'OTHER');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('PENDING', 'UNDER_REVIEW', 'RESOLVED', 'DISMISSED', 'ESCALATED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ReportPriority" AS ENUM ('LOW', 'NORMAL', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "ReportSeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "ReportAction" AS ENUM ('WARNING', 'CONTENT_REMOVED', 'CONTENT_HIDDEN', 'ACCOUNT_SUSPENDED', 'ACCOUNT_BANNED', 'NO_ACTION', 'REFERRED_TO_AUTHORITIES');

-- CreateEnum
CREATE TYPE "BlockType" AS ENUM ('FULL_BLOCK', 'MESSAGES_ONLY', 'POSTS_ONLY', 'TEMPORARY');

-- CreateEnum
CREATE TYPE "ActivityAction" AS ENUM ('LOGIN', 'LOGOUT', 'REGISTER', 'PASSWORD_CHANGE', 'CREATE_POST', 'EDIT_POST', 'DELETE_POST', 'LIKE_POST', 'UNLIKE_POST', 'COMMENT_POST', 'SHARE_POST', 'SAVE_POST', 'FOLLOW_USER', 'UNFOLLOW_USER', 'BLOCK_USER', 'UNBLOCK_USER', 'REPORT_CONTENT', 'REVIEW_REPORT', 'UPDATE_PROFILE', 'UPLOAD_AVATAR', 'UPDATE_SETTINGS', 'UPLOAD_VIDEO', 'DELETE_VIDEO', 'CREATE_PLAYLIST', 'JOIN_CONVERSATION', 'LEAVE_CONVERSATION', 'SEND_MESSAGE', 'DELETE_MESSAGE', 'NOMINATE_USER', 'ACCEPT_NOMINATION', 'REJECT_NOMINATION', 'BAN_USER', 'UNBAN_USER', 'DELETE_CONTENT', 'APPROVE_CONTENT');

-- CreateEnum
CREATE TYPE "ActivityCategory" AS ENUM ('AUTHENTICATION', 'CONTENT', 'SOCIAL', 'ADMIN', 'SECURITY', 'MESSAGING', 'VIDEO');

-- CreateEnum
CREATE TYPE "BehaviorPattern" AS ENUM ('FOCUSED', 'DIVERSE', 'EXPLORER', 'CONSISTENT', 'SEASONAL', 'BALANCED');

-- CreateEnum
CREATE TYPE "EngagementStyle" AS ENUM ('PASSIVE', 'ACTIVE', 'CREATOR', 'CURATOR', 'SOCIAL', 'CASUAL');

-- CreateEnum
CREATE TYPE "ContentPreference" AS ENUM ('TEXT_HEAVY', 'VISUAL', 'MIXED', 'INTERACTIVE', 'SHORT_FORM', 'LONG_FORM');

-- CreateEnum
CREATE TYPE "UpdateFrequency" AS ENUM ('DAILY', 'WEEKLY', 'BIWEEKLY', 'MONTHLY', 'QUARTERLY', 'ON_DEMAND');

-- CreateEnum
CREATE TYPE "InterestStatus" AS ENUM ('ACTIVE', 'DORMANT', 'EMERGING', 'FADING', 'ARCHIVED', 'SUPPRESSED');

-- CreateEnum
CREATE TYPE "TrendDirection" AS ENUM ('RISING', 'STABLE', 'DECLINING', 'VOLATILE', 'SEASONAL');

-- CreateEnum
CREATE TYPE "InterestSource" AS ENUM ('INTERACTION', 'PROFILE', 'SEARCH', 'VIEWING_TIME', 'EXPLICIT', 'HASHTAG', 'FOLLOWING', 'SAVE', 'SHARE', 'COMMENT', 'LIKE', 'RECOMMENDATION', 'TRENDING');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "nehky_email" TEXT NOT NULL,
    "external_email" TEXT,
    "phone" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "gender" "Gender",
    "age" INTEGER,
    "graduation_year" INTEGER,
    "certificate" TEXT,
    "high_school" TEXT,
    "nationality" TEXT,
    "country_of_origin" TEXT,
    "country_of_residence" TEXT,
    "hobbies" TEXT[],
    "interests" TEXT[],
    "role" "UserRole" NOT NULL DEFAULT 'NORMAL',
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "is_influencer" BOOLEAN NOT NULL DEFAULT false,
    "profile_picture" TEXT,
    "cover_picture" TEXT,
    "bio" TEXT,
    "followers_count" INTEGER NOT NULL DEFAULT 0,
    "following_count" INTEGER NOT NULL DEFAULT 0,
    "posts_count" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "last_seen_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "influencer_accounts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "platform_name" "ExternalPlatform" NOT NULL,
    "platform_link" TEXT NOT NULL,
    "followers_count" INTEGER NOT NULL DEFAULT 0,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "verified_at" TIMESTAMP(3),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "influencer_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "posts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "media_url" TEXT,
    "media_type" "MediaType",
    "visibility" "PostVisibility" NOT NULL DEFAULT 'PUBLIC',
    "likes_count" INTEGER NOT NULL DEFAULT 0,
    "comments_count" INTEGER NOT NULL DEFAULT 0,
    "shares_count" INTEGER NOT NULL DEFAULT 0,
    "views_count" INTEGER NOT NULL DEFAULT 0,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "is_pinned" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interactions" (
    "id" TEXT NOT NULL,
    "post_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" "InteractionType" NOT NULL,
    "content" TEXT,
    "parent_id" TEXT,
    "likes_count" INTEGER NOT NULL DEFAULT 0,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "interactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_scores" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "post_id" TEXT NOT NULL,
    "interaction_id" TEXT,
    "interaction_type" "InteractionType" NOT NULL,
    "points" INTEGER NOT NULL,
    "interaction_time" TIMESTAMP(3) NOT NULL,
    "calculated_score" DOUBLE PRECISION NOT NULL,
    "speed_category" "SpeedCategory" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_signatures" (
    "id" TEXT NOT NULL,
    "influencer_id" TEXT NOT NULL,
    "follower_id" TEXT NOT NULL,
    "signature_text" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_signatures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nominations" (
    "id" TEXT NOT NULL,
    "influencer_id" TEXT NOT NULL,
    "candidate_user_id" TEXT NOT NULL,
    "score_snapshot" DOUBLE PRECISION NOT NULL,
    "status" "NominationStatus" NOT NULL DEFAULT 'PENDING',
    "nominated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "decision_deadline" TIMESTAMP(3) NOT NULL,
    "responded_at" TIMESTAMP(3),
    "notes" TEXT,
    "week" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "week_number" INTEGER NOT NULL,
    "is_expired" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "nominations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "video_channels" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "thumbnail_url" TEXT,
    "subscribers_count" INTEGER NOT NULL DEFAULT 0,
    "videos_count" INTEGER NOT NULL DEFAULT 0,
    "total_views" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "video_channels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "videos" (
    "id" TEXT NOT NULL,
    "channel_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "video_url" TEXT NOT NULL,
    "thumbnail_url" TEXT,
    "duration" INTEGER,
    "visibility" "PostVisibility" NOT NULL DEFAULT 'PUBLIC',
    "views_count" INTEGER NOT NULL DEFAULT 0,
    "likes_count" INTEGER NOT NULL DEFAULT 0,
    "dislikes_count" INTEGER NOT NULL DEFAULT 0,
    "comments_count" INTEGER NOT NULL DEFAULT 0,
    "tags" TEXT[],
    "category" TEXT,
    "is_processing" BOOLEAN NOT NULL DEFAULT true,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "videos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "playlists" (
    "id" TEXT NOT NULL,
    "channel_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "thumbnail_url" TEXT,
    "videos_count" INTEGER NOT NULL DEFAULT 0,
    "total_views" INTEGER NOT NULL DEFAULT 0,
    "total_duration" INTEGER NOT NULL DEFAULT 0,
    "is_public" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "playlists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "playlist_items" (
    "id" TEXT NOT NULL,
    "playlist_id" TEXT NOT NULL,
    "video_id" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "added_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "playlist_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversations" (
    "id" TEXT NOT NULL,
    "type" "ConversationType" NOT NULL DEFAULT 'PRIVATE',
    "name" TEXT,
    "description" TEXT,
    "avatar_url" TEXT,
    "created_by_user_id" TEXT NOT NULL,
    "last_message_id" TEXT,
    "last_message_at" TIMESTAMP(3),
    "members_count" INTEGER NOT NULL DEFAULT 0,
    "messages_count" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversation_members" (
    "id" TEXT NOT NULL,
    "conversation_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "role" "MemberRole" NOT NULL DEFAULT 'MEMBER',
    "last_read_at" TIMESTAMP(3),
    "unread_count" INTEGER NOT NULL DEFAULT 0,
    "is_muted" BOOLEAN NOT NULL DEFAULT false,
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "left_at" TIMESTAMP(3),

    CONSTRAINT "conversation_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL,
    "conversation_id" TEXT NOT NULL,
    "sender_id" TEXT NOT NULL,
    "message_type" "MessageType" NOT NULL,
    "content" TEXT,
    "media_url" TEXT,
    "file_name" TEXT,
    "file_size" INTEGER,
    "reply_to_id" TEXT,
    "is_edited" BOOLEAN NOT NULL DEFAULT false,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "read_by_count" INTEGER NOT NULL DEFAULT 0,
    "sent_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "edited_at" TIMESTAMP(3),

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admins" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "role" "AdminRole" NOT NULL DEFAULT 'MODERATOR',
    "assigned_by" TEXT,
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "last_active_at" TIMESTAMP(3),
    "notes" TEXT,
    "department" TEXT,
    "cv_file" TEXT,
    "criminal_record_file" TEXT,
    "profile_image" TEXT,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "verified_by" TEXT,
    "verified_at" TIMESTAMP(3),

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_permissions" (
    "id" TEXT NOT NULL,
    "admin_id" TEXT NOT NULL,
    "section" "AdminSection" NOT NULL,
    "can_view" BOOLEAN NOT NULL DEFAULT false,
    "can_edit" BOOLEAN NOT NULL DEFAULT false,
    "can_delete" BOOLEAN NOT NULL DEFAULT false,
    "can_ban" BOOLEAN NOT NULL DEFAULT false,
    "granted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "login_sessions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "ip_address" TEXT NOT NULL,
    "country" TEXT,
    "region" TEXT,
    "city" TEXT,
    "timezone" TEXT,
    "device_type" "DeviceType" NOT NULL,
    "os" TEXT,
    "browser" TEXT,
    "user_agent" TEXT NOT NULL,
    "device_fingerprint" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_suspicious" BOOLEAN NOT NULL DEFAULT false,
    "login_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "logout_time" TIMESTAMP(3),
    "last_activity_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "login_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hashtags" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "usage_count" INTEGER NOT NULL DEFAULT 1,
    "trend_score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "daily_usage" INTEGER NOT NULL DEFAULT 0,
    "weekly_usage" INTEGER NOT NULL DEFAULT 0,
    "peak_usage" INTEGER NOT NULL DEFAULT 0,
    "last_used_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "peak_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hashtags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_hashtags" (
    "id" TEXT NOT NULL,
    "post_id" TEXT NOT NULL,
    "hashtag_id" TEXT NOT NULL,
    "extracted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "post_hashtags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "keywords" (
    "id" TEXT NOT NULL,
    "keyword" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "detected_from_post_id" TEXT,
    "category" TEXT,
    "sentiment" DOUBLE PRECISION,
    "language" TEXT DEFAULT 'ar',
    "usage_count" INTEGER NOT NULL DEFAULT 1,
    "daily_usage" INTEGER NOT NULL DEFAULT 0,
    "weekly_usage" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "keywords_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trending_topics" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" "TrendType" NOT NULL,
    "reference_id" TEXT NOT NULL,
    "trend_score" DOUBLE PRECISION NOT NULL,
    "velocity" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "momentum" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "peak_score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "peak_at" TIMESTAMP(3),
    "category" TEXT,
    "region" TEXT,
    "age_group" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "detected_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trending_topics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "data_json" TEXT,
    "action_url" TEXT,
    "action_type" TEXT,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "read_at" TIMESTAMP(3),
    "priority" "NotificationPriority" NOT NULL DEFAULT 'NORMAL',
    "is_sent" BOOLEAN NOT NULL DEFAULT false,
    "sent_at" TIMESTAMP(3),
    "delivery_method" TEXT,
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reports" (
    "id" TEXT NOT NULL,
    "reporter_id" TEXT NOT NULL,
    "target_type" "ReportTargetType" NOT NULL,
    "target_id" TEXT NOT NULL,
    "reason" "ReportReason" NOT NULL,
    "description" TEXT,
    "evidence" TEXT[],
    "screenshots" TEXT[],
    "status" "ReportStatus" NOT NULL DEFAULT 'PENDING',
    "priority" "ReportPriority" NOT NULL DEFAULT 'NORMAL',
    "severity" "ReportSeverity" NOT NULL DEFAULT 'LOW',
    "reviewed_by" TEXT,
    "reviewed_at" TIMESTAMP(3),
    "review_notes" TEXT,
    "action" "ReportAction",
    "category" TEXT,
    "tags" TEXT[],
    "is_anonymous" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_blocks" (
    "id" TEXT NOT NULL,
    "blocker_user_id" TEXT NOT NULL,
    "blocked_user_id" TEXT NOT NULL,
    "reason" TEXT,
    "block_type" "BlockType" NOT NULL DEFAULT 'FULL_BLOCK',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_blocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_logs" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "action" "ActivityAction" NOT NULL,
    "target_type" TEXT,
    "target_id" TEXT,
    "description" TEXT NOT NULL,
    "metadata" TEXT,
    "category" "ActivityCategory",
    "ip_address" TEXT,
    "user_agent" TEXT,
    "device_type" "DeviceType",
    "country" TEXT,
    "region" TEXT,
    "city" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activity_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_interest_profiles" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "profile_version" INTEGER NOT NULL DEFAULT 1,
    "last_calculated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "next_update_due" TIMESTAMP(3) NOT NULL,
    "calculation_method" TEXT NOT NULL DEFAULT 'behavioral_analysis_v1',
    "overall_confidence" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "data_quality" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "profile_completeness" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "total_interactions" INTEGER NOT NULL DEFAULT 0,
    "unique_interests" INTEGER NOT NULL DEFAULT 0,
    "dominant_categories" TEXT[],
    "top_interests" JSONB NOT NULL,
    "interest_categories" JSONB NOT NULL,
    "interest_trends" JSONB NOT NULL,
    "behavior_pattern" "BehaviorPattern" NOT NULL DEFAULT 'BALANCED',
    "engagement_style" "EngagementStyle" NOT NULL DEFAULT 'CASUAL',
    "content_preference" "ContentPreference" NOT NULL DEFAULT 'MIXED',
    "recommendation_weight" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "explore_vs_exploit" DOUBLE PRECISION NOT NULL DEFAULT 0.7,
    "diversity_score" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "significant_changes" JSONB,
    "stability_score" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "update_frequency" "UpdateFrequency" NOT NULL DEFAULT 'WEEKLY',
    "auto_update_enabled" BOOLEAN NOT NULL DEFAULT true,
    "manual_overrides" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_interest_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_interest_scores" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "interest_name" TEXT NOT NULL,
    "current_score" DOUBLE PRECISION NOT NULL,
    "raw_score" DOUBLE PRECISION NOT NULL,
    "normalized_score" DOUBLE PRECISION NOT NULL,
    "weighted_score" DOUBLE PRECISION NOT NULL,
    "category" TEXT NOT NULL,
    "subcategory" TEXT,
    "keywords" TEXT[],
    "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "sources" TEXT[],
    "source_weights" JSONB NOT NULL,
    "primary_source" TEXT NOT NULL,
    "total_interactions" INTEGER NOT NULL DEFAULT 0,
    "recent_interactions" INTEGER NOT NULL DEFAULT 0,
    "avg_interaction_gap" DOUBLE PRECISION,
    "first_detected" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_activity" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "peak_period" TEXT,
    "seasonality" DOUBLE PRECISION,
    "trend_direction" "TrendDirection" NOT NULL DEFAULT 'STABLE',
    "trend_strength" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "momentum" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "volatility" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "decay_factor" DOUBLE PRECISION NOT NULL DEFAULT 0.98,
    "boost_factor" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "contextual_weight" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "status" "InterestStatus" NOT NULL DEFAULT 'ACTIVE',
    "is_core" BOOLEAN NOT NULL DEFAULT false,
    "is_emerging" BOOLEAN NOT NULL DEFAULT false,
    "is_fading" BOOLEAN NOT NULL DEFAULT false,
    "related_posts" TEXT[],
    "related_users" TEXT[],
    "related_hashtags" TEXT[],
    "last_calculated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "next_review" TIMESTAMP(3),

    CONSTRAINT "user_interest_scores_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_nehky_email_key" ON "users"("nehky_email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE INDEX "users_username_idx" ON "users"("username");

-- CreateIndex
CREATE INDEX "users_nehky_email_idx" ON "users"("nehky_email");

-- CreateIndex
CREATE INDEX "users_phone_idx" ON "users"("phone");

-- CreateIndex
CREATE INDEX "users_external_email_idx" ON "users"("external_email");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE INDEX "users_is_active_idx" ON "users"("is_active");

-- CreateIndex
CREATE INDEX "users_is_influencer_idx" ON "users"("is_influencer");

-- CreateIndex
CREATE INDEX "users_created_at_idx" ON "users"("created_at");

-- CreateIndex
CREATE INDEX "users_last_seen_at_idx" ON "users"("last_seen_at");

-- CreateIndex
CREATE INDEX "influencer_accounts_user_id_idx" ON "influencer_accounts"("user_id");

-- CreateIndex
CREATE INDEX "influencer_accounts_platform_name_idx" ON "influencer_accounts"("platform_name");

-- CreateIndex
CREATE INDEX "influencer_accounts_followers_count_idx" ON "influencer_accounts"("followers_count");

-- CreateIndex
CREATE INDEX "influencer_accounts_is_verified_idx" ON "influencer_accounts"("is_verified");

-- CreateIndex
CREATE INDEX "influencer_accounts_is_active_idx" ON "influencer_accounts"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "influencer_accounts_user_id_platform_name_key" ON "influencer_accounts"("user_id", "platform_name");

-- CreateIndex
CREATE INDEX "posts_user_id_idx" ON "posts"("user_id");

-- CreateIndex
CREATE INDEX "posts_visibility_idx" ON "posts"("visibility");

-- CreateIndex
CREATE INDEX "posts_created_at_idx" ON "posts"("created_at");

-- CreateIndex
CREATE INDEX "posts_is_deleted_idx" ON "posts"("is_deleted");

-- CreateIndex
CREATE INDEX "posts_is_pinned_idx" ON "posts"("is_pinned");

-- CreateIndex
CREATE INDEX "interactions_post_id_idx" ON "interactions"("post_id");

-- CreateIndex
CREATE INDEX "interactions_user_id_idx" ON "interactions"("user_id");

-- CreateIndex
CREATE INDEX "interactions_type_idx" ON "interactions"("type");

-- CreateIndex
CREATE INDEX "interactions_parent_id_idx" ON "interactions"("parent_id");

-- CreateIndex
CREATE INDEX "interactions_created_at_idx" ON "interactions"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "interactions_post_id_user_id_type_key" ON "interactions"("post_id", "user_id", "type");

-- CreateIndex
CREATE INDEX "user_scores_user_id_idx" ON "user_scores"("user_id");

-- CreateIndex
CREATE INDEX "user_scores_post_id_idx" ON "user_scores"("post_id");

-- CreateIndex
CREATE INDEX "user_scores_interaction_type_idx" ON "user_scores"("interaction_type");

-- CreateIndex
CREATE INDEX "user_scores_speed_category_idx" ON "user_scores"("speed_category");

-- CreateIndex
CREATE INDEX "user_scores_interaction_time_idx" ON "user_scores"("interaction_time");

-- CreateIndex
CREATE INDEX "user_scores_calculated_score_idx" ON "user_scores"("calculated_score");

-- CreateIndex
CREATE INDEX "user_signatures_influencer_id_idx" ON "user_signatures"("influencer_id");

-- CreateIndex
CREATE INDEX "user_signatures_follower_id_idx" ON "user_signatures"("follower_id");

-- CreateIndex
CREATE INDEX "user_signatures_is_active_idx" ON "user_signatures"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "user_signatures_influencer_id_follower_id_key" ON "user_signatures"("influencer_id", "follower_id");

-- CreateIndex
CREATE INDEX "nominations_influencer_id_idx" ON "nominations"("influencer_id");

-- CreateIndex
CREATE INDEX "nominations_candidate_user_id_idx" ON "nominations"("candidate_user_id");

-- CreateIndex
CREATE INDEX "nominations_status_idx" ON "nominations"("status");

-- CreateIndex
CREATE INDEX "nominations_week_idx" ON "nominations"("week");

-- CreateIndex
CREATE INDEX "nominations_decision_deadline_idx" ON "nominations"("decision_deadline");

-- CreateIndex
CREATE INDEX "nominations_is_expired_idx" ON "nominations"("is_expired");

-- CreateIndex
CREATE INDEX "nominations_nominated_at_idx" ON "nominations"("nominated_at");

-- CreateIndex
CREATE UNIQUE INDEX "nominations_influencer_id_week_key" ON "nominations"("influencer_id", "week");

-- CreateIndex
CREATE INDEX "video_channels_user_id_idx" ON "video_channels"("user_id");

-- CreateIndex
CREATE INDEX "video_channels_is_active_idx" ON "video_channels"("is_active");

-- CreateIndex
CREATE INDEX "video_channels_subscribers_count_idx" ON "video_channels"("subscribers_count");

-- CreateIndex
CREATE INDEX "video_channels_created_at_idx" ON "video_channels"("created_at");

-- CreateIndex
CREATE INDEX "videos_channel_id_idx" ON "videos"("channel_id");

-- CreateIndex
CREATE INDEX "videos_visibility_idx" ON "videos"("visibility");

-- CreateIndex
CREATE INDEX "videos_views_count_idx" ON "videos"("views_count");

-- CreateIndex
CREATE INDEX "videos_created_at_idx" ON "videos"("created_at");

-- CreateIndex
CREATE INDEX "videos_is_deleted_idx" ON "videos"("is_deleted");

-- CreateIndex
CREATE INDEX "videos_category_idx" ON "videos"("category");

-- CreateIndex
CREATE INDEX "playlists_channel_id_idx" ON "playlists"("channel_id");

-- CreateIndex
CREATE INDEX "playlists_is_public_idx" ON "playlists"("is_public");

-- CreateIndex
CREATE INDEX "playlists_created_at_idx" ON "playlists"("created_at");

-- CreateIndex
CREATE INDEX "playlist_items_playlist_id_idx" ON "playlist_items"("playlist_id");

-- CreateIndex
CREATE INDEX "playlist_items_video_id_idx" ON "playlist_items"("video_id");

-- CreateIndex
CREATE INDEX "playlist_items_position_idx" ON "playlist_items"("position");

-- CreateIndex
CREATE UNIQUE INDEX "playlist_items_playlist_id_video_id_key" ON "playlist_items"("playlist_id", "video_id");

-- CreateIndex
CREATE INDEX "conversations_type_idx" ON "conversations"("type");

-- CreateIndex
CREATE INDEX "conversations_created_by_user_id_idx" ON "conversations"("created_by_user_id");

-- CreateIndex
CREATE INDEX "conversations_last_message_at_idx" ON "conversations"("last_message_at");

-- CreateIndex
CREATE INDEX "conversations_is_active_idx" ON "conversations"("is_active");

-- CreateIndex
CREATE INDEX "conversations_created_at_idx" ON "conversations"("created_at");

-- CreateIndex
CREATE INDEX "conversation_members_conversation_id_idx" ON "conversation_members"("conversation_id");

-- CreateIndex
CREATE INDEX "conversation_members_user_id_idx" ON "conversation_members"("user_id");

-- CreateIndex
CREATE INDEX "conversation_members_role_idx" ON "conversation_members"("role");

-- CreateIndex
CREATE INDEX "conversation_members_last_read_at_idx" ON "conversation_members"("last_read_at");

-- CreateIndex
CREATE UNIQUE INDEX "conversation_members_conversation_id_user_id_key" ON "conversation_members"("conversation_id", "user_id");

-- CreateIndex
CREATE INDEX "messages_conversation_id_idx" ON "messages"("conversation_id");

-- CreateIndex
CREATE INDEX "messages_sender_id_idx" ON "messages"("sender_id");

-- CreateIndex
CREATE INDEX "messages_message_type_idx" ON "messages"("message_type");

-- CreateIndex
CREATE INDEX "messages_sent_at_idx" ON "messages"("sent_at");

-- CreateIndex
CREATE INDEX "messages_is_deleted_idx" ON "messages"("is_deleted");

-- CreateIndex
CREATE INDEX "messages_reply_to_id_idx" ON "messages"("reply_to_id");

-- CreateIndex
CREATE UNIQUE INDEX "admins_user_id_key" ON "admins"("user_id");

-- CreateIndex
CREATE INDEX "admins_role_idx" ON "admins"("role");

-- CreateIndex
CREATE INDEX "admins_is_active_idx" ON "admins"("is_active");

-- CreateIndex
CREATE INDEX "admins_assigned_at_idx" ON "admins"("assigned_at");

-- CreateIndex
CREATE INDEX "admins_last_active_at_idx" ON "admins"("last_active_at");

-- CreateIndex
CREATE INDEX "admins_is_verified_idx" ON "admins"("is_verified");

-- CreateIndex
CREATE INDEX "admin_permissions_admin_id_idx" ON "admin_permissions"("admin_id");

-- CreateIndex
CREATE INDEX "admin_permissions_section_idx" ON "admin_permissions"("section");

-- CreateIndex
CREATE UNIQUE INDEX "admin_permissions_admin_id_section_key" ON "admin_permissions"("admin_id", "section");

-- CreateIndex
CREATE INDEX "login_sessions_user_id_idx" ON "login_sessions"("user_id");

-- CreateIndex
CREATE INDEX "login_sessions_ip_address_idx" ON "login_sessions"("ip_address");

-- CreateIndex
CREATE INDEX "login_sessions_device_type_idx" ON "login_sessions"("device_type");

-- CreateIndex
CREATE INDEX "login_sessions_is_active_idx" ON "login_sessions"("is_active");

-- CreateIndex
CREATE INDEX "login_sessions_login_time_idx" ON "login_sessions"("login_time");

-- CreateIndex
CREATE INDEX "login_sessions_last_activity_at_idx" ON "login_sessions"("last_activity_at");

-- CreateIndex
CREATE INDEX "login_sessions_is_suspicious_idx" ON "login_sessions"("is_suspicious");

-- CreateIndex
CREATE UNIQUE INDEX "hashtags_name_key" ON "hashtags"("name");

-- CreateIndex
CREATE INDEX "hashtags_name_idx" ON "hashtags"("name");

-- CreateIndex
CREATE INDEX "hashtags_usage_count_idx" ON "hashtags"("usage_count");

-- CreateIndex
CREATE INDEX "hashtags_trend_score_idx" ON "hashtags"("trend_score");

-- CreateIndex
CREATE INDEX "hashtags_last_used_at_idx" ON "hashtags"("last_used_at");

-- CreateIndex
CREATE INDEX "hashtags_daily_usage_idx" ON "hashtags"("daily_usage");

-- CreateIndex
CREATE INDEX "hashtags_weekly_usage_idx" ON "hashtags"("weekly_usage");

-- CreateIndex
CREATE INDEX "post_hashtags_post_id_idx" ON "post_hashtags"("post_id");

-- CreateIndex
CREATE INDEX "post_hashtags_hashtag_id_idx" ON "post_hashtags"("hashtag_id");

-- CreateIndex
CREATE INDEX "post_hashtags_extracted_at_idx" ON "post_hashtags"("extracted_at");

-- CreateIndex
CREATE UNIQUE INDEX "post_hashtags_post_id_hashtag_id_key" ON "post_hashtags"("post_id", "hashtag_id");

-- CreateIndex
CREATE INDEX "keywords_keyword_idx" ON "keywords"("keyword");

-- CreateIndex
CREATE INDEX "keywords_weight_idx" ON "keywords"("weight");

-- CreateIndex
CREATE INDEX "keywords_category_idx" ON "keywords"("category");

-- CreateIndex
CREATE INDEX "keywords_usage_count_idx" ON "keywords"("usage_count");

-- CreateIndex
CREATE INDEX "keywords_language_idx" ON "keywords"("language");

-- CreateIndex
CREATE INDEX "keywords_sentiment_idx" ON "keywords"("sentiment");

-- CreateIndex
CREATE INDEX "trending_topics_type_idx" ON "trending_topics"("type");

-- CreateIndex
CREATE INDEX "trending_topics_trend_score_idx" ON "trending_topics"("trend_score");

-- CreateIndex
CREATE INDEX "trending_topics_category_idx" ON "trending_topics"("category");

-- CreateIndex
CREATE INDEX "trending_topics_region_idx" ON "trending_topics"("region");

-- CreateIndex
CREATE INDEX "trending_topics_detected_at_idx" ON "trending_topics"("detected_at");

-- CreateIndex
CREATE INDEX "trending_topics_is_active_idx" ON "trending_topics"("is_active");

-- CreateIndex
CREATE INDEX "trending_topics_velocity_idx" ON "trending_topics"("velocity");

-- CreateIndex
CREATE INDEX "notifications_user_id_idx" ON "notifications"("user_id");

-- CreateIndex
CREATE INDEX "notifications_type_idx" ON "notifications"("type");

-- CreateIndex
CREATE INDEX "notifications_is_read_idx" ON "notifications"("is_read");

-- CreateIndex
CREATE INDEX "notifications_priority_idx" ON "notifications"("priority");

-- CreateIndex
CREATE INDEX "notifications_created_at_idx" ON "notifications"("created_at");

-- CreateIndex
CREATE INDEX "notifications_expires_at_idx" ON "notifications"("expires_at");

-- CreateIndex
CREATE INDEX "notifications_is_sent_idx" ON "notifications"("is_sent");

-- CreateIndex
CREATE INDEX "reports_reporter_id_idx" ON "reports"("reporter_id");

-- CreateIndex
CREATE INDEX "reports_target_type_target_id_idx" ON "reports"("target_type", "target_id");

-- CreateIndex
CREATE INDEX "reports_status_idx" ON "reports"("status");

-- CreateIndex
CREATE INDEX "reports_priority_idx" ON "reports"("priority");

-- CreateIndex
CREATE INDEX "reports_severity_idx" ON "reports"("severity");

-- CreateIndex
CREATE INDEX "reports_reviewed_by_idx" ON "reports"("reviewed_by");

-- CreateIndex
CREATE INDEX "reports_created_at_idx" ON "reports"("created_at");

-- CreateIndex
CREATE INDEX "reports_reason_idx" ON "reports"("reason");

-- CreateIndex
CREATE INDEX "user_blocks_blocker_user_id_idx" ON "user_blocks"("blocker_user_id");

-- CreateIndex
CREATE INDEX "user_blocks_blocked_user_id_idx" ON "user_blocks"("blocked_user_id");

-- CreateIndex
CREATE INDEX "user_blocks_is_active_idx" ON "user_blocks"("is_active");

-- CreateIndex
CREATE INDEX "user_blocks_block_type_idx" ON "user_blocks"("block_type");

-- CreateIndex
CREATE INDEX "user_blocks_expires_at_idx" ON "user_blocks"("expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "user_blocks_blocker_user_id_blocked_user_id_key" ON "user_blocks"("blocker_user_id", "blocked_user_id");

-- CreateIndex
CREATE INDEX "activity_logs_user_id_idx" ON "activity_logs"("user_id");

-- CreateIndex
CREATE INDEX "activity_logs_action_idx" ON "activity_logs"("action");

-- CreateIndex
CREATE INDEX "activity_logs_target_type_target_id_idx" ON "activity_logs"("target_type", "target_id");

-- CreateIndex
CREATE INDEX "activity_logs_created_at_idx" ON "activity_logs"("created_at");

-- CreateIndex
CREATE INDEX "activity_logs_category_idx" ON "activity_logs"("category");

-- CreateIndex
CREATE INDEX "activity_logs_ip_address_idx" ON "activity_logs"("ip_address");

-- CreateIndex
CREATE UNIQUE INDEX "user_interest_profiles_user_id_key" ON "user_interest_profiles"("user_id");

-- CreateIndex
CREATE INDEX "user_interest_profiles_user_id_idx" ON "user_interest_profiles"("user_id");

-- CreateIndex
CREATE INDEX "user_interest_profiles_last_calculated_idx" ON "user_interest_profiles"("last_calculated");

-- CreateIndex
CREATE INDEX "user_interest_profiles_next_update_due_idx" ON "user_interest_profiles"("next_update_due");

-- CreateIndex
CREATE INDEX "user_interest_profiles_overall_confidence_idx" ON "user_interest_profiles"("overall_confidence");

-- CreateIndex
CREATE INDEX "user_interest_profiles_profile_completeness_idx" ON "user_interest_profiles"("profile_completeness");

-- CreateIndex
CREATE INDEX "user_interest_profiles_behavior_pattern_idx" ON "user_interest_profiles"("behavior_pattern");

-- CreateIndex
CREATE INDEX "user_interest_profiles_auto_update_enabled_idx" ON "user_interest_profiles"("auto_update_enabled");

-- CreateIndex
CREATE INDEX "user_interest_scores_user_id_idx" ON "user_interest_scores"("user_id");

-- CreateIndex
CREATE INDEX "user_interest_scores_interest_name_idx" ON "user_interest_scores"("interest_name");

-- CreateIndex
CREATE INDEX "user_interest_scores_category_idx" ON "user_interest_scores"("category");

-- CreateIndex
CREATE INDEX "user_interest_scores_current_score_idx" ON "user_interest_scores"("current_score");

-- CreateIndex
CREATE INDEX "user_interest_scores_confidence_idx" ON "user_interest_scores"("confidence");

-- CreateIndex
CREATE INDEX "user_interest_scores_status_idx" ON "user_interest_scores"("status");

-- CreateIndex
CREATE INDEX "user_interest_scores_is_core_idx" ON "user_interest_scores"("is_core");

-- CreateIndex
CREATE INDEX "user_interest_scores_is_emerging_idx" ON "user_interest_scores"("is_emerging");

-- CreateIndex
CREATE INDEX "user_interest_scores_is_fading_idx" ON "user_interest_scores"("is_fading");

-- CreateIndex
CREATE INDEX "user_interest_scores_last_activity_idx" ON "user_interest_scores"("last_activity");

-- CreateIndex
CREATE INDEX "user_interest_scores_trend_direction_idx" ON "user_interest_scores"("trend_direction");

-- CreateIndex
CREATE INDEX "user_interest_scores_category_current_score_idx" ON "user_interest_scores"("category", "current_score");

-- CreateIndex
CREATE UNIQUE INDEX "user_interest_scores_user_id_interest_name_key" ON "user_interest_scores"("user_id", "interest_name");

-- AddForeignKey
ALTER TABLE "influencer_accounts" ADD CONSTRAINT "influencer_accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interactions" ADD CONSTRAINT "interactions_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interactions" ADD CONSTRAINT "interactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interactions" ADD CONSTRAINT "interactions_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "interactions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_scores" ADD CONSTRAINT "user_scores_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_scores" ADD CONSTRAINT "user_scores_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_scores" ADD CONSTRAINT "user_scores_interaction_id_fkey" FOREIGN KEY ("interaction_id") REFERENCES "interactions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_signatures" ADD CONSTRAINT "user_signatures_influencer_id_fkey" FOREIGN KEY ("influencer_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_signatures" ADD CONSTRAINT "user_signatures_follower_id_fkey" FOREIGN KEY ("follower_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nominations" ADD CONSTRAINT "nominations_influencer_id_fkey" FOREIGN KEY ("influencer_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nominations" ADD CONSTRAINT "nominations_candidate_user_id_fkey" FOREIGN KEY ("candidate_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "video_channels" ADD CONSTRAINT "video_channels_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "videos" ADD CONSTRAINT "videos_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "video_channels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "playlists" ADD CONSTRAINT "playlists_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "video_channels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "playlist_items" ADD CONSTRAINT "playlist_items_playlist_id_fkey" FOREIGN KEY ("playlist_id") REFERENCES "playlists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "playlist_items" ADD CONSTRAINT "playlist_items_video_id_fkey" FOREIGN KEY ("video_id") REFERENCES "videos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversation_members" ADD CONSTRAINT "conversation_members_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversation_members" ADD CONSTRAINT "conversation_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_reply_to_id_fkey" FOREIGN KEY ("reply_to_id") REFERENCES "messages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admins" ADD CONSTRAINT "admins_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_permissions" ADD CONSTRAINT "admin_permissions_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "admins"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "login_sessions" ADD CONSTRAINT "login_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_hashtags" ADD CONSTRAINT "post_hashtags_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_hashtags" ADD CONSTRAINT "post_hashtags_hashtag_id_fkey" FOREIGN KEY ("hashtag_id") REFERENCES "hashtags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trending_topics" ADD CONSTRAINT "trending_topic_hashtag_fkey" FOREIGN KEY ("reference_id") REFERENCES "hashtags"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trending_topics" ADD CONSTRAINT "trending_topic_keyword_fkey" FOREIGN KEY ("reference_id") REFERENCES "keywords"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_reporter_id_fkey" FOREIGN KEY ("reporter_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "report_reviewer_fkey" FOREIGN KEY ("reviewed_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "report_admin_fkey" FOREIGN KEY ("reviewed_by") REFERENCES "admins"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "report_post_fkey" FOREIGN KEY ("target_id") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "report_interaction_fkey" FOREIGN KEY ("target_id") REFERENCES "interactions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "report_video_fkey" FOREIGN KEY ("target_id") REFERENCES "videos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "report_message_fkey" FOREIGN KEY ("target_id") REFERENCES "messages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_blocks" ADD CONSTRAINT "user_blocks_blocker_user_id_fkey" FOREIGN KEY ("blocker_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_blocks" ADD CONSTRAINT "user_blocks_blocked_user_id_fkey" FOREIGN KEY ("blocked_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_interest_profiles" ADD CONSTRAINT "user_interest_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_interest_scores" ADD CONSTRAINT "user_interest_scores_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
