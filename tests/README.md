# Test Files Organization

This directory contains all testing, debugging, and utility scripts for the RankMe application.

## Directory Structure

### `/scripts/` - Utility and Test Scripts
Contains various utility scripts and test files for different features:

- **calculate-progress.js** - Script to calculate user progress stats
- **check-users.js** - User validation and checking utilities
- **reset-all-tasks.js** - Script to reset all user tasks
- **simple-daily-test.js** - Simple daily task testing
- **test-api.js** - API endpoint testing
- **test-combined-progress.js** - Combined progress tracking tests
- **test-complete-task.js** - Task completion testing
- **test-daily-progress-tracking.js** - Daily progress tracking tests
- **test-fixed-mapping.js** - Fixed mapping functionality tests
- **test-progress-after-fix.js** - Progress calculation after fixes
- **test-timestamp-recording.js** - Timestamp recording tests
- **trigger-progress-calculation.mjs** - Trigger progress calculations

### `/debugging/` - Debug Scripts and Tools
Contains debugging utilities and diagnostic tools:

- **debug-frontend-mapping.js** - Frontend mapping debugging
- **debug-progress.js** - Progress calculation debugging
- **debug-task-completion.js** - Task completion debugging
- **debug-tracker.js** - Progress tracker debugging
- **test-ui-fixes.html** - HTML file for UI fix testing

### `/database/` - Database Tests
Reserved for future database-specific tests and migrations.

## Usage

To run any script, navigate to the project root directory and use:

```bash
# For JavaScript files
node tests/scripts/filename.js

# For ES modules
node tests/scripts/filename.mjs

# For debugging scripts
node tests/debugging/filename.js
```

## Important Notes

- These scripts are for development and testing purposes only
- Some scripts may modify database data - use with caution
- Always backup your database before running destructive scripts
- Scripts may require specific environment variables or authentication

## Contributing

When adding new test files:
1. Place them in the appropriate subdirectory
2. Use descriptive filenames
3. Add documentation to this README
4. Follow existing naming conventions