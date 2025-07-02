-- AlterEnum
ALTER TYPE "NotificationType" ADD VALUE 'BESTFRIEND';

-- AlterTable
ALTER TABLE "referral_audit_logs" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "user_scroll_tracking" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "post_id" TEXT NOT NULL,
    "scroll_depth" DOUBLE PRECISION NOT NULL,
    "time_on_post" DOUBLE PRECISION NOT NULL,
    "pause_time" DOUBLE PRECISION NOT NULL,
    "scroll_speed" DOUBLE PRECISION NOT NULL,
    "is_visible" BOOLEAN NOT NULL,
    "viewport_data" JSONB NOT NULL,
    "session_id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_scroll_tracking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_video_tracking" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "post_id" TEXT NOT NULL,
    "video_duration" DOUBLE PRECISION NOT NULL,
    "watched_duration" DOUBLE PRECISION NOT NULL,
    "watched_percentage" DOUBLE PRECISION NOT NULL,
    "play_count" INTEGER NOT NULL,
    "pause_count" INTEGER NOT NULL,
    "seek_count" INTEGER NOT NULL,
    "is_completed" BOOLEAN NOT NULL,
    "exit_point" DOUBLE PRECISION NOT NULL,
    "interaction_data" JSONB NOT NULL,
    "session_id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_video_tracking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_interaction_tracking" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "post_id" TEXT NOT NULL,
    "interaction_type" "UserEngagementType" NOT NULL,
    "time_to_interact" DOUBLE PRECISION NOT NULL,
    "scroll_position" DOUBLE PRECISION NOT NULL,
    "click_position" JSONB NOT NULL,
    "device_type" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_interaction_tracking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "smart_user_profiles" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "profile_type" TEXT NOT NULL,
    "avg_time_on_post" DOUBLE PRECISION NOT NULL,
    "avg_scroll_speed" DOUBLE PRECISION NOT NULL,
    "avg_pause_time" DOUBLE PRECISION NOT NULL,
    "scroll_engagement_rate" DOUBLE PRECISION NOT NULL,
    "avg_watch_percentage" DOUBLE PRECISION NOT NULL,
    "video_completion_rate" DOUBLE PRECISION NOT NULL,
    "avg_play_count" DOUBLE PRECISION NOT NULL,
    "video_engagement_indicator" DOUBLE PRECISION NOT NULL,
    "behavior_data" JSONB NOT NULL,
    "last_analyzed" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "smart_user_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "user_scroll_tracking_user_id_idx" ON "user_scroll_tracking"("user_id");

-- CreateIndex
CREATE INDEX "user_scroll_tracking_post_id_idx" ON "user_scroll_tracking"("post_id");

-- CreateIndex
CREATE INDEX "user_scroll_tracking_session_id_idx" ON "user_scroll_tracking"("session_id");

-- CreateIndex
CREATE INDEX "user_scroll_tracking_timestamp_idx" ON "user_scroll_tracking"("timestamp");

-- CreateIndex
CREATE INDEX "user_video_tracking_user_id_idx" ON "user_video_tracking"("user_id");

-- CreateIndex
CREATE INDEX "user_video_tracking_post_id_idx" ON "user_video_tracking"("post_id");

-- CreateIndex
CREATE INDEX "user_video_tracking_session_id_idx" ON "user_video_tracking"("session_id");

-- CreateIndex
CREATE INDEX "user_video_tracking_timestamp_idx" ON "user_video_tracking"("timestamp");

-- CreateIndex
CREATE INDEX "user_video_tracking_is_completed_idx" ON "user_video_tracking"("is_completed");

-- CreateIndex
CREATE INDEX "user_interaction_tracking_user_id_idx" ON "user_interaction_tracking"("user_id");

-- CreateIndex
CREATE INDEX "user_interaction_tracking_post_id_idx" ON "user_interaction_tracking"("post_id");

-- CreateIndex
CREATE INDEX "user_interaction_tracking_interaction_type_idx" ON "user_interaction_tracking"("interaction_type");

-- CreateIndex
CREATE INDEX "user_interaction_tracking_session_id_idx" ON "user_interaction_tracking"("session_id");

-- CreateIndex
CREATE INDEX "user_interaction_tracking_timestamp_idx" ON "user_interaction_tracking"("timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "smart_user_profiles_user_id_key" ON "smart_user_profiles"("user_id");

-- CreateIndex
CREATE INDEX "smart_user_profiles_user_id_idx" ON "smart_user_profiles"("user_id");

-- CreateIndex
CREATE INDEX "smart_user_profiles_profile_type_idx" ON "smart_user_profiles"("profile_type");

-- CreateIndex
CREATE INDEX "smart_user_profiles_last_analyzed_idx" ON "smart_user_profiles"("last_analyzed");

-- AddForeignKey
ALTER TABLE "user_scroll_tracking" ADD CONSTRAINT "user_scroll_tracking_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_scroll_tracking" ADD CONSTRAINT "user_scroll_tracking_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_video_tracking" ADD CONSTRAINT "user_video_tracking_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_video_tracking" ADD CONSTRAINT "user_video_tracking_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_interaction_tracking" ADD CONSTRAINT "user_interaction_tracking_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_interaction_tracking" ADD CONSTRAINT "user_interaction_tracking_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "smart_user_profiles" ADD CONSTRAINT "smart_user_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
