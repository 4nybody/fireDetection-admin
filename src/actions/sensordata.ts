export async function getSensorDataBySystem(systemId: string) {
    const response = await fetch(`/api/sensors?system_id=${systemId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch sensor data');
    }
    return response.json(); // assuming the response is in JSON format
  }