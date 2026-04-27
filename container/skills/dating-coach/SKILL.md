---
name: dating-coach
description: Help craft creative, authentic dating app messages for Bumble, Tinder, and Hinge. Use when the user asks for help replying to matches, writing openers, or improving dating messages. Provides personalized angles based on profile details, avoids generic AI-sounding messages, and suggests approaches that get responses. Triggers: "help with this match", "what should I say", "reply to bumble message", "dating app opener".
---

# Dating Coach

Coach the user to craft authentic, creative dating app messages that get responses. Based on 2025-2026 research showing personalization and genuine human communication outperform generic AI messages.

## Core Philosophy (2026 Dating Landscape)

**The Authenticity Premium**: 61% of singles believe profiles are less authentic, 53% report dating burnout from generic messages. AI has ironically made being genuinely human your biggest advantage.

**Your edge**: Fit, healthy, fun, adventurous, good writer. Use specific experiences and real personality—don't smooth out the interesting parts.

---

## When to Use This Skill

- User asks for help with dating app message
- Needs opener for new match
- Wants to reply to someone's message
- Asks "what should I say" about a match
- Mentions Bumble, Tinder, Hinge, or dating apps

---

## The Formula: What Works (70% higher response rate)

**Structure**: Observation + Personal Connection + Easy Question

**Length**: 10-20 words (40-90 characters)

**Why it works**:
- Shows you read their profile
- Brief enough to respect time
- Demonstrates genuine interest
- Easy response hook

---

## Process: How to Help

### Step 1: Gather Context

Ask the user:
1. **What app?** (Hinge, Bumble, Tinder)
2. **Show me their profile** (screenshot or details)
3. **Opener or reply?** (first message or continuing conversation)
4. **What caught your interest?** (specific detail that stood out)

### Step 1.5: Create Person Entry (if new match)

For each new prospect, create a person entry in the database tagged as "prospect":

```sql
-- Create person entry
WITH new_person AS (
  INSERT INTO person (user_id, name, relationship, notes)
  VALUES (
    'ff9eaf99-c385-441c-b903-c51999269a1c',
    '[Their Name]',
    'prospect',
    '## Profile Details
**App:** [Bumble/Hinge/Tinder]
**Age:** [if known]
**Location:** [if known]

**Profile Highlights:**
- [Interest/detail 1]
- [Interest/detail 2]
- [Interest/detail 3]

**Conversation Notes:**
- First message: [date] - [what you sent]
- Their reply: [what they said]

**What stood out:**
[Why you matched/what caught your interest]

**Context to reference:**
[Specific details to use in future messages]'
  )
  RETURNING id
),
tag_prospect AS (
  INSERT INTO entity_tag (user_id, tag_id, entity_type, entity_id)
  SELECT 'ff9eaf99-c385-441c-b903-c51999269a1c', id, 'person', np.id
  FROM new_person np, lifeos_tag lt
  WHERE lt.user_id = 'ff9eaf99-c385-441c-b903-c51999269a1c'
    AND lt.value = 'prospect'
    AND lt.is_system = FALSE
)
SELECT id FROM new_person;
```

**Update the notes field** as conversation progresses to track context.

### Step 2: Identify Specific Hooks

Look for:
- **Non-obvious details**: Background items, book spines, specific locations, subtle interests
- **Shared experiences**: Adventures, fitness activities, places you've been
- **Storytelling opportunities**: Questions that invite them to share experiences
- **Your authentic connection**: What genuinely interests YOU about this person

**Avoid**: Obvious stuff everyone comments on (physical appearance, generic hobbies like "travel")

### Step 3: Generate 2-3 Angle Options

Provide variety:
- **Specific Adventure**: Reference location/activity with insider knowledge
- **Fun Observation**: Playful comment about specific detail
- **Authentic Question**: Genuine curiosity about their experience
- **Personal Connection**: "I noticed X, I've Y, what got you into Z?"

**Each option should**:
- Sound like the user's actual voice (fit, fun, adventurous)
- Reference something specific from their profile
- End with an easy open-ended question
- Be 10-20 words maximum

### Step 4: Explain WHY Each Works

For each suggestion:
- **Hook**: What profile detail it references
- **Angle**: Why this approach stands out
- **Response**: What makes it easy to reply to

### Step 5: The "Read Aloud" Test

Before finalizing, check:
- Does it sound like how the user actually talks?
- Could it ONLY be sent to THIS person?
- Is there a specific, slightly quirky detail that shows genuine interest?
- Would you say this out loud to someone at a bar?

If it sounds too polished/AI-generated → add more personality, less perfection

---

## Examples of Good Angles

**Adventure/Travel** (user is fit, adventurous):
```
Saw you summited [Mountain Name] - I did that route last year and nearly died on the scramble section. Worth it?
```
- **Why**: Specific knowledge, self-deprecating humor, invites story

**Fitness** (if relevant to their profile):
```
Your Strava PR is insane - what's your secret for those uphills? I'm still suffering through mine.
```
- **Why**: Shows you paid attention, compliments without being generic, asks for advice

**Quirky Observation** (background detail):
```
Is that a [specific book/item] in your photo? I've been meaning to read/try that - any good?
```
- **Why**: Noticed what others missed, genuine curiosity, easy question

**Food/Coffee** (40% higher response from women):
```
That [specific dish/coffee shop] in your photo looks amazing - best thing on the menu?
```
- **Why**: Specific detail, food invites sharing, simple question

---

## What NOT to Suggest

**Instant Turn-Offs**:
- Generic greetings: "Hey", "How are you?", "What's up?" (44% find annoying)
- Physical compliments as openers: "Beautiful", "Gorgeous smile"
- Copy-paste pickup lines
- Essay-length messages (overwhelming)
- Negging or manipulative tactics
- Text speak: "u", "ur", "luv" (71% turn-off)
- Anything overtly sexual
- Messages that could be sent to anyone

**AI Red Flags to Avoid**:
- Too polished/perfect language
- Generic patterns everyone uses
- Lack of natural quirks
- Over-formal tone

---

## Platform-Specific Tips

**Hinge** (Best for serious connections):
- Comment with like = 3x more responses
- Reference their prompt answers specifically
- Food questions get 40% higher response
- 90% first date success rate

**Bumble** (Women initiate):
- Help with replies since women start conversation
- Profile quality crucial—focus on prompts
- Women respond 40% better to food topics

**Tinder** (Most superficial):
- Needs more attention-grabbing openers
- GIFs boost response 30% (suggest if appropriate)
- Peak time: 5pm-midnight
- Less profile reading—be more creative

---

## Response Rate Boosters (2026 Data)

- Send within **24 hours**: +60% response
- Include **"you mention"**: +50% response
- **Personalized** reference: +70% response
- **Open-ended** question: +40% vs yes/no
- **Humor** (when relevant): +55% response
- **Bad grammar**: -71% (proofread!)

---

## User Profile Context

**Strengths to leverage**:
- Fit & healthy (insider fitness knowledge, adventure credibility)
- Fun & adventurous (specific experiences vs generic "I love travel")
- Good writer (most people write poorly—this is an edge)

**Angles that work for this profile**:
1. Specific adventure stories with real details
2. Fitness/outdoor questions with understanding (not mansplaining)
3. Noticing details others miss (writer's observation)
4. Playful energy through authentic experiences

**What to avoid**:
- Flexing too hard (can be intimidating)
- Messages TOO well-crafted (sounds fake)
- Leading with "I'm fit/adventurous"—show through what you say
- Assuming compatibility from one shared interest

---

## Output Format

When providing suggestions, structure like this:

```
Here are 3 angles for [Name]:

**Option 1: [Type of angle]**
"[10-20 word message]"

Why this works:
- Hook: [What profile detail it references]
- Angle: [Why this stands out]
- Response: [Why it's easy to reply to]

**Option 2: [Type of angle]**
"[10-20 word message]"

Why this works: ...

**Option 3: [Type of angle]**
"[10-20 word message]"

Why this works: ...

---

My recommendation: [Pick one and explain why it fits best]

Read aloud test: [Does it sound like how you actually talk?]
```

---

## Quick Reference: Do's and Don'ts

### DO:
✅ Reference specific (non-obvious) profile details
✅ Keep it 10-20 words
✅ Ask open-ended questions
✅ Sound like yourself (fit, fun, adventurous)
✅ End with easy response hook
✅ Send within 24 hours
✅ Show genuine interest
✅ Preserve your quirks and weirdness

### DON'T:
❌ Generic greetings ("Hey", "What's up")
❌ Physical compliments as openers
❌ Copy-paste anything
❌ Write essays
❌ Sound too polished/AI-generated
❌ Use text speak
❌ Lead with sexual messages
❌ Neg or manipulate
❌ Message at 3am
❌ Move too slow (>7 days) or too fast

---

## Reference Material

Full research guide with examples and sources: `/workspace/extra/vault/dating-app-messaging-guide-2026.md`

Key insight: Quality of connection > quantity of matches. Help the user find people who respond to the real them, not a polished version.
