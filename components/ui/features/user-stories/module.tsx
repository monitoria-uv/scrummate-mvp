import { UserStoriesChatHeader } from '@/components/ui/features/user-stories/userStoriesChatHeader';
import { UserStoriesChatWindow } from '@/components/ui/features/user-stories/userStoriesChatWindow';
import { Footer } from '@/components/ui/features/footer';

export default function UserStoriesModule() {
  return (
    <>
      <UserStoriesChatHeader />
      <UserStoriesChatWindow chatId="user-stories-chat" />
      <Footer />
    </>
  );
}
