export function serializeFacility(row) {
  return {
    id: row.id,
    name: row.name,
    district: row.district,
    area: row.area,
    type: row.type,
    departments: JSON.parse(row.departments)
  };
}

export function serializeReport(row) {
  return {
    id: row.id,
    facilityId: row.facility_id,
    department: row.department,
    visitType: row.visit_type,
    costMin: row.cost_min,
    costMax: row.cost_max,
    waitMinutes: row.wait_minutes,
    communicationRating: row.communication_rating,
    tags: JSON.parse(row.tags),
    outcome: row.outcome,
    text: row.body,
    status: row.status,
    rejectionReason: row.rejection_reason || null,
    verificationCount: row.verification_count || 0,
    createdAt: row.created_at,
    moderatedAt: row.moderated_at
  };
}
