-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Drone" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "model" TEXT NOT NULL DEFAULT 'Standard',
    "maxWeight" REAL NOT NULL,
    "maxDistance" REAL NOT NULL DEFAULT 10,
    "battery" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'IDLE'
);
INSERT INTO "new_Drone" ("battery", "id", "maxWeight", "model", "status") SELECT "battery", "id", "maxWeight", "model", "status" FROM "Drone";
DROP TABLE "Drone";
ALTER TABLE "new_Drone" RENAME TO "Drone";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
