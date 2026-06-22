-- Phase 3 seed: 8 visual questions (4 Abstract + 4 Spatial).
-- The figure + SVG option tiles are rendered in code (src/components/quiz/VisualQuestion.jsx),
-- keyed by `code`. The option_* text here is the accessible fallback / alt description.
-- Idempotent upsert on `code`.

insert into public.questions (code, category, difficulty, visual, prompt, option_a, option_b, option_c, option_d, correct_answer) values
('ABS-MAT-201','Abstract Reasoning',3,true,'Which option completes the pattern?','8 dots','9 dots','7 dots','6 dots','B'),
('ABS-MAT-202','Abstract Reasoning',4,true,'Which option completes the pattern?','Arrow up','Arrow right','Arrow down','Arrow left','A'),
('ABS-ANA-201','Abstract Reasoning',2,true,'The first pair shows a relationship. Which option completes the second pair?','Large square','Small square','Large circle','Large triangle','A'),
('ABS-CLS-201','Abstract Reasoning',3,true,'Which shape does not belong with the others?','Square','Triangle','Pentagon','Circle','D'),
('SPA-ROT-201','Spatial Reasoning',2,true,'Three of these are rotations of the figure above. Which one is a mirror image?','Rotated 90 degrees','Rotated 180 degrees','Mirror image','Rotated 270 degrees','C'),
('SPA-NET-201','Spatial Reasoning',3,true,'This net folds into a cube. Which symbol is on the face opposite the dot?','Triangle','Square','Plus','Diamond','B'),
('SPA-ASM-201','Spatial Reasoning',4,true,'Which piece completes the square?','Matching corner block','Right triangle','Small square','Circle','A'),
('SPA-FOLD-201','Spatial Reasoning',4,true,'A square sheet is folded into quarters, one hole is punched, then unfolded. How many holes are there?','2','3','4','8','C')
on conflict (code) do update set
  category=excluded.category, difficulty=excluded.difficulty, visual=excluded.visual, prompt=excluded.prompt,
  option_a=excluded.option_a, option_b=excluded.option_b, option_c=excluded.option_c, option_d=excluded.option_d,
  correct_answer=excluded.correct_answer;
