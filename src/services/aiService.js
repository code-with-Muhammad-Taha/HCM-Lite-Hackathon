export const askAI = async (question, role, userData) => {
  const q = question.toLowerCase();
  if (q.includes("colleague") && q.includes("salary")) return "Sorry, I cannot share other employees' salary information.";
  if (q.includes("sick leave")) return "Your sick leave balance: 8 days per year (per company policy).";
  if (q.includes("late")) return "You should arrive before office start + grace time to avoid late mark.";
  if (q.includes("attendance policy")) return "Office starts at 09:00, grace 15 minutes. Late after 09:15. Half day under 5 hours.";
  if (q.includes("leave policy")) return "Annual: 14, Sick: 8, Casual: 10 days per year. Unpaid unlimited.";
  if (q.includes("payslip")) return "You can download payslips from My Payslips page.";
  return "I'm your HCM assistant. Ask me about attendance, leaves, payroll, or policies. (Demo mode — add real AI API for full features)";
};