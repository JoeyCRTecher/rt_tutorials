## 📘 AI Contribution Protocol – RT Tutorials
> *Reference this file for all AI-generated edits and new page creation.*
---

### 🧭 Global Conventions

* **Use `styles.css`** for all styling — no inline or embedded styles.
* All HTML pages **must include the shared navigation header from `index.html`**.
* Wrap main content in: `<div class="pt-20">` to account for fixed nav.
* Apply fixed top nav using Tailwind: `z-50`.
* Before each task, you must first complete the following steps:
  1. Provide a full plan of your changes.
  2. Provide a list of behaviors that you'll change.
  3. Provide a list of test cases to add.
* Before you add any code, always check if you can just re-use 

* Always focus on simplicity and precision and not comprehensiveness.
* When writing tests, focus on the happy path and only the most important edge cases.
* Before adding a new test, always make sure that a similar test doesn't exist already.or re-configure any existing code to achieve the result.
---

### 🟩 Branding Rules

* "ReadyAI Tutorials" in nav should:

  * Use `gradient-text` class.
  * Link to `index.html`.

---

### 🔗 Navigation Links

Include these in the nav:

* Tutorials → scroll to Tutorials in index.html
* Posts → scroll to Posts in index.html
* About → scroll to About in index.html

On subpages (`posts/`, `tutorials/`), use relative path `../index.html`.

---

### 🎨 Tailwind Config

Use this color scheme:

```js
tailwind.config = {
  theme: {
    extend: {
      colors: {
        'rt-green': '#26d07c',
        'rt-green-dark': '#1fa866',
        'rt-green-light': 'rgba(38, 208, 124, 0.1)',
      }
    }
  }
}
```

---

### 🧊 Favicon Snippet (Required)

Add this block to all HTML pages in `<head>`, **after `<title>`**:

```html
<!-- Favicon -->
<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='6' fill='%23000'/><rect x='2' y='2' width='28' height='28' rx='4' fill='%2326d07c'/><text x='16' y='22' text-anchor='middle' font-family='system-ui,sans-serif' font-size='14' font-weight='bold' fill='%23000'>RT</text></svg>'>
<link rel="apple-touch-icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 180 180'><rect width='180' height='180' rx='30' fill='%23000'/><rect x='10' y='10' width='160' height='160' rx='20' fill='%2326d07c'/><text x='90' y='120' text-anchor='middle' font-family='system-ui,sans-serif' font-size='80' font-weight='bold' fill='%23000'>RT</text></svg>'>
```

---

### 🧱 File Management

* **Never delete files** unless explicitly requested.
* Prefer edits over recreation.
* When unsure about file changes: ask.

---

### 🆕 New Page Creation

1. **Add page reference to `index.html`** in the correct section.
2. **Add metadata entry to `content-metadata.json`**:

```json
"path/to/new-page.html": {
  "title": "Page Title",
  "description": "Brief description",
  "type": "tutorial|post",
  "format": "comprehensive_guide|hands_on_guide|visual_infographic|...",
  "difficulty": "beginner|intermediate|advanced",
  "estimated_read_time": "X-Y minutes",
  "primary_topics": ["topic1", "topic2"],
  "secondary_topics": ["topicA", "topicB"],
  "target_audience": ["developers", "ai-practitioners"],
  "learning_objectives": ["objective1", "objective2"]
}
```

3. **Run `CrossLinkGenerator` utility** to auto-generate related content HTML.
4. **Insert related content** before the closing `</body>` tag in new and related pages.

---

### 🔗 Metadata Relationships (in order of importance)

* **Companion format** (e.g. article ↔ infographic)
* **Learning progression** (e.g. intro → intermediate)
* **Conceptual relationships** (e.g. theory ↔ practice)
* **Shared primary topics**
* **Audience crossover**

---

### 💬 Style & Communication

* Match tone and formatting of existing site.
* Preserve responsive layout.
* Keep transitions smooth and purposeful.
* Ask when unclear.
* Explain design decisions when submitting PRs.