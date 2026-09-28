const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding EcoRoute SQLite database...");

  // Clean existing seed data
  await prisma.notification.deleteMany();
  await prisma.civicComplaint.deleteMany();
  await prisma.reportComment.deleteMany();
  await prisma.reportConfirmation.deleteMany();
  await prisma.communityReport.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.expense.deleteMany();
  await prisma.savedLocation.deleteMany();
  await prisma.emergencyContact.deleteMany();
  await prisma.travelPreference.deleteMany();
  await prisma.ecoStreak.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("password123", 10);

  // 1. Create main demo user
  const user = await prisma.user.create({
    data: {
      id: "demo-user-1",
      email: "commuter@ecoroute.in",
      name: "Aarav Sharma",
      mobile: "+91 98100 12345",
      passwordHash: passwordHash,
      role: "user",
      isVerified: true,
      profile: {
        create: {
          bio: "Sustainable commuter across Delhi & Gurugram. Metro first, EV second.",
          homeAddress: "Connaught Place (Rajiv Chowk), New Delhi",
          workAddress: "DLF Cyber City, Phase 2, Gurugram",
          collegeAddress: "North Campus, Delhi University",
          city: "Delhi",
          state: "Delhi",
          pincode: "110001",
        },
      },
      travelPreferences: {
        create: {
          preferredMode: "Metro",
          maxWalkingMinutes: 15,
          maxBudgetPerDay: 250,
          ecoPreference: true,
          accessibilityMode: false,
        },
      },
      ecoStreaks: {
        create: {
          currentDays: 7,
          longestDays: 14,
          totalCo2Saved: 42.6,
          totalEcoTrips: 28,
        },
      },
      emergencyContacts: {
        create: [
          {
            name: "Sunita Sharma",
            relationship: "Mother",
            phone: "+91 98100 54321",
            email: "sunita@example.com",
            isPrimary: true,
          },
          {
            name: "Rohan Sharma",
            relationship: "Brother",
            phone: "+91 98111 67890",
            email: "rohan@example.com",
            isPrimary: false,
          },
        ],
      },
      savedLocations: {
        create: [
          {
            label: "Home",
            name: "Connaught Place (Rajiv Chowk)",
            address: "Connaught Place, Central Delhi, 110001",
            lat: 28.6328,
            lng: 77.2197,
            icon: "🏠",
            isFavourite: true,
          },
          {
            label: "Work",
            name: "DLF Cyber City, Gurugram",
            address: "DLF Cyber City, Phase 2, Gurugram, 122002",
            lat: 28.4950,
            lng: 77.0889,
            icon: "💼",
            isFavourite: true,
          },
          {
            label: "College",
            name: "North Campus, DU",
            address: "University of Delhi, North Campus, 110007",
            lat: 28.6903,
            lng: 77.2072,
            icon: "🎓",
            isFavourite: false,
          },
          {
            label: "Airport",
            name: "IGI Airport Terminal 3",
            address: "Indira Gandhi International Airport, New Delhi",
            lat: 28.5562,
            lng: 77.1000,
            icon: "✈️",
            isFavourite: false,
          },
          {
            label: "Noida Hub",
            name: "Noida Sector 62",
            address: "Electronic City, Sector 62, Noida, 201309",
            lat: 28.6258,
            lng: 77.3653,
            icon: "🏢",
            isFavourite: false,
          },
        ],
      },
      tickets: {
        create: [
          {
            ticketType: "Metro",
            operator: "DMRC",
            fromStation: "Connaught Place (Rajiv Chowk)",
            toStation: "DLF Cyber City (Sikanderpur)",
            passengerCount: 1,
            fare: 60,
            ticketNumber: "DMRC-" + Math.floor(100000 + Math.random() * 900000),
            qrCode: "DMRC-TKT-LIVE-" + Date.now(),
            status: "active",
            validFrom: new Date(),
            validUntil: new Date(Date.now() + 6 * 3600 * 1000),
            isDemo: false,
          },
          {
            ticketType: "Bus",
            operator: "DTC Electric",
            fromStation: "Connaught Place",
            toStation: "Dhaula Kuan",
            passengerCount: 1,
            fare: 15,
            ticketNumber: "DTC-" + Math.floor(100000 + Math.random() * 900000),
            qrCode: "DTC-BUS-LIVE-" + Date.now(),
            status: "active",
            validFrom: new Date(),
            validUntil: new Date(Date.now() + 12 * 3600 * 1000),
            isDemo: false,
          },
        ],
      },
      notifications: {
        create: [
          {
            type: "transit",
            title: "DMRC Yellow Line Optimal",
            message: "High frequency service with 2.5 min headway active between Rajiv Chowk and Millennium City Centre.",
            isRead: false,
            isCritical: false,
          },
          {
            type: "weather",
            title: "Delhi Air Quality Notice",
            message: "AQI at 142 (Moderate). Commuters via open autos/two-wheelers are advised to wear N95 pollution masks.",
            isRead: false,
            isCritical: false,
          },
          {
            type: "traffic",
            title: "Traffic Congestion on NH-48",
            message: "Slow movement near Mahipalpur flyover towards Gurugram. Delhi Metro Airport/Yellow Line recommended.",
            isRead: true,
            isCritical: false,
          },
        ],
      },
      communityReports: {
        create: [
          {
            category: "Pothole",
            title: "Large pothole on ITO Vikas Marg ramp",
            description: "Deep pothole causing sudden braking on the descent towards ITO crossing.",
            address: "ITO Crossing, Vikas Marg, New Delhi",
            lat: 28.6290,
            lng: 77.2456,
            severity: "high",
            status: "open",
            upvotes: 14,
            isVerified: true,
          },
          {
            category: "Waterlogging",
            title: "Waterlogging after rain under Moolchand flyover",
            description: "Left lane submerged, traffic bottleneck in morning rush hour.",
            address: "Moolchand Underpass, Ring Road, New Delhi",
            lat: 28.5684,
            lng: 77.2341,
            severity: "high",
            status: "acknowledged",
            upvotes: 27,
            isVerified: true,
          },
        ],
      },
      civicComplaints: {
        create: [
          {
            category: "Traffic Signal",
            title: "Traffic signal timing issue at Dhaula Kuan round-about",
            description: "Green signal lasts only 12 seconds causing 1.5 km queue towards AIIMS.",
            address: "Dhaula Kuan Intersection, Ring Road, New Delhi",
            lat: 28.5916,
            lng: 77.1614,
            department: "Delhi Traffic Police (Civic Grievance)",
            draftText: "Formal request to recalibrate Dhaula Kuan intersection green corridor signal cycle.",
            referenceNo: "DTP-2026-98124",
            status: "submitted",
            submittedAt: new Date(),
          },
        ],
      },
      achievements: {
        create: [
          {
            type: "first_trip",
            title: "Green Pioneer",
            description: "Completed your first multimodal zero-emission commute",
            badge: "🌱",
          },
          {
            type: "carbon_saver",
            title: "Clean Air Champion",
            description: "Saved over 25 kg of carbon emissions taking public transit",
            badge: "🏆",
          },
        ],
      },
    },
  });

  console.log("Seeding complete! User created:", user.email, "id:", user.id);
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
