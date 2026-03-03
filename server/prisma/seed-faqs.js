const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const faqs = [
  {
    category: 'Flood Monitoring',
    question: 'What is Hydro Guard 180?',
    answer: 'Hydro Guard 180 is a comprehensive flood monitoring and emergency response system designed specifically for Barangay 180 in Caloocan City. It uses IoT water-level sensors to provide real-time data and automated alerts to protect our community from flood-related disasters.',
    isPublished: true,
    order: 1,
  },
  {
    category: 'Flood Monitoring',
    question: 'How does the water monitoring system work?',
    answer: 'Our IoT water-level monitoring device continuously measures water levels at critical points in the barangay. The device sends readings every 1-5 minutes to our system, which automatically classifies the flood risk level and triggers appropriate alerts and safety protocols.',
    isPublished: true,
    order: 2,
  },
  {
    category: 'Flood Monitoring',
    question: 'How often is the water level updated?',
    answer: 'Water level data is updated every 1 to 5 minutes, depending on the current alert level. During critical situations, readings are taken more frequently to ensure accurate and timely information.',
    isPublished: true,
    order: 3,
  },
  {
    category: 'Alert System',
    question: 'What are the different alert levels?',
    answer: 'Our system uses four alert levels: Level 1 (Normal) - no flood risk; Level 2 (Advisory) - elevated water levels, stay informed; Level 3 (Warning) - significant flood risk, prepare to evacuate; Level 4 (Critical) - immediate danger, evacuate now.',
    isPublished: true,
    order: 4,
  },
  {
    category: 'Alert System',
    question: 'How will I be notified of flood alerts?',
    answer: 'Flood alerts are communicated through multiple channels: our website dashboard, SMS notifications to registered residents, barangay PA system announcements, and social media posts on the official Barangay 180 accounts.',
    isPublished: true,
    order: 5,
  },
  {
    category: 'Evacuation',
    question: 'Where are the evacuation centers?',
    answer: 'The primary evacuation centers are Barangay 180 Multi-Purpose Hall, Caloocan North High School, and the community basketball court. Specific assignments depend on your zone. Check the Training page for detailed information about each center.',
    isPublished: true,
    order: 6,
  },
  {
    category: 'Evacuation',
    question: 'What should I bring to an evacuation center?',
    answer: 'Bring your go-bag with essentials: valid IDs, important documents in waterproof bags, medications, first aid kit, flashlight, batteries, portable phone charger, water and non-perishable food for 3 days, change of clothes, and blankets.',
    isPublished: false,
    order: 7,
  },
];

async function seedFaqs() {
  try {
    console.log('Seeding FAQs...');
    
    // Check if FAQs already exist
    const existingFaqs = await prisma.fAQ.count();
    if (existingFaqs > 0) {
      console.log(`FAQs already exist (${existingFaqs} found). Skipping seed.`);
      return;
    }

    // Create FAQs
    for (const faq of faqs) {
      await prisma.fAQ.create({
        data: faq,
      });
    }

    console.log(`✅ Successfully seeded ${faqs.length} FAQs`);
  } catch (error) {
    console.error('Error seeding FAQs:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedFaqs();
