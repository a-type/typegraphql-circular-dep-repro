# Migration `20200823193854`

This migration has been generated by Grant Forrest at 8/23/2020, 3:38:54 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."User" ADD COLUMN "authSubject" text   NOT NULL 

CREATE UNIQUE INDEX "User.authSubject_unique" ON "public"."User"("authSubject")
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200818215423..20200823193854
--- datamodel.dml
+++ datamodel.dml
@@ -1,23 +1,19 @@
 datasource db {
   provider = "postgresql"
-  url = "***"
+  url = "***"
 }
 generator prisma_client {
-  provider        = "prisma-client-js"
-  previewFeatures = ["aggregateApi"]
+  provider = "prisma-client-js"
 }
-generator typegraphql {
-  provider = "node node_modules/typegraphql-prisma/generator.js"
-}
-
 model User {
-  id       String    @id @default(cuid())
-  name     String
-  groups   Group[]   @relation(references: [id])
-  accounts Account[]
+  id          String    @id @default(cuid())
+  name        String
+  authSubject String    @unique
+  groups      Group[]   @relation(references: [id])
+  accounts    Account[]
 }
 model Group {
   id    String @id @default(cuid())
```


