'use client';

import Lottie from 'lottie-react';
import chatbotLottie from '@/shared/assets/lottie/mov_chatbot.json';

interface ChatWelcomeHeroProps {
  subtitle: string;
  userName?: string;
}

export const ChatWelcomeHero = ({ subtitle, userName = '영숙님' }: ChatWelcomeHeroProps) => {
  return (
    <>
      <h2 className="txt-fade-up txt-fade-up--title text-[26px] md:text-5xl font-bold leading-[1.2]">
        안녕하세요. <span className="text-primary">{userName} :)</span>
      </h2>
      <p className="txt-fade-up txt-fade-up--desc mt-1.5 text-sm md:text-lg text-gray-300">{subtitle}</p>

      <div className="mt-4 md:mt-5 h-[50px] md:h-[60px] w-[50px] md:w-[60px]">
        <Lottie animationData={chatbotLottie} loop autoplay className="h-full w-full" />
      </div>
    </>
  );
};
