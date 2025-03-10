export const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "SumMate API",
      version: "1.0.0",
      description: "API for managing SumMate",
    },
    components: {
      schemas: {
        User: {
          type: "object",
          properties: {
            _id: { type: "string" },
            email: { type: "string" },
            password: { type: "string" },
            username: { type: "string" },
            photo: { type: "string" },
            tokens: {
              type: "array",
              items: { type: "string" },
            },
          },
          required: ["email", "password", "username"],
        },
        Post: {
          type: "object",
          properties: {
            _id: { type: "string" },
            owner: { $ref: "#/components/schemas/User" },
            content: { type: "string" },
            photoSrc: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            likedBy: {
              type: "array",
              items: { $ref: "#/components/schemas/User" },
            },
            comments: {
              type: "array",
              items: { $ref: "#/components/schemas/Comment" },
            },
          },
          required: ["owner", "content"],
        },
        Comment: {
          type: "object",
          properties: {
            _id: { type: "string" },
            content: { type: "string" },
            user: { $ref: "#/components/schemas/User" },
          },
          required: ["content", "user"],
        },
      },
    },
    paths: {
      "/auth/login": {
        post: {
          summary: "Login a user",
          tags: ["auth"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    username: { type: "string" },
                    password: { type: "string" },
                  },
                  required: ["username", "password"],
                },
              },
            },
          },
          responses: {
            200: {
              description: "User logged in",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      accessToken: { type: "string" },
                      refreshToken: { type: "string" },
                      user: { $ref: "#/components/schemas/User" },
                    },
                  },
                },
              },
            },
            500: {
              description: "Invalid credentials",
            },
          },
        },
      },
      "/auth/register": {
        post: {
          summary: "Register a new user",
          tags: ["auth"],
          requestBody: {
            required: true,
            content: {
              "multipart/form-data": {
                schema: {
                  type: "object",
                  properties: {
                    user: { type: "string" },
                    file: { type: "string", format: "binary" },
                  },
                  required: ["user"],
                },
              },
            },
          },
          responses: {
            201: {
              description: "User registered",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      accessToken: { type: "string" },
                      refreshToken: { type: "string" },
                      user: { $ref: "#/components/schemas/User" },
                    },
                  },
                },
              },
            },
            400: {
              description: "User already exists",
            },
            500: {
              description: "Server error",
            },
          },
        },
      },
      "/auth/logout": {
        post: {
          summary: "Logout a user",
          tags: ["auth"],
          responses: {
            200: {
              description: "User logged out",
            },
            401: {
              description: "No refresh token provided",
            },
            403: {
              description: "Unauthorized",
            },
          },
        },
      },
      "/auth/refresh-token": {
        post: {
          summary: "Refresh access token",
          tags: ["auth"],
          responses: {
            200: {
              description: "Token refreshed",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      accessToken: { type: "string" },
                      refreshToken: { type: "string" },
                      user: { $ref: "#/components/schemas/User" },
                    },
                  },
                },
              },
            },
            401: {
              description: "No token provided",
            },
            403: {
              description: "Unauthorized",
            },
          },
        },
      },
      "/auth/google-login": {
        post: {
          summary: "Login with Google",
          tags: ["auth"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    credential: { type: "string" },
                  },
                  required: ["credential"],
                },
              },
            },
          },
          responses: {
            200: {
              description: "User logged in with Google",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      accessToken: { type: "string" },
                      refreshToken: { type: "string" },
                      user: { $ref: "#/components/schemas/User" },
                    },
                  },
                },
              },
            },
            500: {
              description: "Failed to sign in with Google",
            },
          },
        },
      },
      "/posts": {
        get: {
          summary: "Get all posts",
          tags: ["posts"],
          responses: {
            200: {
              description: "A list of posts",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Post" },
                  },
                },
              },
            },
          },
        },
        post: {
          summary: "Create a new post",
          tags: ["posts"],
          requestBody: {
            required: true,
            content: {
              "multipart/form-data": {
                schema: {
                  type: "object",
                  properties: {
                    post: { type: "string" },
                    file: { type: "string", format: "binary" },
                  },
                  required: ["post"],
                },
              },
            },
          },
          responses: {
            201: {
              description: "Post created",
            },
            500: {
              description: "Server error",
            },
          },
        },
      },
      "/posts/{postId}": {
        get: {
          summary: "Get post by ID",
          tags: ["posts"],
          parameters: [
            {
              name: "postId",
              in: "path",
              required: true,
              description: "The ID of the post",
              schema: {
                type: "string",
              },
            },
          ],
          responses: {
            200: {
              description: "Post found",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Post" },
                },
              },
            },
            404: {
              description: "Post not found",
            },
          },
        },
        put: {
          summary: "Update post by ID",
          tags: ["posts"],
          parameters: [
            {
              name: "postId",
              in: "path",
              required: true,
              description: "The ID of the post",
              schema: {
                type: "string",
              },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "multipart/form-data": {
                schema: {
                  type: "object",
                  properties: {
                    updatedPostContent: { type: "string" },
                    file: { type: "string", format: "binary" },
                  },
                  required: ["updatedPostContent"],
                },
              },
            },
          },
          responses: {
            201: {
              description: "Post updated",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Post" },
                },
              },
            },
            404: {
              description: "Post not found",
            },
          },
        },
        delete: {
          summary: "Delete post by ID",
          tags: ["posts"],
          parameters: [
            {
              name: "postId",
              in: "path",
              required: true,
              description: "The ID of the post",
              schema: {
                type: "string",
              },
            },
          ],
          responses: {
            200: {
              description: "Post deleted",
            },
            404: {
              description: "Post not found",
            },
          },
        },
      },
      "/comments": {
        get: {
          summary: "Get all comments",
          tags: ["comments"],
          responses: {
            200: {
              description: "A list of comments",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Comment" },
                  },
                },
              },
            },
          },
        },
        post: {
          summary: "Create a new comment",
          tags: ["comments"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    postId: { type: "string" },
                    comment: { $ref: "#/components/schemas/Comment" },
                  },
                  required: ["postId", "comment"],
                },
              },
            },
          },
          responses: {
            201: {
              description: "Comment created",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Comment" },
                },
              },
            },
            500: {
              description: "Server error",
            },
          },
        },
      },
      "/comments/{commentId}": {
        get: {
          summary: "Get comment by ID",
          tags: ["comments"],
          parameters: [
            {
              name: "commentId",
              in: "path",
              required: true,
              description: "The ID of the comment",
              schema: {
                type: "string",
              },
            },
          ],
          responses: {
            200: {
              description: "Comment found",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Comment" },
                },
              },
            },
            404: {
              description: "Comment not found",
            },
          },
        },
        put: {
          summary: "Update comment by ID",
          tags: ["comments"],
          parameters: [
            {
              name: "commentId",
              in: "path",
              required: true,
              description: "The ID of the comment",
              schema: {
                type: "string",
              },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Comment" },
              },
            },
          },
          responses: {
            201: {
              description: "Comment updated",
            },
            404: {
              description: "Comment not found",
            },
          },
        },
        delete: {
          summary: "Delete comment by ID",
          tags: ["comments"],
          parameters: [
            {
              name: "commentId",
              in: "path",
              required: true,
              description: "The ID of the comment",
              schema: {
                type: "string",
              },
            },
          ],
          responses: {
            200: {
              description: "Comment deleted",
            },
            404: {
              description: "Comment not found",
            },
          },
        },
      },
    },
  },
  apis: ["./routes/*.ts"],
};