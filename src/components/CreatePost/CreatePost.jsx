import { Card, Input, useDisclosure } from "@heroui/react";
import React from "react";
import FormModal from "./FormModal";

function CreatePost({ fetchAllPosts }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const DEFAULT_AVATAR =
    "https://cdn-icons-png.flaticon.com/512/149/149071.png";
  return (
    <>
      <Card className="mb-4 p-4 bg-white rounded-lg shadow-sm">
        <h3 className="text-pink-600 text-xl mb-4 font-serif">Create Post</h3>
        <div className="flex items-center justify-content gap-5">
          <img
            src={DEFAULT_AVATAR}
            alt="Default Avatar"
            className="w-15 h-15 rounded-full shrink-0"
          />
          <Input
            onClick={onOpen}
            isReadOnly
            type="text"
            placeholder="What's on your mind?"
            className="flex-1 bg-gray-100 rounded-full px-4 py-2 focus:outline-none focus:ring-2  focus:ring-pink-500"
          />
          <FormModal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            fetchAllPosts={fetchAllPosts}
          />
        </div>
      </Card>
    </>
  );
}

export default CreatePost;
