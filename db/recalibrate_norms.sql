-- Recalibrate the active IQ norm from real completed sessions.
-- Run this periodically once enough traffic has accumulated (aim for a few hundred
-- completed sessions before trusting it). It recomputes meanP / sdP from the observed
-- difficulty-weighted proportion and writes a NEW active norm row (keeps history).
--
-- The client reads scoring_norms (active=true) and/or falls back to DEFAULT_NORM in
-- src/lib/iqScoring.js — keep those defaults roughly in sync with the latest active row.

with stats as (
  select
    avg(weighted_score::numeric / nullif(total_questions, 0))                as mean_p_raw,
    coalesce(stddev_samp(weighted_score::numeric / nullif(total_questions, 0)), 0.2) as sd_p_raw,
    count(*)                                                                 as n
  from public.test_sessions
  where status = 'completed'
    and weighted_score is not null
    and total_questions is not null
    and total_questions > 0
)
insert into public.scoring_norms (active, mean_p, sd_p, note)
select
  true,
  round(mean_p_raw, 4),
  round(greatest(sd_p_raw, 0.05), 4),   -- floor SD so a low-variance early sample can't explode IQs
  'Recalibrated from ' || n || ' completed sessions on ' || now()::date
from stats
where n >= 30;   -- guard: don't recalibrate on a tiny sample

-- Deactivate older norms so only the newest stays active.
update public.scoring_norms
set active = false
where id <> (select max(id) from public.scoring_norms);

-- NOTE: mean_p above uses weighted_score / total_questions as a proxy. If you store the
-- true max weighted denominator per session later, switch to weighted_score / max_weighted
-- for an exact proportion.
