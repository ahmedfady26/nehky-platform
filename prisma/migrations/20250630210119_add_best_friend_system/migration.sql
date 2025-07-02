-- CreateEnum
CREATE TYPE "BestFriendStatus" AS ENUM ('PENDING', 'ACTIVE', 'EXPIRED', 'REJECTED', 'CANCELLED', 'PAUSED');

-- CreateEnum
CREATE TYPE "BestFriendPermissionType" AS ENUM ('POST_ON_PROFILE', 'COMMENT_SPECIAL', 'STORY_VIEW', 'PROFILE_ACCESS');

-- CreateEnum
CREATE TYPE "RelationshipStrength" AS ENUM ('WEAK', 'MODERATE', 'STRONG', 'VERY_STRONG');

-- AlterTable
ALTER TABLE "hashtags" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "influencer_accounts" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "interactions" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "keywords" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "notifications" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "post_attractiveness" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "post_sentiment_analysis" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "posts" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "reports" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "sponsored_posts" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "trending_topics" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "user_blocks" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "user_interest_profiles" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "user_interest_scores" ADD COLUMN     "is_archived" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "last_decay_applied" TIMESTAMP(3),
ADD COLUMN     "needs_recalculation" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "user_signatures" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "last_activity" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "videos" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "video_view_sessions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "post_id" TEXT NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3),
    "watch_duration" INTEGER NOT NULL,
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "drop_off_time" INTEGER,
    "device_type" "DeviceType" NOT NULL,
    "quality_settings" TEXT,
    "is_rewatch" BOOLEAN NOT NULL DEFAULT false,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "video_view_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "video_metrics" (
    "id" TEXT NOT NULL,
    "post_id" TEXT NOT NULL,
    "total_views" INTEGER NOT NULL DEFAULT 0,
    "total_watch_time" INTEGER NOT NULL DEFAULT 0,
    "average_watch_time" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "completion_rate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "retention_rate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "engagement_rate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "drop_off_points" INTEGER[],
    "peak_viewing_time" INTEGER NOT NULL DEFAULT 0,
    "rewatch_count" INTEGER NOT NULL DEFAULT 0,
    "mobile_views" INTEGER NOT NULL DEFAULT 0,
    "desktop_views" INTEGER NOT NULL DEFAULT 0,
    "tablet_views" INTEGER NOT NULL DEFAULT 0,
    "hourly_distribution" JSONB,
    "daily_distribution" JSONB,
    "last_calculated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "video_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_follows" (
    "id" TEXT NOT NULL,
    "follower_id" TEXT NOT NULL,
    "followed_id" TEXT NOT NULL,
    "is_notification_enabled" BOOLEAN NOT NULL DEFAULT true,
    "source" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_follows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_logs" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "details" JSONB,
    "executed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "system_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "best_friend_relations" (
    "id" TEXT NOT NULL,
    "user_1_id" TEXT NOT NULL,
    "user_2_id" TEXT NOT NULL,
    "total_points" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "user_1_points" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "user_2_points" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "mutual_score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "relationship_strength" "RelationshipStrength" NOT NULL DEFAULT 'WEAK',
    "compatibility_score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "interaction_frequency" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "nominated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "decided_at" TIMESTAMP(3),
    "last_interaction" TIMESTAMP(3),
    "status" "BestFriendStatus" NOT NULL DEFAULT 'PENDING',
    "nominated_by" TEXT NOT NULL,
    "approved_by" TEXT,
    "posts_used" INTEGER NOT NULL DEFAULT 0,
    "comments_used" INTEGER NOT NULL DEFAULT 0,
    "approvals_required" BOOLEAN NOT NULL DEFAULT true,
    "is_auto_nominated" BOOLEAN NOT NULL DEFAULT false,
    "was_manual_choice" BOOLEAN NOT NULL DEFAULT false,
    "nomination_week" TEXT NOT NULL,
    "cycle_number" INTEGER NOT NULL DEFAULT 1,
    "common_interests" TEXT[],
    "mutual_friends" INTEGER NOT NULL DEFAULT 0,
    "shared_content" INTEGER NOT NULL DEFAULT 0,
    "user_1_rating" DOUBLE PRECISION,
    "user_2_rating" DOUBLE PRECISION,
    "average_rating" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "best_friend_relations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "best_friend_permission_requests" (
    "id" TEXT NOT NULL,
    "relation_id" TEXT NOT NULL,
    "requester_id" TEXT NOT NULL,
    "approver_id" TEXT NOT NULL,
    "permission_type" "BestFriendPermissionType" NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "request_details" TEXT,
    "approval_reason" TEXT,
    "requested_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "responded_at" TIMESTAMP(3),
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "best_friend_permission_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "best_friend_activity_logs" (
    "id" TEXT NOT NULL,
    "relation_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "activity_type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "metadata" JSONB,
    "points_awarded" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "best_friend_activity_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "video_view_sessions_user_id_idx" ON "video_view_sessions"("user_id");

-- CreateIndex
CREATE INDEX "video_view_sessions_post_id_idx" ON "video_view_sessions"("post_id");

-- CreateIndex
CREATE INDEX "video_view_sessions_start_time_idx" ON "video_view_sessions"("start_time");

-- CreateIndex
CREATE INDEX "video_view_sessions_is_completed_idx" ON "video_view_sessions"("is_completed");

-- CreateIndex
CREATE INDEX "video_view_sessions_device_type_idx" ON "video_view_sessions"("device_type");

-- CreateIndex
CREATE UNIQUE INDEX "video_metrics_post_id_key" ON "video_metrics"("post_id");

-- CreateIndex
CREATE INDEX "video_metrics_total_views_idx" ON "video_metrics"("total_views");

-- CreateIndex
CREATE INDEX "video_metrics_engagement_rate_idx" ON "video_metrics"("engagement_rate");

-- CreateIndex
CREATE INDEX "video_metrics_completion_rate_idx" ON "video_metrics"("completion_rate");

-- CreateIndex
CREATE INDEX "video_metrics_last_calculated_idx" ON "video_metrics"("last_calculated");

-- CreateIndex
CREATE INDEX "user_follows_follower_id_idx" ON "user_follows"("follower_id");

-- CreateIndex
CREATE INDEX "user_follows_followed_id_idx" ON "user_follows"("followed_id");

-- CreateIndex
CREATE INDEX "user_follows_created_at_idx" ON "user_follows"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "user_follows_follower_id_followed_id_key" ON "user_follows"("follower_id", "followed_id");

-- CreateIndex
CREATE INDEX "system_logs_type_idx" ON "system_logs"("type");

-- CreateIndex
CREATE INDEX "system_logs_status_idx" ON "system_logs"("status");

-- CreateIndex
CREATE INDEX "system_logs_executed_at_idx" ON "system_logs"("executed_at");

-- CreateIndex
CREATE INDEX "best_friend_relations_user_1_id_idx" ON "best_friend_relations"("user_1_id");

-- CreateIndex
CREATE INDEX "best_friend_relations_user_2_id_idx" ON "best_friend_relations"("user_2_id");

-- CreateIndex
CREATE INDEX "best_friend_relations_status_idx" ON "best_friend_relations"("status");

-- CreateIndex
CREATE INDEX "best_friend_relations_start_date_idx" ON "best_friend_relations"("start_date");

-- CreateIndex
CREATE INDEX "best_friend_relations_end_date_idx" ON "best_friend_relations"("end_date");

-- CreateIndex
CREATE INDEX "best_friend_relations_nomination_week_idx" ON "best_friend_relations"("nomination_week");

-- CreateIndex
CREATE INDEX "best_friend_relations_total_points_idx" ON "best_friend_relations"("total_points");

-- CreateIndex
CREATE INDEX "best_friend_relations_relationship_strength_idx" ON "best_friend_relations"("relationship_strength");

-- CreateIndex
CREATE INDEX "best_friend_relations_nominated_at_idx" ON "best_friend_relations"("nominated_at");

-- CreateIndex
CREATE UNIQUE INDEX "best_friend_relations_user_1_id_user_2_id_nomination_week_key" ON "best_friend_relations"("user_1_id", "user_2_id", "nomination_week");

-- CreateIndex
CREATE INDEX "best_friend_permission_requests_relation_id_idx" ON "best_friend_permission_requests"("relation_id");

-- CreateIndex
CREATE INDEX "best_friend_permission_requests_requester_id_idx" ON "best_friend_permission_requests"("requester_id");

-- CreateIndex
CREATE INDEX "best_friend_permission_requests_approver_id_idx" ON "best_friend_permission_requests"("approver_id");

-- CreateIndex
CREATE INDEX "best_friend_permission_requests_permission_type_idx" ON "best_friend_permission_requests"("permission_type");

-- CreateIndex
CREATE INDEX "best_friend_permission_requests_status_idx" ON "best_friend_permission_requests"("status");

-- CreateIndex
CREATE INDEX "best_friend_permission_requests_expires_at_idx" ON "best_friend_permission_requests"("expires_at");

-- CreateIndex
CREATE INDEX "best_friend_activity_logs_relation_id_idx" ON "best_friend_activity_logs"("relation_id");

-- CreateIndex
CREATE INDEX "best_friend_activity_logs_user_id_idx" ON "best_friend_activity_logs"("user_id");

-- CreateIndex
CREATE INDEX "best_friend_activity_logs_activity_type_idx" ON "best_friend_activity_logs"("activity_type");

-- CreateIndex
CREATE INDEX "best_friend_activity_logs_created_at_idx" ON "best_friend_activity_logs"("created_at");

-- AddForeignKey
ALTER TABLE "video_view_sessions" ADD CONSTRAINT "video_view_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "video_view_sessions" ADD CONSTRAINT "video_view_sessions_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "video_metrics" ADD CONSTRAINT "video_metrics_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_follows" ADD CONSTRAINT "user_follows_follower_id_fkey" FOREIGN KEY ("follower_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_follows" ADD CONSTRAINT "user_follows_followed_id_fkey" FOREIGN KEY ("followed_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "best_friend_relations" ADD CONSTRAINT "best_friend_relations_user_1_id_fkey" FOREIGN KEY ("user_1_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "best_friend_relations" ADD CONSTRAINT "best_friend_relations_user_2_id_fkey" FOREIGN KEY ("user_2_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "best_friend_permission_requests" ADD CONSTRAINT "best_friend_permission_requests_relation_id_fkey" FOREIGN KEY ("relation_id") REFERENCES "best_friend_relations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "best_friend_permission_requests" ADD CONSTRAINT "best_friend_permission_requests_requester_id_fkey" FOREIGN KEY ("requester_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "best_friend_permission_requests" ADD CONSTRAINT "best_friend_permission_requests_approver_id_fkey" FOREIGN KEY ("approver_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "best_friend_activity_logs" ADD CONSTRAINT "best_friend_activity_logs_relation_id_fkey" FOREIGN KEY ("relation_id") REFERENCES "best_friend_relations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "best_friend_activity_logs" ADD CONSTRAINT "best_friend_activity_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
