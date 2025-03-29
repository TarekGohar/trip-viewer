-- Enable RLS on all tables
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Trip" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "DailyActivity" ENABLE ROW LEVEL SECURITY;

-- User policies
CREATE POLICY "Users can view their own data"
ON "User"
FOR SELECT
TO authenticated
USING (id::uuid = auth.uid());

CREATE POLICY "Users can update their own data"
ON "User"
FOR UPDATE
TO authenticated
USING (id::uuid = auth.uid());

-- Trip policies
CREATE POLICY "Users can view their own trips"
ON "Trip"
FOR SELECT
TO authenticated
USING ("userId"::uuid = auth.uid());

CREATE POLICY "Users can create their own trips"
ON "Trip"
FOR INSERT
TO authenticated
WITH CHECK ("userId"::uuid = auth.uid());

CREATE POLICY "Users can update their own trips"
ON "Trip"
FOR UPDATE
TO authenticated
USING ("userId"::uuid = auth.uid());

CREATE POLICY "Users can delete their own trips"
ON "Trip"
FOR DELETE
TO authenticated
USING ("userId"::uuid = auth.uid());

-- DailyActivity policies
CREATE POLICY "Users can view activities from their trips"
ON "DailyActivity"
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM "Trip"
    WHERE "Trip".id = "DailyActivity"."tripId"
    AND "Trip"."userId"::uuid = auth.uid()
  )
);

CREATE POLICY "Users can create activities for their trips"
ON "DailyActivity"
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM "Trip"
    WHERE "Trip".id = "DailyActivity"."tripId"
    AND "Trip"."userId"::uuid = auth.uid()
  )
);

CREATE POLICY "Users can update activities from their trips"
ON "DailyActivity"
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM "Trip"
    WHERE "Trip".id = "DailyActivity"."tripId"
    AND "Trip"."userId"::uuid = auth.uid()
  )
);

CREATE POLICY "Users can delete activities from their trips"
ON "DailyActivity"
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM "Trip"
    WHERE "Trip".id = "DailyActivity"."tripId"
    AND "Trip"."userId"::uuid = auth.uid()
  )
); 