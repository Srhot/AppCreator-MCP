/**
 * Postman Collection & Environment Generator
 *
 * Generates Postman collections and environments for API testing
 * Supports:
 * - Automatic collection generation from API specs
 * - Environment variables (dev, staging, prod)
 * - Request/response examples
 * - Tests (assertions)
 * - Newman CLI integration
 */

import { AIAdapter } from '../adapters/ai-adapter.interface.js';

export interface PostmanRequest {
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  url: string;
  headers: { key: string; value: string }[];
  body?: {
    mode: 'raw' | 'formdata' | 'urlencoded';
    raw?: string;
    formdata?: { key: string; value: string; type: string }[];
  };
  tests: string; // JavaScript test code
  description?: string;
}

export interface PostmanCollection {
  info: {
    name: string;
    description: string;
    schema: string;
  };
  item: PostmanFolder[];
  variable?: { key: string; value: string }[];
}

export interface PostmanFolder {
  name: string;
  item: (PostmanRequest | PostmanFolder)[];
  description?: string;
}

export interface PostmanEnvironment {
  name: string;
  values: {
    key: string;
    value: string;
    enabled: boolean;
  }[];
}

export class PostmanGenerator {
  private aiAdapter: AIAdapter;

  constructor(aiAdapter: AIAdapter) {
    this.aiAdapter = aiAdapter;
  }

  /**
   * Generate Postman collection from API specification
   */
  async generateCollection(
    projectName: string,
    apiSpec: any,
    baseUrl: string = '{{base_url}}'
  ): Promise<PostmanCollection> {
    const endpoints = apiSpec.apiDesign?.endpoints || [];

    if (endpoints.length === 0) {
      throw new Error('No API endpoints found in specification');
    }

    // Group endpoints by resource/category
    const grouped = this.groupEndpointsByResource(endpoints);

    // Generate folders and requests
    const items: PostmanFolder[] = [];

    for (const [resource, resourceEndpoints] of Object.entries(grouped)) {
      const requests = await Promise.all(
        resourceEndpoints.map(endpoint =>
          this.generateRequest(endpoint, baseUrl)
        )
      );

      items.push({
        name: resource,
        item: requests,
        description: `${resource} related endpoints`,
      });
    }

    return {
      info: {
        name: `${projectName} API`,
        description: `API collection for ${projectName}`,
        schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
      },
      item: items,
      variable: [
        { key: 'base_url', value: 'http://localhost:3000' },
        { key: 'api_key', value: '' },
        { key: 'auth_token', value: '' },
      ],
    };
  }

  /**
   * Generate single Postman request from API endpoint
   */
  private async generateRequest(
    endpoint: any,
    baseUrl: string
  ): Promise<PostmanRequest> {
    const tests = await this.generateTests(endpoint);

    const request: PostmanRequest = {
      name: endpoint.description || `${endpoint.method} ${endpoint.path}`,
      method: endpoint.method,
      url: `${baseUrl}${endpoint.path}`,
      headers: [
        { key: 'Content-Type', value: 'application/json' },
        { key: 'Authorization', value: 'Bearer {{auth_token}}' },
      ],
      tests,
      description: endpoint.description,
    };

    // Add request body for POST/PUT/PATCH
    if (['POST', 'PUT', 'PATCH'].includes(endpoint.method) && endpoint.requestBody) {
      request.body = {
        mode: 'raw',
        raw: JSON.stringify(JSON.parse(endpoint.requestBody), null, 2),
      };
    }

    return request;
  }

  /**
   * Generate test assertions for endpoint
   */
  private async generateTests(endpoint: any): Promise<string> {
    const prompt = `Generate Postman test assertions for this API endpoint:

Method: ${endpoint.method}
Path: ${endpoint.path}
Description: ${endpoint.description}
Expected Response: ${endpoint.response}

Generate JavaScript test code that:
1. Checks status code (200, 201, etc.)
2. Validates response structure
3. Checks response time
4. Validates data types
5. Checks for required fields

Example format:
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has correct structure", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('id');
    pm.expect(jsonData).to.have.property('name');
});

Return ONLY the JavaScript test code, no explanation.`;

    return await this.aiAdapter.generateText(prompt, 800);
  }

  /**
   * Group endpoints by resource (users, products, orders, etc.)
   */
  private groupEndpointsByResource(endpoints: any[]): Record<string, any[]> {
    const grouped: Record<string, any[]> = {};

    endpoints.forEach(endpoint => {
      // Extract resource from path (/api/users/123 -> users)
      const pathParts = endpoint.path.split('/').filter((p: string) => p);
      const resource = pathParts[1] || pathParts[0] || 'General';
      const resourceName = resource.charAt(0).toUpperCase() + resource.slice(1);

      if (!grouped[resourceName]) {
        grouped[resourceName] = [];
      }

      grouped[resourceName].push(endpoint);
    });

    return grouped;
  }

  /**
   * Generate environments (dev, staging, prod)
   */
  generateEnvironments(projectName: string): {
    dev: PostmanEnvironment;
    staging: PostmanEnvironment;
    prod: PostmanEnvironment;
  } {
    const baseEnv = {
      dev: {
        base_url: 'http://localhost:3000',
        api_key: 'dev-api-key',
        database_url: 'postgresql://localhost:5432/db_dev',
      },
      staging: {
        base_url: 'https://staging-api.example.com',
        api_key: 'staging-api-key',
        database_url: 'postgresql://staging.db.example.com:5432/db_staging',
      },
      prod: {
        base_url: 'https://api.example.com',
        api_key: '{{PROD_API_KEY}}',
        database_url: '{{PROD_DATABASE_URL}}',
      },
    };

    return {
      dev: {
        name: `${projectName} - Development`,
        values: Object.entries(baseEnv.dev).map(([key, value]) => ({
          key,
          value,
          enabled: true,
        })),
      },
      staging: {
        name: `${projectName} - Staging`,
        values: Object.entries(baseEnv.staging).map(([key, value]) => ({
          key,
          value,
          enabled: true,
        })),
      },
      prod: {
        name: `${projectName} - Production`,
        values: Object.entries(baseEnv.prod).map(([key, value]) => ({
          key,
          value,
          enabled: true,
        })),
      },
    };
  }

  /**
   * Export collection as JSON file
   */
  exportCollection(collection: PostmanCollection): string {
    return JSON.stringify(collection, null, 2);
  }

  /**
   * Export environment as JSON file
   */
  exportEnvironment(environment: PostmanEnvironment): string {
    return JSON.stringify(environment, null, 2);
  }

  /**
   * Generate Newman CLI commands for testing
   */
  generateNewmanCommands(
    collectionPath: string,
    environmentPath: string
  ): {
    runAll: string;
    runWithReporter: string;
    runWithEnvironment: string;
    cicd: string;
  } {
    return {
      runAll: `newman run "${collectionPath}" -e "${environmentPath}"`,
      runWithReporter: `newman run "${collectionPath}" -e "${environmentPath}" -r cli,json,html --reporter-html-export reports/newman-report.html`,
      runWithEnvironment: `newman run "${collectionPath}" -e "${environmentPath}" --env-var "api_key=YOUR_API_KEY"`,
      cicd: `newman run "${collectionPath}" -e "${environmentPath}" --bail --reporters cli,junit --reporter-junit-export reports/newman-results.xml`,
    };
  }

  /**
   * Generate package.json scripts for Newman
   */
  generatePackageScripts(): Record<string, string> {
    return {
      'test:api': 'newman run postman/collection.json -e postman/dev.environment.json',
      'test:api:staging': 'newman run postman/collection.json -e postman/staging.environment.json',
      'test:api:report': 'newman run postman/collection.json -e postman/dev.environment.json -r html --reporter-html-export reports/api-test-report.html',
      'test:api:ci': 'newman run postman/collection.json -e postman/dev.environment.json --bail -r junit --reporter-junit-export reports/api-test-results.xml',
    };
  }

  /**
   * Generate README for Postman testing
   */
  generateTestingGuide(projectName: string): string {
    return `# API Testing Guide - ${projectName}

## Postman Collection

The API collection is located in \`postman/collection.json\`

### Import to Postman

1. Open Postman
2. Click **Import** button
3. Select \`postman/collection.json\`
4. Import environments:
   - \`postman/dev.environment.json\`
   - \`postman/staging.environment.json\`
   - \`postman/prod.environment.json\`

### Manual Testing

1. Select environment (Dev/Staging/Prod)
2. Run individual requests or entire collection
3. Check **Tests** tab for assertions
4. View **Test Results** for pass/fail status

---

## Newman CLI Testing

Newman allows you to run Postman collections from the command line.

### Installation

\`\`\`bash
npm install -g newman
# or
npm install --save-dev newman
\`\`\`

### Run Tests

**Run all tests:**
\`\`\`bash
npm run test:api
\`\`\`

**Run with HTML report:**
\`\`\`bash
npm run test:api:report
# Report will be in: reports/api-test-report.html
\`\`\`

**Run for CI/CD:**
\`\`\`bash
npm run test:api:ci
# JUnit XML for CI/CD integration
\`\`\`

**Run specific environment:**
\`\`\`bash
npm run test:api:staging
\`\`\`

### Advanced Usage

**Run with custom API key:**
\`\`\`bash
newman run postman/collection.json \\
  -e postman/dev.environment.json \\
  --env-var "api_key=YOUR_API_KEY"
\`\`\`

**Run specific folder:**
\`\`\`bash
newman run postman/collection.json \\
  -e postman/dev.environment.json \\
  --folder "Users"
\`\`\`

**Run with delay between requests:**
\`\`\`bash
newman run postman/collection.json \\
  -e postman/dev.environment.json \\
  --delay-request 1000
\`\`\`

---

## CI/CD Integration

### GitHub Actions

\`\`\`yaml
- name: Run API Tests
  run: npm run test:api:ci

- name: Upload Test Results
  uses: actions/upload-artifact@v2
  with:
    name: api-test-results
    path: reports/api-test-results.xml
\`\`\`

### GitLab CI

\`\`\`yaml
api_tests:
  stage: test
  script:
    - npm install
    - npm run test:api:ci
  artifacts:
    reports:
      junit: reports/api-test-results.xml
\`\`\`

---

## Troubleshooting

**Problem: Tests failing**
- Check if API server is running
- Verify environment variables are set correctly
- Check API endpoint URLs

**Problem: Authentication errors**
- Verify \`auth_token\` or \`api_key\` in environment
- Check if token has expired
- Ensure correct authorization header format

**Problem: Slow tests**
- Add delays between requests: \`--delay-request 1000\`
- Reduce timeout: \`--timeout-request 10000\`
- Run specific folders instead of entire collection

---

## Test Report

After running tests, check:
- **reports/api-test-report.html** - Visual HTML report
- **reports/api-test-results.xml** - JUnit XML for CI/CD
- Console output for quick summary

---

## Next Steps

1. Import collection to Postman
2. Run manual tests to verify endpoints
3. Set up Newman for automated testing
4. Integrate with CI/CD pipeline
5. Monitor test results and fix failures
`;
  }
}
