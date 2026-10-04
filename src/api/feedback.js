import api from "./axios";

export const feedbackApi = {
  submit: (payload, screenshot) => {
    const formData = new FormData();
    formData.append(
      "data",
      new Blob([JSON.stringify(payload)], { type: "application/json" })
    );
    if (screenshot) {
      formData.append("screenshot", screenshot);
    }
    return api
      .post("/feedback", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data);
  },
};