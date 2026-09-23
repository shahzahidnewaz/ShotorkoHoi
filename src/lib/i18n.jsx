import { createContext, useContext, useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "shotorko_lang";

const dict = {
  en: {
    nav: {
      search: "Search hospitals",
      data: "Data",
      about: "About",
      dashboard: "Dashboard",
      hi: "Hi, {name}",
      logout: "Log out"
    },
    footer: {
      copy: "© 2026 ShotorkoHoi — an independent patient-experience record for Bangladesh healthcare.",
      how: "How this works",
      staff: "Staff sign in"
    },
    common: {
      shareExperience: "Share your experience",
      search: "Search",
      allDistricts: "All districts",
      allDepartments: "All departments",
      unverifiedBadge: "Unverified · Self-reported",
      reportsCount_one: "{count} report",
      reportsCount_other: "{count} reports"
    },
    landing: {
      h1: "Know what to expect before your hospital visit.",
      sub: "ShotorkoHoi collects real patients' accounts of costs, wait times, and what actually happened at hospitals and clinics across Bangladesh — so you can prepare better and ask sharper questions.",
      searchPlaceholder: "Search a hospital or clinic, e.g. Square Hospital",
      trust1Bold: "No login required.",
      trust1: "Reports are anonymous.",
      trust2Bold: "Unverified by design.",
      trust2: "Every account is self-reported.",
      trust3Bold: "Not a booking site.",
      trust3: "No affiliation with any hospital.",
      recentTitle: "Recently added hospitals",
      seeAll: "See all →"
    },
    search: {
      h1: "Search hospitals",
      placeholder: "Hospital or clinic name",
      results: "Results",
      found_one: "{count} hospital found",
      found_other: "{count} hospitals found",
      errorTitle: "Something went wrong",
      errorBody: "Couldn't load search results. Please try again.",
      emptyTitle: "No hospitals match your search",
      emptyBody: "Try a different name, or broaden the district/department filters."
    },
    facilityDetail: {
      noFacilityTitle: "No hospital specified",
      noFacilityBody: "Go back to search to pick a hospital.",
      notFoundTitle: "Hospital not found",
      notFoundBody: "This hospital may have been removed or the link is incorrect.",
      noReportsYet: "No reports yet for this hospital. Be the first to share your experience.",
      patientReports: "Patient reports",
      shareHere: "Share your experience here",
      noDeptReportsTitle: "No reports in this department yet",
      noDeptReportsBody: "Try another department, or be the first to share your experience."
    },
    reportCard: {
      outcomeResolved: "Marked resolved by reporter",
      outcomeUnresolved: "Marked unresolved by reporter",
      cost: "Cost:",
      wait: "Wait:",
      communication: "Communication:",
      verifiedByYou: "✓ Verified by you",
      verifying: "Verifying…",
      happenedToMeToo: "This happened to me too",
      verifyTitle: "Click if this matches your own experience at this hospital",
      flaggedForReview: "Flagged for review",
      flagThisReport: "Flag this report"
    },
    stats: {
      costRange: "Reported cost range",
      medianWait: "Median wait time",
      avgCommunication: "Avg. communication",
      reportsOnRecord: "Reports on record"
    },
    data: {
      h1: "Aggregate Patient Data",
      sub: "A rolling, site-wide view of every approved, anonymous patient report — self-reported, aggregated across all hospitals.",
      generatingNote: "Numbers below are generated live from the public ledger of approved reports.",
      totalReports: "Approved reports",
      totalFacilities: "Hospitals on record",
      totalDistricts: "Districts covered",
      avgCommunication: "Avg. communication",
      medianWait: "Median wait time",
      costRange: "Reported cost range",
      resolvedShare: "Marked resolved",
      minutesSuffix: "min",
      topIssuesTitle: "Most-reported issues",
      byDepartmentTitle: "Reports by department",
      byDistrictTitle: "Reports by district",
      districtCol: "District",
      facilitiesCol: "Hospitals",
      reportsCol: "Reports",
      trendTitle: "Reports submitted, last 30 days",
      emptyTitle: "No approved reports yet",
      emptyBody: "Once reports are moderated and approved, aggregate numbers will appear here.",
      errorTitle: "Couldn't load platform data",
      errorBody: "Please try again in a moment.",
      methodologyTitle: "How to read this",
      methodologyBody: "Every figure here is computed only from reports that passed moderation and are publicly visible. Nothing is independently verified — treat these as a directional signal from self-reported accounts, not an audited statistic."
    },
    about: {
      h1: "What ShotorkoHoi is, and isn't",
      sub: "A quick, honest guide to how this platform works and what it's for.",
      sections: [
        {
          title: "What it is",
          body: "ShotorkoHoi is a public record of patient-submitted accounts of visits to hospitals and clinics in Bangladesh — cost, wait time, communication, and what to expect. It exists so the next patient walking into an unfamiliar hospital has some idea what's ahead, instead of finding out standing at the counter."
        },
        {
          title: "What it isn't",
          body: "It is not an investigative body, a complaints authority, or an alternative to the Bangladesh Medical and Dental Council or the Directorate General of Health Services. It does not verify individual claims, and it does not publish or aggregate information about named individual doctors or staff — reports are tied to hospitals and departments only."
        },
        {
          title: "Why everything says \"unverified\"",
          body: "Every report here is one person's own account, submitted anonymously with no way for us to confirm it independently. We label every report and every aggregate statistic as unverified and self-reported, and we mean it literally: treat a single report as one data point, not a conclusion. Patterns across many reports are more informative than any single one."
        },
        {
          title: "Moderation",
          body: "Reports are reviewed before publishing to remove identifying details (names, phone numbers, patient IDs), spam, and clearly abusive content. Moderation checks for policy compliance; it does not check whether the underlying claim is factually true."
        },
        {
          title: "Privacy",
          body: "No account, name, phone number, or email is required to submit a report. Guests can browse and report anonymously, and reports cannot be traced back to a submitting account."
        }
      ]
    },
    reportNew: {
      h1: "Share your experience",
      sub1: "This report is anonymous — we don't ask for your name, phone number, or account. It will be reviewed before it appears publicly, and will always be labeled",
      subBold: "unverified, self-reported",
      facility: "Hospital",
      selectFacility: "Type to search for a hospital",
      facilityNoMatch: "No matching hospital — keep typing or check the spelling",
      department: "Department / service",
      selectDepartment: "Select a department",
      departmentOther: "Others",
      departmentOtherPlaceholder: "Please specify the department / service",
      visitType: "Visit type",
      visitTypeHint: "A short description of why you visited.",
      visitTypePlaceholder: "e.g. Routine consultation, Emergency, Delivery",
      approxCost: "Approximate cost (BDT)",
      minimum: "Minimum",
      maximum: "Maximum",
      noCostHint: "Leave both as 0 if there was no cost. Positive numbers only.",
      approxWait: "Approximate wait time (minutes)",
      waitPlaceholder: "e.g. 45",
      communicationLabel: "How clear was the communication?",
      commOption5: "5 — Very clear",
      commOption1: "1 — Very unclear",
      standOut: "What stood out? (select any that apply)",
      issueResolved: "Was your issue resolved?",
      resolved: "Resolved",
      unresolved: "Unresolved",
      describe: "Describe what happened",
      describeHint: "{count}/1200 characters. Please don't include names of doctors or staff, or any personal identifying details.",
      describePlaceholder: "What should someone else expect? What would help them prepare? Avoid naming individual staff members.",
      confirmNote: "By submitting, you confirm this account reflects your own experience. Reports are published as",
      unverifiedWord: "unverified",
      confirmNoteEnd: "and reviewed for identifying details, abuse, and spam before appearing publicly.",
      back: "Back",
      continue: "Continue",
      submitting: "Submitting…",
      submit: "Submit report",
      errFacility: "Please select the hospital you visited from the suggestions.",
      errDepartment: "Please select a department.",
      errDepartmentOther: "Please describe the department / service.",
      errVisitType: "Please describe the visit type.",
      errCostMin: "Enter a valid positive number for minimum cost.",
      errCostMax: "Enter a valid positive number for maximum cost.",
      errText: "Please write at least 30 characters describing what happened.",
      submitFailed: "Something went wrong submitting your report. Please try again."
    },
    reportSuccess: {
      h1: "Thank you — your report is pending review",
      body: "Your report was submitted anonymously and will be reviewed for identifying details, spam, and abuse before it appears publicly, labeled as unverified and self-reported. There's no account to check status — this keeps your report fully anonymous.",
      searchOthers: "Search other hospitals"
    },
    login: {
      h1: "Staff sign in",
      sub: "This login is for ShotorkoHoi moderators and admins only.",
      email: "Email",
      password: "Password",
      loggingIn: "Logging in…",
      logIn: "Log in",
      guestNote: "Guests can still search, submit, and verify reports without an account",
      genericError: "Something went wrong. Please try again."
    },
    admin: {
      queueTitle: "Moderation queue",
      queueSub: "Review reports before they go public.",
      manageUsers: "Manage users",
      statusPending: "Pending",
      statusApproved: "Approved",
      statusRejected: "Rejected",
      loadFailed: "Failed to load the moderation queue.",
      approveFailed: "Failed to approve report.",
      rejectFailed: "Failed to reject report.",
      rejectPrompt: "Reason for rejecting this report (optional):",
      errorTitle: "Something went wrong",
      nothingHereTitle: "Nothing here",
      nothingHereBody: "No {status} reports right now.",
      cost: "Cost:",
      wait: "Wait:",
      communication: "Communication:",
      outcome: "Outcome:",
      rejected: "Rejected:",
      approve: "Approve",
      reject: "Reject",
      usersTitle: "Manage users",
      usersSub: "Activate new accounts, promote admins, or remove users.",
      moderationQueue: "Moderation queue",
      loadUsersFailed: "Failed to load users.",
      actionFailed: "Action failed.",
      deleteConfirm: "Delete this user permanently? This can't be undone.",
      noUsersTitle: "No users yet",
      noUsersBody: "Registered accounts will show up here.",
      colName: "Name",
      colEmail: "Email",
      colRole: "Role",
      colStatus: "Status",
      colJoined: "Joined",
      colActions: "Actions",
      you: "(you)",
      active: "active",
      inactive: "inactive",
      admin: "admin",
      user: "user",
      activate: "Activate",
      deactivate: "Deactivate",
      demote: "Demote",
      promote: "Promote",
      delete: "Delete"
    },
    dashboard: {
      title: "Dashboard",
      usersSectionTitle: "Manage users",
      overviewTitle: "Overview",
      pendingReports: "Pending reports",
      approvedReports: "Approved reports",
      rejectedReports: "Rejected reports",
      totalUsers: "Total users",
      activeUsers: "Active users",
      totalHospitals: "Hospitals on record",
      goToQueue: "Review moderation queue",
      loadFailed: "Couldn't load dashboard data."
    },
    profile: {
      button: "Profile",
      personalDetails: "Personal details",
      name: "Name",
      email: "Email",
      role: "Role",
      status: "Status",
      joined: "Joined",
      changePassword: "Change password",
      currentPassword: "Current password",
      newPassword: "New password",
      confirmPassword: "Confirm new password",
      updatePassword: "Update password",
      updating: "Updating…",
      passwordUpdated: "Password updated successfully.",
      errAllFields: "Please fill in all three fields.",
      errMismatch: "New password and confirmation don't match.",
      errTooShort: "New password must be at least 8 characters.",
      logout: "Log out",
      uploadImage: "Upload photo",
      removeImage: "Remove photo",
      imageHint: "PNG, JPEG, WEBP, or GIF. Max 300KB.",
      saveChanges: "Save changes",
      saving: "Saving…",
      savedSuccessfully: "Your changes have been saved.",
      errNameRequired: "Name is required.",
      errSaveFailed: "Couldn't save your changes. Please try again.",
      errImageType: "Please choose a PNG, JPEG, WEBP, or GIF image.",
      errImageSize: "That image is too large. Please choose one under 300KB."
    }
  },
  bn: {
    nav: {
      search: "হাসপাতাল খুঁজুন",
      data: "ডেটা",
      about: "সম্পর্কে",
      dashboard: "ড্যাশবোর্ড",
      hi: "হাই, {name}",
      logout: "লগ আউট"
    },
    footer: {
      copy: "© ২০২৬ শটর্কোহই — বাংলাদেশের স্বাস্থ্যসেবার একটি স্বাধীন রোগীর অভিজ্ঞতার রেকর্ড।",
      how: "এটি যেভাবে কাজ করে",
      staff: "স্টাফ সাইন ইন"
    },
    common: {
      shareExperience: "আপনার অভিজ্ঞতা শেয়ার করুন",
      search: "খুঁজুন",
      allDistricts: "সব জেলা",
      allDepartments: "সব বিভাগ",
      unverifiedBadge: "যাচাই-বিহীন · স্ব-প্রতিবেদিত",
      reportsCount_one: "{count}টি প্রতিবেদন",
      reportsCount_other: "{count}টি প্রতিবেদন"
    },
    landing: {
      h1: "হাসপাতালে যাওয়ার আগে জেনে নিন কী আশা করবেন।",
      sub: "শটর্কোহই বাংলাদেশের হাসপাতাল ও ক্লিনিকে প্রকৃত রোগীদের খরচ, অপেক্ষার সময় এবং প্রকৃতপক্ষে কী ঘটেছিল তার বিবরণ সংগ্রহ করে — যাতে আপনি আরও ভালোভাবে প্রস্তুত হতে ও সঠিক প্রশ্ন জিজ্ঞাসা করতে পারেন।",
      searchPlaceholder: "একটি হাসপাতাল বা ক্লিনিক খুঁজুন, যেমন Square Hospital",
      trust1Bold: "কোনো লগইন প্রয়োজন নেই।",
      trust1: "প্রতিবেদনগুলো অজ্ঞাতনামা।",
      trust2Bold: "ডিজাইন অনুযায়ী যাচাই-বিহীন।",
      trust2: "প্রতিটি বিবরণ স্ব-প্রতিবেদিত।",
      trust3Bold: "এটি বুকিং সাইট নয়।",
      trust3: "কোনো হাসপাতালের সাথে সংশ্লিষ্টতা নেই।",
      recentTitle: "সম্প্রতি যোগ হওয়া হাসপাতালসমূহ",
      seeAll: "সব দেখুন →"
    },
    search: {
      h1: "হাসপাতাল খুঁজুন",
      placeholder: "হাসপাতাল বা ক্লিনিকের নাম",
      results: "ফলাফল",
      found_one: "{count}টি হাসপাতাল পাওয়া গেছে",
      found_other: "{count}টি হাসপাতাল পাওয়া গেছে",
      errorTitle: "কিছু ভুল হয়েছে",
      errorBody: "অনুসন্ধানের ফলাফল লোড করা যায়নি। আবার চেষ্টা করুন।",
      emptyTitle: "আপনার অনুসন্ধানের সাথে কোনো হাসপাতাল মেলেনি",
      emptyBody: "অন্য নাম দিয়ে চেষ্টা করুন, অথবা জেলা/বিভাগ ফিল্টার বিস্তৃত করুন।"
    },
    facilityDetail: {
      noFacilityTitle: "কোনো হাসপাতাল উল্লেখ করা হয়নি",
      noFacilityBody: "একটি হাসপাতাল বাছাই করতে অনুসন্ধানে ফিরে যান।",
      notFoundTitle: "হাসপাতালটি পাওয়া যায়নি",
      notFoundBody: "এই হাসপাতালটি সরিয়ে ফেলা হতে পারে অথবা লিংকটি ভুল।",
      noReportsYet: "এই হাসপাতালের জন্য এখনও কোনো প্রতিবেদন নেই। প্রথমে আপনার অভিজ্ঞতা শেয়ার করুন।",
      patientReports: "রোগীর প্রতিবেদন",
      shareHere: "এখানে আপনার অভিজ্ঞতা শেয়ার করুন",
      noDeptReportsTitle: "এই বিভাগে এখনও কোনো প্রতিবেদন নেই",
      noDeptReportsBody: "অন্য বিভাগ চেষ্টা করুন, অথবা প্রথমে আপনার অভিজ্ঞতা শেয়ার করুন।"
    },
    reportCard: {
      outcomeResolved: "প্রতিবেদক সমাধান হয়েছে বলে চিহ্নিত করেছেন",
      outcomeUnresolved: "প্রতিবেদক সমাধান হয়নি বলে চিহ্নিত করেছেন",
      cost: "খরচ:",
      wait: "অপেক্ষা:",
      communication: "যোগাযোগ:",
      verifiedByYou: "✓ আপনার দ্বারা যাচাইকৃত",
      verifying: "যাচাই করা হচ্ছে…",
      happenedToMeToo: "আমার সাথেও এমন হয়েছে",
      verifyTitle: "এটি এই হাসপাতালে আপনার নিজের অভিজ্ঞতার সাথে মিললে ক্লিক করুন",
      flaggedForReview: "পর্যালোচনার জন্য চিহ্নিত হয়েছে",
      flagThisReport: "এই প্রতিবেদনটি ফ্ল্যাগ করুন"
    },
    stats: {
      costRange: "প্রতিবেদিত খরচের পরিসীমা",
      medianWait: "মধ্যম অপেক্ষার সময়",
      avgCommunication: "গড় যোগাযোগ",
      reportsOnRecord: "রেকর্ডে থাকা প্রতিবেদন"
    },
    data: {
      h1: "সমষ্টিগত রোগীর ডেটা",
      sub: "পাবলিক লেজার থেকে অনুমোদিত প্রতিটি অজ্ঞাতনামা রোগীর প্রতিবেদনের একটি চলমান, সাইট-ব্যাপী দৃশ্য — স্ব-প্রতিবেদিত, সব হাসপাতাল জুড়ে একত্রিত।",
      generatingNote: "নিচের সংখ্যাগুলো অনুমোদিত প্রতিবেদনের পাবলিক লেজার থেকে লাইভ তৈরি হয়।",
      totalReports: "অনুমোদিত প্রতিবেদন",
      totalFacilities: "রেকর্ডে থাকা হাসপাতাল",
      totalDistricts: "অন্তর্ভুক্ত জেলা",
      avgCommunication: "গড় যোগাযোগ",
      medianWait: "মধ্যম অপেক্ষার সময়",
      costRange: "প্রতিবেদিত খরচের পরিসীমা",
      resolvedShare: "সমাধান হয়েছে বলে চিহ্নিত",
      minutesSuffix: "মিনিট",
      topIssuesTitle: "সবচেয়ে বেশি প্রতিবেদিত সমস্যা",
      byDepartmentTitle: "বিভাগ অনুযায়ী প্রতিবেদন",
      byDistrictTitle: "জেলা অনুযায়ী প্রতিবেদন",
      districtCol: "জেলা",
      facilitiesCol: "হাসপাতাল",
      reportsCol: "প্রতিবেদন",
      trendTitle: "গত ৩০ দিনে জমা হওয়া প্রতিবেদন",
      emptyTitle: "এখনও কোনো অনুমোদিত প্রতিবেদন নেই",
      emptyBody: "প্রতিবেদন পর্যালোচনা ও অনুমোদিত হলে, একত্রিত সংখ্যা এখানে দেখা যাবে।",
      errorTitle: "প্ল্যাটফর্মের ডেটা লোড করা যায়নি",
      errorBody: "অনুগ্রহ করে একটু পরে আবার চেষ্টা করুন।",
      methodologyTitle: "এটি কীভাবে পড়বেন",
      methodologyBody: "এখানে প্রতিটি সংখ্যা শুধুমাত্র সেই প্রতিবেদনগুলো থেকে গণনা করা হয়েছে যা পর্যালোচনা পাস করে পাবলিকলি দৃশ্যমান হয়েছে। কিছুই স্বাধীনভাবে যাচাই করা হয়নি — এগুলোকে একটি নিরীক্ষিত পরিসংখ্যান হিসেবে নয়, বরং স্ব-প্রতিবেদিত বিবরণ থেকে একটি দিকনির্দেশক সংকেত হিসেবে বিবেচনা করুন।"
    },
    about: {
      h1: "শটর্কোহই যা, এবং যা নয়",
      sub: "এই প্ল্যাটফর্মটি কীভাবে কাজ করে এবং এটি কীসের জন্য তার একটি সংক্ষিপ্ত, সৎ নির্দেশিকা।",
      sections: [
        {
          title: "এটি যা",
          body: "শটর্কোহই বাংলাদেশের হাসপাতাল ও ক্লিনিকে রোগীদের ভ্রমণের জমা দেওয়া বিবরণের একটি সর্বজনীন রেকর্ড — খরচ, অপেক্ষার সময়, যোগাযোগ, এবং কী আশা করা উচিত। এটি এই জন্য বিদ্যমান যাতে অপরিচিত হাসপাতালে প্রবেশ করা পরবর্তী রোগীর সামনে কী আছে তার কিছুটা ধারণা থাকে, কাউন্টারে দাঁড়িয়ে জানার পরিবর্তে।"
        },
        {
          title: "এটি যা নয়",
          body: "এটি কোনো তদন্তকারী সংস্থা, অভিযোগ কর্তৃপক্ষ, বা বাংলাদেশ মেডিকেল অ্যান্ড ডেন্টাল কাউন্সিল বা স্বাস্থ্য অধিদপ্তরের বিকল্প নয়। এটি পৃথক দাবি যাচাই করে না, এবং নির্দিষ্ট নামযুক্ত ডাক্তার বা কর্মীদের সম্পর্কে তথ্য প্রকাশ বা সংকলন করে না — প্রতিবেদনগুলো শুধুমাত্র হাসপাতাল ও বিভাগের সাথে যুক্ত।"
        },
        {
          title: "কেন সবকিছুতে \"যাচাই-বিহীন\" লেখা থাকে",
          body: "এখানে প্রতিটি প্রতিবেদন একজন ব্যক্তির নিজস্ব বিবরণ, অজ্ঞাতনামাভাবে জমা দেওয়া, যা স্বাধীনভাবে নিশ্চিত করার কোনো উপায় আমাদের নেই। আমরা প্রতিটি প্রতিবেদন ও প্রতিটি সমষ্টিগত পরিসংখ্যানকে যাচাই-বিহীন ও স্ব-প্রতিবেদিত হিসেবে লেবেল করি, এবং এটি আক্ষরিক অর্থেই বলি: একটি একক প্রতিবেদনকে একটি ডেটা পয়েন্ট হিসেবে বিবেচনা করুন, উপসংহার নয়। অনেক প্রতিবেদন জুড়ে প্যাটার্নগুলো যেকোনো একটি প্রতিবেদনের চেয়ে বেশি তথ্যবহুল।"
        },
        {
          title: "মডারেশন",
          body: "প্রকাশের আগে প্রতিবেদনগুলো পর্যালোচনা করা হয় শনাক্তকারী বিবরণ (নাম, ফোন নম্বর, রোগীর আইডি), স্প্যাম, এবং স্পষ্টত অপব্যবহারমূলক বিষয়বস্তু অপসারণ করতে। মডারেশন নীতি মেনে চলা যাচাই করে; এটি অন্তর্নিহিত দাবিটি প্রকৃতপক্ষে সত্য কিনা তা যাচাই করে না।"
        },
        {
          title: "গোপনীয়তা",
          body: "একটি প্রতিবেদন জমা দিতে কোনো অ্যাকাউন্ট, নাম, ফোন নম্বর, বা ইমেইলের প্রয়োজন নেই। অতিথিরা অ্যাকাউন্ট ছাড়াই ব্রাউজ ও অজ্ঞাতনামাভাবে প্রতিবেদন করতে পারেন, এবং প্রতিবেদনগুলো জমাদানকারী অ্যাকাউন্টে ফিরিয়ে খুঁজে পাওয়া যায় না।"
        }
      ]
    },
    reportNew: {
      h1: "আপনার অভিজ্ঞতা শেয়ার করুন",
      sub1: "এই প্রতিবেদনটি অজ্ঞাতনামা — আমরা আপনার নাম, ফোন নম্বর, বা অ্যাকাউন্ট জিজ্ঞাসা করি না। এটি প্রকাশের আগে পর্যালোচনা করা হবে, এবং সবসময় লেবেল করা থাকবে",
      subBold: "যাচাই-বিহীন, স্ব-প্রতিবেদিত",
      facility: "হাসপাতাল",
      selectFacility: "হাসপাতালের নাম লিখতে শুরু করুন",
      facilityNoMatch: "কোনো মিল পাওয়া যায়নি — লিখতে থাকুন বা বানান পরীক্ষা করুন",
      department: "বিভাগ / সেবা",
      selectDepartment: "একটি বিভাগ নির্বাচন করুন",
      departmentOther: "অন্যান্য",
      departmentOtherPlaceholder: "বিভাগ / সেবাটি উল্লেখ করুন",
      visitType: "ভ্রমণের ধরন",
      visitTypeHint: "আপনি কেন গিয়েছিলেন তার একটি সংক্ষিপ্ত বিবরণ।",
      visitTypePlaceholder: "যেমন নিয়মিত পরামর্শ, জরুরি, ডেলিভারি",
      approxCost: "আনুমানিক খরচ (টাকা)",
      minimum: "সর্বনিম্ন",
      maximum: "সর্বোচ্চ",
      noCostHint: "যদি কোনো খরচ না থাকে তবে উভয়টি ০ রাখুন। শুধুমাত্র ধনাত্মক সংখ্যা।",
      approxWait: "আনুমানিক অপেক্ষার সময় (মিনিট)",
      waitPlaceholder: "যেমন ৪৫",
      communicationLabel: "যোগাযোগ কতটা স্পষ্ট ছিল?",
      commOption5: "৫ — খুব স্পষ্ট",
      commOption1: "১ — খুব অস্পষ্ট",
      standOut: "কী চোখে পড়েছে? (যা প্রযোজ্য তা নির্বাচন করুন)",
      issueResolved: "আপনার সমস্যা কি সমাধান হয়েছিল?",
      resolved: "সমাধান হয়েছে",
      unresolved: "সমাধান হয়নি",
      describe: "কী ঘটেছিল তা বর্ণনা করুন",
      describeHint: "{count}/১২০০ অক্ষর। অনুগ্রহ করে ডাক্তার বা কর্মীদের নাম, অথবা কোনো ব্যক্তিগত পরিচয়সূচক তথ্য অন্তর্ভুক্ত করবেন না।",
      describePlaceholder: "অন্য কারো কী আশা করা উচিত? কী তাদের প্রস্তুত হতে সাহায্য করবে? আলাদা কর্মীর নাম উল্লেখ করা এড়িয়ে চলুন।",
      confirmNote: "জমা দেওয়ার মাধ্যমে, আপনি নিশ্চিত করছেন যে এই বিবরণটি আপনার নিজের অভিজ্ঞতা প্রতিফলিত করে। প্রতিবেদনগুলো প্রকাশিত হয়",
      unverifiedWord: "যাচাই-বিহীন",
      confirmNoteEnd: "হিসেবে এবং প্রকাশের আগে শনাক্তকারী বিবরণ, অপব্যবহার ও স্প্যামের জন্য পর্যালোচনা করা হয়।",
      back: "পেছনে",
      continue: "এগিয়ে যান",
      submitting: "জমা দেওয়া হচ্ছে…",
      submit: "প্রতিবেদন জমা দিন",
      errFacility: "অনুগ্রহ করে তালিকা থেকে আপনি যে হাসপাতালে গিয়েছিলেন তা নির্বাচন করুন।",
      errDepartment: "একটি বিভাগ নির্বাচন করুন।",
      errDepartmentOther: "অনুগ্রহ করে বিভাগ / সেবাটি উল্লেখ করুন।",
      errVisitType: "ভ্রমণের ধরন বর্ণনা করুন।",
      errCostMin: "সর্বনিম্ন খরচের জন্য একটি বৈধ ধনাত্মক সংখ্যা লিখুন।",
      errCostMax: "সর্বোচ্চ খরচের জন্য একটি বৈধ ধনাত্মক সংখ্যা লিখুন।",
      errText: "কী ঘটেছিল তা বর্ণনা করে অন্তত ৩০টি অক্ষর লিখুন।",
      submitFailed: "আপনার প্রতিবেদন জমা দিতে সমস্যা হয়েছে। আবার চেষ্টা করুন।"
    },
    reportSuccess: {
      h1: "ধন্যবাদ — আপনার প্রতিবেদন পর্যালোচনাধীন",
      body: "আপনার প্রতিবেদনটি অজ্ঞাতনামাভাবে জমা দেওয়া হয়েছে এবং এটি প্রকাশের আগে শনাক্তকারী বিবরণ, স্প্যাম ও অপব্যবহারের জন্য পর্যালোচনা করা হবে, যাচাই-বিহীন ও স্ব-প্রতিবেদিত হিসেবে লেবেলকৃত। স্ট্যাটাস দেখার জন্য কোনো অ্যাকাউন্ট নেই — এটি আপনার প্রতিবেদনকে সম্পূর্ণ অজ্ঞাতনামা রাখে।",
      searchOthers: "অন্যান্য হাসপাতাল খুঁজুন"
    },
    login: {
      h1: "স্টাফ সাইন ইন",
      sub: "এই লগইন শুধুমাত্র শটর্কোহই মডারেটর ও অ্যাডমিনদের জন্য।",
      email: "ইমেইল",
      password: "পাসওয়ার্ড",
      loggingIn: "লগইন করা হচ্ছে…",
      logIn: "লগ ইন",
      guestNote: "অতিথিরা অ্যাকাউন্ট ছাড়াই খুঁজতে, জমা দিতে এবং প্রতিবেদন যাচাই করতে পারেন",
      genericError: "কিছু ভুল হয়েছে। আবার চেষ্টা করুন।"
    },
    admin: {
      queueTitle: "মডারেশন সারি",
      queueSub: "প্রকাশের আগে প্রতিবেদন পর্যালোচনা করুন।",
      manageUsers: "ব্যবহারকারী পরিচালনা",
      statusPending: "মুলতুবি",
      statusApproved: "অনুমোদিত",
      statusRejected: "প্রত্যাখ্যাত",
      loadFailed: "মডারেশন সারি লোড করা যায়নি।",
      approveFailed: "প্রতিবেদন অনুমোদন করা যায়নি।",
      rejectFailed: "প্রতিবেদন প্রত্যাখ্যান করা যায়নি।",
      rejectPrompt: "এই প্রতিবেদনটি প্রত্যাখ্যানের কারণ (ঐচ্ছিক):",
      errorTitle: "কিছু ভুল হয়েছে",
      nothingHereTitle: "এখানে কিছু নেই",
      nothingHereBody: "এই মুহূর্তে কোনো {status} প্রতিবেদন নেই।",
      cost: "খরচ:",
      wait: "অপেক্ষা:",
      communication: "যোগাযোগ:",
      outcome: "ফলাফল:",
      rejected: "প্রত্যাখ্যাত:",
      approve: "অনুমোদন",
      reject: "প্রত্যাখ্যান",
      usersTitle: "ব্যবহারকারী পরিচালনা",
      usersSub: "নতুন অ্যাকাউন্ট সক্রিয় করুন, অ্যাডমিন পদোন্নতি দিন, অথবা ব্যবহারকারী মুছুন।",
      moderationQueue: "মডারেশন সারি",
      loadUsersFailed: "ব্যবহারকারী লোড করা যায়নি।",
      actionFailed: "কাজটি ব্যর্থ হয়েছে।",
      deleteConfirm: "এই ব্যবহারকারীকে স্থায়ীভাবে মুছবেন? এটি পূর্বাবস্থায় ফেরানো যাবে না।",
      noUsersTitle: "এখনও কোনো ব্যবহারকারী নেই",
      noUsersBody: "নিবন্ধিত অ্যাকাউন্টগুলো এখানে দেখা যাবে।",
      colName: "নাম",
      colEmail: "ইমেইল",
      colRole: "ভূমিকা",
      colStatus: "অবস্থা",
      colJoined: "যোগদান",
      colActions: "কার্যক্রম",
      you: "(আপনি)",
      active: "সক্রিয়",
      inactive: "নিষ্ক্রিয়",
      admin: "অ্যাডমিন",
      user: "ব্যবহারকারী",
      activate: "সক্রিয় করুন",
      deactivate: "নিষ্ক্রিয় করুন",
      demote: "পদাবনতি",
      promote: "পদোন্নতি",
      delete: "মুছুন"
    },
    dashboard: {
      title: "ড্যাশবোর্ড",
      usersSectionTitle: "ব্যবহারকারী পরিচালনা",
      overviewTitle: "সংক্ষিপ্ত বিবরণ",
      pendingReports: "মুলতুবি প্রতিবেদন",
      approvedReports: "অনুমোদিত প্রতিবেদন",
      rejectedReports: "প্রত্যাখ্যাত প্রতিবেদন",
      totalUsers: "মোট ব্যবহারকারী",
      activeUsers: "সক্রিয় ব্যবহারকারী",
      totalHospitals: "রেকর্ডে থাকা হাসপাতাল",
      goToQueue: "মডারেশন সারি পর্যালোচনা করুন",
      loadFailed: "ড্যাশবোর্ডের তথ্য লোড করা যায়নি।"
    },
    profile: {
      button: "প্রোফাইল",
      personalDetails: "ব্যক্তিগত তথ্য",
      name: "নাম",
      email: "ইমেইল",
      role: "ভূমিকা",
      status: "অবস্থা",
      joined: "যোগদান",
      changePassword: "পাসওয়ার্ড পরিবর্তন করুন",
      currentPassword: "বর্তমান পাসওয়ার্ড",
      newPassword: "নতুন পাসওয়ার্ড",
      confirmPassword: "নতুন পাসওয়ার্ড নিশ্চিত করুন",
      updatePassword: "পাসওয়ার্ড হালনাগাদ করুন",
      updating: "হালনাগাদ করা হচ্ছে…",
      passwordUpdated: "পাসওয়ার্ড সফলভাবে হালনাগাদ হয়েছে।",
      errAllFields: "অনুগ্রহ করে সবকটি ঘর পূরণ করুন।",
      errMismatch: "নতুন পাসওয়ার্ড ও নিশ্চিতকরণ মেলেনি।",
      errTooShort: "নতুন পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।",
      logout: "লগ আউট",
      uploadImage: "ছবি আপলোড করুন",
      removeImage: "ছবি সরান",
      imageHint: "PNG, JPEG, WEBP, বা GIF। সর্বোচ্চ ৩০০KB।",
      saveChanges: "পরিবর্তন সংরক্ষণ করুন",
      saving: "সংরক্ষণ করা হচ্ছে…",
      savedSuccessfully: "আপনার পরিবর্তনগুলো সংরক্ষণ করা হয়েছে।",
      errNameRequired: "নাম আবশ্যক।",
      errSaveFailed: "আপনার পরিবর্তন সংরক্ষণ করা যায়নি। আবার চেষ্টা করুন।",
      errImageType: "অনুগ্রহ করে একটি PNG, JPEG, WEBP, বা GIF ছবি বেছে নিন।",
      errImageSize: "ছবিটি অনেক বড়। অনুগ্রহ করে ৩০০KB-এর কম আকারের ছবি বেছে নিন।"
    }
  }
};

function get(obj, path) {
  return path.split(".").reduce((o, k) => (o == null ? undefined : o[k]), obj);
}

const BN_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
export function toBnDigits(value) {
  return String(value).replace(/[0-9]/g, (d) => BN_DIGITS[d]);
}
export function formatNumber(lang, value) {
  if (value === undefined || value === null) return value;
  return lang === "bn" ? toBnDigits(value) : String(value);
}

function interpolate(str, vars, lang) {
  if (!vars) return str;
  return str.replace(/\{(\w+)\}/g, (_, k) => {
    if (vars[k] === undefined) return `{${k}}`;
    const v = vars[k];
    const isNumeric = typeof v === "number" || (typeof v === "string" && /^-?\d+(\.\d+)?$/.test(v));
    return isNumeric ? formatNumber(lang, v) : v;
  });
}

const LangContext = createContext(null);

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved === "bn" || saved === "en" ? saved : "en";
    } catch {
      return "en";
    }
  });

  useEffect(() => {
    document.documentElement.lang = lang === "bn" ? "bn" : "en";
  }, [lang]);

  const setLang = useCallback((next) => {
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
    }
  }, []);

  const toggleLang = useCallback(() => {
    setLang(lang === "en" ? "bn" : "en");
  }, [lang, setLang]);
  const t = useCallback(
    (key, vars) => {
      const value = get(dict[lang], key) ?? get(dict.en, key) ?? key;
      return typeof value === "string" ? interpolate(value, vars, lang) : value;
    },
    [lang]
  );
  const tp = useCallback(
    (key, count, vars = {}) => {
      const suffix = count === 1 ? "_one" : "_other";
      return t(`${key}${suffix}`, { count, ...vars });
    },
    [t]
  );
  const td = useCallback((key) => get(dict[lang], key) ?? get(dict.en, key), [lang]);
  const n = useCallback((value) => formatNumber(lang, value), [lang]);

  return (
    <LangContext.Provider value={{ lang, setLang, toggleLang, t, tp, td, n }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within a LangProvider");
  return ctx;
}
