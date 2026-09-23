
export const DEPARTMENTS = [
  "Emergency", "Gynecology & Obstetrics", "Cardiology", "Orthopedics",
  "Pediatrics", "General Medicine", "Dental", "Dermatology",
  "ENT", "Neurology", "Oncology", "Surgery"
];

export const DISTRICTS = [
  "Dhaka", "Chattogram", "Sylhet", "Rajshahi", "Khulna",
  "Rangpur", "Mymensingh", "Barishal"
];

export const TAGS = [
  "long_wait", "no_written_estimate", "cash_only", "clear_communication",
  "rushed_consultation", "helpful_staff", "clean_facility",
  "unexpected_extra_charges", "good_followup", "difficult_to_reach_doctor"
];

export const TAG_LABELS = {
  long_wait: "Long wait",
  no_written_estimate: "No written cost estimate",
  cash_only: "Cash only",
  clear_communication: "Clear communication",
  rushed_consultation: "Rushed consultation",
  helpful_staff: "Helpful staff",
  clean_facility: "Clean facility",
  unexpected_extra_charges: "Unexpected extra charges",
  good_followup: "Good follow-up",
  difficult_to_reach_doctor: "Hard to reach doctor again"
};

export const FACILITIES = [
  { id: "f1", name: "Square Hospital", district: "Dhaka", area: "Panthapath", type: "Private", departments: ["Gynecology & Obstetrics", "Cardiology", "Surgery"] },
  { id: "f2", name: "Dhaka Medical College Hospital", district: "Dhaka", area: "Shahbagh", type: "Public", departments: ["Emergency", "General Medicine", "Orthopedics", "Surgery"] },
  { id: "f3", name: "United Hospital", district: "Dhaka", area: "Gulshan", type: "Private", departments: ["Cardiology", "Oncology", "Neurology"] },
  { id: "f4", name: "Chattogram Medical College Hospital", district: "Chattogram", area: "Panchlaish", type: "Public", departments: ["Emergency", "General Medicine", "Pediatrics"] },
  { id: "f5", name: "Ibn Sina Hospital", district: "Dhaka", area: "Kallyanpur", type: "Private", departments: ["Dental", "Dermatology", "ENT", "Gynecology & Obstetrics"] },
  { id: "f6", name: "Sylhet MAG Osmani Medical College Hospital", district: "Sylhet", area: "Sylhet Sadar", type: "Public", departments: ["Emergency", "General Medicine", "Pediatrics", "Orthopedics"] },
  { id: "f7", name: "Evercare Hospital", district: "Dhaka", area: "Bashundhara", type: "Private", departments: ["Oncology", "Cardiology", "Neurology", "Surgery"] },
  { id: "f8", name: "Rajshahi Medical College Hospital", district: "Rajshahi", area: "Rajshahi Sadar", type: "Public", departments: ["Emergency", "General Medicine", "Gynecology & Obstetrics"] }
];
export const REPORTS = [
  { id: "r1", facilityId: "f1", department: "Gynecology & Obstetrics", visitType: "Delivery / C-section", costMin: 55000, costMax: 85000, waitMinutes: 40, communicationRating: 4, tags: ["no_written_estimate", "clean_facility", "good_followup"], outcome: "resolved", text: "Booked a C-section in advance. The room and staff were good, but the final bill had several line items nobody explained beforehand — ask for an itemized estimate at admission, not after.", createdAt: "2026-08-14" },
  { id: "r2", facilityId: "f1", department: "Cardiology", visitType: "Routine consultation", costMin: 1500, costMax: 2000, waitMinutes: 90, communicationRating: 2, tags: ["long_wait", "rushed_consultation"], outcome: "unresolved", text: "Waited almost 1.5 hours past my appointment slot, then the consultation itself was under 5 minutes. Bring a written list of your symptoms/questions since there's no time to think on the spot.", createdAt: "2026-09-02" },
  { id: "r3", facilityId: "f2", department: "Emergency", visitType: "Emergency / trauma", costMin: 0, costMax: 3000, waitMinutes: 120, communicationRating: 2, tags: ["long_wait", "cash_only", "helpful_staff"], outcome: "resolved", text: "My father was in a road accident. Care was ultimately fine once seen, but the ticket queue for emergency intake took nearly 2 hours — go straight to the trauma desk, not the general line.", createdAt: "2026-07-28" },
  { id: "r4", facilityId: "f2", department: "Orthopedics", visitType: "Fracture follow-up", costMin: 500, costMax: 1200, waitMinutes: 180, communicationRating: 3, tags: ["long_wait", "difficult_to_reach_doctor"], outcome: "unresolved", text: "Follow-up visits require standing in the same queue as new patients. The doctor I was assigned to wasn't present for two of my three scheduled follow-ups.", createdAt: "2026-06-19" },
  { id: "r5", facilityId: "f3", department: "Oncology", visitType: "Chemotherapy session", costMin: 25000, costMax: 40000, waitMinutes: 30, communicationRating: 5, tags: ["clear_communication", "clean_facility", "good_followup"], outcome: "resolved", text: "Every session had a clear written cost breakdown given in advance. Staff explained side effects thoroughly before each cycle. One of the better-organized experiences I've had here.", createdAt: "2026-08-30" },
  { id: "r6", facilityId: "f3", department: "Cardiology", visitType: "Angiogram", costMin: 30000, costMax: 45000, waitMinutes: 60, communicationRating: 3, tags: ["unexpected_extra_charges", "helpful_staff"], outcome: "unresolved", text: "Quoted price didn't include the contrast dye or a few consumables, which added about 8,000 taka at billing. Ask specifically what the quote excludes.", createdAt: "2026-05-11" },
  { id: "r7", facilityId: "f5", department: "Dental", visitType: "Root canal", costMin: 8000, costMax: 12000, waitMinutes: 20, communicationRating: 4, tags: ["clear_communication", "clean_facility"], outcome: "resolved", text: "Straightforward, appointment was on time, and the dentist explained each sitting's purpose. Price matched what was quoted at the first visit.", createdAt: "2026-09-05" },
  { id: "r8", facilityId: "f6", department: "Pediatrics", visitType: "Fever / infection", costMin: 300, costMax: 800, waitMinutes: 150, communicationRating: 2, tags: ["long_wait", "rushed_consultation", "cash_only"], outcome: "unresolved", text: "Outpatient queue for children was extremely long with no separate fast-track despite my child having a high fever. Consultation itself was under 3 minutes.", createdAt: "2026-07-02" },
  { id: "r9", facilityId: "f7", department: "Neurology", visitType: "MRI + consultation", costMin: 12000, costMax: 18000, waitMinutes: 45, communicationRating: 4, tags: ["clear_communication", "helpful_staff"], outcome: "resolved", text: "MRI booking was efficient with an SMS reminder. Neurologist walked through the scan results in plain language rather than just handing over a report.", createdAt: "2026-08-22" },
  { id: "r10", facilityId: "f4", department: "General Medicine", visitType: "Routine consultation", costMin: 300, costMax: 600, waitMinutes: 100, communicationRating: 3, tags: ["long_wait", "helpful_staff"], outcome: "resolved", text: "Standard outpatient wait but staff at the ticket counter were patient and helpful in directing me to the right department.", createdAt: "2026-06-30" },
  { id: "r11", facilityId: "f8", department: "Gynecology & Obstetrics", visitType: "Routine checkup", costMin: 200, costMax: 500, waitMinutes: 60, communicationRating: 3, tags: ["long_wait", "clean_facility"], outcome: "resolved", text: "Basic checkup, no major issues. Wait was long but that seems typical for the public OPD hours here.", createdAt: "2026-05-27" },
  { id: "r12", facilityId: "f1", department: "Gynecology & Obstetrics", visitType: "Routine checkup", costMin: 1200, costMax: 1800, waitMinutes: 25, communicationRating: 5, tags: ["clear_communication", "clean_facility", "helpful_staff"], outcome: "resolved", text: "Very smooth appointment, on time, and the doctor answered all my questions without rushing. Reception was efficient with online booking confirmation.", createdAt: "2026-09-10" }
];
