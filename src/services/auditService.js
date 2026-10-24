import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/config";

export const logAction = async (actor, action, entity, before = null, after = null) => {
  try {
    await addDoc(collection(db, "audit_logs"), {
      actor: actor?.name || actor?.email || "system",
      actorUid: actor?.uid || null,
      action,
      entity,
      before,
      after,
      at: new Date().toISOString(),
    });
  } catch (e) {
    console.error("Audit log failed:", e);
  }
};