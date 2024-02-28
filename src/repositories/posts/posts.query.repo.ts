import { ObjectId } from 'bson';
import { postCollection } from '../../db/db';
import { IPostOutput } from '../../models/posts/output.types';
import { postMapper } from '../../models/posts/postMapper/postMapper';
import { IOutputModel } from '../../models/common.types';
import { IQueryPostData } from '../../models/posts/query.types';

export class PostQueryRepository {
  static async getAll(sortData: IQueryPostData): Promise<IOutputModel<IPostOutput>> {
    let { pageNumber, pageSize, sortBy, sortDirection } = sortData;
    pageNumber = Number(pageNumber);
    pageSize = Number(pageSize);
    const filter = {};

    const posts = await postCollection
      .find(filter)
      .sort(sortBy, sortDirection)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .toArray();

    const totalCount = await postCollection.countDocuments(filter);
    const pagesCount = Math.ceil(totalCount / pageSize);
    return {
      items: posts.map(postMapper),
      page: pageNumber,
      pagesCount,
      pageSize,
      totalCount,
    };
  }
  static async getPostById(id: string): Promise<IPostOutput | null> {
    const post = await postCollection.findOne({ _id: new ObjectId(id) });
    if (post) return postMapper(post);
    return null;
  }
}
