# 快速开始

## 5 分钟快速上手 SDD

本指南将帮助您在 5 分钟内了解如何使用 SDD 进行开发。

## 步骤 1：理解需求

假设我们需要开发一个用户注册 API：

**需求**：
- 用户可以通过邮箱和密码注册
- 系统验证邮箱格式
- 系统验证密码强度（至少 8 位，包含大小写字母和数字）
- 返回创建的用户信息

## 步骤 2：编写规范

创建 `api-spec.yaml`：

```yaml
openapi: 3.0.0
info:
  title: User API
  version: 1.0.0
paths:
  /api/v1/users:
    post:
      summary: Create a new user
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [email, password]
              properties:
                email:
                  type: string
                  format: email
                  example: "user@example.com"
                password:
                  type: string
                  minLength: 8
                  pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$"
                  example: "SecurePass123"
                name:
                  type: string
                  maxLength: 50
                  example: "John Doe"
      responses:
        '201':
          description: User created successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  id:
                    type: number
                    example: 12345
                  email:
                    type: string
                    format: email
                    example: "user@example.com"
                  name:
                    type: string
                    example: "John Doe"
                  createdAt:
                    type: string
                    format: date-time
                    example: "2024-01-15T10:30:00Z"
        '400':
          description: Validation error
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                    example: "Validation failed"
                  errors:
                    type: array
                    items:
                      type: object
                      properties:
                        field:
                          type: string
                          example: "email"
                        message:
                          type: string
                          example: "Invalid email format"
        '409':
          description: Email already exists
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                    example: "Email already registered"
                  code:
                    type: string
                    example: "EMAIL_EXISTS"
```

## 步骤 3：规范评审

与团队评审规范：

- ✅ 功能需求是否完整？
- ✅ 边界条件是否考虑？
- ✅ 错误处理是否定义？
- ✅ API 设计是否合理？

## 步骤 4：生成 Mock 服务

使用工具生成 Mock 服务，前端可以立即开始开发：

```bash
# 使用 Prism 生成 Mock 服务
npx @stoplight/prism-cli mock api-spec.yaml
```

Mock 服务运行在 `http://localhost:4010`，前端可以基于此开发。

## 步骤 5：实现后端

基于规范实现后端：

```javascript
// app.js
const express = require('express');
const app = express();

app.use(express.json());

app.post('/api/v1/users', async (req, res) => {
  const { email, password, name } = req.body;
  
  // 验证输入
  if (!email || !isValidEmail(email)) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: [{ field: 'email', message: 'Invalid email format' }]
    });
  }
  
  if (!password || !isValidPassword(password)) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: [{ field: 'password', message: 'Password must contain uppercase, lowercase, and number' }]
    });
  }
  
  // 检查邮箱是否已存在
  if (await userExists(email)) {
    return res.status(409).json({
      message: 'Email already registered',
      code: 'EMAIL_EXISTS'
    });
  }
  
  // 创建用户
  const user = await createUser({ email, password, name });
  
  // 返回响应
  res.status(201).json({
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt.toISOString()
  });
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
```

## 步骤 6：验证实现

使用契约测试验证实现是否符合规范：

```bash
# 使用 Dredd 进行契约测试
npm install -g dredd
dredd api-spec.yaml http://localhost:3000
```

## 步骤 7：集成测试

前后端集成测试：

```javascript
// test/integration/users.test.js
const request = require('supertest');
const app = require('../app');

describe('POST /api/v1/users', () => {
  it('should create user with valid data', async () => {
    const response = await request(app)
      .post('/api/v1/users')
      .send({
        email: 'user@example.com',
        password: 'SecurePass123',
        name: 'John Doe'
      });
    
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.email).toBe('user@example.com');
  });
  
  it('should return 400 for invalid email', async () => {
    const response = await request(app)
      .post('/api/v1/users')
      .send({
        email: 'invalid-email',
        password: 'SecurePass123'
      });
    
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });
});
```

## 总结

通过以上 7 个步骤，您已经：

1. ✅ 编写了完整的 API 规范
2. ✅ 进行了规范评审
3. ✅ 生成了 Mock 服务
4. ✅ 实现了后端 API
5. ✅ 验证了实现符合规范
6. ✅ 进行了集成测试

这就是 SDD 的基本流程！继续阅读[示例](./examples.md)了解更多实践。

## 下一步

- [查看示例](./examples.md) - 更多实际案例
- [了解工具](./tools.md) - 推荐的工具和资源
- [最佳实践](../best-practices/) - 深入学习最佳实践

