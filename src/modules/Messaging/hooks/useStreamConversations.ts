"use client"

import { useState, useEffect, useContext } from 'react';
import { XmtpContext } from '../context/XmtpContext';
import { useAccount, useWalletClient } from 'wagmi';
import { Conversation, Stream } from '@xmtp/xmtp-js';
import { buildChatMessage, CONVERSATION_PREFIX } from '../utils/messaging';
import { useChainId } from '../../../hooks/useChainId';

const useStreamConversations = () => {
  const chainId = useChainId();
  const { data: walletClient } = useWalletClient({
    chainId,
  });
  const { address: walletAddress } = useAccount();
  const { providerState, setProviderState } = useContext(XmtpContext);
  const [stream, setStream] = useState<Stream<Conversation> | undefined>();

  useEffect(() => {
    if (!providerState?.conversations || !providerState?.client || !setProviderState) return;

    const streamConversations = async () => {
      const newStream = await providerState.client?.conversations.stream();
      if (!newStream) return;
      // /!\ in ex was set to 'stream' instead of 'newStream'
      setStream(newStream);
      for await (const conversation of newStream) {
        if (
          conversation.peerAddress !== (await walletAddress) &&
          conversation.context?.conversationId.startsWith(CONVERSATION_PREFIX)
        ) {
          //If a new conversation is detected, we get its messages
          const messages = await conversation.messages();
          const chatMessages = messages.map(msg => {
            return buildChatMessage(msg);
          });
          providerState.conversationMessages.set(conversation.peerAddress, chatMessages);
          providerState.conversations.set(conversation.peerAddress, conversation);
          setProviderState({
            ...providerState,
            conversationMessages: providerState.conversationMessages,
            conversations: providerState.conversations,
          });
        }
      }
    };

    streamConversations();

    return () => {
      const closeStream = async () => {
        if (!stream) return;
        await stream.return();
      };
      closeStream();
    };
  }, [providerState?.conversations]);
};

export default useStreamConversations;
