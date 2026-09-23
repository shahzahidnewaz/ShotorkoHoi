
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
  { id: "f8", name: "Rajshahi Medical College Hospital", district: "Rajshahi", area: "Rajshahi Sadar", type: "Public", departments: ["Emergency", "General Medicine", "Gynecology & Obstetrics"] },
  { id: "f9", name: "Khulna Medical College Hospital", district: "Khulna", area: "Khulna Sadar", type: "Public", departments: ["Emergency", "General Medicine", "Orthopedics", "Pediatrics"] },
  { id: "f10", name: "Ad-din Khulna Medical College Hospital", district: "Khulna", area: "Sonadanga", type: "Private", departments: ["Gynecology & Obstetrics", "Pediatrics", "Surgery"] },
  { id: "f11", name: "Rangpur Medical College Hospital", district: "Rangpur", area: "Rangpur Sadar", type: "Public", departments: ["Emergency", "General Medicine", "Surgery", "Orthopedics"] },
  { id: "f12", name: "Mymensingh Medical College Hospital", district: "Mymensingh", area: "Mymensingh Sadar", type: "Public", departments: ["Emergency", "General Medicine", "Gynecology & Obstetrics", "Pediatrics"] },
  { id: "f13", name: "Sher-e-Bangla Medical College Hospital", district: "Barishal", area: "Barishal Sadar", type: "Public", departments: ["Emergency", "General Medicine", "Orthopedics", "ENT"] },
  { id: "f14", name: "Popular Diagnostic Centre & Hospital", district: "Dhaka", area: "Dhanmondi", type: "Private", departments: ["General Medicine", "Cardiology", "Dermatology", "ENT"] },
  { id: "f15", name: "Chittagong Maa-O-Shishu Hospital", district: "Chattogram", area: "Agrabad", type: "Private", departments: ["Gynecology & Obstetrics", "Pediatrics"] },
  { id: "f16", name: "Labaid Hospital", district: "Dhaka", area: "Dhanmondi", type: "Private", departments: ["Cardiology", "Neurology", "General Medicine", "Surgery"] }
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
  { id: "r12", facilityId: "f1", department: "Gynecology & Obstetrics", visitType: "Routine checkup", costMin: 1200, costMax: 1800, waitMinutes: 25, communicationRating: 5, tags: ["clear_communication", "clean_facility", "helpful_staff"], outcome: "resolved", text: "Very smooth appointment, on time, and the doctor answered all my questions without rushing. Reception was efficient with online booking confirmation.", createdAt: "2026-09-10" },
  { id: "r13", facilityId: "f9", department: "Orthopedics", visitType: "Fracture / cast", costMin: 400, costMax: 1000, waitMinutes: 200, communicationRating: 2, tags: ["long_wait", "cash_only"], outcome: "unresolved", text: "Broke my wrist and came straight to the emergency ward. The queue for X-ray took over 3 hours even with a visible fracture. Casting itself was quick once seen.", createdAt: "2026-08-03" },
  { id: "r14", facilityId: "f10", department: "Gynecology & Obstetrics", visitType: "Delivery / normal", costMin: 15000, costMax: 25000, waitMinutes: 30, communicationRating: 4, tags: ["clean_facility", "good_followup"], outcome: "resolved", text: "Delivered here after my usual gynecologist recommended it. Ward was clean and the nurses checked in regularly during recovery. Billing matched the estimate given at admission.", createdAt: "2026-07-19" },
  { id: "r15", facilityId: "f11", department: "Surgery", visitType: "Appendectomy", costMin: 20000, costMax: 35000, waitMinutes: 90, communicationRating: 3, tags: ["unexpected_extra_charges", "helpful_staff"], outcome: "resolved", text: "Emergency appendix surgery, staff moved fast once admitted. Final bill was about 6,000 taka over the initial verbal estimate for extra lab tests that weren't mentioned upfront.", createdAt: "2026-06-25" },
  { id: "r16", facilityId: "f11", department: "General Medicine", visitType: "Routine consultation", costMin: 200, costMax: 400, waitMinutes: 75, communicationRating: 3, tags: ["long_wait", "helpful_staff"], outcome: "resolved", text: "Standard OPD wait for a public hospital. The doctor was thorough despite the queue outside — didn't feel rushed once inside.", createdAt: "2026-05-08" },
  { id: "r17", facilityId: "f12", department: "Pediatrics", visitType: "Vaccination", costMin: 0, costMax: 200, waitMinutes: 45, communicationRating: 4, tags: ["clear_communication", "helpful_staff"], outcome: "resolved", text: "Free EPI vaccination program, well organized with a clear queue system. Staff explained the vaccination schedule and side effects to watch for.", createdAt: "2026-08-11" },
  { id: "r18", facilityId: "f12", department: "Gynecology & Obstetrics", visitType: "Delivery / C-section", costMin: 8000, costMax: 15000, waitMinutes: 20, communicationRating: 3, tags: ["cash_only", "rushed_consultation"], outcome: "unresolved", text: "Emergency C-section, care was adequate but rushed — pre-op counseling was under two minutes. Had to pay cash upfront before the procedure, no card facility.", createdAt: "2026-04-30" },
  { id: "r19", facilityId: "f13", department: "ENT", visitType: "Ear infection", costMin: 300, costMax: 600, waitMinutes: 110, communicationRating: 3, tags: ["long_wait", "clean_facility"], outcome: "resolved", text: "Long wait typical of a district medical college hospital, but the ENT department itself was clean and the doctor's diagnosis was accurate — infection cleared with prescribed course.", createdAt: "2026-07-14" },
  { id: "r20", facilityId: "f13", department: "Emergency", visitType: "Emergency / trauma", costMin: 0, costMax: 1500, waitMinutes: 40, communicationRating: 4, tags: ["helpful_staff", "clean_facility"], outcome: "resolved", text: "Minor road accident, was seen quickly given it was flagged as trauma. Staff were calm and communicated next steps clearly throughout.", createdAt: "2026-09-01" },
  { id: "r21", facilityId: "f14", department: "Cardiology", visitType: "ECG + consultation", costMin: 2500, costMax: 4000, waitMinutes: 35, communicationRating: 4, tags: ["clear_communication", "clean_facility"], outcome: "resolved", text: "Booked online, appointment ran close to on time. Cardiologist reviewed the ECG on the spot and explained the results clearly with a printed summary.", createdAt: "2026-08-27" },
  { id: "r22", facilityId: "f14", department: "Dermatology", visitType: "Skin consultation", costMin: 1000, costMax: 1500, waitMinutes: 50, communicationRating: 3, tags: ["long_wait", "unexpected_extra_charges"], outcome: "unresolved", text: "Consultation fee was as quoted, but was told mid-visit that a biopsy would cost extra and wasn't part of the original package — would've liked that upfront.", createdAt: "2026-06-05" },
  { id: "r23", facilityId: "f15", department: "Pediatrics", visitType: "Fever / infection", costMin: 500, costMax: 900, waitMinutes: 55, communicationRating: 4, tags: ["clean_facility", "helpful_staff"], outcome: "resolved", text: "Took my toddler in with a high fever. Facility was noticeably clean and the pediatric nurses were patient with a scared kid. Diagnosis and treatment were straightforward.", createdAt: "2026-09-15" },
  { id: "r24", facilityId: "f15", department: "Gynecology & Obstetrics", visitType: "Delivery / C-section", costMin: 35000, costMax: 55000, waitMinutes: 15, communicationRating: 5, tags: ["clear_communication", "good_followup", "clean_facility"], outcome: "resolved", text: "Planned C-section, everything was explained step by step including costs before admission. Follow-up calls after discharge checked on recovery — best experience I've had at a private facility.", createdAt: "2026-08-19" },
  { id: "r25", facilityId: "f16", department: "Neurology", visitType: "MRI + consultation", costMin: 14000, costMax: 20000, waitMinutes: 40, communicationRating: 4, tags: ["clear_communication", "clean_facility"], outcome: "resolved", text: "MRI scheduling was efficient and the neurologist spent real time going over the scan. Slightly pricier than public hospitals but worth it for the clarity given.", createdAt: "2026-07-22" }
];
