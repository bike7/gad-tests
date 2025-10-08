import { CommentPayload } from '@_src/api/models/comment-payload.api.model';
import { Headers } from '@_src/api/models/headers.api.model';
import { apiEndpoints } from '@_src/api/utils/api.util';
import { APIRequestContext, APIResponse } from '@playwright/test';

export class CommentsRequest {
  endpoint: string;

  constructor(
    protected request: APIRequestContext,
    protected authorizationHeader?: Headers,
  ) {
    this.endpoint = apiEndpoints.comments;
  }

  async get(commentId?: number): Promise<APIResponse> {
    const url = commentId ? `${this.endpoint}/${commentId}` : this.endpoint;
    const response = await this.request.get(url);
    return response;
  }

  async post(commentData: CommentPayload): Promise<APIResponse> {
    return await this.request.post(this.endpoint, {
      headers: this.authorizationHeader,
      data: commentData,
    });
  }

  async put(
    commentId: number,
    commentData: CommentPayload,
  ): Promise<APIResponse> {
    return await this.request.put(`${this.endpoint}/${commentId}`, {
      headers: this.authorizationHeader,
      data: commentData,
    });
  }

  async patch(
    commentId: number,
    commentData: Partial<CommentPayload>,
  ): Promise<APIResponse> {
    return await this.request.patch(`${this.endpoint}/${commentId}`, {
      headers: this.authorizationHeader,
      data: commentData,
    });
  }

  async delete(commentId: number): Promise<APIResponse> {
    return await this.request.delete(`${this.endpoint}/${commentId}`, {
      headers: this.authorizationHeader,
    });
  }
}
