## Postman Collection

The Postman collection and related resources are located in the `Postman` folder. Inside this folder, you will find the collection files and a video (brief_postman_video.mp4) demonstrating how to run the tests.

## Playwright Tests

The Playwright tests are located in the `playwright/tests` folder. The video located in `Playwright` folder (brief_playwright_video.mp4). To run these tests, follow the steps below:

1. Clone this repository to your local machine.
2. Run the following command to install the necessary dependencies:

   ```bash
   npm install
   ```

3. After the dependencies are installed, navigate to the `tests` folder:

   ```bash
   cd playwright/tests
   ```

4. To run the tests, use the following command:

   ```bash
   npx playwright test test.spec.ts
   ```

This will start the Playwright test runner and execute the `test.spec.ts` file.

## Important Note: 

The login credentials provided in this repository are for testing purposes only. In real projects, sensitive data such as credentials should never be stored directly in the repository. Instead, they should be kept in a separate .env file for security.
