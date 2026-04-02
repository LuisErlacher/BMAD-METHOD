const path = require('node:path');
const fs = require('fs-extra');
const csv = require('csv-parse/sync');
const chalk = require('chalk');

/**
 * Generates Claude Code subagent files for Phase 4 (implementation) workflows
 *
 * Subagents are placed in .claude/agents/ and can be invoked via the Task tool
 * with subagent_type parameter. This enables the orchestrator to spawn specialized
 * workflow agents.
 *
 * Naming convention: bmad-{workflow-name}.md (without module prefix)
 */
class SubagentGenerator {
  constructor(bmadFolderName = '_bmad') {
    this.templatePath = path.join(__dirname, '../templates/combined/default-subagent.md');
    this.bmadFolderName = bmadFolderName;

    // Workflow-specific configurations
    this.workflowConfig = {
      'code-review': { model: 'opus', color: 'red' },
      'create-story': { model: 'opus', color: 'purple' },
      'dev-story': { model: 'opus', color: 'blue' },
      'sprint-planning': { model: 'opus', color: 'green' },
      'sprint-status': { model: 'opus', color: 'cyan' },
      'correct-course': { model: 'opus', color: 'orange' },
      retrospective: { model: 'opus', color: 'gray' },
    };

    // Default configuration
    this.defaultConfig = { model: 'opus', color: 'gray' };
  }

  /**
   * Generate subagent files from Phase 4 workflows in the manifest
   * @param {string} bmadDir - BMAD installation directory
   * @param {string} agentsDir - Target .claude/agents directory
   * @returns {Promise<{count: number}>} Number of subagents generated
   */
  async generateSubagents(bmadDir, agentsDir) {
    const workflows = await this.loadWorkflowManifest(bmadDir);

    if (!workflows) {
      console.log(chalk.yellow('Workflow manifest not found. Skipping subagent generation.'));
      return { count: 0 };
    }

    // Filter to only Phase 4 (implementation) workflows
    const phase4Workflows = workflows.filter((workflow) => this.isPhase4Workflow(workflow));

    if (phase4Workflows.length === 0) {
      console.log(chalk.yellow('No Phase 4 workflows found. Skipping subagent generation.'));
      return { count: 0 };
    }

    // Load the subagent template
    const template = await fs.readFile(this.templatePath, 'utf8');

    let generatedCount = 0;

    for (const workflow of phase4Workflows) {
      const content = this.generateSubagentContent(workflow, template, bmadDir);
      const subagentName = `${workflow.name}.md`;
      const subagentPath = path.join(agentsDir, subagentName);

      await fs.writeFile(subagentPath, content);
      generatedCount++;
    }

    return { count: generatedCount };
  }

  /**
   * Collect subagent artifacts without writing them (for config-driven installer)
   * @param {string} bmadDir - BMAD installation directory
   * @returns {Promise<{artifacts: Array, count: number}>} Artifacts and count
   */
  async collectSubagentArtifacts(bmadDir) {
    const workflows = await this.loadWorkflowManifest(bmadDir);

    if (!workflows) {
      return { artifacts: [], count: 0 };
    }

    // Filter to only Phase 4 (implementation) workflows
    const phase4Workflows = workflows.filter((workflow) => this.isPhase4Workflow(workflow));

    if (phase4Workflows.length === 0) {
      return { artifacts: [], count: 0 };
    }

    // Load the subagent template
    const template = await fs.readFile(this.templatePath, 'utf8');

    const artifacts = [];

    for (const workflow of phase4Workflows) {
      const content = this.generateSubagentContent(workflow, template, bmadDir);
      const subagentName = `${workflow.name}.md`;

      artifacts.push({
        type: 'subagent',
        name: workflow.name,
        description: workflow.description || `${workflow.name} workflow`,
        module: workflow.module,
        filename: subagentName,
        content: content,
        sourcePath: workflow.path,
      });
    }

    return {
      artifacts,
      count: artifacts.length,
    };
  }

  /**
   * Check if a workflow belongs to Phase 4 (implementation)
   * @param {Object} workflow - Workflow object from manifest
   * @returns {boolean} True if Phase 4 workflow
   */
  isPhase4Workflow(workflow) {
    // Check path for 4-implementation
    if (workflow.path && workflow.path.includes('4-implementation')) {
      return true;
    }

    // Check phase field if present
    if (workflow.phase === '4' || workflow.phase === 'implementation') {
      return true;
    }

    return false;
  }

  /**
   * Generate subagent content from template
   * @param {Object} workflow - Workflow object
   * @param {string} template - Template content
   * @param {string} bmadDir - BMAD installation directory
   * @returns {string} Generated subagent content
   */
  generateSubagentContent(workflow, template, bmadDir) {
    // Convert source path to installed path
    let workflowPath = workflow.path;

    // Handle different path formats from manifest:
    // - _bmad/bmm/workflows/... (installed path)
    // - /src/bmm/... (source path - legacy)
    if (workflowPath.startsWith('_bmad/')) {
      // Remove _bmad prefix - will be replaced with bmadFolderName in template
      workflowPath = workflowPath.replace(/^_bmad\//, '');
    } else if (workflowPath.includes('/src/bmm/')) {
      const match = workflowPath.match(/\/src\/bmm\/(.+)/);
      if (match) {
        workflowPath = `bmm/${match[1]}`;
      }
    } else if (workflowPath.includes('/src/core/')) {
      const match = workflowPath.match(/\/src\/core\/(.+)/);
      if (match) {
        workflowPath = `core/${match[1]}`;
      }
    }

    // Get workflow-specific configuration (model and color)
    const config = this.workflowConfig[workflow.name] || this.defaultConfig;

    // Replace template variables
    return template
      .replaceAll('{{name}}', workflow.name)
      .replaceAll('{{module}}', workflow.module || 'bmm')
      .replaceAll('{{description}}', workflow.description || `${workflow.name} workflow`)
      .replaceAll('{{path}}', workflowPath) // FIX: template uses {{path}}
      .replaceAll('{{workflow_path}}', workflowPath) // KEEP: backwards compatibility
      .replaceAll('{{model}}', config.model)
      .replaceAll('{{color}}', config.color)
      .replaceAll('{{bmadFolderName}}', this.bmadFolderName) // FIX: template uses {{bmadFolderName}}
      .replaceAll('_bmad', this.bmadFolderName); // KEEP: backwards compatibility
  }

  /**
   * Load workflow manifest CSV
   * @param {string} bmadDir - BMAD installation directory
   * @returns {Promise<Array|null>} Parsed workflows or null
   */
  async loadWorkflowManifest(bmadDir) {
    const manifestPath = path.join(bmadDir, '_config', 'workflow-manifest.csv');

    if (!(await fs.pathExists(manifestPath))) {
      return null;
    }

    const csvContent = await fs.readFile(manifestPath, 'utf8');
    return csv.parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
    });
  }

  /**
   * Write subagent artifacts to target directory
   * @param {string} agentsDir - Target agents directory
   * @param {Array} artifacts - Subagent artifacts
   * @returns {Promise<number>} Count of subagents written
   */
  async writeSubagentArtifacts(agentsDir, artifacts) {
    let writtenCount = 0;

    for (const artifact of artifacts) {
      if (artifact.type === 'subagent') {
        const subagentPath = path.join(agentsDir, artifact.filename);
        await fs.ensureDir(path.dirname(subagentPath));
        await fs.writeFile(subagentPath, artifact.content);
        writtenCount++;
      }
    }

    return writtenCount;
  }
}

module.exports = { SubagentGenerator };
