// File Path: src/api.js

const API_BASE_URL = "http://localhost:8000";

// 1. Sabhi incidents fetch karne ke liye
export async function fetchIncidents() {
  try {
    const response = await fetch(`${API_BASE_URL}/incidents`);
    if (!response.ok) {
      throw new Error("Incidents fetch karne mein masla hua");
    }
    return await response.json();
  } catch (error) {
    console.error("API Error (fetchIncidents):", error);
    throw error;
  }
}

// 2. Kisi ek specific incident ki detail fetch karne ke liye
export async function fetchIncidentById(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/incidents/${id}`);
    if (!response.ok) {
      throw new Error("Incident details fetch nahi ho sakein");
    }
    return await response.json();
  } catch (error) {
    console.error("API Error (fetchIncidentById):", error);
    throw error;
  }
}

// 3. Incident approve karne ke liye
export async function approveIncident(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/incidents/${id}/approve`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Approve karne mein masla hua");
    }
    return await response.json();
  } catch (error) {
    console.error("API Error (approveIncident):", error);
    throw error;
  }
}

// 4. Log simulation / detection pipeline run karne ke liye
export async function runPipeline() {
  try {
    const response = await fetch(`${API_BASE_URL}/run`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Pipeline run karne mein masla hua");
    }
    return await response.json();
  } catch (error) {
    console.error("API Error (runPipeline):", error);
    throw error;
  }
}