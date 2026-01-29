import prisma from "../config/prisma";

export const getSetting = async (key: string) => {
  return prisma.setting.findUnique({ where: { key } });
};

export const upsertSetting = async (key: string, value: string) => {
  return prisma.setting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
};
