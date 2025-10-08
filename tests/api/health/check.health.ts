import { HealthRequest } from '@_src/api/requests/health.request';
import { expect, test as health } from '@_src/merge.fixture';

health('Application health check', async ({ request }) => {
  try {
    // Arrange
    const healthRequest = new HealthRequest(request);
    // Act
    const response = await healthRequest.get();
    const responseJson = await response.json();
    // Assert
    await expect(response).toBeOK();
    expect(responseJson.status).toBe(healthRequest.healthStatusOK);
  } catch (error) {
    throw new Error(
      `Application health check failed!\nMake sure that GAD is up and running\n\n${error.message}`,
    );
  }
});
