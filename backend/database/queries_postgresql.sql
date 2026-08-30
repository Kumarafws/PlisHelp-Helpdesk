-- ==============================================================================
-- PLISHELP IT HELPDESK - POSTGRESQL 15+ ADVANCED QUERIES & ANALYTICS GUIDE
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. DASHBOARD & SUMMARY METRICS QUERIES
-- ------------------------------------------------------------------------------

-- 1.1 Overview Summary Count (Total, Open, In Progress, Need Info, Escalated, Resolved, Closed)
SELECT
    COUNT(*) AS total_tickets,
    COUNT(*) FILTER (WHERE status = 'OPEN') AS open_count,
    COUNT(*) FILTER (WHERE status = 'IN_PROGRESS') AS in_progress_count,
    COUNT(*) FILTER (WHERE status = 'NEED_INFO') AS need_info_count,
    COUNT(*) FILTER (WHERE status = 'ESCALATED') AS escalated_count,
    COUNT(*) FILTER (WHERE status = 'RESOLVED') AS resolved_count,
    COUNT(*) FILTER (WHERE status = 'CLOSED') AS closed_count,
    COUNT(*) FILTER (WHERE status NOT IN ('RESOLVED', 'CLOSED') AND sla_due_at < NOW()) AS breached_count
FROM tickets
WHERE deleted_at IS NULL;

-- 1.2 IT Support Specific Dashboard Metrics
-- (Ganti :technician_id dengan ID teknisi yang sedang login)
SELECT
    COUNT(*) FILTER (WHERE assignee_id = 2 AND status NOT IN ('RESOLVED', 'CLOSED')) AS my_active_tickets,
    COUNT(*) FILTER (WHERE assignee_id IS NULL AND status = 'OPEN') AS available_in_queue,
    COUNT(*) FILTER (WHERE assignee_id = 2 AND status = 'RESOLVED') AS my_resolved_tickets,
    COUNT(*) FILTER (WHERE assignee_id = 2 AND status NOT IN ('RESOLVED', 'CLOSED') AND sla_due_at < NOW()) AS my_breached_tickets
FROM tickets
WHERE deleted_at IS NULL;


-- ------------------------------------------------------------------------------
-- 2. SLA PERFORMANCE & REAL-TIME SLA STATUS TRACKING
-- ------------------------------------------------------------------------------

-- 2.1 Calculate Remaining SLA Time and Dynamic SLA Breach Flag
SELECT
    t.id,
    t.number,
    t.title,
    t.priority,
    t.status,
    u.name AS assignee_name,
    t.sla_due_at,
    CASE 
        WHEN t.status IN ('RESOLVED', 'CLOSED') THEN 'RESOLVED'
        WHEN t.status = 'NEED_INFO' THEN 'PAUSED'
        WHEN t.sla_due_at < NOW() THEN 'BREACHED'
        WHEN t.sla_due_at <= NOW() + INTERVAL '1 hour' THEN 'NEAR_BREACH'
        ELSE 'WITHIN_SLA'
    END AS dynamic_sla_status,
    CASE 
        WHEN t.sla_due_at > NOW() THEN 
            CONCAT(
                LPAD(FLOOR(EXTRACT(EPOCH FROM (t.sla_due_at - NOW())) / 3600)::TEXT, 2, '0'), 'h ',
                LPAD(FLOOR((EXTRACT(EPOCH FROM (t.sla_due_at - NOW())) % 3600) / 60)::TEXT, 2, '0'), 'm'
            )
        ELSE '00h 00m'
    END AS remaining_time_formatted
FROM tickets t
LEFT JOIN users u ON t.assignee_id = u.id
WHERE t.deleted_at IS NULL
ORDER BY t.sla_due_at ASC;


-- ------------------------------------------------------------------------------
-- 3. RESOLVER (IT SUPPORT) PERFORMANCE & KPI AGGREGATION
-- ------------------------------------------------------------------------------

-- 3.1 Ranking & KPI IT Support Staff
SELECT
    u.id AS technician_id,
    u.name AS technician_name,
    u.email,
    COUNT(t.id) AS total_assigned,
    COUNT(t.id) FILTER (WHERE t.status = 'RESOLVED' OR t.status = 'CLOSED') AS total_resolved,
    COUNT(t.id) FILTER (WHERE t.status NOT IN ('RESOLVED', 'CLOSED')) AS currently_handling,
    ROUND(
        AVG(EXTRACT(EPOCH FROM (t.first_response_at - t.created_at)) / 60)::NUMERIC, 
        1
    ) AS avg_first_response_minutes,
    ROUND(
        AVG(EXTRACT(EPOCH FROM (t.resolved_at - t.created_at)) / 3600)::NUMERIC, 
        1
    ) AS avg_resolution_hours,
    ROUND(AVG(tr.score)::NUMERIC, 2) AS avg_customer_rating,
    COUNT(tr.id) AS total_ratings_received
FROM users u
LEFT JOIN tickets t ON t.assignee_id = u.id AND t.deleted_at IS NULL
LEFT JOIN ticket_ratings tr ON tr.ticket_id = t.id
WHERE u.role = 'IT Support' AND u.status = 'ACTIVE'
GROUP BY u.id, u.name, u.email
ORDER BY total_resolved DESC, avg_customer_rating DESC;


-- ------------------------------------------------------------------------------
-- 4. DEPARTMENT & CATEGORY DISTRIBUTION (REPORTING)
-- ------------------------------------------------------------------------------

-- 4.1 Tickets Breakdown per Department
SELECT
    d.id,
    d.name AS department_name,
    d.code AS department_code,
    COUNT(t.id) AS total_tickets,
    COUNT(t.id) FILTER (WHERE t.status IN ('OPEN', 'IN_PROGRESS', 'NEED_INFO', 'ESCALATED')) AS active_tickets,
    COUNT(t.id) FILTER (WHERE t.status IN ('RESOLVED', 'CLOSED')) AS resolved_tickets,
    ROUND((COUNT(t.id)::NUMERIC / NULLIF((SELECT COUNT(*) FROM tickets WHERE deleted_at IS NULL), 0) * 100), 1) AS percentage_of_total
FROM departments d
LEFT JOIN tickets t ON t.department_id = d.id AND t.deleted_at IS NULL
GROUP BY d.id, d.name, d.code
ORDER BY total_tickets DESC;

-- 4.2 Top Issue Categories
SELECT
    c.name AS category_name,
    t.subcategory_name,
    COUNT(t.id) AS total_incidents,
    COUNT(t.id) FILTER (WHERE t.priority IN ('HIGH', 'CRITICAL')) AS high_priority_count
FROM categories c
JOIN tickets t ON t.category_id = c.id AND t.deleted_at IS NULL
GROUP BY c.name, t.subcategory_name
ORDER BY total_incidents DESC;


-- ------------------------------------------------------------------------------
-- 5. FULL-TEXT SEARCH (POSTGRESQL TSVECTOR & ILIKE)
-- ------------------------------------------------------------------------------

-- 5.1 Search Tickets by Number, Title, Description, Requester, or Department
-- (Ganti :search_query dengan kata kunci pencarian)
SELECT
    t.id,
    t.number,
    t.title,
    t.status,
    t.priority,
    t.created_at,
    u.name AS requester_name,
    d.name AS department_name
FROM tickets t
JOIN users u ON t.requester_id = u.id
JOIN departments d ON t.department_id = d.id
WHERE t.deleted_at IS NULL
  AND (
      t.number ILIKE '%wifi%'
      OR t.title ILIKE '%wifi%'
      OR t.description ILIKE '%wifi%'
      OR u.name ILIKE '%wifi%'
      OR d.name ILIKE '%wifi%'
  )
ORDER BY t.created_at DESC;


-- ------------------------------------------------------------------------------
-- 6. AUDIT TRAIL / ACTIVITY TIMELINE QUERY WITH JSONB
-- ------------------------------------------------------------------------------

-- 6.1 View Detailed Chronological Timeline for a Ticket
SELECT
    ta.id,
    ta.action,
    ta.actor_name,
    ta.actor_role,
    ta.note,
    ta.metadata,
    ta.created_at
FROM ticket_activities ta
WHERE ta.ticket_id = 1
ORDER BY ta.created_at ASC;
