import { useGetConversationsQuery } from "@graphql";
import { useContext, useEffect } from "react";
import { createApiClient } from "../api/apiClient";
import { CustomIconsContext } from "../App";
import PencilSquareIcon from "../assets/PencilSquareIcon";
import XIcon from "../assets/XIcon";
import useConvoStack from "../hooks/useConvoStack";
import ConversationListItem from "./ConversationListItem";
import LoaderSpinner from "./LoaderSpinner";

interface ConversationListProps {
  onClickClose: () => void;
}

const ConversationList: React.FC<ConversationListProps> = ({
  onClickClose,
}) => {
  const icons = useContext(CustomIconsContext);
  const {
    graphqlUrl,
    styling,
    userData,
    openConversation,
    agent,
    context,
    createdFirstConversation,
  } = useConvoStack();
  const { data, isFetching, isLoading } = useGetConversationsQuery(
    createApiClient(graphqlUrl, userData)
  );
  const conversationArray =
    data !== undefined &&
    data?.getConversations !== null &&
    data?.getConversations !== undefined &&
    data?.getConversations.length > 0
      ? data.getConversations
      : [];
  useEffect(() => {
    if (
      !createdFirstConversation &&
      !isFetching &&
      conversationArray.length === 0
    ) {
      openConversation(null, agent, context);
    }
  }, [isFetching]);

  return (
    <>
      <div
        className={`w-full min-h-16 py-4 ${
          styling?.headerColor || "bg-blue-gradient"
        } sm:rounded-tl-lg sm:rounded-tr-lg sm:flex justify-between items-center hidden`}
      >
        <div
          className="left-0 absolute hover:cursor-pointer"
          onClick={() => {
            openConversation(null, agent, context);
          }}
        >
          {icons?.createNewConversationIcon || (
            <PencilSquareIcon className="w-6 h-6 ml-4" />
          )}
        </div>
        <div className="flex w-full">
          <p className="font-semibold mx-auto">
            {styling?.headerText || "ConvoStack Chat"}
          </p>
        </div>
      </div>
      <div
        className={`w-full min-h-36 ${
          styling?.headerColor || "bg-blue-gradient"
        } sm:rounded-tl-lg sm:rounded-tr-lg flex flex-wrap items-center py-4 sm:hidden justify-between`}
      >
        <div
          className="hover:cursor-pointer"
          onClick={() => openConversation(null, agent, context)}
        >
          {icons?.createNewConversationIcon || (
            <PencilSquareIcon className="w-6 h-6 ml-4" />
          )}
        </div>
        <div className="mx-auto">
          <p className="font-semibold mx-auto">
            {styling?.headerText || "ConvoStack Chat"}
          </p>
        </div>
        <div className="hover:cursor-pointer" onClick={onClickClose}>
          <XIcon className="w-6 h-6 mr-4" />
        </div>
      </div>
      <div className="bg-white flex-grow overflow-y-auto flex flex-col sm:rounded-b-lg pb-4">
        {isLoading ? (
          <LoaderSpinner className="mx-auto mt-8" />
        ) : (
          <>
            {conversationArray.length !== 0 &&
              conversationArray.map((item, index) => (
                <ConversationListItem
                  key={index}
                  title={item.title || ""}
                  headline={item.lastMessage?.content || ""}
                  updatedAt={item.lastMessage?.createdAt || ""}
                  conversationId={item.id}
                  avatarUrl={item.agent.avatarUrl || ""}
                />
              ))}
          </>
        )}
      </div>
    </>
  );
};

export default ConversationList;
