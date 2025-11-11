# 示例

## 实际案例

本章提供一些实际案例，帮助您更好地理解 SDD 的应用。

## 案例 1：RESTful API 开发

### 场景

开发一个博客系统的 API，包括：
- 文章列表
- 文章详情
- 创建文章
- 更新文章
- 删除文章

### 规范示例

```yaml
openapi: 3.0.0
info:
  title: Blog API
  version: 1.0.0
paths:
  /api/v1/posts:
    get:
      summary: Get posts list
      parameters:
        - name: page
          in: query
          schema:
            type: integer
            default: 1
        - name: limit
          in: query
          schema:
            type: integer
            default: 10
            maximum: 100
      responses:
        '200':
          description: Posts list
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/Post'
                  pagination:
                    type: object
                    properties:
                      page:
                        type: integer
                      limit:
                        type: integer
                      total:
                        type: integer
    post:
      summary: Create a new post
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [title, content]
              properties:
                title:
                  type: string
                  minLength: 1
                  maxLength: 200
                content:
                  type: string
                  minLength: 1
                tags:
                  type: array
                  items:
                    type: string
      responses:
        '201':
          description: Post created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Post'
        '400':
          description: Validation error
  /api/v1/posts/{id}:
    get:
      summary: Get post by ID
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: integer
      responses:
        '200':
          description: Post details
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Post'
        '404':
          description: Post not found
    put:
      summary: Update post
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: integer
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                title:
                  type: string
                content:
                  type: string
      responses:
        '200':
          description: Post updated
        '404':
          description: Post not found
    delete:
      summary: Delete post
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: integer
      responses:
        '204':
          description: Post deleted
        '404':
          description: Post not found

components:
  schemas:
    Post:
      type: object
      properties:
        id:
          type: integer
        title:
          type: string
        content:
          type: string
        tags:
          type: array
          items:
            type: string
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time
```

### 实现要点

1. **分页处理** - 实现分页逻辑
2. **输入验证** - 验证标题和内容
3. **错误处理** - 处理 404 等情况
4. **数据格式** - 确保响应格式符合规范

## 案例 2：微服务接口定义

### 场景

定义用户服务和订单服务之间的接口：

- 用户服务提供用户信息
- 订单服务需要获取用户信息

### 规范示例

```yaml
# user-service-api.yaml
openapi: 3.0.0
info:
  title: User Service API
  version: 1.0.0
servers:
  - url: http://user-service:3000
paths:
  /api/v1/users/{id}:
    get:
      summary: Get user by ID
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: integer
      responses:
        '200':
          description: User information
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
        '404':
          description: User not found
  /api/v1/users/batch:
    post:
      summary: Get multiple users
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                ids:
                  type: array
                  items:
                    type: integer
      responses:
        '200':
          description: Users list
          content:
            application/json:
              schema:
                type: object
                properties:
                  users:
                    type: array
                    items:
                      $ref: '#/components/schemas/User'

components:
  schemas:
    User:
      type: object
      properties:
        id:
          type: integer
        email:
          type: string
        name:
          type: string
        status:
          type: string
          enum: [active, inactive, suspended]
```

### 契约测试

```javascript
// order-service 的契约测试
const { Pact } = require('@pact-foundation/pact');

const provider = new Pact({
  consumer: 'Order Service',
  provider: 'User Service',
  port: 1234
});

describe('User Service Contract', () => {
  beforeAll(() => provider.setup());
  afterAll(() => provider.finalize());
  
  it('should get user by ID', async () => {
    await provider.addInteraction({
      state: 'user exists',
      uponReceiving: 'a request for user by ID',
      withRequest: {
        method: 'GET',
        path: '/api/v1/users/1'
      },
      willRespondWith: {
        status: 200,
        body: {
          id: 1,
          email: 'user@example.com',
          name: 'John Doe',
          status: 'active'
        }
      }
    });
    
    // 测试订单服务调用用户服务
    const response = await orderService.getUserInfo(1);
    expect(response.email).toBe('user@example.com');
  });
});
```

## 案例 3：前后端协作

### 场景

前端和后端协作开发用户管理功能：

- 用户列表
- 用户详情
- 创建用户
- 更新用户

### 工作流程

#### 1. 后端编写规范

```yaml
# api-spec.yaml
openapi: 3.0.0
info:
  title: User Management API
  version: 1.0.0
paths:
  /api/v1/users:
    get:
      summary: Get users list
      # ...
    post:
      summary: Create user
      # ...
  /api/v1/users/{id}:
    get:
      summary: Get user by ID
      # ...
    put:
      summary: Update user
      # ...
```

#### 2. 生成 Mock 服务

```bash
# 使用 Prism 生成 Mock
npx @stoplight/prism-cli mock api-spec.yaml
```

#### 3. 前端基于 Mock 开发

```javascript
// frontend/src/services/userService.js
const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:4010';

export const userService = {
  async getUsers() {
    const response = await fetch(`${API_BASE}/api/v1/users`);
    return response.json();
  },
  
  async getUser(id) {
    const response = await fetch(`${API_BASE}/api/v1/users/${id}`);
    return response.json();
  },
  
  async createUser(userData) {
    const response = await fetch(`${API_BASE}/api/v1/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return response.json();
  }
};
```

#### 4. 后端实现 API

```javascript
// backend/routes/users.js
router.get('/api/v1/users', async (req, res) => {
  const users = await userService.getUsers();
  res.json(users);
});

router.post('/api/v1/users', async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(201).json(user);
});
```

#### 5. 集成测试

```javascript
// 前端切换到真实 API
const API_BASE = 'http://localhost:3000';

// 运行集成测试
npm run test:integration
```

## 案例 4：GraphQL API

### 场景

使用 GraphQL 开发 API，也需要定义规范。

### 规范示例

```graphql
# schema.graphql
type User {
  id: ID!
  email: String!
  name: String
  posts: [Post!]!
  createdAt: DateTime!
}

type Post {
  id: ID!
  title: String!
  content: String!
  author: User!
  createdAt: DateTime!
}

type Query {
  user(id: ID!): User
  users(limit: Int = 10, offset: Int = 0): [User!]!
  post(id: ID!): Post
  posts(limit: Int = 10, offset: Int = 0): [Post!]!
}

type Mutation {
  createUser(input: CreateUserInput!): User!
  updateUser(id: ID!, input: UpdateUserInput!): User!
  createPost(input: CreatePostInput!): Post!
}

input CreateUserInput {
  email: String!
  password: String!
  name: String
}

input UpdateUserInput {
  email: String
  name: String
}

input CreatePostInput {
  title: String!
  content: String!
  authorId: ID!
}

scalar DateTime
```

### 实现

```javascript
// resolvers.js
const resolvers = {
  Query: {
    user: async (parent, { id }) => {
      return await userService.getUserById(id);
    },
    users: async (parent, { limit, offset }) => {
      return await userService.getUsers({ limit, offset });
    }
  },
  Mutation: {
    createUser: async (parent, { input }) => {
      return await userService.createUser(input);
    }
  },
  User: {
    posts: async (parent) => {
      return await postService.getPostsByAuthorId(parent.id);
    }
  }
};
```

## 总结

这些案例展示了 SDD 在不同场景下的应用：

1. **RESTful API** - 使用 OpenAPI 规范
2. **微服务** - 服务间接口定义和契约测试
3. **前后端协作** - 基于 Mock 的并行开发
4. **GraphQL** - GraphQL Schema 作为规范

无论使用什么技术栈，SDD 的核心思想都是：**先定义规范，再实现功能**。

继续阅读[工具](./tools.md)了解相关工具和资源。

