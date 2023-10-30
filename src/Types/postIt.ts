export type PostItNodeElement = {
    id: string;
    type: string;
    position: { x: number; y: number };
    data: { id:string, title: string , description: string};
  };

export type PostItNoteItem = {
  id: string;
  title: string;
  description: string;
}