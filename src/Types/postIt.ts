export type PostItNodeElement = {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: {
    id: string;
    title: string;
    description: string;
    //Holds on in progress - Jerald
    comments: Comment[];
  };
};

export type PostItNoteItem = {
  id: string;
  title: string;
  description: string;
  pinned: boolean;
  comments?: Comment[];
};

export type Comment = {
  userId: string;
  commentId: string;
  comment: string;
};
