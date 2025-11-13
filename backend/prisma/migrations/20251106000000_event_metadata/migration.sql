-- Rename the old RSVP deadline column to the new registrationDeadline name
ALTER TABLE "Event"
RENAME COLUMN "rsvpDeadline" TO "registrationDeadline";

-- Extend events with the metadata that the frontend expects
ALTER TABLE "Event"
ADD COLUMN     "maxCapacity" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "isPrivate" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "image" TEXT,
ADD COLUMN     "category" TEXT;
