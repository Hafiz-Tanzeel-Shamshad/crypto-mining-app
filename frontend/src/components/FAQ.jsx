import { useState } from 'react';
import './FAQ.css';
import Footer from './Footer';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: " What are Kinzoo Energy Points?",
      answer: "Kinzoo Energy Points are loyalty and mining rewards earned by early supporters of the Kinzoo Protocol. They represent your activity and contribution before our token launch."
    },
    {
      question: " Will Kinzoo Energy Points convert into $KINZ tokens?",
      answer: "Yes! All Kinzoo Energy Points will be convertible into $KINZ tokens at TGE (Token Generation Event). The more Energy Points you earn, the more $KINZ you'll be able to claim."
    },
    {
      question: " What is the conversion ratio from Energy Points to $KINZ?",
      answer: "The conversion ratio will be officially announced before the TGE. It will be designed to fairly reward early contributors and miners."
    },
    {
      question: " Can I create multiple accounts to earn more points?",
      answer: "No. Multi-accounting, bot activity, or any form of cheating is strictly prohibited. Offenders will be suspended permanently and forfeit all Energy Points."
    },
    {
      question: " Is there a minimum amount of Energy Points required to participate in TGE?",
      answer: "No minimum required. Whether you've earned a little or a lot, every valid Energy Point counts and will be convertible at TGE."
    },
    {
      question: " When is the TGE?",
      answer: "The official date will be announced soon. Stay tuned on our socials and Discord for updates."
    }
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };
  return (
    <div className="faq-page">
      <div className="faq-content">
        <div className="faq-container">
          <h2 className="faq-title">🔋 KINZOO Energy Points — FAQ</h2>
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className={`faq-item ${activeIndex === index ? 'active' : ''}`}
                onClick={() => toggleFAQ(index)}
              >
                <div className="faq-question">
                  {faq.question}
                  <span className="faq-toggle">{activeIndex === index ? '−' : '+'}</span>
                </div>
                <div className="faq-answer">
                  {faq.answer}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FAQ;