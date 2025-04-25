import { GoodPracticesChatHeader } from '@/components/ui/features/good-practices/goodPracticesChatHeader';
import { GoodPracticesChatWindow } from '@/components/ui/features/good-practices/goodPracticesChatWindow';
import { Footer } from '@/components/ui/features/footer';

export default function GoodPracticesModule() {
  return (
    <>
      <GoodPracticesChatHeader />
      <GoodPracticesChatWindow chatId={'good-practices-chat'} />
      <Footer />
    </>
  );
}
