-- Phase 1 seed: 20 new text questions (brings live test to 25 total with the 5 originals).
-- Balanced 5 per category; difficulties ramp D2 -> D5 (delivery is ordered by id ascending).
-- Idempotent: upsert keyed on `code` so this can be re-run safely.
-- Categories match the live verbose names ("Verbal Reasoning", etc.).

insert into public.questions (code, category, difficulty, prompt, option_a, option_b, option_c, option_d, correct_answer) values
-- ── D2 ───────────────────────────────────────────────────────────────────────
('NUM-002','Numerical Reasoning',2,'What number comes next in the sequence: 3, 6, 12, 24, __?','30','36','48','42','C'),
('LOG-002','Logical Reasoning',2,'All roses are flowers. Some flowers fade quickly. Which conclusion is valid?','All roses fade quickly','Some roses fade quickly','No conclusion about roses fading can be drawn','Roses never fade','C'),
('SPA-002','Spatial Reasoning',2,'How many faces does a cube have?','4','6','8','12','B'),
-- ── D3 ───────────────────────────────────────────────────────────────────────
('VER-003','Verbal Reasoning',3,'Cartographer is to map as choreographer is to ___?','song','dance','stage','actor','B'),
('NUM-003','Numerical Reasoning',3,'What number comes next in the sequence: 1, 4, 9, 16, 25, __?','30','36','49','35','B'),
('LOG-003','Logical Reasoning',3,'If it rains, the match is cancelled. The match was not cancelled. Therefore:','It rained','It did not rain','The match was postponed','Cannot be determined','B'),
('SPA-003','Spatial Reasoning',3,'A flat cross made of six equal squares is folded along its edges. What solid does it form?','Pyramid','Cube','Cylinder','Cone','B'),
('ABS-101','Abstract Reasoning',3,'Which letter comes next: A, C, E, G, __?','H','I','J','K','B'),
('ABS-102','Abstract Reasoning',3,'Which number is the odd one out: 2, 3, 5, 9, 11, 13?','3','5','9','13','C'),
-- ── D4 ───────────────────────────────────────────────────────────────────────
('VER-004','Verbal Reasoning',4,'Which word is the odd one out?','Ephemeral','Transient','Fleeting','Perpetual','D'),
('NUM-004','Numerical Reasoning',4,'What number comes next in the sequence: 2, 6, 12, 20, 30, __?','40','42','44','36','B'),
('NUM-005','Numerical Reasoning',4,'If 3 painters paint 3 fences in 3 hours, how many painters are needed to paint 9 fences in 9 hours?','9','3','6','27','B'),
('LOG-004','Logical Reasoning',4,'In a race, Tom finished before Sara but after Raj. Lena finished before Raj. Who finished first?','Raj','Tom','Lena','Sara','C'),
('SPA-004','Spatial Reasoning',4,'On an analog clock showing exactly 3:00, what is the angle between the hour and minute hands?','90 degrees','180 degrees','45 degrees','120 degrees','A'),
('SPA-005','Spatial Reasoning',4,'You are facing North. You turn 90 degrees clockwise, then 180 degrees, then 90 degrees counterclockwise. Which direction are you now facing?','North','East','South','West','C'),
('ABS-103','Abstract Reasoning',4,'Which letter comes next: B, D, G, K, __?','O','P','N','Q','B'),
('ABS-104','Abstract Reasoning',4,'What number comes next in the sequence: 1, 1, 2, 3, 5, 8, __?','11','12','13','10','C'),
-- ── D5 ───────────────────────────────────────────────────────────────────────
('VER-005','Verbal Reasoning',5,'Obfuscate is to clarify as exacerbate is to ___?','worsen','alleviate','intensify','provoke','B'),
('LOG-005','Logical Reasoning',5,'Three boxes are labeled Apples, Oranges, and Mixed. Every label is wrong. You take one fruit from the box labeled Mixed and it is an apple. What does that box actually contain?','Apples','Oranges','A mix of apples and oranges','Cannot be determined','A'),
('ABS-105','Abstract Reasoning',5,'What number comes next in the sequence: 1, 2, 6, 24, 120, __?','600','720','840','480','B')
on conflict (code) do update set
  category       = excluded.category,
  difficulty     = excluded.difficulty,
  prompt         = excluded.prompt,
  option_a       = excluded.option_a,
  option_b       = excluded.option_b,
  option_c       = excluded.option_c,
  option_d       = excluded.option_d,
  correct_answer = excluded.correct_answer;
