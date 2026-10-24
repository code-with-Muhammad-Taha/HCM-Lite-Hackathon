import { collection, addDoc, getDocs, doc, updateDoc, query, where } from "firebase/firestore";
import { db } from "../firebase/config";

export const calculateTax = (annualGross) => {
  if (annualGross <= 600000) return 0;
  if (annualGross <= 1200000) return (annualGross - 600000) * 0.05;
  if (annualGross <= 2400000) return 30000 + (annualGross - 1200000) * 0.15;
  if (annualGross <= 3600000) return 210000 + (annualGross - 2400000) * 0.25;
  return 510000 + (annualGross - 3600000) * 0.35;
};

export const generatePayroll = async (month, employees) => {
  for (const emp of employees) {
    const gross = (emp.basic || 0) * 1.5;
    const annual = gross * 12;
    const tax = calculateTax(annual) / 12;
    const net = gross - tax;
    await addDoc(collection(db, "payroll"), {
      uid: emp.id, name: emp.name, month, basic: emp.basic || 0, gross, tax, net,
      status: "draft", createdAt: new Date().toISOString(),
    });
  }
};

export const getPayroll = async () => {
  const snap = await getDocs(collection(db, "payroll"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const getMyPayroll = async (uid) => {
  const q = query(collection(db, "payroll"), where("uid", "==", uid));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const finalizePayroll = async (id) => {
  await updateDoc(doc(db, "payroll", id), { status: "finalized", finalizedAt: new Date().toISOString() });
};