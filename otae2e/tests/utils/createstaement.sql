 CREATE TABLE "measures"
 ( "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, 
  "testName" TEXT NOT NULL, 
  "time" REAL NOT NULL DEFAULT (datetime('now','localtime')), 
  "JSHeapUsedSize" INTEGER, "LayoutCount" INTEGER, "RecalcStyleCount" INTEGER, 
  "ScriptDuration" INTEGER, "TaskDuration" INTEGER, "Timestamp" INTEGER, 
  "JSEventListeners" INTEGER, "LayoutDuration" INTEGER, "RecalcStyleDuration" INTEGER, 
  "Nodes" INTEGER, "screenshot" BLOB )