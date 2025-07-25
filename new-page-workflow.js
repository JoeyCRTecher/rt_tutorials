#!/usr/bin/env node

/**
 * RT Tutorials - New Page Workflow
 * Demonstrates the metadata-driven cross-linking process
 */

const fs = require('fs');
const path = require('path');

// Import the CrossLinkGenerator if needed
// const CrossLinkGenerator = require('./crosslink-generator.js');

class NewPageWorkflow {
    constructor() {
        this.metadataPath = 'content-metadata.json';
        this.metadata = this.loadMetadata();
    }

    loadMetadata() {
        try {
            return JSON.parse(fs.readFileSync(this.metadataPath, 'utf8'));
        } catch (error) {
            console.error('❌ Error loading metadata:', error.message);
            process.exit(1);
        }
    }

    saveMetadata() {
        try {
            fs.writeFileSync(this.metadataPath, JSON.stringify(this.metadata, null, 2));
            console.log('✅ Metadata saved successfully');
        } catch (error) {
            console.error('❌ Error saving metadata:', error.message);
        }
    }

    /**
     * Step 1: Add metadata entry for new page
     */
    addPageMetadata(pagePath, pageData) {
        console.log(`\n📝 Step 1: Adding metadata for ${pagePath}`);
        
        // Validate required fields
        const requiredFields = ['title', 'description', 'type', 'format', 'difficulty', 'primary_topics', 'target_audience'];
        for (const field of requiredFields) {
            if (!pageData[field]) {
                throw new Error(`Missing required field: ${field}`);
            }
        }

        // Add to metadata
        this.metadata.pages[pagePath] = pageData;
        
        console.log(`   ✓ Added metadata with ${pageData.primary_topics.length} topics`);
        console.log(`   ✓ Target audience: ${pageData.target_audience.join(', ')}`);
        console.log(`   ✓ Difficulty: ${pageData.difficulty}`);
    }

    /**
     * Step 2: Define relationships
     */
    addRelationships(pagePath, relationships = {}) {
        console.log(`\n🔗 Step 2: Defining relationships for ${pagePath}`);

        // Add companion format if specified
        if (relationships.companionFormat) {
            this.metadata.relationships.content_pairs[pagePath] = {
                companion_format: relationships.companionFormat,
                relationship_type: relationships.companionType || 'article_to_visual',
                description: relationships.companionDescription || 'Companion format content'
            };
            console.log(`   ✓ Added companion format: ${relationships.companionFormat}`);
        }

        // Add to learning progression if specified
        if (relationships.learningTrack) {
            const track = this.metadata.relationships.learning_progressions[relationships.learningTrack];
            if (track) {
                if (relationships.position === 'append') {
                    track.push(pagePath);
                } else if (typeof relationships.position === 'number') {
                    track.splice(relationships.position, 0, pagePath);
                }
                console.log(`   ✓ Added to ${relationships.learningTrack} learning track`);
            }
        }

        // Add conceptual relationships
        if (relationships.conceptual) {
            for (const [type, relatedPath] of Object.entries(relationships.conceptual)) {
                if (!this.metadata.relationships.conceptual_relationships[type]) {
                    this.metadata.relationships.conceptual_relationships[type] = [];
                }
                
                const relationshipObj = {};
                relationshipObj[type === 'theory_to_practice' ? 'theory' : 
                              type === 'problem_to_solution' ? 'problem' :
                              type === 'role_progression' ? 'junior' : 'source'] = pagePath;
                relationshipObj[type === 'theory_to_practice' ? 'practice' : 
                              type === 'problem_to_solution' ? 'solution' :
                              type === 'role_progression' ? 'senior' : 'target'] = relatedPath;
                
                this.metadata.relationships.conceptual_relationships[type].push(relationshipObj);
                console.log(`   ✓ Added ${type} relationship with ${relatedPath}`);
            }
        }
    }

    /**
     * Step 3: Generate cross-links using metadata
     */
    generateCrossLinks(pagePath) {
        console.log(`\n🎯 Step 3: Generating cross-links for ${pagePath}`);

        // Simulate the CrossLinkGenerator logic
        const currentPage = this.metadata.pages[pagePath];
        const relatedPages = [];

        // Check companion formats
        const companionPair = this.metadata.relationships.content_pairs[pagePath];
        if (companionPair) {
            relatedPages.push({
                url: companionPair.companion_format,
                title: this.metadata.pages[companionPair.companion_format]?.title,
                description: 'Visual summary of the key concepts from this article.',
                relationship_type: companionPair.relationship_type
            });
        }

        // Check learning progressions
        for (const [trackName, track] of Object.entries(this.metadata.relationships.learning_progressions)) {
            const index = track.indexOf(pagePath);
            if (index !== -1 && index < track.length - 1) {
                const nextPath = track[index + 1];
                relatedPages.push({
                    url: nextPath,
                    title: this.metadata.pages[nextPath]?.title,
                    description: `Next step in the ${trackName.replace('_', ' ')} learning path.`,
                    relationship_type: 'learning_progression'
                });
            }
        }

        // Check shared topics
        const currentTopics = new Set(currentPage.primary_topics);
        for (const [otherPath, otherPage] of Object.entries(this.metadata.pages)) {
            if (otherPath === pagePath || relatedPages.length >= 3) continue;
            
            const otherTopics = new Set(otherPage.primary_topics);
            const intersection = new Set([...currentTopics].filter(x => otherTopics.has(x)));
            
            if (intersection.size >= 2) {
                relatedPages.push({
                    url: otherPath,
                    title: otherPage.title,
                    description: `Related content covering ${Array.from(intersection).join(', ')}.`,
                    relationship_type: 'shared_topics'
                });
            }
        }

        console.log(`   ✓ Generated ${relatedPages.length} related links:`);
        relatedPages.forEach((link, i) => {
            console.log(`     ${i + 1}. ${link.title} (${link.relationship_type})`);
        });

        return relatedPages;
    }

    /**
     * Step 4: Generate HTML for related content section
     */
    generateRelatedContentHTML(pagePath, relatedPages) {
        console.log(`\n🔧 Step 4: Generating HTML for ${pagePath}`);

        if (relatedPages.length === 0) {
            return '<!-- No related content found -->';
        }

        let html = `
<!-- Related Content Section -->
<section class="max-w-800px mx-auto px-6 py-8 mb-8">
    <div class="glass-effect rounded-xl p-8">
        <h2 style="color: #26d07c; margin-bottom: 1.5rem; font-size: 1.6rem;">🔗 Related Content</h2>
        <div style="display: grid; gap: 1rem;">`;

        for (const link of relatedPages.slice(0, 3)) {
            // Determine relative path
            const currentDir = pagePath.includes('/') ? pagePath.split('/')[0] : '';
            const linkDir = link.url.includes('/') ? link.url.split('/')[0] : '';
            const relativePath = currentDir === linkDir ? 
                link.url.split('/').pop() : 
                (currentDir ? `../${link.url}` : link.url);

            html += `
            <a href="${relativePath}" style="display: block; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(38, 208, 124, 0.2); border-radius: 10px; padding: 1.5rem; text-decoration: none; transition: all 0.3s ease;">
                <h3 style="color: #26d07c; margin-bottom: 0.5rem; font-size: 1.2rem;">${link.title}</h3>
                <p style="color: #ccc; margin: 0;">${link.description}</p>
            </a>`;
        }

        html += `
        </div>
    </div>
</section>`;

        console.log(`   ✓ Generated HTML with ${relatedPages.length} links`);
        return html;
    }

    /**
     * Complete workflow for adding a new page
     */
    addNewPage(pagePath, pageData, relationships = {}) {
        console.log(`\n🚀 RT Tutorials - Adding New Page: ${pagePath}`);
        console.log('='.repeat(60));

        try {
            // Step 1: Add metadata
            this.addPageMetadata(pagePath, pageData);

            // Step 2: Define relationships
            this.addRelationships(pagePath, relationships);

            // Step 3: Generate cross-links
            const relatedPages = this.generateCrossLinks(pagePath);

            // Step 4: Generate HTML
            const html = this.generateRelatedContentHTML(pagePath, relatedPages);

            // Save metadata
            this.saveMetadata();

            console.log(`\n✅ Workflow completed successfully!`);
            console.log(`⏱️  Total time: ~5-10 minutes (vs 2-3 hours manual)`);
            console.log(`📄 Ready to insert HTML into ${pagePath}`);

            return {
                relatedPages,
                html,
                success: true
            };

        } catch (error) {
            console.error(`\n❌ Workflow failed:`, error.message);
            return { success: false, error: error.message };
        }
    }
}

// Example usage
if (require.main === module) {
    const workflow = new NewPageWorkflow();

    // Example: Adding a new AI Security post
    const examplePage = {
        title: "AI Security Best Practices",
        description: "Essential security considerations when implementing AI systems in production environments.",
        type: "post",
        format: "practical_guide",
        difficulty: "intermediate",
        estimated_read_time: "12-15 minutes",
        primary_topics: [
            "ai-security",
            "production-ai",
            "risk-management",
            "best-practices"
        ],
        secondary_topics: [
            "compliance",
            "data-privacy",
            "model-safety"
        ],
        target_audience: [
            "senior-developers",
            "security-engineers",
            "ai-practitioners",
            "team-leads"
        ],
        learning_objectives: [
            "identify_ai_security_risks",
            "implement_security_controls",
            "ensure_compliance",
            "monitor_ai_systems"
        ]
    };

    const exampleRelationships = {
        conceptual: {
            role_progression: "posts/junior_programmers_ai.html" // This is more advanced than junior content
        }
    };

    workflow.addNewPage("posts/ai_security.html", examplePage, exampleRelationships);
}

module.exports = NewPageWorkflow; 