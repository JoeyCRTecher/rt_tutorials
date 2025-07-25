/**
 * Cross-Link Generator for RT Tutorials
 * Automatically generates related content links based on metadata
 */

class CrossLinkGenerator {
    constructor(metadata) {
        this.metadata = metadata;
        this.pages = metadata.pages;
        this.relationships = metadata.relationships;
        this.rules = metadata.cross_linking_rules;
    }

    /**
     * Generate related links for a specific page
     * @param {string} pagePath - Path to the page (e.g., "posts/context_vs_prompt.html")
     * @returns {Array} Array of related page objects
     */
    generateRelatedLinks(pagePath) {
        const currentPage = this.pages[pagePath];
        if (!currentPage) {
            throw new Error(`Page not found: ${pagePath}`);
        }

        const relatedPages = new Map(); // Use Map to avoid duplicates
        const maxLinks = this.rules.max_related_links;

        // Apply rules in priority order
        for (const priority of this.rules.link_priorities) {
            if (relatedPages.size >= maxLinks) break;

            switch (priority) {
                case 'companion_formats':
                    this._addCompanionFormatLinks(pagePath, relatedPages);
                    break;
                case 'learning_progressions':
                    this._addLearningProgressionLinks(pagePath, relatedPages);
                    break;
                case 'conceptual_relationships':
                    this._addConceptualRelationshipLinks(pagePath, relatedPages);
                    break;
                case 'shared_primary_topics':
                    this._addSharedTopicLinks(pagePath, relatedPages, maxLinks);
                    break;
                case 'audience_crossover':
                    this._addAudienceCrossoverLinks(pagePath, relatedPages, maxLinks);
                    break;
            }
        }

        // Apply manual exceptions
        this._applyManualExceptions(pagePath, relatedPages);

        // Convert to array and limit results
        return Array.from(relatedPages.values()).slice(0, maxLinks);
    }

    _addCompanionFormatLinks(pagePath, relatedPages) {
        // Check if this page has a companion format
        const companionData = this.relationships.content_pairs[pagePath];
        if (companionData) {
            const companionPath = companionData.companion_format;
            if (this.pages[companionPath]) {
                relatedPages.set(companionPath, {
                    url: companionPath,
                    title: this.pages[companionPath].title,
                    description: this._getCompanionDescription(companionData),
                    relationship_type: companionData.relationship_type,
                    priority: 1
                });
            }
        }

        // Check if this page IS a companion format for another page
        for (const [parentPath, data] of Object.entries(this.relationships.content_pairs)) {
            if (data.companion_format === pagePath) {
                relatedPages.set(parentPath, {
                    url: parentPath,
                    title: this.pages[parentPath].title,
                    description: this._getReverseCompanionDescription(data),
                    relationship_type: this._reverseRelationshipType(data.relationship_type),
                    priority: 1
                });
                break;
            }
        }
    }

    _addLearningProgressionLinks(pagePath, relatedPages) {
        for (const [trackName, track] of Object.entries(this.relationships.learning_progressions)) {
            const currentIndex = track.indexOf(pagePath);
            if (currentIndex !== -1) {
                // Add next step in progression
                if (currentIndex < track.length - 1) {
                    const nextPath = track[currentIndex + 1];
                    relatedPages.set(nextPath, {
                        url: nextPath,
                        title: this.pages[nextPath].title,
                        description: `Next step in the ${trackName.replace('_', ' ')} learning path.`,
                        relationship_type: 'learning_progression',
                        priority: 2
                    });
                }
                
                // Add previous step for reference (lower priority)
                if (currentIndex > 0 && relatedPages.size < this.rules.max_related_links) {
                    const prevPath = track[currentIndex - 1];
                    relatedPages.set(prevPath, {
                        url: prevPath,
                        title: this.pages[prevPath].title,
                        description: `Foundation concepts for this content.`,
                        relationship_type: 'learning_foundation',
                        priority: 3
                    });
                }
                break;
            }
        }
    }

    _addConceptualRelationshipLinks(pagePath, relatedPages) {
        // Theory to practice relationships
        for (const relationship of this.relationships.conceptual_relationships.theory_to_practice) {
            if (relationship.theory === pagePath) {
                relatedPages.set(relationship.practice, {
                    url: relationship.practice,
                    title: this.pages[relationship.practice].title,
                    description: "Apply these concepts in practical scenarios.",
                    relationship_type: 'theory_to_practice',
                    priority: 2
                });
            } else if (relationship.practice === pagePath) {
                relatedPages.set(relationship.theory, {
                    url: relationship.theory,
                    title: this.pages[relationship.theory].title,
                    description: "Understand the theoretical foundation behind these practices.",
                    relationship_type: 'practice_to_theory',
                    priority: 2
                });
            }
        }

        // Problem to solution relationships
        for (const relationship of this.relationships.conceptual_relationships.problem_to_solution) {
            if (relationship.problem === pagePath) {
                relatedPages.set(relationship.solution, {
                    url: relationship.solution,
                    title: this.pages[relationship.solution].title,
                    description: "Learn techniques to solve this type of problem.",
                    relationship_type: 'problem_to_solution',
                    priority: 2
                });
            }
        }

        // Role progression relationships
        for (const relationship of this.relationships.conceptual_relationships.role_progression) {
            if (relationship.junior === pagePath) {
                relatedPages.set(relationship.senior, {
                    url: relationship.senior,
                    title: this.pages[relationship.senior].title,
                    description: "Explore advanced career development and emerging roles.",
                    relationship_type: 'career_progression',
                    priority: 3
                });
            }
        }
    }

    _addSharedTopicLinks(pagePath, relatedPages, maxLinks) {
        if (relatedPages.size >= maxLinks) return;

        const currentPage = this.pages[pagePath];
        const currentTopics = new Set(currentPage.primary_topics);

        for (const [otherPath, otherPage] of Object.entries(this.pages)) {
            if (otherPath === pagePath || relatedPages.has(otherPath)) continue;
            if (relatedPages.size >= maxLinks) break;

            const otherTopics = new Set(otherPage.primary_topics);
            const intersection = new Set([...currentTopics].filter(x => otherTopics.has(x)));
            
            if (intersection.size >= 2) {
                const sharedTopics = Array.from(intersection).join(', ');
                relatedPages.set(otherPath, {
                    url: otherPath,
                    title: otherPage.title,
                    description: `Related content covering ${sharedTopics}.`,
                    relationship_type: 'shared_topics',
                    priority: 4
                });
            }
        }
    }

    _addAudienceCrossoverLinks(pagePath, relatedPages, maxLinks) {
        if (relatedPages.size >= maxLinks) return;

        const currentPage = this.pages[pagePath];
        const currentAudience = new Set(currentPage.target_audience);

        for (const [otherPath, otherPage] of Object.entries(this.pages)) {
            if (otherPath === pagePath || relatedPages.has(otherPath)) continue;
            if (relatedPages.size >= maxLinks) break;

            const otherAudience = new Set(otherPage.target_audience);
            const intersection = new Set([...currentAudience].filter(x => otherAudience.has(x)));
            
            if (intersection.size >= 1) {
                relatedPages.set(otherPath, {
                    url: otherPath,
                    title: otherPage.title,
                    description: otherPage.description,
                    relationship_type: 'audience_overlap',
                    priority: 5
                });
            }
        }
    }

    _applyManualExceptions(pagePath, relatedPages) {
        const exception = this.rules.manual_exceptions.find(e => e.page === pagePath);
        if (!exception) return;

        // Remove never_link_to pages
        for (const neverLink of exception.never_link_to || []) {
            relatedPages.delete(neverLink);
        }

        // Add always_link_to pages
        for (const alwaysLink of exception.always_link_to || []) {
            if (this.pages[alwaysLink]) {
                relatedPages.set(alwaysLink, {
                    url: alwaysLink,
                    title: this.pages[alwaysLink].title,
                    description: this.pages[alwaysLink].description,
                    relationship_type: 'manual_override',
                    priority: 0 // Highest priority
                });
            }
        }
    }

    _getCompanionDescription(companionData) {
        switch (companionData.relationship_type) {
            case 'article_to_visual':
                return 'Visual summary of the key concepts from this article.';
            default:
                return companionData.description || 'Related content in a different format.';
        }
    }

    _getReverseCompanionDescription(companionData) {
        switch (companionData.relationship_type) {
            case 'article_to_visual':
                return 'Read the complete article with detailed explanations and examples.';
            default:
                return 'Detailed version of this content.';
        }
    }

    _reverseRelationshipType(type) {
        switch (type) {
            case 'article_to_visual':
                return 'visual_to_article';
            default:
                return type;
        }
    }

    /**
     * Generate HTML for related content section
     * @param {string} pagePath - Path to the current page
     * @returns {string} HTML string for related content section
     */
    generateRelatedContentHTML(pagePath) {
        const relatedLinks = this.generateRelatedLinks(pagePath);
        
        if (relatedLinks.length === 0) {
            return '<!-- No related content found -->';
        }

        let html = `
<!-- Related Content Section -->
<section class="max-w-800px mx-auto px-6 py-8 mb-8">
    <div class="glass-effect rounded-xl p-8">
        <h2 style="color: #26d07c; margin-bottom: 1.5rem; font-size: 1.6rem;">🔗 Related Content</h2>
        <div style="display: grid; gap: 1rem;">`;

        for (const link of relatedLinks) {
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

        return html;
    }

    /**
     * Test the system with current pages
     */
    testAllPages() {
        console.log('=== CrossLink Generator Test Results ===\n');
        
        for (const pagePath of Object.keys(this.pages)) {
            console.log(`📄 ${pagePath}`);
            console.log(`Title: ${this.pages[pagePath].title}`);
            
            const relatedLinks = this.generateRelatedLinks(pagePath);
            console.log(`Related links (${relatedLinks.length}):`);
            
            for (const link of relatedLinks) {
                console.log(`  → ${link.url} (${link.relationship_type})`);
                console.log(`    "${link.description}"`);
            }
            console.log('');
        }
    }
}

// Example usage:
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CrossLinkGenerator;
} else if (typeof window !== 'undefined') {
    window.CrossLinkGenerator = CrossLinkGenerator;
}

// If running in Node.js, you could test it like this:
/*
const fs = require('fs');
const metadata = JSON.parse(fs.readFileSync('content-metadata.json', 'utf8'));
const generator = new CrossLinkGenerator(metadata);
generator.testAllPages();
*/ 