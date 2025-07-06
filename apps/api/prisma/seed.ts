import { PrismaClient } from "@metrifacts/api/db";

const prisma = new PrismaClient();

const metricsData = [
  {
    name: "Daily active users",
    description: "Users who logged in today",
    category: "user-engagement",
    unit: "users",
    baseValue: 1200,
    trend: 1.02,
  },
  {
    name: "Session duration",
    description: "Average time spent per session",
    category: "user-engagement",
    unit: "minutes",
    baseValue: 25,
    trend: 1.001,
  },
  {
    name: "User retention",
    description: "Users returning after 7 days",
    category: "user-engagement",
    unit: "percentage",
    baseValue: 65,
    trend: 1.01,
  },
  {
    name: "API response time",
    description: "average api response time",
    category: "performance",
    unit: "milliseconds",
    baseValue: 150,
    trend: 0.99,
  },
  {
    name: "Error rate",
    description: "Failed requests percentage",
    category: "performance",
    unit: "percentage",
    baseValue: 3,
    trend: 0.98,
  },
  {
    name: "Daily revenue",
    description: "Revenue generated per day",
    category: "business",
    unit: "dollars",
    baseValue: 15_000,
    trend: 1.03,
  },
  {
    name: "Conversion rate",
    description: "Visitors who sign up",
    category: "business",
    unit: "percentage",
    baseValue: 4,
    trend: 1.005,
  },
];

async function main() {
  console.log("🌱 Starting seed...");

  await prisma.metricEntry.deleteMany();
  await prisma.metric.deleteMany();

  const metrics = await Promise.all(
    metricsData.map((data) =>
      prisma.metric.create({
        data: {
          name: data.name,
          description: data.description,
          category: data.category,
          unit: data.unit,
        },
      })
    )
  );

  console.log(`✅ Created ${metrics.length} metrics`);

  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 30);

  const allEntryPromises = metrics.map((metric, i) => {
    const config = metricsData[i];

    const entries: Array<{
      metricId: string;
      value: number;
      timestamp: Date;
    }> = [];

    for (let day = 0; day < 30; day++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + day);

      const trendMultiplier = config.trend ** day;
      const randomness = 0.9 + Math.random() * 0.2;
      const value = config.baseValue * trendMultiplier * randomness;

      entries.push({
        metricId: metric.id,
        value: Math.round(value * 100) / 100,
        timestamp: date,
      });
    }

    return prisma.metricEntry.createMany({ data: entries });
  });

  await Promise.all(allEntryPromises);

  console.log("✅ Generated 30 days of data for each metric");
  console.log("🎉 Seed completed! Your dashboard is ready.");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
