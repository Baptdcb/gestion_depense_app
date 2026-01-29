import api from "./api";

export interface Setting {
  key: string;
  value: string;
}

export const getSetting = async (key: string): Promise<string | null> => {
  try {
    const { data } = await api.get(`/settings/${key}`);
    return data?.value || null;
  } catch (error) {
    return null;
  }
};

export const updateSetting = async (
  key: string,
  value: string,
): Promise<Setting> => {
  const { data } = await api.put(`/settings/${key}`, { value });
  return data;
};
