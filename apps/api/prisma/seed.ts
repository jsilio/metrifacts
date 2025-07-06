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
    unit: "%",
    baseValue: 65,
    trend: 1.01,
  },
  {
    name: "API response time",
    description: "Average API response time",
    category: "performance",
    unit: "ms",
    baseValue: 150,
    trend: 0.99,
  },
  {
    name: "Error rate",
    description: "Failed requests percentage",
    category: "performance",
    unit: "%",
    baseValue: 3,
    trend: 0.98,
  },
  {
    name: "Monthly recurring revenue",
    description: "Predictable monthly revenue from subscriptions",
    category: "business",
    unit: "USD",
    baseValue: 125_000,
    trend: 1.08,
  },
  {
    name: "Daily revenue",
    description: "Revenue generated per day",
    category: "business",
    unit: "USD",
    baseValue: 15_000,
    trend: 1.03,
  },
  {
    name: "Conversion rate",
    description: "Visitors who sign up",
    category: "business",
    unit: "%",
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

  const now = new Date();

  const allEntryPromises = metrics.map((metric, i) => {
    const config = metricsData[i];
    const entries: Array<{
      metricId: string;
      value: number;
      timestamp: Date;
    }> = [];

    for (let hour = 23; hour >= 0; hour--) {
      const date = new Date(now);
      date.setHours(date.getHours() - hour);
      date.setMinutes(0);
      date.setSeconds(0);
      date.setMilliseconds(0);

      const hourlyTrend = config.trend ** (hour / 24);
      const randomness = 0.8 + Math.random() * 0.4;
      const value = config.baseValue * hourlyTrend * randomness;

      entries.push({
        metricId: metric.id,
        value: Math.round(value * 100) / 100,
        timestamp: date,
      });
    }

    for (let day = 30; day >= 1; day--) {
      const date = new Date(now);
      date.setDate(date.getDate() - day);
      date.setHours(12, 0, 0, 0);

      const dailyTrend = config.trend ** day;
      const randomness = 0.85 + Math.random() * 0.3;
      const value = config.baseValue * dailyTrend * randomness;

      entries.push({
        metricId: metric.id,
        value: Math.round(value * 100) / 100,
        timestamp: date,
      });
    }

    return prisma.metricEntry.createMany({ data: entries });
  });

  await Promise.all(allEntryPromises);

  console.log("✅ Generated hourly data for last 24 hours");
  console.log("✅ Generated daily data for last 30 days");
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
