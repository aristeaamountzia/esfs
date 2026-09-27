# Ξεκίνα από εδώ

Αυτός είναι ο πλήρης φάκελος που θα χρησιμοποιηθεί για Netlify:

```text
ARAM_NETLIFY_FULL_SECURE_DEPLOY
```

Περιέχει:

- δημόσιο site
- online back office
- Netlify Back Office AI Function
- Vinted Import μέσα στο Back Office και ξεχωριστή εφεδρική σελίδα
- Firebase rules
- αναλυτικές οδηγίες

## Τι θα δουλεύει μετά

Το δημόσιο site:

```text
https://το-site-σου.netlify.app/
```

Το back office από υπολογιστή ή κινητό:

```text
https://το-site-σου.netlify.app/admin-aram-58142.html
```

Το back office θα ζητάει email/password.

Το Vinted import βρίσκεται μέσα στο back office. Αν χρειαστείς και την εφεδρική σελίδα:

```text
https://το-site-σου.netlify.app/vinted-importer.html
```

## Τι μπορώ να κάνω εγώ και τι πρέπει να κάνεις εσύ

Έχω φτιάξει τα αρχεία.

Δεν μπορώ να πατήσω εγώ τα κουμπιά στους λογαριασμούς σου χωρίς πρόσβαση σε Firebase/Netlify. Αυτά πρέπει να γίνουν από εσένα:

1. Δημιουργία Firebase Auth user.
2. Επικόλληση Firebase rules.
3. Προσθήκη Netlify environment variables.
4. Deploy στο Netlify.

Τα έχω κάνει όμως όσο πιο copy-paste γίνεται.

## 1. Firebase Auth user

Στο Firebase:

```text
Authentication -> Sign-in method -> Email/Password -> Enable
```

Μετά:

```text
Authentication -> Users -> Add user
```

Βάλε:

```text
Email: aristeaamnta@gmail.com
Password: ένα δυνατό password που θα θυμάσαι
```

Αυτό το email είναι ήδη γραμμένο στα rules του φακέλου.

## 2. Firebase rules

Άνοιξε:

```text
FIREBASE_RULES_COPY_PASTE.txt
```

Κάνε copy/paste:

- το πρώτο block στο `Firestore Database -> Rules`
- το δεύτερο block στο `Storage -> Rules`

Πάτα `Publish` και στα δύο.

## 3. Netlify environment variables

Άνοιξε:

```text
NETLIFY_ENV_VARIABLES_COPY_PASTE.txt
```

Στο Netlify πήγαινε:

```text
Site configuration -> Environment variables
```

Βάλε τις μεταβλητές μία-μία.

Το Gemini key μπαίνει στο Netlify, όχι σε αρχείο.

## 4. Netlify deploy

Ο φάκελος έχει:

```text
netlify.toml
```

Το `netlify.toml` λέει:

```text
Publish directory: site
Functions directory: netlify/functions
```

Για να δουλέψει και το Back Office AI online, προτίμησε Git-connected deploy ή Netlify CLI.

Αν κάνεις απλό drag & drop, μπορεί να ανέβει το site/admin, αλλά η function ίσως να μη στηθεί σωστά.

## 5. Μετά το deploy

Άνοιξε:

```text
https://το-site-σου.netlify.app/admin-aram-58142.html
```

Βάλε:

```text
aristeaamnta@gmail.com
το password που έφτιαξες στο Firebase Auth
```

Αν συνδεθεί, είσαι μέσα στο online back office.

## Πολύ σημαντικό

Μην ανεβάσεις ποτέ:

- `.env`
- `ai-backend`
- backup αρχεία
- Gemini/OpenAI keys μέσα σε HTML

Αυτός ο φάκελος έχει ελεγχθεί ώστε να μην περιέχει αυτά.
