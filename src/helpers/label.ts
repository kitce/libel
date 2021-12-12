import { ISource } from './../models/Label';
import { IPost } from './../types/post';

export const mapPostToSource = (post: IPost): ISource => {
  return {
    thread: post.thread_id,
    page: post.page,
    messageNumber: post.msg_num
  };
};
