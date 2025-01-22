import type { ChatMessage, ChatSession } from '~~/types/chat';

export function useMessageList(curSession: ChatSession) {
  const messageList = computed(() => {
    const messages: ChatMessage[] = [];
    curSession.chats.map((chatItem, chatIndex) => {
      const isLastChat = chatIndex === curSession.chats.length - 1;

      messages.push({
        id: chatItem.id,
        role: 'user',
        content: chatItem.query,
        date: chatItem.date,
        modeId: '',
        _isLastChat: isLastChat,
      });
      chatItem.answers.forEach((citem) => {
        citem._isLastChat = isLastChat;
      });
      messages.push(...chatItem.answers);
    });
    return messages;
  });

  return {
    messageList,
  };
}
