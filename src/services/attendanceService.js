import { collection, addDoc, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config";

const getCompanySettings = async () => {
  const snap = await getDocs(query(collection(db, "settings"), where("__name__", "==", "company")));
  if (snap.empty) return { officeStart: "09:00", graceMinutes: 15, halfDayHours: 5 };
  return snap.docs[0].data();
};

const getStatus = async (checkIn, checkOut) => {
  const settings = await getCompanySettings();
  const officeStart = settings.officeStart || "09:00";
  const grace = settings.graceMinutes || 15;
  const halfDayHours = settings.halfDayHours || 5;

  const [sh, sm] = officeStart.split(":").map(Number);
  const inTime = new Date(checkIn);
  const startTime = new Date(inTime);
  startTime.setHours(sh, sm + grace, 0, 0);

  let status = "present";
  if (inTime > startTime) status = "late";

  if (checkOut) {
    const hours = (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60);
    if (hours < halfDayHours) status = "half_day";
  }

  return status;
};

export const getTodayRecord = async (uid) => {
  const today = new Date().toISOString().split("T")[0];
  const q = query(collection(db, "attendance"), where("uid", "==", uid), where("date", "==", today));
  const snap = await getDocs(q);
  return snap.empty ? null : { id: snap.docs[0].id, ...snap.docs[0].data() };
};

export const checkIn = async (uid, name) => {
  const existing = await getTodayRecord(uid);
  if (existing?.checkIn) throw new Error("Already checked in today");
  const today = new Date().toISOString().split("T")[0];
  const now = new Date().toISOString();
  await addDoc(collection(db, "attendance"), {
    uid, name, date: today,
    checkIn: now, checkOut: null,
    status: await getStatus(now, null),
    source: "web",
  });
};

export const checkOut = async (uid) => {
  const rec = await getTodayRecord(uid);
  if (!rec) throw new Error("No check-in found");
  if (rec.checkOut) throw new Error("Already checked out");
  const now = new Date().toISOString();
  await updateDoc(doc(db, "attendance", rec.id), {
    checkOut: now,
    status: await getStatus(rec.checkIn, now),
  });
};

export const getMyAttendance = async (uid) => {
  const q = query(collection(db, "attendance"), where("uid", "==", uid));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const getAllAttendance = async () => {
  const snap = await getDocs(collection(db, "attendance"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};