# Secure mobile back office - απλές οδηγίες

Αυτός ο φάκελος είναι για τη σωστή online λύση:

- Το site ανεβαίνει στο Netlify.
- Το admin ανοίγει online και από κινητό.
- Το admin ζητάει Firebase login.
- Το Back Office AI τρέχει από Netlify Function.
- Τα Gemini/OpenAI keys δεν μπαίνουν ποτέ σε HTML.

## Τι ανεβάζουμε στο Netlify

Ανεβάζουμε όλο αυτόν τον φάκελο:

```text
ARAM_NETLIFY_SECURE_ADMIN_UPLOAD
```

Το Netlify θα δημοσιεύσει μόνο τον φάκελο:

```text
site
```

και θα κρατήσει ως serverless function το:

```text
netlify/functions/backoffice-ai.mjs
```

## Τι θα είναι online

Το δημόσιο site:

```text
https://το-site-σου.netlify.app/
```

Το back office:

```text
https://το-site-σου.netlify.app/admin-aram-58142.html
```

Το back office θα ζητάει email/password.

## Βήμα 1 - Φτιάξε admin λογαριασμό στο Firebase

1. Άνοιξε Firebase Console.
2. Πήγαινε στο project `aramcreations-e1529`.
3. Πήγαινε `Authentication`.
4. Πήγαινε `Sign-in method`.
5. Άνοιξε το `Email/Password`.
6. Πήγαινε `Users`.
7. Πάτα `Add user`.
8. Βάλε το email σου και ένα δυνατό password.

## Βήμα 2 - Κλείδωσε τα writes στο Firebase

Άνοιξε αυτά τα αρχεία:

```text
firebase-rules/firestore.rules
firebase-rules/storage.rules
```

Και στα δύο άλλαξε αυτό:

```text
PUT-YOUR-ADMIN-EMAIL-HERE
```

με το email που έβαλες στο Firebase Auth.

Μετά βάλε τους κανόνες στο Firebase Console:

- `Firestore Database -> Rules`
- `Storage -> Rules`

Αυτό είναι το αληθινό κλείδωμα. Το login στην οθόνη είναι η πόρτα, αλλά οι Firebase rules είναι η κλειδαριά.

## Βήμα 3 - Βάλε τα AI keys στο Netlify

Στο Netlify πήγαινε:

```text
Site configuration -> Environment variables
```

Βάλε:

```text
FIREBASE_PROJECT_ID=aramcreations-e1529
ADMIN_EMAILS=το-email-σου
GEMINI_API_KEY=το-gemini-key-σου
AI_PROVIDER=gemini
GEMINI_MODEL=gemini-2.5-flash-lite
GEMINI_MODEL_ORDER=gemini-2.5-flash-lite,gemini-2.5-flash,gemini-2.0-flash-lite
```

Αν θες και OpenAI fallback:

```text
OPENAI_API_KEY=το-openai-key-σου
AI_PROVIDER=auto
AI_PROVIDER_ORDER=gemini,openai
OPENAI_MODEL=gpt-5-mini
```

## Βήμα 4 - Ρυθμίσεις Netlify deploy

Στο Netlify βάλε:

```text
Build command: κενό
Publish directory: site
Functions directory: netlify/functions
```

Για να δουλέψει το Back Office AI online, καλύτερα να γίνει deploy με Git ή Netlify CLI.

Απλό drag and drop μπορεί να ανεβάσει το site και το admin page, αλλά μπορεί να μη στήσει σωστά τη function.

## Μετά το deploy

Από κινητό ανοίγεις:

```text
https://το-site-σου.netlify.app/admin-aram-58142.html
```

Βάζεις email/password.

Αλλάζεις προϊόντα.

Το admin γράφει στο Firebase.

Το δημόσιο site στο Netlify διαβάζει από Firebase και ενημερώνεται.

## Πολύ σημαντικό

Δεν ανεβάζουμε ποτέ:

- `.env`
- `ai-backend`
- API keys μέσα σε HTML
- backups

Τα keys μπαίνουν μόνο στα Netlify environment variables.
