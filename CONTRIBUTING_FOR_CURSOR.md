# Style Guidelines
All styling needs to reference the `styles.css` file.

# Navigation Conventions
- **CRITICAL**: All pages must copy the navigation header from index.html
- Navigation should be fixed at the top with `z-50` to stay above content
- Brand link "ReadyAI Tutorials" should use `gradient-text` class and link back to index.html
- Include navigation items: Tutorials, Posts, About (linking to index.html sections)
- For subpages (posts/, tutorials/), use relative paths: `../index.html`
- Always include Tailwind config with RT color scheme:
  ```javascript
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
- Wrap main content in `<div class="pt-20">` to account for fixed navigation

# Favicon Requirements
- **CRITICAL**: All HTML pages must include the RT Tutorials favicon in the `<head>` section
- Add favicon immediately after the `<title>` tag and before any Open Graph meta tags
- Use the following exact favicon code for consistency:
  ```html
  <!-- Favicon -->
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='6' fill='%23000'/><rect x='2' y='2' width='28' height='28' rx='4' fill='%2326d07c'/><text x='16' y='22' text-anchor='middle' font-family='system-ui,sans-serif' font-size='14' font-weight='bold' fill='%23000'>RT</text></svg>">
  <link rel="apple-touch-icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 180 180'><rect width='180' height='180' rx='30' fill='%23000'/><rect x='10' y='10' width='160' height='160' rx='20' fill='%2326d07c'/><text x='90' y='120' text-anchor='middle' font-family='system-ui,sans-serif' font-size='80' font-weight='bold' fill='%23000'>RT</text></svg>">
  ```
- The favicon features RT green (#26d07c) branding with "RT" letters on black background
- Includes both standard favicon and Apple touch icon for mobile compatibility
- Maintains consistency across all pages for professional branding

# Protocol Guidelines
## File Management
- **CRITICAL**: Do not delete any files unless the user explicitly requests deletion
- Always preserve existing files when making changes
- Use edit operations rather than recreate operations when possible
- When unsure about file changes, ask for confirmation

### New Page Integration
- **CRITICAL**: When creating new .html pages, always update index.html to include references to the new page
- Add new pages to appropriate sections in index.html (tutorials section for tutorials/, posts section for posts/)

### Metadata-Driven Cross-Linking Process
**CRITICAL**: After creating ANY new page, ALWAYS use the metadata system for cross-linking instead of manual content review.
- **Step 1: Add metadata entry** - Add the new page to `content-metadata.json` with appropriate topics, difficulty, audience, and learning objectives
- **Step 2: Define relationships** - Update relationship mappings in the metadata file (companion formats, learning progressions, conceptual relationships)
- **Step 3: Generate cross-links** - Use the CrossLinkGenerator utility to automatically generate related content sections
- **Step 4: Apply generated HTML** - Insert and / or update the auto-generated "Related Content" sections into both the new page and existing pages as needed

#### Metadata Configuration Guidelines
All new pages must include these metadata fields:
```json
"path/to/new-page.html": {
  "title": "Page Title",
  "description": "Brief description for link previews",
  "type": "tutorial|post",
  "format": "comprehensive_guide|hands_on_guide|analytical_article|interactive_infographic|visual_infographic|industry_analysis|practical_guide",
  "difficulty": "beginner|beginner_to_intermediate|intermediate|advanced",
  "estimated_read_time": "X-Y minutes",
  "primary_topics": ["topic1", "topic2", "topic3"],
  "secondary_topics": ["secondary1", "secondary2"],
  "target_audience": ["developers", "ai-practitioners", "junior-programmers", etc.],
  "learning_objectives": ["objective1", "objective2"]
}
```

#### Relationship Mapping Rules
- **Companion formats**: Article ↔ Infographic pairs (bidirectional, highest priority)
- **Learning progressions**: Sequential tracks (unidirectional, high priority)  
- **Conceptual relationships**: Theory ↔ Practice, Problem ↔ Solution, Junior ↔ Senior roles
- **Shared topics**: Pages with 2+ matching primary topics (automatic detection)
- **Audience crossover**: Pages targeting same audiences (lowest priority)
- Cross-linking doesn't need to be symmetrical - only create links where they provide genuine 
value

#### Automated Cross-Link Generation
Use the CrossLinkGenerator utility:
```javascript
// Generate related links for any page
const generator = new CrossLinkGenerator(metadata);
const relatedHTML = generator.generateRelatedContentHTML('path/to/page.html');
// Insert relatedHTML into page before closing </body> tag
```


### Development Approach
- Maintain consistency with existing codebase style
- Follow established patterns and conventions
- Preserve responsive design principles
- Keep animations smooth and purposeful
- Apply navigation conventions to ALL new pages created

### Communication
- Be explicit about what changes are being made
- Explain reasoning for design decisions
- Ask for clarification when requirements are ambiguous 