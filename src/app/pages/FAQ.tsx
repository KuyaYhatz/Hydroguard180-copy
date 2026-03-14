import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../components/ui/accordion';
import { Input } from '../components/ui/input';
import { faqsAPI } from '../utils/api';

export function FAQ() {
  const [searchQuery, setSearchQuery] = useState('');
  const [publishedFaqs, setPublishedFaqs] = useState<any[]>([]);

  useEffect(() => {
    loadFaqs();
  }, []);

  const loadFaqs = async () => {
    try {
      const data = await faqsAPI.getPublic();
      setPublishedFaqs(data);
    } catch (error) {
      console.error('Error loading FAQs:', error);
      setPublishedFaqs([]);
    }
  };

  // Group by category
  const faqs = Object.entries(
    publishedFaqs.reduce<Record<string, { q: string; a: string }[]>>((acc, faq) => {
      if (!acc[faq.category]) acc[faq.category] = [];
      acc[faq.category].push({ q: faq.question, a: faq.answer });
      return acc;
    }, {})
  ).map(([category, questions]) => ({ category, questions }));

  const filteredFaqs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(
      faq =>
        faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.a.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter(category => category.questions.length > 0);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#26343A] to-[#1a252a] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Everything you need to know about Hydro Guard 180 and flood safety
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="text"
              placeholder="Search for questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 bg-white shadow-lg text-lg"
            />
          </div>
        </motion.div>
      </section>

      {/* FAQ Sections */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No questions found matching your search.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {filteredFaqs.map((category, idx) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <h2 className="text-2xl font-bold text-[#1F2937] mb-6 pb-2 border-b-2 border-[#FF6A00]">
                  {category.category}
                </h2>
                <Accordion type="single" collapsible className="space-y-4">
                  {category.questions.map((faq, faqIdx) => (
                    <AccordionItem
                      key={faqIdx}
                      value={`${category.category}-${faqIdx}`}
                      className="bg-white border border-gray-200 rounded-lg px-6 shadow-sm"
                    >
                      <AccordionTrigger className="text-left hover:no-underline">
                        <span className="font-semibold text-[#1F2937]">{faq.q}</span>
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600 leading-relaxed">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Contact CTA */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-[#1F2937] mb-4">Still have questions?</h2>
            <p className="text-gray-600 mb-6">
              Our team is here to help. Contact us for more information.
            </p>
            <a
              href="/contact"
              className="inline-block px-6 py-3 bg-[#FF6A00] text-white rounded-md font-medium hover:bg-[#E55F00] transition-colors"
            >
              Contact Us
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
