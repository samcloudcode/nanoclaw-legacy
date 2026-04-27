---
name: lifeos-quality
description: Validate that Life OS goals and actions are well-defined and properly linked. Use when creating goals/actions in bulk, when user asks to "check" or "review" their goals/actions, or when a goal/action seems unclear during creation. Goals should be clear outcomes, actions should be single concrete steps (not multi-step projects), and actions should link to relevant goals.
---

# Life OS Quality Check

Ensure goals and actions are clear, actionable, and properly linked without over-engineering.

## Core Principles

1. **Preserve user intent** — Keep their original language and framing. Don't add details they didn't specify.
2. **Clear outcomes** — Goals should state what success looks like, not vague aspirations.
3. **Single steps** — Actions should be one concrete next step, not a multi-step project.
4. **Proper linking** — Actions should link to the most specific relevant goal.
5. **Don't overdo it** — Only flag actual clarity issues, not stylistic preferences.

## Quality Checks

### For Goals

**✅ Good goal:**
- Clear outcome: "Complete annual health checkup"
- Specific target: "Launch fitness app with Henrik"
- Measurable: "10 friends using LifeOS + NanoClaw"

**❌ Needs improvement:**
- Too vague: "Be healthier" → What does success look like?
- Multi-part: "Plan trip and book flights and find hotel" → Break into sub-goals or actions
- Missing outcome: "Working on app" → What's the deliverable?

**Fix:** Ask user to clarify the outcome, or suggest a specific interpretation if obvious.

### For Actions

**✅ Good action:**
- Single step: "Message April to check healthcare budget"
- Concrete: "Buy ticket to Day Zero event"
- Clear verb: "Research clinics for annual checkup"

**❌ Needs improvement:**
- Multi-step: "Plan and execute boat trip" → Break down: 1) Decide dates, 2) Provision food, 3) Book slip
- Vague: "Deal with email" → What specifically? Reply to X? Clear inbox? Archive old threads?
- Too big: "Build fitness app" → That's a goal with many actions, not one action

**Fix:**
- If obvious next step: Suggest breaking into 2-3 concrete actions
- If unclear: Ask user what the actual first step is

### For Action Metadata

Check that metadata fields accurately reflect the action:

**Effort Estimate (realistic time):**
- 5 min: Quick email, WhatsApp message, simple lookup
- 15 min: Quick task (make a call, fill simple form)
- 30 min: Moderate task (research, draft document)
- 60 min: Substantial work (detailed planning, complex task)
- 120+ min: Major effort, multi-part work

**Energy Level:**
- **low**: Routine/mechanical (send message, check status, make booking)
- **medium**: Needs some focus (research, review document, organize)
- **high**: Deep work, difficult decision, creative thinking, complex problem

**Context (communication channel/medium):**
- **whatsapp**: Friends, family, casual contacts
- **email**: Clients, formal communication, PAM external
- **teams**: Internal PAM colleagues, work chat
- **admin**: Paperwork, forms, scheduling, organizing
- **development**: Coding, building features
- **research**: Investigation, learning, comparison
- **web**: Browser tasks, online services
- **buy**: Purchasing items
- **call**: Phone conversations
- **meeting**: In-person or scheduled video calls

**Labels (user-created tags):**
- **PAM**: Client work, fund management, trading
- **home**: House maintenance, household tasks
- **admin**: General administrative tasks
- **fitness**: Training, exercise, health tracking

**Decision framework for context:**
1. Is it communication? → whatsapp (friends/family), email (clients), teams (colleagues)
2. Is it coding? → development
3. Is it learning/comparing? → research
4. Is it purchasing? → buy
5. Is it paperwork/scheduling? → admin
6. Default: Match the primary activity

**Common metadata errors:**
- 5min task marked as 60min → Fix effort estimate
- "Send quick message" marked high energy → Should be low
- "Message friend" with context=email → Should be whatsapp
- PAM client work without PAM label → Add label
- Home repair without home label → Add label

### For Linking

**Check:**
1. Is action linked to a goal?
2. Is it linked to the *most specific* relevant goal (not a high-level parent)?
3. Does the action actually support that goal?

**Common issues:**
- Orphan actions (no goal link) → Find or create appropriate goal
- Linked to wrong goal → Relink to correct one
- Linked to parent when child goal exists → Link to the more specific goal

## Workflow

### When creating goals/actions in bulk

As you create each item:
1. **Goals:** Check if outcome is clear. If vague, note it and ask user for clarification after batch creation.
2. **Actions:** Check if single-step and concrete. If multi-step, break down immediately. If vague, ask for clarification.
3. **Linking:** Link to most specific relevant goal.

### When reviewing existing items

Query Life OS database:

```bash
psql "$DATABASE_URL" -t <<SQL
-- Get actions with their goal links
SELECT a.id, a.title,
  string_agg(DISTINCT g.title, ' | ') as goals
FROM action a
LEFT JOIN entity_link el ON a.id::text = el.source_id::text
  AND el.source_type = 'action' AND el.relation_type = 'supports'
LEFT JOIN goal g ON el.target_id::text = g.id::text
WHERE a.user_id = '$USER_ID' AND a.status = 'active' AND a.deleted_at IS NULL
GROUP BY a.id
ORDER BY a.title;
SQL
```

Scan for:
- Actions that seem multi-step (words like "and", "then", commas separating tasks)
- Actions with vague verbs ("deal with", "handle", "sort out")
- Actions with no goal link (goals column is empty)
- Actions linked to multiple goals (usually means unclear scope)

### Output format

**If issues found:**

Present as a simple list:

```
Found 3 clarity issues:

*Goals:*
1. "Be healthier" — What specific outcome? (e.g., "Achieve X body composition" or "Complete annual checkup")

*Actions:*
2. "Plan and execute boat trip with Brittany" — Multi-step. Break down?
   Suggested:
   - Decide dates for boat trip with Brittany
   - Provision food and supplies for boat trip
   - Book marina slip for weekend

3. "Send email" — Which email? To whom? About what?

*Linking:*
4. "Message April about healthcare budget" — Not linked to any goal. Should link to "Complete annual health checkup"
```

**If no issues:**

```
✓ All goals and actions look clear and well-linked.
```

## Decision Framework

**When in doubt:**
- **Goals:** If you can't picture what "done" looks like → flag it
- **Actions:** If you can't do it in one sitting without switching contexts → suggest breaking down
- **Linking:** If an action doesn't clearly support the linked goal → flag it

**When NOT to flag:**
- Stylistic differences (their phrasing vs yours)
- Different level of detail than you'd prefer
- Minor ambiguity that doesn't affect actionability

## Examples

### Good (no changes needed)

**Goal:** "Complete annual health checkup"
**Actions:**
- Message April to check healthcare budget
- Find clinic for annual checkup
- Schedule and complete checkup

*Why good:* Goal is clear outcome, actions are single concrete steps, properly linked.

### Needs improvement

**Goal:** "Fitness stuff"
**Actions:**
- Plan week and book gym and do workout

*Issues:*
1. Goal too vague — "fitness stuff" doesn't specify outcome
2. Action is multi-step — "plan AND book AND do" are 3 separate actions

*Suggested fix:*
- Clarify goal: "Establish consistent gym routine" or "Complete 12 workouts this month"
- Break action into:
  - Plan this week's gym sessions
  - Book gym slot for Monday
  - Complete Monday workout

### Borderline (use judgment)

**Action:** "Follow up with John about project"

*Could be fine if:* You know which project, "follow up" is clear in context
*Flag if:* Unclear which project, or what specific follow-up is needed

**Rule of thumb:** If user could look at it tomorrow and know exactly what to do → it's fine.

## Integration with lifeos-db skill

This skill validates quality. The lifeos-db skill handles database operations. Use them together:

1. User asks to create goals/actions → Use lifeos-db to create them
2. During creation → Apply this skill's checks
3. After creation → Optionally run quality review if batch was large

Don't duplicate database logic here. This skill is purely about clarity validation.
