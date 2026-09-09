import { db } from "../../../firebase/firebase-config.js";
import { callSecure } from "../../../shared/security-client.js?v=classification-permission-2";
import { complaintAttachmentMeta, downloadBlob, isImageAttachment, loadComplaintAttachmentBlob } from "../../../shared/complaint-attachments.js";
import {
  collection,
  getCountFromServer,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  startAfter,
  where
} from "https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js";

const uscAuthAllowed = await (globalThis.USC_AUTH_READY || Promise.resolve(false));
if (uscAuthAllowed !== true) await new Promise(() => {});


const STATUS_FLOW = ["Submitted", "Under Review", "In Progress", "Resolved", "Closed"];

const COMPLAINT_CLASSIFICATIONS = ["Student Level", "Administrative Level", "Crisis Level"];
const CLASSIFICATION_HELP = {
  "": "Assign after reviewing the complaint.",
  "Student Level": "Handled primarily through student/USC support channels.",
  "Administrative Level": "Requires coordination with a university office, department, or administrator.",
  "Crisis Level": "Urgent safety, welfare, or serious-risk concern that requires immediate escalation."
};

function normalizeClassification(value = "") {
  const classification = safeText(value);
  return COMPLAINT_CLASSIFICATIONS.includes(classification) ? classification : "";
}

function complaintClassificationForRecord(record = {}) {
  const direct = normalizeClassification(record?.classification);
  if (direct) return direct;
  const thread = Array.isArray(record?.thread) ? record.thread : [];
  for (let index = thread.length - 1; index >= 0; index -= 1) {
    const fromThread = normalizeClassification(thread[index]?.classification);
    if (fromThread) return fromThread;
  }
  return "";
}

function normalizeComplaintRecord(record = {}) {
  const classification = complaintClassificationForRecord(record);
  return classification ? { ...record, classification } : record;
}

function classificationClass(value = "") {
  const classification = normalizeClassification(value);
  if (classification === "Student Level") return "student";
  if (classification === "Administrative Level") return "administrative";
  if (classification === "Crisis Level") return "crisis";
  return "pending";
}

function syncClassificationUI(value = "") {
  const classification = normalizeClassification(value);
  if (detailClassification) {
    detailClassification.value = classification;
    detailClassification.dataset.level = classificationClass(classification);
  }
  if (classificationHelp) classificationHelp.textContent = CLASSIFICATION_HELP[classification] || CLASSIFICATION_HELP[""];
}

const inboxContainer = document.getElementById("complaintInbox");
const emptyState = document.getElementById("complaintEmptyState");
const detailPanel = document.getElementById("complaintDetailPanel");

const detailReference = document.getElementById("detailReference");
const detailStatus = document.getElementById("detailStatus");
const detailClassification = document.getElementById("detailClassification");
const classificationHelp = document.getElementById("classificationHelp");
const detailCategory = document.getElementById("detailCategory");
const detailStudent = document.getElementById("detailStudent");
const detailSubject = document.getElementById("detailSubject");
const detailComplaintText = document.getElementById("detailComplaintText");
const detailReply = document.getElementById("detailReply");
const complaintThread = document.getElementById("complaintThread");
const detailAttachmentPreview = document.getElementById("detailAttachmentPreview");

const updateStatusBtn = document.getElementById("updateStatusBtn");
const sendReplyBtn = document.getElementById("sendReplyBtn");
const deleteComplaintBtn = document.getElementById("deleteComplaintBtn");
const timelineSteps = Array.from(document.querySelectorAll(".timeline-step"));
const loadOlderComplaintsBtn = document.getElementById("loadOlderComplaints");
const complaintInboxScope = document.getElementById("complaintInboxScope");

const LIVE_PAGE_SIZE = 100;
let complaintsCache = [];
let liveComplaints = [];
let olderComplaints = [];
let paginationCursor = null;
let hasMoreOlderComplaints = true;
let selectedComplaintId = null;
let countRefreshTimer = 0;
let attachmentPreviewUrl = "";
let attachmentPreviewToken = 0;
let analyticsComplaints = [];

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function safeText(value, fallback = "") {
  return String(value || fallback).trim();
}

function getBadgeClass(status) {
  const map = {
    Submitted: "live",
    "Under Review": "review",
    "In Progress": "progress",
    Resolved: "good",
    Closed: "closed"
  };

  return map[safeText(status, "Submitted")] || "live";
}

function formatDate(value) {
  if (!value) return "-";

  if (value.toDate) {
    return value.toDate().toLocaleString();
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? String(value) : parsed.toLocaleString();
}

function getAnonymousComplainantLabel() {
  return "Anonymous Student";
}

function getSelectedComplaint() {
  return complaintsCache.find((item) => item.id === selectedComplaintId) || null;
}

function selectComplaint(id) {
  selectedComplaintId = id;
  renderInbox();
  renderDetails();
}

window.selectComplaint = selectComplaint;

function updateStatusFlow(status) {
  const activeIndex = STATUS_FLOW.indexOf(safeText(status, "Submitted"));

  timelineSteps.forEach((step, index) => {
    step.classList.remove("active", "completed");

    if (index < activeIndex) {
      step.classList.add("completed");
    } else if (index === activeIndex) {
      step.classList.add("active");
    }
  });
}

function setButtonLoading(button, isLoading, loadingText, idleText) {
  if (!button) return;

  button.disabled = isLoading;
  button.textContent = isLoading ? loadingText : idleText;
}

function setCount(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = String(value ?? 0);
}


function complaintStudentKey(record = {}) {
  return safeText(record.studentUid)
    || safeText(record.studentId)
    || safeText(record.studentEmail).toLowerCase()
    || `complaint:${safeText(record.id || record.complaintRef)}`;
}

function complaintProgram(record = {}) {
  return safeText(
    record.studentProgram
      || record.program
      || record.studentDepartment
      || record.course
      || record.department
      || record.collegeDepartment,
    "Program not specified"
  );
}

function pluralizeComplaint(count) {
  return `${count} complaint${count === 1 ? "" : "s"}`;
}

function renderComplaintAnalytics() {
  const source = analyticsComplaints.length ? analyticsComplaints : complaintsCache;
  const normalized = source.map(normalizeComplaintRecord);
  const allStudents = new Set(normalized.map(complaintStudentKey).filter(Boolean));
  const classificationStats = new Map(COMPLAINT_CLASSIFICATIONS.map((level) => [level, { complaints: 0, students: new Set() }]));
  const programs = new Map();
  let pendingClassification = 0;

  normalized.forEach((item) => {
    const classification = complaintClassificationForRecord(item);
    const studentKey = complaintStudentKey(item);
    if (classificationStats.has(classification)) {
      const bucket = classificationStats.get(classification);
      bucket.complaints += 1;
      if (studentKey) bucket.students.add(studentKey);
    } else {
      pendingClassification += 1;
    }

    const program = complaintProgram(item);
    programs.set(program, (programs.get(program) || 0) + 1);
  });

  const studentLevel = classificationStats.get("Student Level");
  const administrativeLevel = classificationStats.get("Administrative Level");
  const crisisLevel = classificationStats.get("Crisis Level");

  setCount("analyticsUniqueStudents", allStudents.size);
  const totalEl = document.getElementById("analyticsTotalComplaints");
  if (totalEl) totalEl.textContent = pluralizeComplaint(normalized.length).replace(/^/, "").replace(" complaint", " total complaint");
  setCount("analyticsStudentLevelStudents", studentLevel.students.size);
  setCount("analyticsAdministrativeStudents", administrativeLevel.students.size);
  setCount("analyticsCrisisStudents", crisisLevel.students.size);

  const studentCases = document.getElementById("analyticsStudentLevelComplaints");
  const adminCases = document.getElementById("analyticsAdministrativeComplaints");
  const crisisCases = document.getElementById("analyticsCrisisComplaints");
  if (studentCases) studentCases.textContent = pluralizeComplaint(studentLevel.complaints);
  if (adminCases) adminCases.textContent = pluralizeComplaint(administrativeLevel.complaints);
  if (crisisCases) crisisCases.textContent = pluralizeComplaint(crisisLevel.complaints);

  const pending = document.getElementById("analyticsPendingClassification");
  if (pending) pending.textContent = `${pendingClassification} pending classification${pendingClassification === 1 ? "" : "s"}`;

  const host = document.getElementById("programAnalyticsList");
  if (!host) return;
  const sortedPrograms = [...programs.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  if (!sortedPrograms.length) {
    host.innerHTML = '<div class="program-analytics-empty">No complaint records are available yet.</div>';
    return;
  }

  const maxCount = Math.max(...sortedPrograms.map(([, count]) => count), 1);
  host.innerHTML = sortedPrograms.map(([program, count], index) => {
    const share = normalized.length ? (count / normalized.length) * 100 : 0;
    const width = Math.max(6, (count / maxCount) * 100);
    return `
      <div class="program-analytics-row">
        <div class="program-analytics-rank">${index + 1}</div>
        <div class="program-analytics-main">
          <div class="program-analytics-label"><strong>${escapeHtml(program)}</strong><span>${count} complaint${count === 1 ? "" : "s"} · ${share.toFixed(1)}%</span></div>
          <div class="program-analytics-track"><i style="width:${width.toFixed(2)}%"></i></div>
        </div>
        <strong class="program-analytics-count">${count}</strong>
      </div>`;
  }).join("");
}

function bindComplaintAnalytics() {
  onSnapshot(
    collection(db, "complaints"),
    (snapshot) => {
      analyticsComplaints = snapshot.docs.map((docSnap) => normalizeComplaintRecord({ id: docSnap.id, ...docSnap.data() }));
      renderComplaintAnalytics();
    },
    (error) => {
      console.warn("Complaint analytics listener unavailable:", error);
      analyticsComplaints = [];
      renderComplaintAnalytics();
    }
  );
}

async function refreshComplaintCounts() {
  try {
    const base = collection(db, "complaints");
    const [submitted, review, progress, resolved] = await Promise.all([
      getCountFromServer(query(base, where("status", "==", "Submitted"))),
      getCountFromServer(query(base, where("status", "==", "Under Review"))),
      getCountFromServer(query(base, where("status", "==", "In Progress"))),
      getCountFromServer(query(base, where("status", "in", ["Resolved", "Closed"])))
    ]);
    setCount("submittedCount", submitted.data().count);
    setCount("reviewCount", review.data().count);
    setCount("progressCount", progress.data().count);
    setCount("resolvedCount", resolved.data().count);
  } catch (error) {
    console.warn("Complaint aggregate counts unavailable:", error);
    // The visible page still receives a local count fallback.
    setCount("submittedCount", complaintsCache.filter((c) => c.status === "Submitted").length);
    setCount("reviewCount", complaintsCache.filter((c) => c.status === "Under Review").length);
    setCount("progressCount", complaintsCache.filter((c) => c.status === "In Progress").length);
    setCount("resolvedCount", complaintsCache.filter((c) => ["Resolved", "Closed"].includes(c.status)).length);
  }
}

function scheduleCountRefresh() {
  clearTimeout(countRefreshTimer);
  countRefreshTimer = setTimeout(refreshComplaintCounts, 650);
}

function mergeComplaintPages() {
  const byId = new Map();
  [...liveComplaints, ...olderComplaints].forEach((item) => byId.set(item.id, item));
  complaintsCache = Array.from(byId.values()).sort((a, b) => {
    const toMs = (value) => value?.toMillis?.() || value?.toDate?.()?.getTime?.() || new Date(value || 0).getTime() || 0;
    return toMs(b.createdAt || b.updatedAt) - toMs(a.createdAt || a.updatedAt);
  });
  if (complaintInboxScope) {
    complaintInboxScope.textContent = `Showing ${complaintsCache.length} loaded complaint${complaintsCache.length === 1 ? "" : "s"}. Newest records update live.`;
  }
  if (!analyticsComplaints.length) renderComplaintAnalytics();
}

function renderInbox() {
  if (!inboxContainer) return;

  if (!complaintsCache.length) {
    inboxContainer.innerHTML = `
      <div class="note-box" style="margin-top:0;">
        <strong>No complaints yet</strong>
        <p>Student submissions will appear here automatically.</p>
      </div>
    `;
    return;
  }

  inboxContainer.innerHTML = complaintsCache
    .map((item) => {
      const badgeClass = getBadgeClass(item.status);
      const isSelected = item.id === selectedComplaintId ? " is-selected" : "";
      const lastUpdate = formatDate(item.updatedAt || item.createdAt);
      const anonymousLabel = getAnonymousComplainantLabel();

      return `
        <button class="list-item complaint-list-item${isSelected}" type="button" onclick="selectComplaint('${item.id}')">
          <span class="complaint-item-icon"><i class="fa-regular fa-message"></i></span>
          <div class="complaint-item-content"><div class="item-top">
            <div>
              <div class="item-title">${escapeHtml(safeText(item.subject, "Untitled Complaint"))}</div>
              <div class="item-meta">
                Ref: ${escapeHtml(safeText(item.complaintRef, item.id))}<br>
                Category: ${escapeHtml(safeText(item.category, "-"))}<br>
                <span class="complaint-classification-badge ${classificationClass(item.classification)}">${escapeHtml(normalizeClassification(item.classification) || "Pending Classification")}</span><br>
                Complainant: ${escapeHtml(anonymousLabel)}
              </div>
            </div>
            <div class="badge ${badgeClass}">${escapeHtml(safeText(item.status, "Submitted"))}</div>
          </div>
          <div class="case-meta-inline">
            <span><i class="fa-regular fa-calendar"></i> Submitted: ${escapeHtml(formatDate(item.createdAt))}</span>
            <span><i class="fa-solid fa-clock-rotate-left"></i> Last update: ${escapeHtml(lastUpdate)}</span>
          </div></div>
          <i class="fa-solid fa-chevron-right complaint-item-chevron" aria-hidden="true"></i>
        </button>
      `;
    })
    .join("");
}

function renderThread(selected) {
  if (!complaintThread) return;

  const threadEntries = Array.isArray(selected.thread) ? selected.thread : [];

  if (!threadEntries.length) {
    complaintThread.innerHTML = `
      <div class="note-box" style="margin-top:0;">
        <strong>No USC feedback yet</strong>
        <p>Official USC feedback and review updates will appear here after the complaint is assessed.</p>
      </div>
    `;
    return;
  }

  complaintThread.innerHTML = threadEntries
    .map((entry) => {
      const rawAuthor = safeText(entry.by, "System");
      const displayAuthor = rawAuthor === "Student" ? "Anonymous Student" : rawAuthor === "Officer" ? "USC Feedback" : rawAuthor;
      const msgClass =
        rawAuthor === "Officer"
          ? "officer"
          : rawAuthor === "Student"
            ? "student"
            : "system";

      return `
        <div class="msg ${msgClass}">
          <div class="msg-head">
            <strong>${escapeHtml(displayAuthor)}</strong>
            <small>${escapeHtml(formatDate(entry.at))}</small>
          </div>
          <div class="msg-body">${escapeHtml(safeText(entry.message, ""))}</div>
        </div>
      `;
    })
    .join("");
}



async function renderAttachmentPreview(selected) {
  if (!detailAttachmentPreview) return;
  const token = ++attachmentPreviewToken;
  if (attachmentPreviewUrl) {
    URL.revokeObjectURL(attachmentPreviewUrl);
    attachmentPreviewUrl = "";
  }

  const meta = complaintAttachmentMeta(selected);
  if (!meta.path && !meta.directUrl && !safeText(selected?.attachmentName || selected?.fileName)) {
    detailAttachmentPreview.innerHTML = '<div class="attachment-empty">No attachment submitted.</div>';
    return;
  }

  detailAttachmentPreview.innerHTML = `<div class="attachment-loading"><i class="fa-solid fa-spinner fa-spin"></i> Loading ${escapeHtml(meta.name)}…</div>`;
  try {
    const loaded = await loadComplaintAttachmentBlob({ ...selected, id: selected.id });
    if (token !== attachmentPreviewToken) return;
    attachmentPreviewUrl = URL.createObjectURL(loaded.blob);

    if (isImageAttachment(loaded.meta)) {
      detailAttachmentPreview.innerHTML = `
        <figure class="admin-attachment-card admin-image-display">
          <img src="${attachmentPreviewUrl}" alt="Complaint attachment: ${escapeHtml(loaded.meta.name)}">
          <figcaption>
            <strong>${escapeHtml(loaded.meta.name)}</strong>
            <small>${escapeHtml(loaded.meta.type || "Image attachment")}</small>
            <button type="button" class="mini-btn light" data-download-complaint-attachment><i class="fa-solid fa-download"></i> Download image</button>
          </figcaption>
        </figure>`;
    } else {
      detailAttachmentPreview.innerHTML = `
        <div class="admin-attachment-card">
          <i class="fa-solid fa-file-arrow-down"></i>
          <div>
            <strong>${escapeHtml(loaded.meta.name)}</strong>
            <small>${escapeHtml(loaded.meta.type || "Document attachment")}</small>
            <div class="attachment-actions">
              <a class="mini-btn light" href="${attachmentPreviewUrl}" target="_blank" rel="noopener noreferrer"><i class="fa-solid fa-up-right-from-square"></i> Open document</a>
              <button type="button" class="mini-btn light" data-download-complaint-attachment><i class="fa-solid fa-download"></i> Download</button>
            </div>
          </div>
        </div>`;
    }

    detailAttachmentPreview.querySelector('[data-download-complaint-attachment]')?.addEventListener('click', () => {
      downloadBlob(loaded.blob, loaded.meta.name);
    });
  } catch (error) {
    if (token !== attachmentPreviewToken) return;
    console.error("Complaint attachment preview failed:", error);
    const legacy = meta.bucket && meta.bucket !== "firestore-chunks";
    detailAttachmentPreview.innerHTML = `
      <div class="admin-attachment-card attachment-unavailable">
        <i class="fa-solid fa-triangle-exclamation"></i>
        <div>
          <strong>${escapeHtml(meta.name)}</strong>
          <small>${legacy
            ? "This older attachment uses the previous private-backend storage format. New complaint attachments open directly in this browser-only capstone version."
            : "The attachment could not be reconstructed. Ask the student to submit the file again if necessary."}
          </small>
        </div>
      </div>`;
  }
}


function renderDetails() {
  const selected = getSelectedComplaint();

  if (!selected) {
    if (emptyState) emptyState.style.display = "block";
    if (detailPanel) detailPanel.style.display = "none";
    if (deleteComplaintBtn) deleteComplaintBtn.hidden = true;
    updateStatusFlow("Submitted");
    return;
  }

  if (emptyState) emptyState.style.display = "none";
  if (detailPanel) detailPanel.style.display = "block";

  if (detailReference) detailReference.value = safeText(selected.complaintRef, selected.id);
  if (detailStatus) detailStatus.value = safeText(selected.status, "Submitted");
  syncClassificationUI(selected.classification);
  if (detailCategory) detailCategory.value = safeText(selected.category);
  if (detailStudent) detailStudent.value = getAnonymousComplainantLabel();
  if (detailSubject) detailSubject.value = safeText(selected.subject);
  if (detailComplaintText) detailComplaintText.value = safeText(selected.details);

  void renderAttachmentPreview(selected);
  renderThread(selected);
  updateStatusFlow(selected.status);

  if (deleteComplaintBtn) {
    const deletable = ["Resolved", "Closed"].includes(safeText(selected.status));
    deleteComplaintBtn.hidden = !deletable;
    deleteComplaintBtn.textContent = safeText(selected.status) === "Closed" ? "Delete Closed Case" : "Delete Resolved Case";
  }
}

const complaintsQuery = query(
  collection(db, "complaints"),
  orderBy("createdAt", "desc"),
  limit(LIVE_PAGE_SIZE)
);

onSnapshot(
  complaintsQuery,
  (snapshot) => {
    liveComplaints = snapshot.docs.map((docSnap) => normalizeComplaintRecord({ id: docSnap.id, ...docSnap.data() }));
    if (!olderComplaints.length) {
      paginationCursor = snapshot.docs.at(-1) || null;
      hasMoreOlderComplaints = snapshot.docs.length === LIVE_PAGE_SIZE;
    }
    mergeComplaintPages();

    if (!selectedComplaintId && complaintsCache.length) {
      selectedComplaintId = complaintsCache[0].id;
    } else if (selectedComplaintId && !complaintsCache.some((item) => item.id === selectedComplaintId)) {
      selectedComplaintId = complaintsCache.length ? complaintsCache[0].id : null;
    }

    renderInbox();
    renderDetails();
    scheduleCountRefresh();
    if (loadOlderComplaintsBtn) {
      loadOlderComplaintsBtn.disabled = !hasMoreOlderComplaints;
      loadOlderComplaintsBtn.textContent = hasMoreOlderComplaints ? "Load Older" : "All Loaded";
    }
  },
  (error) => {
    console.error("Complaint listener error:", error);
  }
);

loadOlderComplaintsBtn?.addEventListener("click", async () => {
  if (!paginationCursor || !hasMoreOlderComplaints || loadOlderComplaintsBtn.disabled) return;
  loadOlderComplaintsBtn.disabled = true;
  loadOlderComplaintsBtn.textContent = "Loading…";
  try {
    const olderQuery = query(
      collection(db, "complaints"),
      orderBy("createdAt", "desc"),
      startAfter(paginationCursor),
      limit(LIVE_PAGE_SIZE)
    );
    const snapshot = await getDocs(olderQuery);
    const page = snapshot.docs.map((docSnap) => normalizeComplaintRecord({ id: docSnap.id, ...docSnap.data() }));
    olderComplaints.push(...page);
    paginationCursor = snapshot.docs.at(-1) || paginationCursor;
    hasMoreOlderComplaints = snapshot.docs.length === LIVE_PAGE_SIZE;
    mergeComplaintPages();
    renderInbox();
    renderDetails();
  } catch (error) {
    console.error("Unable to load older complaints:", error);
    alert("Unable to load older complaints right now. Please try again.");
  } finally {
    loadOlderComplaintsBtn.disabled = !hasMoreOlderComplaints;
    loadOlderComplaintsBtn.textContent = hasMoreOlderComplaints ? "Load Older" : "All Loaded";
  }
});

bindComplaintAnalytics();
refreshComplaintCounts();
setInterval(refreshComplaintCounts, 30000);

if (detailStatus) {
  detailStatus.addEventListener("change", () => {
    updateStatusFlow(detailStatus.value);
  });
}

if (detailClassification) {
  detailClassification.addEventListener("change", () => {
    syncClassificationUI(detailClassification.value);
  });
}

if (updateStatusBtn) {
  updateStatusBtn.addEventListener("click", async () => {
    const selected = getSelectedComplaint();
    if (!selected || !detailStatus || !detailClassification) return;

    const nextStatus = safeText(detailStatus.value, "Submitted");
    const previousStatus = safeText(selected.status, "Submitted");
    const nextClassification = normalizeClassification(detailClassification.value);
    const previousClassification = normalizeClassification(selected.classification);

    if (previousClassification && !nextClassification) {
      alert("An assigned classification cannot be cleared. Select the correct classification level instead.");
      syncClassificationUI(previousClassification);
      return;
    }

    if (["In Progress", "Resolved", "Closed"].includes(nextStatus) && !nextClassification) {
      alert("Assign a classification level before moving this complaint beyond review.");
      detailClassification.focus();
      return;
    }

    if (nextStatus === previousStatus && nextClassification === previousClassification) {
      alert("No review changes to save.");
      return;
    }

    setButtonLoading(updateStatusBtn, true, "Saving...", "Save Review");

    try {
      await callSecure("updateComplaintCase", {
        complaintId: selected.id,
        complaintRef: safeText(selected.complaintRef, selected.id),
        previousStatus,
        previousClassification,
        status: nextStatus,
        classification: nextClassification
      });
      alert(nextClassification
        ? `Review saved as ${nextClassification}.`
        : "Complaint review status saved.");
    } catch (error) {
      console.error("Error saving complaint review:", error);
      alert(error?.message || "Failed to save the complaint review.");
      updateStatusFlow(previousStatus);
      syncClassificationUI(previousClassification);
    } finally {
      setButtonLoading(updateStatusBtn, false, "Saving...", "Save Review");
    }
  });
}

if (deleteComplaintBtn) {
  deleteComplaintBtn.addEventListener("click", async () => {
    const selected = getSelectedComplaint();
    if (!selected) return;

    const status = safeText(selected.status, "Submitted");
    if (!["Resolved", "Closed"].includes(status)) {
      alert("Only complaints that are already Resolved or Closed can be deleted.");
      return;
    }

    const complaintRef = safeText(selected.complaintRef, selected.id);
    const confirmed = confirm(`Permanently delete complaint ${complaintRef}?\n\nThis will remove the complaint record and its stored attachment. This action cannot be undone.`);
    if (!confirmed) return;

    setButtonLoading(deleteComplaintBtn, true, "Deleting...", status === "Closed" ? "Delete Closed Case" : "Delete Resolved Case");

    try {
      await callSecure("deleteComplaintCase", { complaintId: selected.id });

      selectedComplaintId = null;
      liveComplaints = liveComplaints.filter((item) => item.id !== selected.id);
      olderComplaints = olderComplaints.filter((item) => item.id !== selected.id);
      mergeComplaintPages();
      if (complaintsCache.length) selectedComplaintId = complaintsCache[0].id;
      renderInbox();
      renderDetails();
      scheduleCountRefresh();
      alert("Complaint deleted permanently.");
    } catch (error) {
      console.error("Error deleting complaint:", error);
      alert(error?.message || "Failed to delete the complaint.");
    } finally {
      setButtonLoading(deleteComplaintBtn, false, "Deleting...", status === "Closed" ? "Delete Closed Case" : "Delete Resolved Case");
    }
  });
}

if (sendReplyBtn) {
  sendReplyBtn.addEventListener("click", async () => {
    const selected = getSelectedComplaint();
    if (!selected || !detailReply || !detailStatus || !detailClassification) return;

    const feedbackText = detailReply.value.trim();
    const classification = normalizeClassification(detailClassification.value);

    if (!feedbackText) {
      alert("Please type the USC feedback first.");
      return;
    }
    if (!classification) {
      alert("Assign the complaint classification before sending USC feedback.");
      detailClassification.focus();
      return;
    }

    let nextStatus = safeText(detailStatus.value, selected.status || "Under Review");
    if (nextStatus === "Submitted") {
      nextStatus = "Under Review";
      detailStatus.value = nextStatus;
      updateStatusFlow(nextStatus);
    }

    setButtonLoading(sendReplyBtn, true, "Sending...", "Send Feedback");

    try {
      await callSecure("updateComplaintCase", {
        complaintId: selected.id,
        complaintRef: safeText(selected.complaintRef, selected.id),
        previousStatus: safeText(selected.status, "Submitted"),
        previousClassification: complaintClassificationForRecord(selected),
        status: nextStatus,
        classification,
        feedback: feedbackText
      });
      detailReply.value = "";
      alert("USC feedback sent. The student can now view it in their Tracklist.");
    } catch (error) {
      console.error("Error sending USC feedback:", error);
      alert(error?.message || "Failed to send USC feedback.");
    } finally {
      setButtonLoading(sendReplyBtn, false, "Sending...", "Send Feedback");
    }
  });
}



document.getElementById("openComplaintInboxBtn")?.addEventListener("click", () => {
  document.getElementById("complaintInbox")?.scrollIntoView({ behavior: "smooth", block: "start" });
});
