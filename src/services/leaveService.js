import { collection, addDoc, getDocs, query, where, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config";

const DEFAULT_QUOTAS = { annual: 14, sick: 8, casual: 10, unpaid: 999 };

export const getLeaveQuotas = async () => {
  const snap = await getDocs(collection(db, "leaveTypes"));
  const quotas = { ...DEFAULT_QUOTAS };
  snap.docs.forEach((d) => {
    const data = d.data();
    if (data.name && data.quota) quotas[data.name.toLowerCase()] = Number(data.quota);
  });
  return quotas;
};

export const getMyLeaveBalance = async (uid) => {
  const quotas = await getLeaveQuotas();
  const q = query(collection(db, "leaves"), where("uid", "==", uid), where("status", "==", "approved"));
  const snap = await getDocs(q);
  const used = { annual: 0, sick: 0, casual: 0, unpaid: 0 };
  snap.docs.forEach((d) => {
    const data = d.data();
    const days = (new Date(data.endDate) - new Date(data.startDate)) / (1000 * 60 * 60 * 24) + 1;
    if (used[data.type] !== undefined) used[data.type] += days;
  });
  const balance = {};
  Object.keys(quotas).forEach((k) => {
    balance[k] = { quota: quotas[k], used: used[k] || 0, left: quotas[k] - (used[k] || 0) };
  });
  return balance;
};

export const applyLeave = async (data) => {
  const start = new Date(data.startDate);
  const end = new Date(data.endDate);
  if (end < start) throw new Error("End date cannot be before start date");
  await addDoc(collection(db, "leaves"), { ...data, status: "pending", createdAt: new Date().toISOString() });
};

export const getMyLeaves = async (uid) => {
  const q = query(collection(db, "leaves"), where("uid", "==", uid));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const getAllLeaves = async () => {
  const snap = await getDocs(collection(db, "leaves"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const approveLeave = async (id, status, comment) => {
  await updateDoc(doc(db, "leaves", id), { status, comment, decidedAt: new Date().toISOString() });
};