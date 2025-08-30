-- CreateTable
CREATE TABLE "Drone" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "model" TEXT NOT NULL DEFAULT 'Standard',
    "maxWeight" REAL NOT NULL,
    "battery" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'IDLE'
);

-- CreateTable
CREATE TABLE "Package" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "weight" REAL NOT NULL,
    "destinationX" INTEGER NOT NULL,
    "destinationY" INTEGER NOT NULL,
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "droneId" INTEGER,
    CONSTRAINT "Package_droneId_fkey" FOREIGN KEY ("droneId") REFERENCES "Drone" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
